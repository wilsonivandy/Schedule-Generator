const e = require("express");
const {Client} = require("@googlemaps/google-maps-services-js");
const mapsCall = require("./mapsCall");
const Event = require("../models/event");
const Event_TripDuration = require("../models/event_tripDuration");
const User = require("../models/user");
const Schedule = require("../models/schedule");
const Schedule_Group = require("../models/schedule_group");

async function createSchedule(username, scheduleStartTime, scheduleEndTime, priorityWeight, durationWeight) {  // takes in  events, start_time
    // Step 0:
    // Make sure no fixed-events are clashing. If so, throw error
    // Add a 'ghost' event at the start of placed events. this event starts at xx:xx, which is the startTime of the schedule

    // Testing:
    let sortedEvents = await Event.timeSortedEvents(username);
    let newDate = new Date(scheduleStartTime);
    let departureTime = newDate.getTime(); // in milliseconds

    let newEndTime = new Date(scheduleEndTime);
    let leaveTime = newEndTime.getTime();
    
    let origin;
    let destination;
    let waypoints;

    for (let i=1; i<3; i++) {
        [origin, destination, waypoints, sortedEvents, order1] = await sortSchedule(sortedEvents, departureTime, leaveTime, priorityWeight, durationWeight);
        await updateMapsData(origin, destination, departureTime, waypoints, sortedEvents);
        [origin, destination, waypoints, sortedEvents, order2] = await sortSchedule(sortedEvents, departureTime, leaveTime, priorityWeight, durationWeight);
        let equal = true;
        for (let j=0; j<order1.length; j++) {
            if (order1[j] != order2[j]) {
                equal = false;
            }
        }
        if (equal){
            break;
        }
    }

    return sortedEvents;
}

async function updateMapsData(origin, destination, departureTime, waypoints, sortedEvents) {
    let makeCall = false;
    for (let i=0; i < sortedEvents.length - 1; i++) {
        let tripDuration = await Event_TripDuration.getTripDuration(sortedEvents[i].id, sortedEvents[i+1].id);
        if (tripDuration === null) {
            makeCall = true;
            break;
        };
    }

    if (makeCall) {
        const generatedSchedule = await mapsCall(origin, destination, departureTime, waypoints);
        let legs = generatedSchedule.routes[0].legs;

        for (let i = 0; i < sortedEvents.length - 1; i++) {
            // Save distance and duration to database;
            let data = {
                event_id1: sortedEvents[i].id,
                event_id2: sortedEvents[i+1].id,
                trip_duration: legs[i].duration.value,
                trip_distance: legs[i].distance.value
            }
            await Event_TripDuration.create(data)
        }
    }
}

async function sortSchedule(events, scheduleStartTime, scheduleEndTime, priorityWeight, durationWeight) {
    // TODO: Sort here, which events fit in the schedule time limit
    let todayEvents = [];

    for (let event of events) {
        let eventStartTime = new Date(event.event_start_time);
        eventStartTime = eventStartTime.getTime();

        let eventEndTime = new Date(event.event_end_time);
        eventEndTime = eventEndTime.getTime();

        if (scheduleStartTime <= eventStartTime && eventEndTime <= scheduleEndTime || event.event_isflexible) {
            todayEvents.push(event);
        }
    }

    let placedEvents = todayEvents.filter(event => !event.event_isflexible)
        .sort((a,b) => a.event_start_time - b.event_start_time);
    let unplacedEvents = todayEvents.filter(event => event.event_isflexible);
 
    unplacedEvents = sortEventWeights(unplacedEvents, priorityWeight, durationWeight);

    // For all sorted unplaced events, if there is time slot available then schedule it. If not, add to end of schedule.
    while (unplacedEvents.length > 0) {
        let flexibleEvent = unplacedEvents.shift();
        placedEvents = await addEvent(placedEvents, flexibleEvent, scheduleStartTime, scheduleEndTime);
    }

    let sortedEvents = placedEvents.slice();
    let origin = placedEvents.shift().event_location;
    let destination = placedEvents.pop().event_location;
    let waypoints = placedEvents.map(e => e.event_location).join('|');
    let order = sortedEvents.map(e => e.id);

    return [origin, destination, waypoints, sortedEvents, order];
}

async function addEvent(placedEvents, flexibleEvent, scheduleStartTime, scheduleEndTime) { // scheduleStartTime in milliseconds
    if (placedEvents.length === 0) {
        flexibleEvent = updateFlexibleEvent(flexibleEvent, scheduleStartTime);
        placedEvents.push(flexibleEvent);
    } else {
        for (let i = 0; i <= placedEvents.length - 1; i++) {
            let placedEventsLength = placedEvents.length;
            let startingEventStartTime = new Date(placedEvents[0].event_start_time);
            let previousEvent = placedEvents[i];
            let nextEvent = placedEvents[i + 1];
            if (nextEvent === undefined) {
                placedEvents = await addToEndOfSchedule(placedEvents, flexibleEvent, previousEvent, scheduleStartTime, scheduleEndTime)
                if (placedEvents.length !== placedEventsLength) break;
            } else if (scheduleStartTime < startingEventStartTime.getTime()) {
                let nextStartingEventTime = new Date(nextEvent.event_start_time);
                placedEvents = await addToStartOfSchedule(placedEvents, flexibleEvent, scheduleStartTime, nextStartingEventTime.getTime(), scheduleEndTime)
                if (placedEvents.length !== placedEventsLength) break;
            } else {
                placedEvents = await addToSchedule(placedEvents, flexibleEvent, previousEvent, nextEvent, scheduleStartTime, scheduleEndTime);
                if (placedEvents.length !== placedEventsLength) break;
            }
        }
    }
    return placedEvents;
}

async function addToSchedule(placedEvents, flexibleEvent, previousEvent, nextEvent, scheduleStartTime, scheduleEndTime) {
    let added = false;

    let nextEventStartTime = new Date(nextEvent.event_start_time);
    let previousEventEndTime = new Date(previousEvent.event_end_time);
    let tripDuration = await Event_TripDuration.getTripDuration(previousEvent.id, flexibleEvent.id) * 1000; // milliseconds
    [neededTotalDuration, availableDuration] = await getDurations(flexibleEvent, nextEvent, nextEventStartTime, previousEventEndTime.getTime(), tripDuration, scheduleStartTime, scheduleEndTime);

    // Check if needed duration fits in available duration
    if (neededTotalDuration <= availableDuration) {
        // The duration of the flexible-time event fits between the start time and end time of the fixed-time events, schedule the flexible-time event
        let newStart = previousEventEndTime.getTime() + tripDuration;
        flexibleEvent = updateFlexibleEvent(flexibleEvent, newStart);

        let index = placedEvents.findIndex(e => e.event_start_time > flexibleEvent.event_start_time);
        placedEvents.splice(index, 0, flexibleEvent);
        added = true;
    } else {
        added = false;
    }


    return placedEvents;
}

async function addToStartOfSchedule(placedEvents, flexibleEvent, scheduleStartTime, startingEventTime, scheduleEndTime) {
    let added = false;
    [neededTotalDuration, availableDuration] = await getDurations(flexibleEvent, placedEvents[0], startingEventTime, scheduleStartTime, 0, scheduleStartTime, scheduleEndTime);
    if (neededTotalDuration <= availableDuration) {
       flexibleEvent = updateFlexibleEvent(flexibleEvent, scheduleStartTime);
       placedEvents.unshift(flexibleEvent);
       added = true;
    }
    return placedEvents;
}

async function addToEndOfSchedule(placedEvents, flexibleEvent, previousEvent, scheduleStartTime, scheduleEndTime) {
    let previousEventEndTime = new Date(previousEvent.event_end_time);
    let tripDuration = await Event_TripDuration.getTripDuration(previousEvent.id, flexibleEvent.id) * 1000; // milliseconds
    let newStart = previousEventEndTime.getTime() + tripDuration;
    flexibleEvent = updateFlexibleEvent(flexibleEvent, newStart);
    if (isInSchedule(flexibleEvent, scheduleStartTime, scheduleEndTime)) {
        placedEvents.push(flexibleEvent);
    }
    return placedEvents;
}

async function getDurations(flexibleEvent, nextEvent, nextStartingTime, previousEndingTime, tripDuration, scheduleStartTime, scheduleEndTime) {
    let neededEventDuration = flexibleEvent.event_duration*1000*60; // was in minutes, convert to milliseconds
    let nextTripDuration = await Event_TripDuration.getTripDuration(flexibleEvent.id, nextEvent.id) * 1000;
    let availableDuration;

    if (scheduleStartTime <= flexibleEvent.event_start_time && flexibleEvent.event_end_time <= scheduleEndTime) {
        availableDuration = nextStartingTime - previousEndingTime - nextTripDuration; // milliseconds
    } else {
        availableDuration = scheduleEndTime - previousEndingTime - nextTripDuration; // milliseconds
    }

    let neededTotalDuration = neededEventDuration + tripDuration;
    return [neededTotalDuration, availableDuration];
}

function updateFlexibleEvent(flexibleEvent, newStartingTime) {
    let neededEventDuration = flexibleEvent.event_duration*1000*60; // was in minutes, convert to milliseconds
    flexibleEvent.event_start_time = new Date(newStartingTime);
    flexibleEvent.event_end_time = new Date(newStartingTime + neededEventDuration);
    return flexibleEvent;
}

function isInSchedule(event, scheduleStartTime, scheduleEndTime) {
    let inSchedule = false;

    if (scheduleStartTime <= event.event_start_time && event.event_end_time <= scheduleEndTime) {
        inSchedule = true;
    }
    
    return inSchedule;
}

// function addEventToDb(event) {
//     let events = await Event.timeSortedEvents('testuser1');
//

function sortEventWeights(events, priorityWeight, durationWeight) {
    for (let event of events) {
        event.weight = event.event_priority * priorityWeight - event.event_duration * durationWeight;
    }
    let sortedEvents = events.sort((a,b) => b.weight - a.weight);
    return sortedEvents;
};

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

async function confirmEventToSchedule(username, schedule_date, scheduleStartTime, scheduleEndTime, events) {
    let schedule = await Schedule.create(username, schedule_date, scheduleStartTime, scheduleEndTime);
    for (let i=0; i<events.length; i++) {
        await Schedule.addEvent(schedule.id, events[i].id, i+1, events[i].event_start_time, events[i].event_end_time)
    }
    schedule.events = events;
    return schedule;
}


async function createSchedules(username, schedule_name, schedule_date, scheduleStartTime, scheduleEndTime) {
    let priorityWeightRange = [200, 400, 600, 800, 1000];
    let durationWeightRange = [1,2,3,4,5,6,7];
    let foundSchedule = false;
    let listOfEventIds = [];
    let listOfSchedules = [];

    // Tries to find more than one schedule

    // for (let i=0; i<3; i++) {
    //     foundSchedule = false;
    //     let iterations = 0;
    //     while (!foundSchedule && iterations < 30) {
    //         const randomIndex1 = Math.floor(Math.random() * priorityWeightRange.length);
    //         const randomIndex2 = Math.floor(Math.random() * durationWeightRange.length);
    //         let events = await createSchedule(username, scheduleStartTime, scheduleEndTime, priorityWeightRange[randomIndex1], durationWeightRange[randomIndex2]);
    //         let eventIds = events.map(e => e.id);
    //         if (listOfEventIds.length === 0) {
    //             listOfEventIds.push(eventIds);
    //             let schedule = await confirmEventToSchedule(username, schedule_date, scheduleStartTime, scheduleEndTime, events);
    //             listOfSchedules.push(schedule);
    //         } else {
    //             for (let l of listOfEventIds) {
    //                 if (!arraysEqual(l, eventIds)) {
    //                     foundSchedule = true;
    //                     listOfEventIds.push(eventIds);
    //                     let schedule = await confirmEventToSchedule(username, schedule_date, scheduleStartTime, scheduleEndTime, events);
    //                     listOfSchedules.push(schedule);
    //                 }
    //             }
    //             iterations += 1;
    //         }
    //     }
    // }

    let formData = {

    }

    let newScheduleGroup = await Schedule_Group.createGroup(username, 0);

    while (listOfEventIds.length <= 5 && priorityWeightRange.length > 0) {
        let firstPriorityWeight = priorityWeightRange.shift();
        let foundSchedule = false;
        for (let d of durationWeightRange) {
            let events = await createSchedule(username, scheduleStartTime, scheduleEndTime, firstPriorityWeight, d);
            let eventIds = events.map(e => e.id);
            if (listOfEventIds.length === 0) {
                listOfEventIds.push(eventIds);
                let schedule = await confirmEventToSchedule(username, schedule_date, scheduleStartTime, scheduleEndTime, events);
                let startTime = new Date(scheduleStartTime);
                let endTime = new Date(scheduleEndTime);
                let total_distance = 0;
                let total_duration = 0;

                for (let i = 0; i < schedule.events.length - 1; i++) {
                    let duration = await Event_TripDuration.getTripDuration(schedule.events[i].id, schedule.events[i+1].id) / 60; // minutes
                    let distance = await Event_TripDuration.getTripDistance(schedule.events[i].id, schedule.events[i+1].id); //
                    total_distance += distance;
                    total_duration += duration;
                }

                let newSched = {
                    group_id: newScheduleGroup.id,
                    schedule_id: schedule.id,
                    username: username,
                    schedule_name: schedule_name,
                    schedule_date: schedule_date,
                    schedule_start_time: startTime,
                    schedule_end_time: endTime,
                    total_distance: total_distance, 
                    total_duration: total_duration
                }

                await Schedule_Group.addSchedule(newSched);
                listOfSchedules.push(schedule);
            } else {
                let allDifferent = true;
                for (let l of listOfEventIds) {
                    if (arraysEqual(l, eventIds)) {
                        allDifferent = false;
                    }
                }
                if (allDifferent) {
                    foundSchedule = true;
                    listOfEventIds.push(eventIds);
                    let schedule = await confirmEventToSchedule(username, schedule_date, scheduleStartTime, scheduleEndTime, events);
                    let startTime = new Date(scheduleStartTime);
                    let endTime = new Date(scheduleEndTime);
                    let total_distance = 0;
                    let total_duration = 0;

                    for (let i = 0; i < schedule.events.length - 1; i++) {
                        let duration = await Event_TripDuration.getTripDuration(schedule.events[i].id, schedule.events[i+1].id) / 60; // minutes
                        let distance = await Event_TripDuration.getTripDistance(schedule.events[i].id, schedule.events[i+1].id); //
                        total_distance += distance;
                        total_duration += duration;
                    }

                    let newSched = {
                        group_id: newScheduleGroup.id,
                        schedule_id: schedule.id,
                        username: username,
                        schedule_name: schedule_name,
                        schedule_date: schedule_date,
                        schedule_start_time: startTime,
                        schedule_end_time: endTime,
                        total_distance: total_distance, 
                        total_duration: total_duration
                    }
    
                    await Schedule_Group.addSchedule(newSched);
                    listOfSchedules.push(schedule);
                }
            }
        }
    }
    
    // Returns only one schedule
    // let events = await createSchedule(username, scheduleStartTime, scheduleEndTime, 100, 1);
    // let schedule = await confirmEventToSchedule(username, schedule_date, scheduleStartTime, scheduleEndTime, events);
    // listOfSchedules.push(schedule);


    return listOfSchedules;
}

module.exports = createSchedules;

// TODO: Get several schedules, prevent making duplicate calls to google maps for distance, automatic reload
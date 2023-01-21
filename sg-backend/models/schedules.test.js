
const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Schedule = require("./schedule.js");
const Event = require("./event.js")
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create a schedule", function () {

    const event1 = {
        username: "u1",
        event_name: "testEvent1",
        event_start_time: new Date("2023-01-17T08:00:00.000Z"),
        event_duration: 30,
        event_end_time: new Date("2023-01-17T08:30:00.000Z"),
        event_location: "place_id:nadii8ley892qhxciajbc7i6b",
        event_priority: 3,
        event_isFlexible: false
      };
    
      const event2 = {
        username: "u1",
        event_name: "testEvent2",
        event_start_time: new Date("2023-01-17T09:00:00.000Z"),
        event_duration: 60,
        event_end_time: new Date("2023-01-17T10:00:00.000Z"),
        event_location: "place_id:nadii8ley892qhxciajbc7i6b",
        event_priority: 3,
        event_isFlexible: false
      }

    const newSchedule = {
      username: "u1",
      schedule_date: "2023-01-17",
      schedule_start_time: new Date("2023-01-17T08:00:00.000Z"),
      schedule_end_time: new Date("2023-01-17T18:00:00.000Z")
    };
  
    test("valid schedule", async function () {
      await Event.create(event1);
      await Event.create(event2);
      let schedule = await Schedule.create(newSchedule.username, newSchedule.schedule_date, newSchedule.schedule_start_time, newSchedule.schedule_end_time);
      expect(schedule.schedule_date).toEqual("2023-01-17");
  
      const result = await db.query(
            `SELECT 
             username, schedule_date, schedule_start_time, schedule_end_time
             FROM schedules
             WHERE username = 'u1'`);
      expect(result.rows[0].schedule_date).toEqual("2023-01-17");
    });
  
    test("bad request schedule", async function () {
      try {
        await Schedule.create({
            username: "u1",
            schedule_date: "2023-01-17",
            schedule_start_time: new Date("2023-01-17T08:00:00.000Z")
          });
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });

  describe("add and remove events in schedule", function () {

    const event1 = {
        username: "u1",
        event_name: "testEvent1",
        event_start_time: new Date("2023-01-17T08:00:00.000Z"),
        event_duration: 30,
        event_end_time: new Date("2023-01-17T08:30:00.000Z"),
        event_location: "place_id:nadii8ley892qhxciajbc7i6b",
        event_priority: 3,
        event_isFlexible: false
      };
    
      const event2 = {
        username: "u1",
        event_name: "testEvent2",
        event_start_time: new Date("2023-01-17T09:00:00.000Z"),
        event_duration: 60,
        event_end_time: new Date("2023-01-17T10:00:00.000Z"),
        event_location: "place_id:nadii8ley892qhxciajbc7i6b",
        event_priority: 3,
        event_isFlexible: false
      }

    const newSchedule = {
      username: "u1",
      schedule_date: "2023-01-17",
      schedule_start_time: new Date("2023-01-17T08:00:00.000Z"),
      schedule_end_time: new Date("2023-01-17T18:00:00.000Z")
    };
  
    test("add events", async function () {
      let newEvent1 = await Event.create(event1);
      let newEvent2 = await Event.create(event2);
      let schedule = await Schedule.create(newSchedule.username, newSchedule.schedule_date, newSchedule.schedule_start_time, newSchedule.schedule_end_time);

      await Schedule.addEvent(schedule.id, newEvent1.id, 1, event1.event_start_time, event1.event_end_time);
      await Schedule.addEvent(schedule.id, newEvent2.id, 2, event2.event_start_time, event2.event_end_time);
      schedule = await Schedule.getSchedule(schedule.id);
      expect(schedule.events.length).toEqual(2);
      expect(schedule.events[0].event_name).toEqual("testEvent1");
      expect(schedule.events[1].event_name).toEqual("testEvent2");
  });

  test("remove events", async function () {
    let newEvent1 = await Event.create(event1);
    let newEvent2 = await Event.create(event2);
    let schedule = await Schedule.create(newSchedule.username, newSchedule.schedule_date, newSchedule.schedule_start_time, newSchedule.schedule_end_time);

    await Schedule.addEvent(schedule.id, newEvent1.id, 1, event1.event_start_time, event1.event_end_time);
    await Schedule.addEvent(schedule.id, newEvent2.id, 2, event2.event_start_time, event2.event_end_time);
    schedule = await Schedule.getSchedule(schedule.id);
    expect(schedule.events.length).toEqual(2);

    await Schedule.removeEvent(schedule.id, newEvent1.id);
    schedule = await Schedule.getSchedule(schedule.id);
    expect(schedule.events.length).toEqual(1);
    expect(schedule.events[0].event_name).toEqual("testEvent2");
});
});

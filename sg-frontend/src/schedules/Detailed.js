/*global google*/
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import UserContext from "../auth/UserContext";
import ScheduleGeneratorApi from '../api';
import { useJsApiLoader } from '@react-google-maps/api';
import API_SECRET_KEY from '../events/secrets';
import "./Detailed.css"

const LIBRARIES = ["places"];

function Detailed() {
    const history = useHistory();
    const { currentUser, groupId } = useContext(UserContext);

    const [stats, setStats] = useState([0, 0]);
    const [group, setGroup] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [currSchedId, setCurrSchedId] = useState(0);
    const [schedIds , setSchedIds] = useState([]);
    const [limit, setLimit] = useState(5);
    const [disabled, setDisabled] = useState(false);
    const [events, setEvents] = useState([]);
    
    useEffect(function loadSchedule() {
        async function getSchedule() {
            let schedules = await ScheduleGeneratorApi.getSchedulesByGroupId(currentUser.username, groupId);
            let listOfSchedIds = schedules.map(s => s.schedule_id);
            setGroup(schedules);
            setSchedIds(listOfSchedIds);
            setCurrSchedId(listOfSchedIds[0])
            setLimit(listOfSchedIds.length - 1);
        }
        getSchedule();
    }, [groupId]);

    function write(e) {
        let time = new Date(e.event_start_time);
        let startTime = `${time.toTimeString().slice(0, 8)}` ;
    
        if (e.event_isflexible === true && !e.event_start_time) {
          startTime = undefined;
        }

        return (
            <tr>
              <th scope="row">{e.event_name}</th>
              <td>{startTime || "Flexible"}</td>
              <td>{e.event_duration}</td>
            </tr>
          )

    }

    function renderStats() {
        if (stats) {
            return (
                <table class="table mt-5">
                    <thead>
                        <tr>
                        <th scope="col">Total Travel Distance</th>
                        <th scope="col">Total Travel Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>{Math.round(stats[0] / 100 ) / 10} km</td>
                        <td>{Math.round(stats[1] * 10) / 10} minutes</td>
                        </tr>
                    </tbody>
                </table>
            )
        }
    }

    function renderScheduleOptions() {
        let options = [];
        for (let i=1; i <= schedIds.length; i++) {
            let pair = [];
            pair.push(`${i}`);
            pair.push(schedIds[i - 1])
            options.push(pair);
        }
        return (
            <>
                {options.map(o => (writeOptions(o[0], o[1])))}
            </>
        )
    }

    function handleOptionClick(id) {
        setDisabled(true);
        setCurrSchedId(id)
        setTimeout(() => {
            setDisabled(false); 
        }, 1500);
    }

    function writeOptions(name, id) {
        return (
            <button class="btn btn-primary m-2 list-group-item list-group-item-action" disabled={disabled} onClick={() => handleOptionClick(id)} id={`list-${id}-list`} data-toggle="list" href={`#${id}`} role="tab" aria-controls={`${id}`}>{name}</button>
        )
    }


    const Places = () => {
        let scheduleDate;
        const { isLoaded } = useJsApiLoader({
            googleMapsApiKey: API_SECRET_KEY,
            libraries: LIBRARIES,
        });

        useEffect(() => {
            async function loadDetail() {
                let schedule = await ScheduleGeneratorApi.getSchedule(currentUser.username, currSchedId);
                setEvents(schedule.schedules.events);
                setSchedule(schedule);

                for (let i=0; i < group.length; i++) {
                    if (group[i].schedule_id === currSchedId) {
                        setStats([group[i].total_distance, group[i].total_duration])
                    }
                }
            } 

            if (currSchedId !== 0) {
                loadDetail();
            }

        }, [currSchedId]);

        if (!isLoaded || !events.length) {
            return (
            <div>
                <h1 className='Dashboard'>
                    Please create some events and schedule
                </h1>
            </div>
            )
        }  else {
            if (schedule) {
                scheduleDate = new Date(schedule.schedules.schedule_date);
                scheduleDate = scheduleDate.toDateString();
            }
            
            const mapElement = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: { lat: 41.85, lng: -87.65 },
            });
            const directionsRenderer = new google.maps.DirectionsRenderer();
            const directionsService = new google.maps.DirectionsService();
            directionsRenderer.setMap(mapElement);
            let scheduleEvents = events;
            let waypts = [];
            
            for (let i = 0; i < scheduleEvents.length; i++) {
                waypts.push({
                    location: { placeId: scheduleEvents[i].event_location.slice(9)},
                    stopover: true,
                });
            }

            const origin = waypts.shift().location;
            const destination = waypts.pop().location;

            
            directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: waypts,
            }).then((response) => {
                directionsRenderer.setDirections(response);
            }).catch((err) => window.alert("Directions request failed due to "));
            }

            return (
                <>
                    <div className='subtitles'>
                        <p className="mx-auto pt-5 mb-0 text-uppercase font-weight-bold text-center">{group[0].schedule_name}</p>
                    </div>
                    <p className='text-white font-weight-bold'>({scheduleDate})</p>
                    <h5 className='text-white font-weight-bold text-underline'><u>Schedule Alternatives:</u></h5>
                </>
                
                
            )
        }
  
    return (
      <>
        <div className="Dashboard">
            <header className="h-100 d-flex align-items-center">
                <div className="container-fluid h-100 mb-5">
                    <div className="row text-center mx-0 mt-5">
                                <div className='col'>
                                    {Places()}
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <div class="list-group list-group-horizontal" id="list-tab" role="tablist">
                                            {renderScheduleOptions()}
                                        </div>
                                    </div>
                                    

                                    <div className="eventList mt-5">
                                        {events.length
                                            ? (
                                                <div className="d-flex flex-column align-items-center justify-contents-center">
                                                    <div className="subtitles">
                                                    <h5 className='text-white font-weight-bold text-underline'><u>Events:</u></h5>
                                                    </div>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th scope="col" className="text-nowrap">Event Name</th>
                                                            <th scope="col">Starting Time</th>
                                                            <th scope="col" className="text-wrap">Duration (mins)</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {events.map(e => (
                                                        write(e)))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="lead"></p>
                                            )}
                                    </div>
                                    
                            </div>
                            <div className='col d-flex flex-column align-items-center justify-content-center mt-5'>
                                <div id='map'></div>
                                {renderStats()}
                            </div>
                        
                    </div>
                    <div className='text-center d-flex flex-row align-items-center justify-content-center'>
                            <button className='btn btn-primary backButton text-nowrap mt-4 mx-3' onClick={() => history.push(`/schedules/${currentUser.username}`)}>Back to Schedules </button>
                            <button className='btn btn-primary backButton text-nowrap mt-4 mx-3' onClick={() => history.push(`/dashboard/${currentUser.username}`)}>Back to Dashboard </button>
                    </div>
                </div>
            </header>
        </div>
      </>
    );
}

export default Detailed;





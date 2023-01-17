import React, { useState, useEffect, useContext } from "react";
import ScheduleGeneratorApi from "../api";

import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../auth/UserContext";
import useEventState from '../hooks/useEventState';
import "./EventForm.css";
import { XSquare, Pencil } from 'react-bootstrap-icons';
import useEditState from "../hooks/useEditState";
import { useHistory, Link } from "react-router-dom";

/** Show page with list of companies.
 *
 * On mount, loads companies from API.
 * Re-loads filtered companies on submit from search form.
 *
 * This is routed to at /companies
 *
 * Routes -> { CompanyCard, SearchForm }
 */

function EventList() {
    const history = useHistory()
    const { currentUser, setEditId, setAction } = useContext(UserContext);
    const [eventChange, toggleEventChange] = useEventState();
    const [events, setEvents] = useState(null);

  /** Triggered by search form submit; reloads companies. */
    useEffect(function loadEvents() {
        async function getEvents() {
            let events = await ScheduleGeneratorApi.getEvents(currentUser.username);
            setEvents(events);
        }
        getEvents();
    }, [eventChange])

  if (!events) return (
      <div className="eventList col-md-8 offset-md-2 pl-0 pr-0 ml-0 mr-0">
          <div className="d-flex flex-column align-items-center justify-contents-center">
                  <div className="subtitles">
                      <p className="mx-auto my-0 text-uppercase font-weight-bold">Events</p>
                  </div>
                  <p>Your created events will appear here</p>
          </div>
      </div>
    );

  async function removeEvent(username, id) {
      await ScheduleGeneratorApi.removeEvent(username, id);
      toggleEventChange();
  }

  function editEvent(id) {
    setEditId(id);
    setAction("event");
    history.push(`/dashboard/editing`);
  }

  function write(e) {
    let time = new Date(e.event_start_time);
    let startTime = `${time.toTimeString().slice(0, 8)} - ${time.toDateString()}` ;

    if (e.event_isflexible === true && !e.event_start_time) {
      startTime = undefined;
    }

    
    return (
      <tr>
        {/* <button onClick={() => removeEvent(currentUser.username, e.id)} className="btn btn-primary removeButton"><XSquare/></button> */}
        <td>
        <button onClick={() => removeEvent(currentUser.username, e.id)} className="btn-sm btn-primary"><XSquare/></button>
        </td>
        <th scope="row">{e.event_name}</th>
        <td>{startTime || "Flexible"}</td>
        <td>{e.event_duration}</td>
        <td>
        <button onClick={() => editEvent(e.id)} className="btn-sm btn-primary"><Pencil/></button>
        </td>
      </tr>
    )
  }

  return (
      <div className="eventList col-md-8 offset-md-2 pl-0 pr-0 ml-0 mr-0">
      {events.length
          ? (
              <div className="d-flex flex-column align-items-center justify-contents-center">
                  <div className="subtitles">
                  <p className="mx-auto my-0 text-uppercase font-weight-bold text-left">Events</p>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th scope="col" className="text-nowrap">Event Name</th>
                        <th scope="col">Starting Time</th>
                        <th scope="col" className="text-wrap">Duration (mins)</th>
                        <th></th>
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
  );
}

export default EventList;

import React, { useState, useEffect, useContext } from "react";
import ScheduleGeneratorApi from "../api";
import UserContext from "../auth/UserContext";
import useEventState from '../hooks/useEventState';
import Event from "./Event";
import "./EventForm.css";

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
    const { currentUser } = useContext(UserContext);
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
                        <Event eventData={e}/>
                      ))}
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

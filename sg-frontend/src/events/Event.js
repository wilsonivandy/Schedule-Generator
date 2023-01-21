import React, { useContext } from "react";
import ScheduleGeneratorApi from "../api";
import UserContext from "../auth/UserContext";
import useEventState from '../hooks/useEventState';
import { XSquare } from 'react-bootstrap-icons';
import { useHistory } from "react-router-dom";
import EditEventForm from "./EditEventForm";
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

function Event({eventData}) {
    const history = useHistory();
    const { currentUser, setAction } = useContext(UserContext);
    const [eventChange, toggleEventChange] = useEventState();

    async function removeEvent(username, id) {
        await ScheduleGeneratorApi.removeEvent(username, id);
        toggleEventChange();
        setAction('event');
        history.push(`/dashboard/remove`);
    }

    let time = new Date(eventData.event_start_time);
    let startTime = `${time.toTimeString().slice(0, 5)} - ${time.toDateString()}` ;

    if (eventData.event_isflexible === true && !eventData.event_start_time) {
      startTime = undefined;
    }

    return (
      <tr>
        <td>
        <button onClick={() => removeEvent(currentUser.username, eventData.id)} className="btn-sm btn-primary"><XSquare/></button>
        </td>
        <th scope="row">{eventData.event_name}</th>
        <td>{startTime || "Flexible"}</td>
        <td>{eventData.event_duration}</td>
        <td>
        <EditEventForm eventId={eventData.id}/>
        </td>
      </tr>
    )
}

export default Event;

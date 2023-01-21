import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import ScheduleGeneratorApi from "../api";
import UserContext from "../auth/UserContext";
import useScheduleChangeState from "../hooks/useScheduleChangeState";
import { XSquare, Search } from 'react-bootstrap-icons';
import "./ScheduleForm.css";


function Schedule({schedule}) {
    const { currentUser, setGroupId } = useContext(UserContext);
    const [scheduleChange, toggleScheduleChange] = useScheduleChangeState();
    const history = useHistory();

    let start = new Date(schedule.schedule_start_time);
    let end = new Date(schedule.schedule_end_time);
    let startTime = `${start.toTimeString().slice(0, 5)} - ${end.toTimeString().slice(0, 5)}` ;

    async function removeSchedule(username, id) {
        await ScheduleGeneratorApi.removeSchedule(username, id);
        toggleScheduleChange();
      }
  
    function viewMap(id) {
      setGroupId(id);
      history.push(`/dashboard/${currentUser.username}/map`);
    }

    return (
      <tr>
        <td>
          <button onClick={() => removeSchedule(currentUser.username, schedule.id)} className="btn-sm btn-primary"><XSquare/></button>
        </td>
        
        <th scope="row">{schedule.name}</th>
        <td>{startTime}</td>
        <td>{schedule.schedule_date.slice(0,16)}</td>
        <td>
          <button onClick={() => viewMap(schedule.group_id)} className="btn-sm btn-primary"><Search/></button>
        </td>
      </tr>
    )
}

export default Schedule;
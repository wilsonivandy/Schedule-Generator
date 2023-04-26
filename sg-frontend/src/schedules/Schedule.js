import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import ScheduleGeneratorApi from "../api";
import UserContext from "../auth/UserContext";
import useScheduleChangeState from "../hooks/useScheduleChangeState";
import { XSquare, Search } from 'react-bootstrap-icons';
import "./ScheduleForm.css";


function Schedule({schedule}) {
    const { currentUser, setGroupId, setAction } = useContext(UserContext);
    const history = useHistory();
    const [alternatives, setAlternatives] = useState(0);

    let start = new Date(schedule.schedule_start_time);
    let end = new Date(schedule.schedule_end_time);
    let startTime = `${start.toTimeString().slice(0, 5)} - ${end.toTimeString().slice(0, 5)}` ;

    useEffect(() => {
      async function getScheduleArray() {
        let scheduleArray = await ScheduleGeneratorApi.getSchedulesByGroupId(currentUser.username, schedule.group_id);
        setAlternatives(scheduleArray.length);
      }
      getScheduleArray();
    }, [schedule]);

    async function removeSchedule(username, id) {
        await ScheduleGeneratorApi.removeSchedule(username, id);
        setAction("schedule");
        history.push(`/dashboard/deleting`);
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
        <td>{alternatives}</td>
        <td>
          <button onClick={() => viewMap(schedule.group_id)} className="btn-sm btn-primary"><Search/></button>
        </td>
      </tr>
    )
}

export default Schedule;
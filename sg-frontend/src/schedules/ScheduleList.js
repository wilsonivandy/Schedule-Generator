import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import ScheduleGeneratorApi from "../api";
import UserContext from "../auth/UserContext";
import useScheduleChangeState from "../hooks/useScheduleChangeState";
import { XSquare, Search } from 'react-bootstrap-icons';
import "./ScheduleForm.css";

/** Show page with list of companies.
 *
 * On mount, loads companies from API.
 * Re-loads filtered companies on submit from search form.
 *
 * This is routed to at /companies
 *
 * Routes -> { CompanyCard, SearchForm }
 */

function ScheduleList() {
    const { currentUser, setGroupId } = useContext(UserContext);
    const [scheduleChange, toggleScheduleChange] = useScheduleChangeState();
    const [schedules, setSchedules] = useState(null);
    const history = useHistory();

    useEffect(function loadSchedule() {
        async function getSchedule() {
            let groups = await ScheduleGeneratorApi.getSchedules(currentUser.username);
            let groupIds = groups.map(g => (g.group_id));

            let uniqueGroupIds = [];
            for (let i = 0; i < groupIds.length; i++) {
                if (uniqueGroupIds.indexOf(groupIds[i]) === -1) {
                  uniqueGroupIds.push(groupIds[i]);
                }
            }

            let listOfSchedules = [];
            for (let i=0; i < uniqueGroupIds.length; i++) {
              let scheduleArray = await ScheduleGeneratorApi.getSchedulesByGroupId(currentUser.username, uniqueGroupIds[i]);
              listOfSchedules.push(scheduleArray);
            }
            let tempFinalList = []
            for (let i = 0; i < listOfSchedules.length; i++) {
              let tempGroup = [];
              let group = listOfSchedules[i];
              let groupName = group[0].schedule_name;

              let schedule = await ScheduleGeneratorApi.getSchedule(currentUser.username, group[0].schedule_id);
              schedule.total_distance = group[0].total_distance / 1000;
              schedule.total_duration = group[0].total_duration;
              schedule.group_id = group[0].group_id;
              tempGroup.push(schedule);
              
              // tempGroup = tempGroup.map(s => s.schedules);
              tempGroup.name = groupName;
              tempFinalList.push(tempGroup);
            }
            
            setSchedules(tempFinalList); // schedules is an array, where each value has a number of grouped schedules,
        }
        getSchedule();
    }, [currentUser.username, scheduleChange]);


    if (!schedules) return (
      <div className="eventList col-md-8 offset-md-2 pl-0 pr-0 ml-0 mr-0">
          <div className="d-flex flex-column align-items-center justify-contents-center">
                  <div className="subtitles">
                      <p className="mx-auto my-0 text-uppercase font-weight-bold">Schedules</p>
                  </div>
                  <p>Your created schedules will appear here</p>
          </div>
      </div>
    );

    async function removeSchedule(username, id) {
      await ScheduleGeneratorApi.removeSchedule(username, id);
      toggleScheduleChange();
    }

    function viewMap(id) {
      setGroupId(id);
      history.push(`/dashboard/${currentUser.username}/map`);
    }

    function renderSchedules() {
      return (
        <>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th scope="col" className="text-nowrap">Schedule Name</th>
                <th scope="col">Starting - End</th>
                <th scope="col" className="text-wrap">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(group =>  (writeGroup(group, group.name)))}
            </tbody>
          </table>
        </>
        
      )
    }

   function writeGroup(group, name) {
        return (
          <>
          {group.map(s => (writeSchedule(s, name)))}
          </>
        )
      }

    function writeSchedule(schedule, name) {
        let start = new Date(schedule.schedules.schedule_start_time);
        let end = new Date(schedule.schedules.schedule_end_time);
        let startTime = `${start.toTimeString().slice(0, 5)} - ${end.toTimeString().slice(0, 5)}` ;
        return (
          <tr>
            <td>
              <button onClick={() => removeSchedule(currentUser.username, schedule.schedules.id)} className="btn-sm btn-primary"><XSquare/></button>
            </td>
            
            <th scope="row">{name}</th>
            <td>{startTime}</td>
            <td>{schedule.schedules.schedule_date.slice(0,16)}</td>
            {/* <td>{Math.round(schedule.total_distance * 10) / 10}</td>
            <td>{Math.round(schedule.total_duration * 10) / 10}</td> */}

            <td>
              <button onClick={() => viewMap(schedule.group_id)} className="btn-sm btn-primary"><Search/></button>
            </td>
          </tr>
        )
    }

  return (
    <div className="eventList col-md-8 offset-md-2 pl-0 pr-0 ml-0 mr-0">
        {schedules.length
            ? (
                <div className="d-flex flex-column align-items-center justify-contents-center">
                    <div className="subtitles">
                        <p className="mx-auto my-0 text-uppercase font-weight-bold">Schedules</p>
                    </div>
                    {renderSchedules()}
                </div>
            ) : (
                <p className="lead"></p>
            )}
      </div>
  );
}

export default ScheduleList;

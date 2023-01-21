import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import ScheduleGeneratorApi from "../api";
import UserContext from "../auth/UserContext";
import useScheduleChangeState from "../hooks/useScheduleChangeState";
import { XSquare, Search } from 'react-bootstrap-icons';
import Schedule from "./Schedule";
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

            let tempSchedules = []
            for (let i = 0; i < listOfSchedules.length; i++) {
              let group = listOfSchedules[i];
              let schedule = await ScheduleGeneratorApi.getSchedule(currentUser.username, group[0].schedule_id);
              schedule.schedules.name = group[0].schedule_name;
              schedule.schedules.group_id = group[0].group_id;
              tempSchedules.push(schedule.schedules);
            }
            
            setSchedules(tempSchedules); // schedules is an array, where each value has a number of grouped schedules,
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
              {schedules.map(s =>  (
                <Schedule schedule={s}/>
              ))}
            </tbody>
          </table>
        </>
        
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

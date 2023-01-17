import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ScheduleGeneratorApi from '../api';
import UserContext from "../auth/UserContext";
import "./Dashboard.css";


function Dashboard() {
  const history = useHistory();
  const { currentUser, action, setAction } = useContext(UserContext);
  const [groupIds, setGroupIds] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(function getGroups() {
    async function getGroupLength() {
            let groups = await ScheduleGeneratorApi.getSchedules(currentUser.username);
            let groupIds = groups.map(g => (g.group_id));
            setGroups(groups);

            let uniqueGroupIds = [];
            for (let i = 0; i < groupIds.length; i++) {
                if (uniqueGroupIds.indexOf(groupIds[i]) === -1) {
                uniqueGroupIds.push(groupIds[i]);
                }
            }
            setGroupIds(uniqueGroupIds)
        }
    getGroupLength()
  }, [])

  function writeSchedules(s) {
        return (
            <li>{s.schedule_name} - {s.schedule_date}</li>
        )
  }

  function renderInfo() {
    let name;
    let date;
      if (groupIds.length === 0) {
        return (<h5 className="mt-3 font-weight-bold">Create at least 2 events to generate your first schedule!</h5>)
     } else if (groupIds.length === 1) {
         for (let i=0; i < groups.length; i++) {
             if (groups[i].group_id === groupIds[0]) {
                 name = groups[i].schedule_name;
                 date = groups[i].schedule_date;
                 break;
             }
         }
        return (
            <>
                <h5 className="mt-3 font-weight-bold">You have made 1 schedule!</h5>
                <ul>
                    <li>{name} - {date}</li>
                </ul>
            </>
        )
     } else {
         let uniqueSchedules = []
         for (let j=0; j < groupIds.length; j++) {
             for (let i=0; i < groups.length; i++) {
                if (groups[i].group_id === groupIds[j]) {
                    let schedule = {};
                    schedule.schedule_name = groups[i].schedule_name;
                    schedule.schedule_date = groups[i].schedule_date;
                    uniqueSchedules.push(schedule);
                    break;
                }
            }
         }
        

         return (
             <>
                <h5 className="mt-3 font-weight-bold">You have made {groupIds.length} schedules!</h5>
                <ul className="scheduleInfo">
                    {uniqueSchedules.map(g => (writeSchedules(g)))}
                </ul>
             </>
         
         )
     }
  }

  function handleEventButton() {
    setAction("event");
    history.push(`/events/view`);
  }

  function handleScheduleButton() {
    setAction("schedule");
    history.push(`/schedules/view`);
  }


  const render = (
    <div className="Dashboard h-100 d-flex align-items-center justify-content-center">
        <div className="container-fluid h-100 ">
            <div className="d-flex align-items-center justify-content-center row mb-5">
                <div className="col-lg-6">
                    <h1 className="text-uppercase font-weight-bold text-left">Hello, {currentUser.name}</h1>
                    <div>
                        {renderInfo()}
                    </div>
                    <div className="text-center d-flex flex-row">
                        <button className='btn btn-primary backButton text-nowrap mt-4 mx-1' onClick={() => handleEventButton()}>
                            Your Events
                        </button>
                        <button className='btn btn-primary backButton text-nowrap mt-4 mx-1' onClick={() => handleScheduleButton()}>
                            Your Schedules
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
      
  )

  return (
      <div>
            {currentUser && render}
      </div>
  );
}

export default Dashboard;
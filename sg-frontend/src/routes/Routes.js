import React, { useContext } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignUpForm";
import UserContext from "../auth/UserContext";
import Map from '../dashboard/Map';
import Homepage from '../homepage/Homepage';
import ScheduleView from '../schedules/ScheduleView';
import EventView from '../events/EventView';
// import PrivateRoute from "./PrivateRoute";

function Routes({login, signUp}) {
    const { currentUser, action } = useContext(UserContext);
    let dashboardPath = ``;
    let schedulesPath = ``;
    let eventsPath = ``;
    if (currentUser) {
        dashboardPath = `/dashboard/${currentUser.username}`;
        schedulesPath = `/schedules/${currentUser.username}`;
        eventsPath = `/events/${currentUser.username}`;
    } else {
        dashboardPath = `/home`;
        schedulesPath = `/home`;
        eventsPath = `/home`;

    }

    let redirectPath = ``;
    if (action === "event") {
       redirectPath = `/events/${currentUser.username}`;
    } else if (action === "schedule") {
      redirectPath = `/schedules/${currentUser.username}`;
    } else {
      redirectPath = `/home`;
    }

    return (
      <Switch>
        <Route exact path="/home">
          <Homepage/>
        </Route>

        <Route exact path={dashboardPath}>
          <Dashboard/>
        </Route>

        <Route exact path={eventsPath}>
          <EventView/>
        </Route>
        


        <Route exact path={schedulesPath}>
          <ScheduleView/>
        </Route>
{/* 
        <Route exact path={dashboardPath}>
          <Dashboard/>
        </Route> */}

        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>

        <Route exact path="/signup">
          <SignupForm signUp={signUp} />
        </Route>

        <Route exact path={`${dashboardPath}/map`}>
          <Map/>
        </Route>

        <Redirect to={`${redirectPath}`} />
    </Switch>
    );
  }

export default Routes;
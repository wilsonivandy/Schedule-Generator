import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
// import background from '../images/lance-anderson.png';
// import background from '../images/work.avif';
import UserContext from "../auth/UserContext";
import EventForm from "../events/AddEventForm";
import EventList from "../events/EventList";
import ScheduleForm from "../schedules/ScheduleForm";
import ScheduleList from "../schedules/ScheduleList";
import API_SECRET_KEY from "../events/secrets";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./Homepage.css";



/** Dashboard of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Dashboard
 */

function Homepage() {
  const { currentUser } = useContext(UserContext);

  function getGreeting() {
    if (currentUser) {
        return (
            <h1 className="mx-auto my-0 text-uppercase font-weight-bold text-left">Hello, {currentUser.name}</h1>
        )
    } else {
        return (
            <h1 className="mx-auto my-0 text-uppercase font-weight-bold text-left">Schedule Generator</h1>
        )
    }
}

  function getButton() {
      if (currentUser) {
          return (
              <Link to={`/dashboard/${currentUser.username}`}>
              <button className="btn btn-primary float-left">Continue where you left off</button>
              </Link>

          )
      } else {
          return (
            <Link to="/signup">
            <button className="btn btn-primary float-left" href="#about">Get Started</button>
            </Link>
          )
      }
  }

  const render = (
      <div>
          <div>
              <header className="masthead h-100 d-flex h-100 align-items-center justify-content-around">
                    <div className="container-fluid ml-0 mr-0 pl-0 pr-0 h-100 d-flex align-items-center justify-content-around">
                        <div className="homepage d-flex align-items-center justify-content-center row g-0">
                            <div className="text-center col-lg-6 h-50 order-lg-1">
                                {getGreeting()}
                                <h2 className="text-white-50 ml-2 mt-4 mb-5 text-left">Say goodbye to scheduling stress with our intuitive visualization and scheduling tool</h2>
                                {/* <button className="btn btn-primary float-left" href="#about">Get Started</button> */}
                                {getButton()}
                            </div>
                            <div className="col-lg-6 heroPicture order-lg-2">
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            <section className="showcase">
              <div className="container-fluid p-0">
                  <div className="row g-0 d-flex justify-content-center">
                      <div className="col-lg-6 order-lg-2 text-white showcase-img calendarIconPic"></div>  
                      <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                          <h2>Effortless Scheduling</h2>
                          <p className="lead mb-0">Our app makes it easy for you to create and organize your schedule with just a few clicks. Simply add your events and tasks, and the app will generate a feasible schedule for you.</p>
                      </div>
                  </div>
                  <div className="row g-0">
                      <div className="col-lg-6 text-white showcase-img googlemapsIconPic" ></div>
                      <div className="col-lg-6 my-auto showcase-text">
                          <h2>Integration with Google Maps</h2>
                          <p className="lead mb-0">Our app integrates with Google Maps to provide you with the distance and travel time between events. This helps you plan your schedule more efficiently and avoid any delays.</p>
                      </div>
                  </div>
                  <div className="row g-0">
                      <div className="col-lg-6 order-lg-2 text-white showcase-img routeIconPic"></div>
                      <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                          <h2>Review your schedule route on a Map</h2>
                          <p className="lead mb-0">In addition to the calendar view, you can also view the route on a map for each event. This helps you visualize your schedule and plan your travel more effectively.</p>
                      </div>
                  </div>
              </div>
            </section>
      </div>
          
  )
 
  return (
      <div>
            {currentUser
                ? <div>
                    {/* Welcome Back, {currentUser.firstName || currentUser.username}! */}
                    {render}
                </div>
                : <div>
                    {render}
                    </div>}
      </div>
  );
}

export default Homepage;
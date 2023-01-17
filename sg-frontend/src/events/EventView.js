import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
// import background from '../images/lance-anderson.png';
// import background from '../images/work.avif';
import UserContext from "../auth/UserContext";
import EventForm from "./EventForm";
import EventList from "./EventList";
import API_SECRET_KEY from "../events/secrets";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import "../dashboard/Dashboard.css";



/** Dashboard of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Dashboard
 */

function EventView() {
  const { currentUser } = useContext(UserContext);
  const render = (
    <div className="Dashboard">
    <header className="container h-100 d-flex align-items-center justify-content-around">
          <div className="justify-content-center mt-5 flex-nowrap text-center">
                    <div className="row">
                        <EventList/>
                    </div>

                    <div className='row text-center justify-content-center'>
                        <EventForm />
                    </div>
            </div>
      </header>
    </div>
  )

  return (
      <div>
            {currentUser && render}
      </div>
  );
}

export default EventView;
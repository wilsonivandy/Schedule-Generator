import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import './NavBar.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import "../../node_modules/jquery/dist/jquery";
import "../../node_modules/bootstrap/dist/js/bootstrap";

function NavBar({logout}) {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    function renderLoggedIn() {
        return (
            <Nav className="me-auto ">
                <Link className="nav-link mx-1" to={`/dashboard/${currentUser.username}`}>Dashboard</Link>
                <Link className="nav-link mx-1" to={`/events/${currentUser.username}`}>Events</Link>
                <Link className="nav-link mx-1" to={`/schedules/${currentUser.username}`}>Schedules</Link>
                <Link className="nav-link mx-1" to="/home" onClick={logout}>Log out {currentUser.first_name || currentUser.username}</Link>
            </Nav>
        )
    }

    function renderLoggedOut() {
        return (
            <Nav className="me-auto ">
                <NavLink className="nav-link" to="/login">Login</NavLink>
                <NavLink className="nav-link" to="/signup">Sign Up</NavLink>
            </Nav>
        )
    }

  return (
    <Navbar expand="lg" id="mainNav">
        <Container>
        <Link className="navbar-brand ml-4" to="/home">Home</Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="nav-items">
            {currentUser ? renderLoggedIn() : renderLoggedOut()}
        </Navbar.Collapse>
        </Container>
    </Navbar>
        
  )
}

export default NavBar;
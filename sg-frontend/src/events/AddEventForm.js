/*global google*/
import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserContext from "../auth/UserContext";
import ScheduleGeneratorApi from '../api';
import useEventState from '../hooks/useEventState';
import EventForm from './EventForm';
import "./EventForm.css";

function AddEventForm() {
    const history = useHistory();
    const [changeEvent, toggleEventChange] = useEventState();
    const { currentUser, setAction } = useContext(UserContext);
    const [show, setShow] = useState(false);
    const [map, setMap] = useState(null)
    const FORM_DATA_INITIAL = {
        username: `${currentUser.username}`,
        event_name: "",
        event_start_time: "",
        event_duration:0,
        event_location:"",
        event_priority:0,
        event_isFlexible:false
      }
    const [formData, setFormData] = useState(FORM_DATA_INITIAL);
    const [formErrors, setFormErrors] = useState([]);
    const [locationCode, setLocationCode] = useState({ lat: 48.8584, lng: 2.2945 });
    
      async function handleSubmit(evt) {
        evt.preventDefault();
        formData.event_duration = parseInt(formData.event_duration);
        formData.event_priority = parseInt(formData.event_priority);
        if (formData["event_start_time"] !== undefined) {
            let newTime = new Date(formData.event_start_time);
            formData.event_start_time = newTime.toUTCString();
            newTime.setMinutes(newTime.getMinutes() + formData.event_duration);
            formData.event_end_time = newTime.toUTCString();
            formData.event_isFlexible = false;
        } else {
            formData.event_isFlexible = true;
        }
        
        try {
            let result = await ScheduleGeneratorApi.createEvent(currentUser.username, formData);
            if (result) {
                toggleEventChange();
                handleClose();
                setFormData(FORM_DATA_INITIAL);
                setAction('event');
                history.push(`/dashboard/creating`);
            }
        } catch (err) {
            setFormErrors(err);
        }
      }

      function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(l => ({ ...l, [name]: value }));
      }


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Create Event
        </Button>
  
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add an event</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <EventForm 
                        formData={formData} 
                        locationCode={locationCode} 
                        setLocationCode={setLocationCode} 
                        setMap={setMap} 
                        handleSubmit={handleSubmit} 
                        handleChange={handleChange}
                        formErrors={formErrors}/>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type='submit' onClick={handleSubmit}>
                    Finish
                    </Button>
                </Modal.Footer>
        </Modal>
      </>
    );
}

export default AddEventForm;

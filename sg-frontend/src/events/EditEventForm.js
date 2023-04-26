/*global google*/
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserContext from "../auth/UserContext";
import ScheduleGeneratorApi from '../api';
import useEventState from '../hooks/useEventState';
import { Pencil } from 'react-bootstrap-icons';
import EventForm from './EventForm';
import "./EventForm.css";

function EditEventForm({eventId}) {
    const history = useHistory();
    const [changeEvent, toggleEventChange] = useEventState();
    const { currentUser, setAction } = useContext(UserContext);
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);
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
    // const libraries = ["places"];
    
      /** Handle form submit:
       *
       * Calls login func prop and, if successful, redirect to /companies.
       */

      useEffect(function loadEditForm() {
          if (editMode) {
            async function getEditForm() {
                let fetchData = await ScheduleGeneratorApi.getEvent(currentUser.username, eventId);
                delete fetchData.event_isflexible;
                delete fetchData.event_end_time;
                delete fetchData.id;
                if (!fetchData.event_start_time) {
                    delete fetchData.event_start_time;
                    fetchData.event_isFlexible = true;
                } else {
                    let startTime = new Date(fetchData.event_start_time);
                    var userTimezoneOffset = startTime.getTimezoneOffset() * 60000;
                    startTime = new Date(startTime.getTime() - userTimezoneOffset);
                    fetchData.event_start_time = startTime.toISOString().slice(0,-1)
                    fetchData.event_isFlexible = false;
                }
                setShow(true);
                setFormData(fetchData);
            }
            getEditForm();
          }
          
      }, [editMode]);

      useEffect(function loadEditForm() {
        if (!show) {
            setFormData(FORM_DATA_INITIAL);
        }
    }, [show]);
    
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
            delete formData.username;
            delete formData.event_isFlexible;
            await ScheduleGeneratorApi.editEvent(currentUser.username, eventId, formData);
            toggleEventChange();
            handleClose();
            setFormData(FORM_DATA_INITIAL);
            setAction("event");
            history.push(`/dashboard/editing`);
        } catch (err) {
            setFormErrors(err);
        }
      }
      
      function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(l => ({ ...l, [name]: value }));
      }

      function handleClose() {
        setShow(false);
        setEditMode(false);
    }

    function handleShow() {
        setShow(true);
        setEditMode(true);
    }

    return (
      <>
        <button className='btn-sm btn-primary' onClick={handleShow}><Pencil/></button>
  
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit event</Modal.Title>
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

export default EditEventForm;

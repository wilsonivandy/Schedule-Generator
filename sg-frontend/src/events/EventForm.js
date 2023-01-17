/*global google*/
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserContext from "../auth/UserContext";
import ScheduleGeneratorApi from '../api';
import useEventState from '../hooks/useEventState';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import API_SECRET_KEY from './secrets';
import Alert from '../common/Alert';
import "./EventForm.css";


function EventForm() {
    const history = useHistory();
    const [changeEvent, toggleEventChange] = useEventState();
    const { currentUser, editId, setEditId, setAction } = useContext(UserContext);
    const [currEdit, setCurrEdit] = useState(0);
    const [show, setShow] = useState(false);
    const [map, setMap] = useState(null)
    const FORM_DATA_INITIAL = {
        username: `${currentUser.username}`,
        event_name: "",
        event_duration:0,
        event_location:"",
        event_priority:0,
        event_isFlexible:false
      }
    const [formData, setFormData] = useState(FORM_DATA_INITIAL);
    const [formErrors, setFormErrors] = useState([]);
    const [locationCode, setLocationCode] = useState({ lat: 48.8584, lng: 2.2945 });
    const locationRef = useRef();
    const libraries = ["places"];
    
      /** Handle form submit:
       *
       * Calls login func prop and, if successful, redirect to /companies.
       */

      useEffect(function loadEditForm() {
          async function getEditForm() {
              let fetchData = await ScheduleGeneratorApi.getEvent(currentUser.username, editId);
              delete fetchData.event_isflexible;
              delete fetchData.event_end_time;
              delete fetchData.id;
              if (!fetchData.event_start_time) {
                  delete fetchData.event_start_time;
                  fetchData.event_isFlexible = true;
              } else {
                  fetchData.event_isFlexible = false;
              }
              setShow(true);
              setCurrEdit(editId);
              setFormData(fetchData);
          }

          if (editId !== 0) {
              getEditForm();
          }
      }, [editId, changeEvent]);

      useEffect(function loadEditForm() {
        if (!show) {
            setEditId(0);
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

        let result;
        

        try {
            if (currEdit > 0) {
                console.log("EDITING")
                delete formData.username;
                delete formData.event_isFlexible;
                result = await ScheduleGeneratorApi.editEvent(currentUser.username, currEdit, formData);
                setEditId(0);
                toggleEventChange();
                handleClose();
                setFormData(FORM_DATA_INITIAL);
                setAction("event");
                history.push(`/dashboard/creating`);
            } else {
                setAction("event");
                result = await ScheduleGeneratorApi.createEvent(currentUser.username, formData);
            }
        } catch (err) {
            setFormErrors(err);
        }
        
        if (result) {
            toggleEventChange();
            handleClose();
            setFormData(FORM_DATA_INITIAL);
            history.push(`/dashboard/creating`);
        }
      }
    
      /** Update form data field */
      function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(l => ({ ...l, [name]: value }));
      }


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const Places = () => {
        const { isLoaded } = useJsApiLoader({
            googleMapsApiKey: API_SECRET_KEY,
            libraries,
        });

        if (!isLoaded) {
            return <div>Loading...</div>
        }  else {
            const input = document.getElementById('autocomplete');
            const options = {
                fields: ["place_id", "geometry"],
            };
            const autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener("place_changed", function () {
                let place = autocomplete.getPlace();
                let placePrefix = "place_id:";
                let chosenLocation = placePrefix.concat(place.place_id)
                formData.event_location = chosenLocation;
                setLocationCode({lat: place.geometry.viewport.Wa.hi, lng: place.geometry.viewport.Ia.hi})
            });
            return (
                <div>
                    <div className="form-group">
                            <label>*Event Location</label>
                                <input
                                id='autocomplete'
                                type="text"
                                name="event_location"
                                className="form-control"
                                ref={locationRef}
                            />
                    </div>
                    <GoogleMap
                                center={locationCode}
                                zoom={14}
                                mapContainerStyle={{ width: '100%', height: '300px' }}
                                options={{
                                    zoomControl: false,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: false,
                                }}
                                onLoad={map => setMap(map)}
                                >
                                <Marker position={locationCode} />
                    </GoogleMap>
                </div>
            )
        }
    }
  
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
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                        <label>*Event Name:</label>
                        <input
                            id="eventName"
                            name="event_name"
                            className="form-control"
                            value={formData.event_name}
                            onChange={handleChange}
                        />
                        </div>
                        <div>
                            <label>Start Time: <p className='smallText mb-0'>(Leave blank if event is flexible)</p></label>
                            <input
                                type="datetime-local"
                                name="event_start_time"
                                id="event_start_time_input"
                                className="form-control"
                                value={formData.event_start_time}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                        <label>*Event Duration (minutes):</label>
                        <input
                            type="number"
                            name="event_duration"
                            className="form-control"
                            value={formData.event_duration}
                            onChange={handleChange}
                        />
                        </div>

                        <div className="form-group">
                        <label>*Event Priority (Rate from 1-5)</label>
                        <input
                            type="number"
                            name="event_priority" 
                            className="form-control"
                            value={formData.event_priority}
                            onChange={handleChange}
                        />
                        </div>
                        
                        {Places()}

                        {formErrors.length
                      ? <Alert type="danger" messages={formErrors} />
                      : null}

                    </form>
                </div>
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

export default EventForm;

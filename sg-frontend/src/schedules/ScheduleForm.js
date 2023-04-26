import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserContext from "../auth/UserContext";
import ScheduleGeneratorApi from '../api';
import "./ScheduleForm.css"; 
import Alert from '../common/Alert';
import useScheduleChangeState from '../hooks/useScheduleChangeState';


function ScheduleForm() {
    const history = useHistory();
    const [scheduleChange, toggleScheduleChange] = useScheduleChangeState();
    const [pauseButton, togglePauseButton] = useState(false);
    const { currentUser, setAction } = useContext(UserContext);
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        username: `${currentUser.username}`,
        schedule_name: "",
        schedule_date: "",
        schedule_start_time: "",
        schedule_end_time:""
      });
      const [formErrors, setFormErrors] = useState([]);
    
      /** Handle form submit:
       *
       * Calls login func prop and, if successful, redirect to /companies.
       */
    
      async function handleSubmit(evt) {
        evt.preventDefault();
        let result;
        try {
          togglePauseButton(true)
          let newDate = new Date(formData.schedule_date);
          let newStart = new Date(formData.schedule_start_time);
          let newEnd = new Date(formData.schedule_end_time);
          formData.schedule_date = newDate.toUTCString().slice(0,16);
          formData.schedule_start_time = newStart.toUTCString();
          formData.schedule_end_time = newEnd.toUTCString();
          result = await ScheduleGeneratorApi.generateSchedule(currentUser.username, formData);
          togglePauseButton(false)
          if (result) {
            handleClose();
            toggleScheduleChange();
            setAction("schedule");
            history.push(`/schedules/${currentUser.username}/creating`);
          }
        } catch (err) {
          setFormErrors(err);
        }
      }
    
      /** Update form data field */
      function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(l => ({ ...l, [name]: value }));
        
      }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Button variant="primary" onClick={handleShow}>
        Create Schedule
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Schedule</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div>
              <form onSubmit={handleSubmit}>
              <div className="form-group">
                  <label>Schedule Name:</label>
                  <input
                      name="schedule_name"
                      type="text"
                      className="form-control"
                      value={formData.schedule_name}
                      onChange={handleChange}
                      required
                  />
                </div>
                <div className="form-group">
                  <label>Schedule Date:</label>
                  <input
                      name="schedule_date"
                      type="date"
                      className="form-control"
                      value={formData.schedule_date}
                      onChange={handleChange}
                      required
                  />
                </div>
                <div>
                    <label>Start Time:</label>
                    <input
                        type="datetime-local"
                        name="schedule_start_time"
                        className="form-control"
                        value={formData.schedule_start_time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                  <label>End Time:</label>
                  <input
                      type="datetime-local"
                      name="schedule_end_time"
                      className="form-control"
                      value={formData.schedule_end_time}
                      onChange={handleChange}
                      required
                  />
                </div>

                {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }
              </form>
              </div>
          </Modal.Body>
          <Modal.Footer>
            {pauseButton ? <Button variant="primary" type='submit' id='submitButton' onClick={handleSubmit} >
              Please Wait
            </Button> : 
              <Button variant="primary" type='submit' id='submitButton' onClick={handleSubmit} >
              Create Schedule
            </Button>
          }
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default ScheduleForm;

/*global google*/
import React from 'react';
import Alert from '../common/Alert';
import EventMap from './EventMap';
import "./EventForm.css";

function EventForm({formData, locationCode, setLocationCode, setMap, handleSubmit, handleChange, formErrors}) {
    return (
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

                <div className="form-group">
                        <label>*Event Location</label>
                            <input
                            id='autocomplete'
                            type="text"
                            name="event_location"
                            className="form-control"
                        />
                </div>
                
                <EventMap formData={formData} locationCode={locationCode} setLocationCode={setLocationCode} setMap={setMap}/>
{/* 
                {formErrors.length
              ? <Alert type="danger" messages={formErrors} />
              : null} */}

            </form>
        </div>
    )
}

export default EventForm;



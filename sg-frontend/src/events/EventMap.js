/*global google*/
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import API_SECRET_KEY from './secrets';
import "./EventForm.css";

const LIBRARIES = ["places"];

const EventMap = ({formData, locationCode, setLocationCode, setMap}) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_SECRET_KEY,
        libraries: LIBRARIES,
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
            setLocationCode({lat: place.geometry.viewport.Wa.hi, lng: place.geometry.viewport.Ja.hi})
        }); 

        if (formData.event_location.length > 0) {
            let locationId = formData.event_location.slice(9);
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({placeId: locationId})
                    .then(({results}) => {
                        setLocationCode({lat: results[0].geometry.viewport.Wa.hi, lng: results[0].geometry.viewport.Ja.hi});
                        input.value = results[0].formatted_address;
                    })

        }
        
        return (
            <div>
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


export default EventMap;
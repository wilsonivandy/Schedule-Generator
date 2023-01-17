var axios = require('axios');
const API_SECRET_KEY = process.env.API_SECRET_KEY || require('./secrets');

// Can be place ID, or string. Must prefix placeID with `place_id:`
// Go from home

async function mapsCall(origin, destination, departureTime, waypoints) {
    try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&departure_time=${departureTime}&mode=driving&waypoints=${waypoints}&key=${API_SECRET_KEY}`
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        throw err;
    }
}

module.exports = mapsCall;
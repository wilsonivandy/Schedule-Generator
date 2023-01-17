// // registering user:

// {
// 	"username": "wilsonivandy",
// 	"password": "wilson2001",
// 	"name": "WilsonNatan",
// 	"email": "wilsonivandy@gmail.com"
// }

// {
// 	"username": "wilsonivandy",
// 	"password": "wilson2001"
// }


// // token received, place in bearer when using insomnia.

// {
// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndpbHNvbml2YW5keSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NzI3MjgzNjZ9.qiLqn4GHv2rb5nYZ3T_7eUkgOeLrBnBKpN_xHHFQ0uI"
// }


// // create events with template:
// {
// 	"username": "wilsonivandy5",
// 	"event_name": "event1",
// 	"event_duration":60,
// 	"event_location": "place_id:ChIJB7RfXFl2hlQRpb-Vv0SYE3A",
// 	"event_priority":3,
// 	"event_isFlexible": true
// }


// {
// 	"username": "wilsonivandy5",
// 	"event_name": "event2",
// 	"event_start_time": "2023-01-17 9:00:00+00",
// 	"event_end_time":"2023-01-17 9:30:00+00",
// 	"event_duration":30,
// 	"event_location": "place_id:ChIJAdUOuNByhlQRhQeijXRE-iA",
// 	"event_priority":3,
// 	"event_isFlexible": false
// }

// {
// 	"username": "wilsonivandy5",
// 	"event_name": "event3",
// 	"event_duration":180,
// 	"event_location": "place_id:ChIJAx7UL8xyhlQR86Iqc-fUncc",
// 	"event_priority":1,
// 	"event_isFlexible": true
// }

// {
// 	"username": "wilsonivandy5",
// 	"event_name": "event4",
// 	"event_start_time": "2023-01-17 11:45:00+00",
// 	"event_end_time":"2023-01-17 12:45:00+00",
// 	"event_duration":60,
// 	"event_location": "place_id:ChIJq2mxU7xzhlQRJQw6V0QuGrg",
// 	"event_priority":2,
// 	"event_isFlexible": false
// }

// {
// 	"username": "wilsonivandy5",
// 	"schedule_date":"2023-01-17",
// 	"schedule_start_time":"2023-01-17 06:00:00+00",
// 	"schedule_end_time":"2023-01-17 22:00:00+00"
// }

const Event_TripDuration = require("../models/event_tripDuration");

async function getTripDuration(first, second) {
    let tripDuration = await Event_TripDuration.getTripDuration(first, second);
    return tripDuration;
}

let resp = undefined;

getTripDuration(78,56).then((res) => { resp = res});

console.log(resp);
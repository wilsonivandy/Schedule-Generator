# Schedule Generator

This is a full-stack web application that allows users to create, read, update, and delete events by providing specific or flexible timestamps, along with their respective locations and priority. The goal of the app is to save users time and scheduling headache, as it can be overwhelming to schedule many events and having to manually check the durations between each event. This potentially allows users to be more productive with their time, while saving costs on gas. 

The app uses Google Maps API to take into account traffic information and travel duration between events, and generates several alternatives for feasible schedules that suit your preferences based on priority, traffic, and travel time. You can then view the generated schedules as a list, or as a route displayed on Google Maps.

## Live Demo
- [Click here to view demo](http://schedule-generator.surge.sh/)

## Features

- Create and sign in into user accounts, save events and schedules.
- Create, read, update, delete events, adding location information made simple by Google Maps Autocomplete.
- Automatically generate multiple schedules and view them as a route
- Generate schedules that takes into account current traffic, duration, and priority.
- Display schedule information such as total travel distance and duration.

## User Flow

![User Flow](/User%20Flow.png)

## Data Model
![Data Model](/Schedule%20Generator%20Schema.png)

## NodeJS Backend API
- The NodeJS server receives, processes, and responds the requests sent by the client. This includes any CRUD operations for events and schedules, along with information regarding locations and travel durations.
- Each request to generate a schedule will return a group of schedules, where each is an alternative. The user can thus pick which schedule they like best.
  
  
## Sorting Algorithm
- When a client requests to generate schedules on a specific time frame, the algorithm will gather all the events that falls within that range, along with all flexible events. Events that have a fixed timestamp are immediately placed, while flexible events are sorted based on their duration and priority which are then placed on available time slots that fit. Then if the distances between the event locations are not yet saved by the database, an API call is made to Google Maps to get updated distances and travel duration. With the new travel duration, flexible events are re-sorted to take into account this additional time. This is important because available time slots will decrease given the time it takes to get from one place to another. If this newly sorted schedule is different than the original schedule order, then another call is made to Google Maps to gather travel durations between the new order of events. This cycle continues until the newly sorted schedule is in the same order as the prior schedule. When a schedule is generated this is reffered to as a feasible schedule.
- Each flexible event is given their respective weights, which represent a linear combination between event duration, event priority, and event travel duration (if provided). These weight parameters are chosen arbitrarily, and thus when implementing ways to generate multiple schedule alternatives, arrays of parameters are used, such that with each iteration we will be testing different parameters to see if the order of schedules change. If a unique and feasible schedule is found, then it is considered as an alternative. 
- The general structure represents a greedy algorithm, where it will make the locally optimal choice at each sorting iteration. By making the most reasonable choice at the current iteration, and leaving the potential conflicts that may arise the app to figure out for later. 
- In consideration of the cost of running this app and rate limits set by Google Maps, the app checks whether it already has the distance and travel duration information of the current order of events in the schedule, prior to making an API call. If any single event-to-event travel has no information gathered on the duration or distance, the app will reverify the entire route by making another Google Maps API call.

![Sorting Algorithm](/Sorting%20Algorithm.png)

## Future Improvements
- Automatic and simple synchronization to Google Calendar will be very useful, thus the user will not have to use two apps. Rather, the schedule generator merely provides a way for users to save time by creating a schedule for them.
- Allowing for recurring flexible events, and customizations for which days they should occur on. 
- Including categories for schedules and events, so users can easily drag and drop which flexible event to include. This also allows for a better dashboard, to see where the user spends most of their time. This helps users analyze their time and maximize productivity.

## Technology Stack

- Javascript (NodeJS, ReactJS, ExpressJS, Axios, JWTa)
- HTML
- CSS (Bootstrap 5)

## Built With
- [Node.js](https://nodejs.org/) - The backend runtime environment
- [Express](https://expressjs.com/) - The web framework used for the API
- [React](https://reactjs.org/) - The JavaScript library used for building the user interface
- [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/directions) - Used for getting traffic information and travel duration between events
- [Bootstrap](https://getbootstrap.com/) - Used for styling the user interface

## Author
* **Wilson Natan** - *Initial work* - [wilsonivandy](https://github.com/wilsonivandy)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Note
Please make sure to obtain your own API key for Google Maps API before running this application. You can get a key from [Google Cloud Console](https://cloud.google.com/maps-platform/).
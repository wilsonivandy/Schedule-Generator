# Schedule Generator

This is a full-stack web application that allows users to create, read, update, and delete events by providing specific or flexible timestamps, along with their respective locations and priority. 

The app uses Google Maps API to take into account traffic information and travel duration between events, and generates several alternatives for feasible schedules that suit your preferences based on priority, traffic, and travel time. You can then view the generated schedules as a list, or as a route displayed on Google Maps.

## Live Demo
- [Click here to view demo](http://schedule-generator.surge.sh/)

## Features

- Create and sign in into user accounts, save events and schedules
- Create, read, update, delete events
- Automatically generate multiple schedules and view them as a route
- Generate schedules that takes into account traffic, duration, and priority.

## NodeJS Backend API
- The NodeJS server receives, processes, and responds the requests sent by the client. This includes any CRUD operations for events and schedules, along with information regarding locations and travel durations. The backend server also handle calls to generate the schedules. 

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
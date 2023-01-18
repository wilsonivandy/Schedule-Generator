# Schedule Generator

This is a full-stack web application that allows users to create, read, update, and delete events with specific or flexible timestamps. The app uses Google Maps API to take into account traffic information and travel duration between events, and generates several alternatives for feasible schedules.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js v12.18.3 or later
- npm v6.14.8 or later
- React v16.13.1 or later

### Installing
1. Clone the repository to your local machine: https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
2. Navigate to the project directory: cd sg-backend ; cd sg-frontend
3. Install the necessary dependencies: npm install
4. Start the development server: npm start
5. Open your web browser and navigate to `http://localhost:3000` to view the application.

### Deployment
The app is ready to be deployed to a live system.

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
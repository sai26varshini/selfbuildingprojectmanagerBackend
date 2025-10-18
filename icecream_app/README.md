# Project Overview
Ice Cream App is a Spring Boot application that provides a RESTful API for managing ice cream data. The frontend is built using React and provides a simple UI for interacting with the API.

## Setup

### Backend

1. Clone the repository and navigate to the project directory.
2. Run `mvn clean package` to build the project.
3. Run `mvn spring-boot:run` to start the application.
4. The application will be available at `http://localhost:8080`.

### Frontend

1. Navigate to the `frontend` directory.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start the development server.
4. The application will be available at `http://localhost:3000`.

### Database

1. Create a MySQL database named `icecreamdb`.
2. Update the `application.properties` file with the correct database credentials.

## Run Instructions

1. Start the Spring Boot application by running `mvn spring-boot:run`.
2. Start the React development server by running `npm start`.
3. Open a web browser and navigate to `http://localhost:3000` to access the application.

## API Endpoints

* `GET /hello`: Returns a simple "Hello World" message.
* `GET /icecreams`: Returns a list of all ice cream data.
* `POST /icecreams`: Creates a new ice cream data.

## React Components

* `Header`: A simple header component.
* `Footer`: A simple footer component.
* `App`: The main application component.

## API Client

* `client.js`: A simple API client using Axios.

## Styles

* `styles.css`: A simple CSS file for styling the application.

## Project Structure

* `src/main/java/com/example`: The Spring Boot application code.
* `src/main/resources`: The application configuration files.
* `src/main/webapp`: The React application code.
* `src/main/webapp/public`: The static files for the React application.
* `src/main/webapp/src`: The React component code.
* `src/main/webapp/src/api`: The API client code.
* `src/main/webapp/src/styles`: The CSS file for styling the application.

## Dependencies

* Spring Boot: `2.7.3`
* Spring Data JPA: `2.7.3`
* MySQL Connector: `8.0.28`
* React: `18.2.0`
* Axios: `0.27.2`

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome. Please submit a pull request with your changes.

---

# README.md

# Ice Cream App

A simple Spring Boot application with a React frontend for managing ice cream data.

## Features

* RESTful API for managing ice cream data
* Simple UI for interacting with the API
* Supports CRUD operations

## Requirements

* Java 11
* Maven 3.8.6
* MySQL 8.0.28
* Node.js 16.17.0
* npm 8.19.2

## Installation

1. Clone the repository and navigate to the project directory.
2. Run `mvn clean package` to build the project.
3. Run `mvn spring-boot:run` to start the application.
4. The application will be available at `http://localhost:8080`.

## Usage

1. Start the Spring Boot application by running `mvn spring-boot:run`.
2. Start the React development server by running `npm start`.
3. Open a web browser and navigate to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome. Please submit a pull request with your changes.

## License

This project is licensed under the MIT License.

---

# package.json

{
  "name": "icecream_app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "axios": "^0.27.2"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}

---

# frontend/src/index.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

---

# frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  const [iceCreams, setIceCreams] = useState([]);
  useEffect(() => {
    axios.get('/icecreams')
      .then(response => {
        setIceCreams(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  return (
    <div>
      <Header />
      <ul>
        {iceCreams.map(iceCream => (
          <li key={iceCream.id}>{iceCream.name}</li>
        ))}
      </ul>
      <Footer />
    </div>
  );
}

export default App;

---

# frontend/src/components/Header.jsx

import React from 'react';
function Header() {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

---

# frontend/src/components/Footer.jsx

import React from 'react';
function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentYear} Ice Cream App</p>
    </footer>
  );
}

export default Footer;

---

# frontend/src/api/client.js

import axios from 'axios';
const API_URL = 'http://localhost:8080';
const client = axios.create({
  baseURL: API_URL,
});
export default client;

---

# frontend/src/styles.css

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}

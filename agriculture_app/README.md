{
  "name": "agriculture_app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.2.3",
    "@types/jest": "^28.1.10",
    "@types/node": "^17.0.38",
    "@types/react": "^18.0.13",
    "@types/react-dom": "^18.0.5",
    "axios": "^0.25.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.7.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/axios": "^0.21.1",
    "@types/react-router-dom": "^5.3.2",
    "typescript": "^4.7.4"
  }
}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agriculture App</title>
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="theme-color" content="#000000">
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png">
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('DOMContentLoaded', () => {
            const isSSR = typeof window === 'undefined';
            if (!isSSR) {
              const script = document.createElement('script');
              script.src = '${API_URL}/client.js';
              document.body.appendChild(script);
            }
          });
        `,
      }}
    />
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
import React, { useState, useEffect } from 'react

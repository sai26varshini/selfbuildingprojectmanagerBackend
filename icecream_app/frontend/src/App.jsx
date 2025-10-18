frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [iceCreams, setIceCreams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/hello')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello from React!</h1>
        <button onClick={() => {
          axios.get('http://localhost:8080/hello')
            .then(response => {
              console.log(response.data);
              setIceCreams(response.data);
            })
            .catch(error => {
              console.error(error);
            });
        }}>Call Backend</button>
        <ul>
          {iceCreams.map((iceCream, index) => (
            <li key={index}>{iceCream}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;

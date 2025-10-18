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
    <div>
      <h1>Ice Creams App</h1>
      <ul>
        {iceCreams.map(iceCream => (
          <li key={iceCream.id}>{iceCream.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

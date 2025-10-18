frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/predict');
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Heart Disease Detection</h1>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}

export default App;

import React from 'react';
import axios from 'axios';

function App() {
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users/');
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Ramu App</h1>
      <button onClick={fetchUsers}>Fetch Users</button>
    </div>
  );
}

export default App;

frontend/src/api/client.js
import axios from 'axios';

const API_URL = 'http://localhost:8080';

const client = axios.create({
  baseURL: API_URL,
});

const get = async (url, params = {}) => {
  try {
    const response = await client.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const post = async (url, data = {}) => {
  try {
    const response = await client.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { get, post };

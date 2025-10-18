frontend/src/api/client.js
import axios from 'axios';
import { API_URL } from '../config';

const client = axios.create({
  baseURL: API_URL,
});

const get = async (endpoint, params = {}) => {
  try {
    const response = await client.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const post = async (endpoint, data) => {
  try {
    const response = await client.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { get, post };

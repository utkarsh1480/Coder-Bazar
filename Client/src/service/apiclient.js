import axios from 'axios';
const baseURL =  "http://localhost:4600/api";

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
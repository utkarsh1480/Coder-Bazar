import apiClient from './apiclient.js';

const authService = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/auth/get-Me");
    return response.data;
  },
};

export default authService;

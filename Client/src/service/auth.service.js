import apiClient from './apiClient';

const authService = {
    login : async (Credentials) => {
        try {
            const response = await apiClient.post('/auth/login', Credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    register : async (userData) => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    logout : async () => {
        try {
            const response = await apiClient.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
   getMe: async () => {
    try{
    const response = await apiClient.get("/auth/get-Me");
    return response.data;
    }catch(error){
        throw error
    }
  },
}
export default authService;
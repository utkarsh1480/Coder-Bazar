import apiClient from "./apiClient";

const userService = {
  getMe: async (id) => {
    const response = await apiClient.get(`/user/${id}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.patch("/user/me", data);
    return response.data;
  },
};

export default userService;
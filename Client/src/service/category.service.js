
import apiClient from "./apiclient.js";


const categoryService = {
  getAllCategory: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },
};

export default categoryService;


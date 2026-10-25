
import apiClient from "./apiclient.js";


const categoryService = {

    getAllCategory : async()=>{
        try{
            const response = await apiClient.get('/categories');
            return response.data;
        }catch(error){
            throw error
        }
    }
}
export default categoryService



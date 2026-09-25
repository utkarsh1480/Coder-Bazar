
import apiClient from "./apiClient";


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




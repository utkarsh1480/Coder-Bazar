import { getCategoriesServices } from "./category.service.js";


export async function getAllCategory(req,res,next){
  try{
    const categories = await getCategoriesServices();

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
}catch(error){
  next(error)
}
}
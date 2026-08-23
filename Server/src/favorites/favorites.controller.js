import {createFavoriteService, deleteFavouriteService, getFavouriteService} from './favorites.service.js'

export async function createfavouriteController(req,res,next){
    try{
    const listingId = req.params.listingId;
    console.log(listingId);
    if(!listingId){
        return res.status(201).json({
            "status" : false,
            "Message" : "please Enter valid listingId"
        })
    }
        const favourite = await createFavoriteService(
            req.user.sub,
            listingId
        )
        res.status(201).json({
      status: "success",
      data: {
        favourite,
      },
    });
}
catch(error){
next(error)
    }
}

export async function deleteFavouriteController(req,res,next){
   try {
      const favouriteId = req.params.favouriteId
       const result = await deleteFavouriteService(
         favouriteId
       );
       res.status(200).json({
         success: true,
         data: result,
       });
     } catch(error) {
       next(error);
     }
}

export async function getFavouriteController(req, res, next) {
  try {
    const favourite = await getFavouriteService(
      req.user.sub
    );
    if (!favourite) {
      const error = new Error("Favourite not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: "success",
      data: {
        favourite,
      },
    });
  } catch (error) {
    next(error);
  }
}
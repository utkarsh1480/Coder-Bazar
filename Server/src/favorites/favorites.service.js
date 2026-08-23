import { tr } from "zod/v4/locales";
import prisma  from "../lib/prisma.js";

export async function createFavoriteService(userId, listingId) {
  
  const listing = await prisma.Listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    const error =  new Error(
      "Listing not found",
    );
    error.statusCode = 404
    throw error
  }


  const existingFavorite = await prisma.Favorite.findUnique({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
  });

  if (existingFavorite) {
    const error = new Error(
      "Listing already added to favorites",
    );
    error.statusCode = 409
    throw error
  }

  const favorite = await prisma.Favorite.create({
    data: {
      userId,
      listingId,
    },
    select: {
      id: true,
      listingId: true,
      createdAt: true,
    },
  });

  return favorite;
}

export async function deleteFavouriteService(favouriteId){
 
const favourite = await prisma.Favorite.findUnique({
    where : {
        id : favouriteId
    }
})
if(!favourite){
    const error = new Error("Fovourite Not exist Please add fovourite first")
      error.statusCode = 404
      throw error  
}
await prisma.favorite.delete({
    where :{
        id : favouriteId
    }
})
  return {
    message: "favourite item  removed successfully",
  };
}

export async function getFavouriteService( userId) {
  const favourite = await prisma.Favorite.findFirst({
    where: {
      userId: userId,
    },

    select: {
      id: true,
      userId: true,
      listingId: true,

      user: {
        select: {
          id: true,
          name: true,
        },
      },

      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          city: true,
        },
      },
    },
  });

  return favourite;
}
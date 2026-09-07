import { describe } from "zod/v4/core";
import prisma from "../lib/prisma.js";
import { date } from "zod";


export async function createListingService(userId, data){

    const category = await prisma.category.findUnique({
        where :{
            id : data.categoryId
        }
    })
    if(!category){
        const error = new Error("Please Select Valid. category")
        error.statusCode = 404;
        throw error
    }

    const listing = await prisma.Listing.create({
        data :{
            title : data.title,
            description : data.description,
            price : data.price,
            city : data.city,
            categoryId : data.categoryId,
            sellerId : userId

        },
        select: {
      id: true,
      title: true,
      description: true,
      price: true,
      city: true,
      sellerId: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
    })
    
    return listing;

}


export async function getAllListingsService(){
   
    const listing = await prisma.Listing.findMany({
       orderBy : {
            createdAt : "desc"
        },
        select :{
            id : true,
            title : true,
            description : true,
            price : true,
            city : true,
            createdAt : true,
            updatedAt : true,
        
        seller: {
        select: {
          id: true,
          name: true,
        },
    },
      category: {
        select: {
          id: true,
          name: true,
        },
    }
}
    })
    return listing
}


export async function getListingByIdService(listingId){

    const listing = await prisma.Listing.findUnique({
        where :{
            id : listingId
        }, select :{
            id : true,
            title : true,
            description : true,
            price : true,
            city : true,
            createdAt : true,
            updatedAt : true,
        
        seller: {
        select: {
          id: true,
          name: true,
        },
    },
      category: {
        select: {
          id: true,
          name: true,
        },
    }
}
    })
    if (!listing) {
   const error = new Error("Listing not found");
  error.statusCode = 404;
  throw error;
}

    return listing
}

export async function updateListingService(listingId, userId, data) {
  const listing = await prisma.Listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    const error =  new Error("Listing not found")
    error.statusCode = 404
    throw error
  }

  if (listing.sellerId !== userId) {
    const error =  new Error(
      "You are not allowed to update this listing",
      "FORBIDDEN"
    );
    error.statusCode = 403
    throw error
  }

  if (data.categoryId) {
    const category = await prisma.Category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      const error =  new AppError(
        "Category not found",
      );
      error.statusCode = 403
      throw error
    }
  }

  const updatedListing = await prisma.Listing.update({
    where: {
      id: listingId,
    },

    data,

    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      city: true,
      sellerId: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedListing;
}

export async function deleteListingService(listingId, userId){

  const listing = await prisma.Listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    const error =  new AppError(
      "Listing not found",
    );
    error.statusCode = 404
    throw error
  }

  if (listing.sellerId !== userId) {
    const error =  new Error(
      "You are not allowed to delete this listing"
    );
    error.statusCode = 403
    throw error
  }

  await prisma.Listing.delete({
    where: {
      id: listingId,
    },
  });

  return {
    message: "Listing deleted successfully",
  };
}

export async function filterListingService(filter ={}, page, limit){
    const {
    search,
    categoryId,
    city,
    minPrice,
    maxPrice,
    sort = "latest",
} = filter;
const skip = (page-1)*limit;
const where = {}
if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
}

if(categoryId){
    where.categoryId = categoryId
}

if(city){
    where.city ={
        equals : city,
        mode : "insensitive"
    }
}

if(minPrice !== undefined || maxPrice !== undefined){
    where.price = {}

    if(minPrice  !== undefined){
        where.price.gte = minPrice
    }
    if(maxPrice !== undefined){
        where.price.lte = maxPrice
    }
}
let orderBy = {
    createdAt: "desc",
  };

  if (sort === "oldest") {
    orderBy = {
      createdAt: "asc",
    };
  }

  if (sort === "price_asc") {
    orderBy = {
      price: "asc",
    };
  }

  if (sort === "price_desc") {
    orderBy = {
      price: "desc",
    };
  }

const listing = await prisma.Listing.findMany({
    skip,
    take : limit,
   where,
   orderBy,
    select :{
        id : true,
        title : true,
        description : true,
        price : true,
        city : true,
        seller :{
            select :{
            id : true,
            name : true
        },
    },
        category : {
            select :{
                id : true 
            }

        }
    }
})
return listing
}





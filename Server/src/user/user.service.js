import prisma from '../lib/prisma.js'


export async function updatUserProfileService(userId, data){
    console.log("YES", userId)
    const user = await prisma.user.findUnique({
        where : {
            id : userId
        }
    })
    if(!user){
    const error = new Error("User Not Found");
    error.statusCode = 404;
    throw error;
    }
      
    const updatedUser = await prisma.user.update({
        where : {
            id : userId
        },
        data,
       
   select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
         
        }})
    return updatedUser;
     
}


export async function getPublicUserProfileService(userId){
    
    const user = await prisma.user.findUnique({
        where : {
            id : userId
        },
        select :{
            id : true,
            name : true,
            avatar : true,
            createdAt : true

        }
    })

    if(!user){
        const error = new Error("User Nof Found");
        error.statusCode(404)
        throw error
    }

    return user
}
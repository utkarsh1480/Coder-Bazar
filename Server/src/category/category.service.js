import prisma from "../lib/prisma.js";


export async function getCategoriesServices(){

    const categorie = await prisma.Category.findMany({
        orderBy : {
            name : "asc"
        },
        select :{
            id : true,
            name : true
        }
    })

    return categorie;
}
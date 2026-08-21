import { success } from 'zod';
import { createListingService ,
     getAllListingsService, 
     getListingByIdService,
     updateListingService,
     deleteListingService,
     filterListingService
    } from './listing.service.js'
import { createListingSchema , updateListingSchema,filterListingSchema} from './listing.validation.js'


export async function createListing(req, res, next) {

    try {
        const result = createListingSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        const userId = req.user.sub;

        const listing = await createListingService(userId, result.data)
        res.status(201).json({
            success: true,
            data: {
                listing,
            },
        });
    } catch (error) {
        next(error)
    }
}

export async function getAllListing(req,res,next){
   try{
    const listing = await getAllListingsService();
     res.status(200).json({
      success: true,
      data: {
        listing,
      },
    });
   } catch(error){
    next(error)
   }
}

export async function getListingById(req,res,next){
    try {
    const listing = await getListingByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        listing,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateListingController(req, res, next) {
  try {
    const result = updateListingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const listing = await updateListingService(
      req.params.id,
      req.user.sub,
      result.data
    );

    res.status(200).json({
      success: true,
      data: {
        listing,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteListingController(req, res, next) {
  try {
    const result = await deleteListingService(
      req.params.id,
      req.user.sub
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function filterListingController(req,res,next){
    try {
const result = filterListingSchema.safeParse(req.query);

const page = Number(req.query.page) || 2;
const limit = Number(req.query.limit) || 10;

if(!result.success){
const error = new Error("Please enter correct Filter")
error.statusCode = 400
throw error
}

const listings = await filterListingService(result.data, page, limit);
res.status(200).json({
    status : "success",
    data :{
        listings
    }
})
    } catch(error){
        next(error)
    }
}
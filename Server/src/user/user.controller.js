import prisma from '../lib/prisma.js';
import {updateProfileSchema} from './user.validator.js'
import {updatUserProfileService, getPublicUserProfileService} from './user.service.js'


export async function updateProfile(req,res,next){
try {
    const result = await updateProfileSchema.safeParse(req.body);
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
    
   const user = await updatUserProfileService(
    req.user.sub,
    result.data
   )
   res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
} catch (error) {
    next(error)
}
}

export async function getUserProfile(req,res,next){
    try {
        const user = await getPublicUserProfileService(req.params.id)
        res.status(200).json({
      success: true,
      data: {
        user,
      },
    })
} catch (error) {
        next(error)
    }
    
}
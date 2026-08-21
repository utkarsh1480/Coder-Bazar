import express from 'express'
import authRouter from '../auth/auth.routes.js'
import userRouter from '../user/user.route.js';
import categoryRouter from '../category/category.route.js';
import listingRouter from '../listings/listing.route.js';

const router = express.Router();


/**
 *@route /api/auth
 8@description all Auth Router
 *access public 
 */
 router.use('/auth', authRouter)

/** 
 *@route /api/user/update-Profile
 @description update user profile
 @access public
 */

 router.use('/user', userRouter)


 /**
  * @route /api/category/get-All-category
  * @description get all category
  * @access public
  */

 router.use('/categories',categoryRouter)


 /**
  * @route /api/listing/createListing
  * @description create new listing 
  * @access public
  */
 
 router.use('/listing', listingRouter);

export default router;
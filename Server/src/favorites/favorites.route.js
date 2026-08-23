import express from "express";
import {createfavouriteController, deleteFavouriteController, getFavouriteController} from './favorites.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js';


const favrouteRouter = express.Router()

/**
 * @route /api/favourite.:id
 * @description add favourite Item to your cart
 * @access public
*/

favrouteRouter.post('/:listingId',requireAuth, createfavouriteController)


/**
 * @route /api/favourite/:favouriteId
 * description delete favourite item 
 * @access public
 */

favrouteRouter.delete('/:favouriteId', deleteFavouriteController)

/**
 * @route /api/favourite/:favouriteId
 * @ description get all favourite Id
 * @access praiate
 */

favrouteRouter.get('/me', requireAuth, getFavouriteController)

export default favrouteRouter;
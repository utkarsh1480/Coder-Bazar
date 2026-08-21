import express from 'express'
import {createListing, 
    getAllListing,
    getListingById , 
    updateListingController , 
    deleteListingController,
    filterListingController

} 
    from './listing.controller.js'
import {requireAuth} from '../middlewares/auth.middleware.js'

const listingRouter = express.Router();

/**
 * @route /api/listing/createListing
 * @description create new listing 
 * @access public
 */

listingRouter.post('/create-listing',requireAuth, createListing );


/**
 * @route /api/listing/getAllListings
 * @description find all listings
 * @access public
 */

listingRouter.get('/get-listings', getAllListing)


/**
 * @route /api/listing/:id
 * @description find all listings by Id
 * @access public
 */

listingRouter.get('/:id', getListingById)


/**
 * @route /api/listing/:i
 * @ description update listing
 * @acess public
 */

listingRouter.patch('/:id', requireAuth ,updateListingController)


/**
 * @route /api/listing/:id
 * @description delete Listing By Id
 * @access public
 */

listingRouter.delete('/:id',requireAuth ,deleteListingController)


/**
 * @route /api/listing/?queryParameter like city=ghaziabad
 * @description apply filter on listing
 * @route public 
 */

listingRouter.get('/', filterListingController)

export default listingRouter
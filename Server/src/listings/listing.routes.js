import express from "express";

import {
  createListing,
  getAllListing,
  getListingById,
  updateListingController,
  deleteListingController,
  filterListingController,
} from "./listing.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const listingRouter = express.Router();

/**
 * @route /api/listing
 * @description Get all listings
 * @access public
 */
listingRouter.get("/", getAllListing);

/**
 * @route /api/listing/filter
 * @description Filter and paginate listings
 * @access public
 */
listingRouter.get("/filter", filterListingController);

/**
 * @route /api/listing/:id
 * @description Get listing by ID
 * @access public
 */
listingRouter.get("/:id", getListingById);

/**
 * @route /api/listing
 * @description Create a new listing
 * @access private
 */
listingRouter.post("/", requireAuth, createListing);

/**
 * @route /api/listing/:id
 * @description Update a listing
 * @access private
 */
listingRouter.patch("/:id", requireAuth, updateListingController);

/**
 * @route /api/listing/:id
 * @description Delete a listing
 * @access private
 */
listingRouter.delete("/:id", requireAuth, deleteListingController);

export default listingRouter;
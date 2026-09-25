import apiClient from "./apiClient";

const listingService = {
  /**
   * Get all listings
   */
  getAllListings: async () => {
    const response = await apiClient.get("/listing");
    return response.data;
  },

  /**
   * Get listing by ID
   */
  getListingById: async (id) => {
    const response = await apiClient.get(`/listing/${id}`);
    return response.data;
  },

  /**
   * Filter and paginate listings
   */
  filterListings: async (params = {}) => {
    const response = await apiClient.get("/listing/filter", {
      params,
    });

    return response.data;
  },

  /**
   * Create a new listing
   */
  createListing: async (data) => {
    const response = await apiClient.post("/listing", data);
    return response.data;
  },

  /**
   * Update a listing
   */
  updateListing: async (id, data) => {
    const response = await apiClient.patch(`/listing/${id}`, data);
    return response.data;
  },

  /**
   * Delete a listing
   */
  deleteListing: async (id) => {
    const response = await apiClient.delete(`/listing/${id}`);
    return response.data;
  },
};

export default listingService;
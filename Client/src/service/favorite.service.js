import apiClient from "./apiClient";

const favoriteService = {
  /**
   * Add a listing to favourites
   */
  addFavourite: async (listingId) => {
    const response = await apiClient.post(`/favourite/${listingId}`);
    return response.data;
  },

  /**
   * Get current user's favourites
   */
  getMyFavourites: async () => {
    const response = await apiClient.get("/favourite/me");
    return response.data;
  },

  /**
   * Remove a favourite
   */
  removeFavourite: async (favouriteId) => {
    const response = await apiClient.delete(
      `/favourite/${favouriteId}`
    );

    return response.data;
  },
};

export default favoriteService;
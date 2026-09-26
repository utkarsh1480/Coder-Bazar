import apiClient from "./apiClient";

const conversationService = {
  /**
   * Create a new conversation for a listing
   */
  createConversation: async (listingId) => {
    const response = await apiClient.post(
      `/conversations/${listingId}`,
    );

    return response.data;
  },

  /**
   * Get all conversations of current user
   */
  getMyConversations: async () => {
    const response = await apiClient.get("/conversations");

    return response.data;
  },

  /**
   * Get all messages of a conversation
   */
  getConversationMessages: async (conversationId) => {
    const response = await apiClient.get(
      `/conversations/${conversationId}/messages`
    );

    return response.data;
  },

  /**
   * Send a message in a conversation
   */
sendMessage: async (conversationId, content) => {
    const response = await apiClient.post(
        `/conversations/${conversationId}/messages`,
        {
            content,
        }
    );
    return response.data;
},

  markConversationAsRead: async (conversationId) => {
    const response = await apiClient.patch(
      `/conversations/${conversationId}/read`
    );

    return response.data;
  },
};


export default conversationService;
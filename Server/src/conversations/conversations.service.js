import { th } from "zod/v4/locales";
import prisma from "../lib/prisma.js";



export async function createConversationService(userId, listingId){

    const listing = await prisma.Listing.findUnique({
        where : {
            id : listingId
        },
        select: {
      id: true,
      sellerId: true,
    },
    })
    if(!listing){
        const error =  new Error("Listing Not Found")
        error.statusCode = 404
        throw error
    }
    if(listing.sellerId == userId){
        const error = new Error("You can not create Connection With yourself")
        error.statusCode = 403
        throw error
    }
    const existConversation = await prisma.Conversation.findUnique({
        where :{
         listingId_buyerId_sellerId: {
      listingId: listingId,
      buyerId: userId,
      sellerId: listing.sellerId,
    },
        },
        select:{
        id: true,
        listingId: true,
        buyerId: true,
        sellerId: true,
        createdAt: true,
        }
    })

    if(existConversation){
        return existConversation;
    }

    const conversation = await prisma.Conversation.create({
        data: {
      listingId,
      buyerId: userId,
      sellerId: listing.sellerId,
    },
    select: {
      id: true,
      listingId: true,
      buyerId: true,
      sellerId: true,
      createdAt: true,
    },
    })

    return conversation;
}

export async function getMyConversationsService(userId) {
  const conversations = await prisma.Conversation.findMany({
    where: {
      OR: [
        {
          buyerId: userId,
        },
        {
          sellerId: userId,
        },
      ],
    },

    orderBy: {
      updatedAt: "desc",
    },

    select: {
      id: true,
      listingId: true,
      buyerId: true,
      sellerId: true,
      createdAt: true,
      updatedAt: true,

      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          city: true,
        },
      },

      buyer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },

      seller: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return conversations;
}


export async function getConversationMessagesService(
  userId,
  conversationId,
  page = 1,
  limit = 50
) {
  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) {
    const error =  new Error(
      "Page must be a positive number");
    error.StatusCode= 400
    throw error
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    const error =  new Error(
      "Limit must be between 1 and 100");
    error.StatusCode = 400
    throw error
  }

  const skip = (page - 1) * limit;

  const conversation = await prisma.Conversation.findFirst({
    where: {
      id: conversationId,

      OR: [
        {
          buyerId: userId,
        },
        {
          sellerId: userId,
        },
      ],
    },

    select: {
      id: true,
    },
  });

  if (!conversation) {
    const error =  new Error("Conversation not found");
    error.StatusCode = 404
    throw error
  }
  const totalMessages = await prisma.Message.count({
    where: {
      conversationId,
    },
  });

  const messages = await prisma.Message.findMany({
    where: {
      conversationId,
    },

    orderBy: {
      createdAt: "asc",
    },

    skip,
    take: limit,

    select: {
      id: true,
      conversationId: true,
      senderId: true,
      content: true,
      createdAt: true,

      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalMessages / limit);

  return {
    messages,

    pagination: {
      page,
      limit,
      totalMessages,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function sendMessageService(
  userId,
  conversationId,
  content
) {
  if (!content || !content.trim()) {
    const error =  new Error(
      "Message cannot be empty",);
    error.statusCode = 400
    throw error
  }

  const cleanContent = content.trim();

  const conversation = await prisma.Conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        {
          buyerId: userId,
        },
        {
          sellerId: userId,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!conversation) {
    const error =  new Error("Conversation not found",);
    error.statusCode = 404
    throw error
  }

  // 3. Create message
  const message = await prisma.Message.create({
    data: {
      conversationId,
      senderId: userId,
      content: cleanContent,
    },
    select: {
      id: true,
      conversationId: true,
      senderId: true,
      content: true,
      createdAt: true,

      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return message;
}
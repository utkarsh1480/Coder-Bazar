import express from 'express'
import {createConversationController,
     getMyConversationsController, 
     getConversationMessagesController,
     sendMessageController
    } from './conversations.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import authRouter from '../auth/auth.routes.js';
const conversationRouter = express.Router();

/**
 * @route /api/conversation/:listingId
 * @description create new Conversation 
 */

conversationRouter.post('/:id',requireAuth, createConversationController )

/**
 * @route /api/conversations/
 * @description get all my conversations
 */

conversationRouter.get("/", requireAuth, getMyConversationsController);

/**
 * @route /api/conversations/conversationsId/message
 * @description search message of Buyer or seller
 */

conversationRouter.get( "/:conversationId/messages", requireAuth,getConversationMessagesController
);

/**
 * @route /api/conversations//:conversationId/messages
 * @description create meaase to seller or to user
 * @access public
 */

conversationRouter.post("/:conversationId/messages",requireAuth,sendMessageController);

export default conversationRouter
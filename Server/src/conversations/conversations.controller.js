import {createConversationService,  
    getMyConversationsService, 
    getConversationMessagesService,
    sendMessageService
} from './conversations.service.js'


export async function createConversationController(req,res,next){
    try {
        const listingId = req.params.id
       const conversation = await createConversationService(
        req.user.sub,
        listingId
       ) 
       res.status(201).json({
        "status" : true,
        data : {
            conversation
        }
       })
    } catch (error) {
        next(error)
    }
}

export async function getMyConversationsController(req, res, next) {
  try {
    const conversations = await getMyConversationsService(
      req.user.sub
    );

    res.status(200).json({
      status: "success",
      data: {
        conversations,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversationMessagesController(req,res, next) {
  try {
    const { conversationId } = req.params;
    console.log(conversationId);

    const { page = 1, limit = 50 } = req.query;

    const result = await getConversationMessagesService(
      req.user.sub,
      conversationId,
      page,
      limit
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMessageController(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    const message = await sendMessageService(
      req.user.sub,
      conversationId,
      content
    );

    res.status(201).json({
      status: "success",
      data: {
        message,
      },
    });
  } catch (error) {
    next(error);
  }
}

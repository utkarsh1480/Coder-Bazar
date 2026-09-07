import prisma from "../lib/prisma.js";
import { sendMessageService } from "../conversations/conversations.service.js";

export function registerChatSocket(io, socket) {

    // =========================================
    // JOIN CONVERSATION
    // =========================================

    socket.on("join_conversation", async ({ conversationId }, callback) => {
        try {

            if (!conversationId) {
                return callback({
                    success: false,
                    message: "Conversation ID is required"
                });
            }
            const conversation = await prisma.Conversation.findFirst({
                where: {
                    id: conversationId,
                    OR: [
                        { buyerId: socket.userId },
                        { sellerId: socket.userId },
                    ],
                },
                select: {
                    id: true,
                    buyerId: true,
                    sellerId: true,
                },
            });

            if (!conversation) {
                return callback({
                    success: false,
                    message: "Conversation not found"
                });
            }

            const ROOM = `conversation_${conversationId}`;

            socket.join(ROOM);

            // Track current conversation
            socket.activeConversationId = conversationId;

            console.log(
                `User ${socket.userId} joined room ${ROOM}`
            );

            return callback({
                success: true,
                message: `Joined conversation ${conversationId}`,
                ROOM
            });

        } catch (error) {

            console.log(
                "Error joining conversation:",
                error.message
            );

            return callback({
                success: false,
                message: "An error occurred while joining the conversation"
            });
        }
    });


    // =========================================
    // SEND MESSAGE
    // =========================================

    socket.on(
        "send_message",
        async ({ conversationId, content }, ack) => {

            try {

                if (!conversationId) {
                    return ack({
                        success: false,
                        message: "Conversation ID is required",
                    });
                }

                if (!content || !content.trim()) {
                    return ack({
                        success: false,
                        message: "Message cannot be empty",
                    });
                }

                // Find conversation
                const conversation = await prisma.Conversation.findFirst({
                    where: {
                        id: conversationId,
                        OR: [
                            { buyerId: socket.userId },
                            { sellerId: socket.userId },
                        ],
                    },
                    select: {
                        id: true,
                        buyerId: true,
                        sellerId: true,
                    },
                });

                if (!conversation) {
                    return ack({
                        success: false,
                        message: "Conversation not found",
                    });
                }


                // =========================================
                // FIND RECIPIENT
                // =========================================

                const recipientId =
                    conversation.buyerId === socket.userId
                        ? conversation.sellerId
                        : conversation.buyerId;

                console.log("Sender:", socket.userId);
                console.log("Recipient:", recipientId);


                // =========================================
                // SAVE MESSAGE
                // =========================================

                const message = await sendMessageService(
                    socket.userId,
                    conversationId,
                    content
                );


                  // =========================================
                //Debug Recipient Sockets
                // =========================================

                const recipientRoom = `user_${recipientId}`;

console.log("================================");
console.log("RECIPIENT DEBUG");
console.log("Recipient ID:", recipientId);
console.log("Recipient room:", recipientRoom);

                // =========================================
                // FIND RECIPIENT SOCKETS
                // =========================================

                const recipientSockets =
                    await io
                        .in(`user_${recipientId}`)
                        .fetchSockets();
               
                        console.log(
    "Recipient sockets:",
    recipientSockets.map((s) => ({
        socketId: s.id,
        userId: s.userId,
        activeConversationId: s.activeConversationId,
    })))

                console.log(
                    "Recipient sockets:",   
                    recipientSockets.length
                );


                // =========================================
                // CHECK ACTIVE CONVERSATION
                // =========================================

                const recipientIsInConversation =
                    recipientSockets.some(
                        (clientSocket) =>
                            clientSocket.activeConversationId ===
                            conversationId
                    );


                console.log(
                    "Recipient in conversation:",
                    recipientIsInConversation
                );


                // =========================================
                // SEND MESSAGE TO CHAT ROOM
                // =========================================

                const ROOM = `conversation_${conversationId}`;
                if(recipientIsInConversation){
                    io.to(ROOM).emit( "new_message",message);
                } else {
                 io.to(`user_${recipientId}`).emit("new_notification",message);
            }

                // =========================================
                // ACK
                // =========================================

                return ack({
                    success: true,
                    message: "Message sent successfully",
                    data: {
                        message,
                    },
                });

            } catch (error) {

                console.error(
                    "Send message error:",
                    error
                );

                return ack({
                    success: false,
                    message: "Unable to send message",
                });
            }
        }
    );


    // =========================================
    // LEAVE CONVERSATION
    // =========================================

    socket.on(
        "leave_conversation",
        async ({ conversationId }, callback) => {

            try {

                if (!conversationId) {
                    return callback({
                        success: false,
                        message: "Conversation ID is required"
                    });
                }

                const ROOM = `conversation_${conversationId}`;

                socket.leave(ROOM);


                // Clear active conversation
                if (
                    socket.activeConversationId === conversationId
                ) {
                    socket.activeConversationId = null;
                }


                console.log(
                    `User ${socket.userId} left room ${ROOM}`
                );


                return callback({
                    success: true,
                    message: `Left conversation ${conversationId}`
                });

            } catch (error) {

                console.log(
                    "Error leaving conversation:",
                    error.message
                );

                return callback({
                    success: false,
                    message: "An error occurred while leaving the conversation"
                });
            }
        }
    );
}
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
                    message: "Conversation ID is required",
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
                    message: "Conversation not found",
                });
            }

            const ROOM = `conversation_${conversationId}`;

            socket.join(ROOM);

            socket.activeConversationId = conversationId;

            console.log(
                `User ${socket.userId} joined room ${ROOM}`
            );

            console.log(
                "SOCKET ROOMS AFTER JOIN:",
                [...socket.rooms]
            );

            return callback({
                success: true,
                message: `Joined conversation ${conversationId}`,
                room: ROOM,
            });
        } catch (error) {
            console.error(
                "Error joining conversation:",
                error
            );

            return callback({
                success: false,
                message:
                    "An error occurred while joining the conversation",
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

                const conversation =
                    await prisma.Conversation.findFirst({
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

                console.log("================================");
                console.log("MESSAGE DELIVERY");
                console.log("Sender:", socket.userId);
                console.log("Recipient:", recipientId);
                console.log("Conversation:", conversationId);

                // =========================================
                // SAVE MESSAGE
                // =========================================

                const message = await sendMessageService(
                    socket.userId,
                    conversationId,
                    content
                );

                // =========================================
                // CONVERSATION ROOM
                // =========================================

                const ROOM =
                    `conversation_${conversationId}`;

                console.log(
                    "Conversation room:",
                    ROOM
                );

                // =========================================
                // CHECK RECIPIENT SOCKET
                // =========================================

                const recipientRoom =
                    `user_${recipientId}`;

                const recipientSockets =
                    await io
                        .in(recipientRoom)
                        .fetchSockets();

                console.log(
                    "Recipient sockets:",
                    recipientSockets.map((clientSocket) => ({
                        socketId: clientSocket.id,
                        userId: clientSocket.userId,
                        activeConversationId:
                            clientSocket.activeConversationId,
                    }))
                );

                const recipientIsInConversation =
                    recipientSockets.some(
                        (clientSocket) =>
                            String(
                                clientSocket.activeConversationId
                            ) === String(conversationId)
                    );

                console.log(
                    "Recipient in conversation:",
                    recipientIsInConversation
                );

                // Deliver to the conversation and recipient rooms. The
                // recipient room covers clients that have not joined the
                // conversation room yet.
                io.to(ROOM)
                    .to(recipientRoom)
                    .emit("new_message", message);

                // =========================================
                // SEND NOTIFICATION IF RECIPIENT
                // IS NOT INSIDE THE CONVERSATION
                // =========================================

                if (!recipientIsInConversation) {
                    io.to(recipientRoom).emit(
                        "new_notification",
                        message
                    );
                }

                // =========================================
                // ACK SENDER
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
                    return callback?.({
                        success: false,
                        message: "Conversation ID is required",
                    });
                }

                const ROOM =
                    `conversation_${conversationId}`;

                socket.leave(ROOM);

                if (
                    socket.activeConversationId ===
                    conversationId
                ) {
                    socket.activeConversationId = null;
                }

                console.log(
                    `User ${socket.userId} left room ${ROOM}`
                );

                return callback?.({
                    success: true,
                    message:
                        `Left conversation ${conversationId}`,
                });
            } catch (error) {
                console.error(
                    "Error leaving conversation:",
                    error
                );

                return callback?.({
                    success: false,
                    message:
                        "An error occurred while leaving the conversation",
                });
            }
        }
    );

    // =========================================
    // TYPING START
    // =========================================

    socket.on(
        "typing_start",
        ({ conversationId } = {}) => {
            if (!conversationId) {
                return;
            }

            const ROOM =
                `conversation_${conversationId}`;

            socket.to(ROOM).emit(
                "user_typing",
                {
                    conversationId,
                    userId: socket.userId,
                }
            );
        }
    );

    // =========================================
    // TYPING STOP
    // =========================================

    socket.on(
        "typing_stop",
        ({ conversationId } = {}) => {
            if (!conversationId) {
                return;
            }

            const ROOM =
                `conversation_${conversationId}`;

            socket.to(ROOM).emit(
                "user_stopped_typing",
                {
                    conversationId,
                    userId: socket.userId,
                }
            );
        }
    );
}
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useToast } from "../context/ToastContext";
import conversationService from "../service/conversation.service";
import socket from "../service/socket";

function Messages() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { conversationId } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  
  useEffect(() => {
    const findConversations = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await conversationService.getMyConversations();

        const conversations =
          response?.data?.conversations || [];

        setConversation(
          Array.isArray(conversations)
            ? conversations
            : []
        );
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Unable to load conversations";

        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    findConversations();
  }, []);

  useEffect(() => {
    const loadMessage = async () => {
      try {
        const response =
          await conversationService.getConversationMessages(
            conversationId
          );

        const messages = Array.isArray(
          response?.data?.messages
        )
          ? response.data.messages
          : [];

        setMessage(messages);
      } catch (error) {
        setMessage([]);
      }
    };

    if (conversationId) {
      loadMessage();
    } else {
      setMessage([]);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const markAsRead = async () => {
      try {
        await conversationService.markConversationAsRead(
          conversationId
        );

        setConversation((prev) =>
          prev.map((item) =>
            String(item.id) === String(conversationId)
              ? { ...item, unreadCount: 0 }
              : item
          )
        );
      } catch (error) {
        console.error(
          "Failed to mark conversation as read:",
          error
        );
      }
    };

    markAsRead();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const joinConversation = () => {
    
      socket.emit(
        "join_conversation",
        { conversationId },
        (response) => {
          if (!response?.success) {
            console.error(
              "FAILED TO JOIN CONVERSATION:",
              response?.message
            );
            return;
          }

        }
      );
    };

    if (socket.connected) {
      joinConversation();
    } else {
      socket.once("connect", joinConversation);
    }

    return () => {
      socket.off("connect", joinConversation);

      if (socket.connected) {
        socket.emit("leave_conversation", { conversationId });
      }
    };
  }, [conversationId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [message]);

  useEffect(() => {
    if (!conversationId) return;

    const addIncomingMessage = (incomingMessage) => {
      if (!incomingMessage?.id) return;


      if (
        String(incomingMessage.conversationId) !==
        String(conversationId)
      ) {
        return;
      }

      setMessage((prev) => {
        const alreadyExists = prev.some(
          (item) => item.id === incomingMessage.id
        );

        if (alreadyExists) {
          return prev;
        }

        return [...prev, incomingMessage];
      });
    };

    const handleNewMessage = (incomingMessage) => {
      addIncomingMessage(incomingMessage);
    };

    const handleNewNotification = (incomingMessage) => {
      if (!incomingMessage?.id) return;

      if (
        String(incomingMessage.conversationId) ===
        String(conversationId)
      ) {
        addIncomingMessage(incomingMessage);
        return;
      }

      setConversation((prev) =>
        prev.map((item) =>
          String(item.id) ===
          String(incomingMessage.conversationId)
            ? {
                ...item,
                unreadCount: (item.unreadCount || 0) + 1,
                updatedAt:
                  incomingMessage.createdAt ||
                  item.updatedAt,
              }
            : item
        )
      );
    };

    socket.on("new_message", handleNewMessage);
    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("new_notification", handleNewNotification);
    };
  }, [conversationId]);


  useEffect(() => {
    if (!conversationId) return;

    const handleUserTyping = ({ conversationId: incomingConversationId, userId }) => {
      if (
        String(incomingConversationId) !== String(conversationId) ||
        userId === user?.id
      ) {
        return;
      }

      setTypingUser(userId);
    };

    const handleUserStoppedTyping = ({
      conversationId: incomingConversationId,
      userId,
    }) => {
      if (
        String(incomingConversationId) !== String(conversationId) ||
        userId === user?.id
      ) {
        return;
      }

      setTypingUser(null);
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
    };
  }, [conversationId, user?.id]);

  const handleTyping = (value) => {
    setInput(value);

    if (!conversationId || !socket.connected) {
      return;
    }

    if (!value.trim()) {
      socket.emit("typing_stop", { conversationId });
      setIsTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      return;
    }

    if (!isTyping) {
      socket.emit("typing_start", { conversationId });
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { conversationId });
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (socket.connected && conversationId) {
        socket.emit("typing_stop", { conversationId });
      }
    };
  }, [conversationId]);

  const selectedConversation = conversation.find(
    (item) =>
      String(item.id || item._id) ===
      String(conversationId)
  );

  const handleSendMessage = async () => {
    if (!input.trim() || !conversationId || sending) {
      return;
    }

    const text = input.trim();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (socket.connected) {
      socket.emit("typing_stop", { conversationId });
    }

    setIsTyping(false);
    setInput("");
    setSending(true);

    const send = () => {
      socket.emit(
        "send_message",
        {
          conversationId,
          content: text,
        },
        (response) => {
          if (!response?.success) {
            console.error(
              "Failed to send message:",
              response?.message
            );

            setInput(text);

            showToast(
              response?.message ||
                "Failed to send message",
              "error"
            );

            setSending(false);
            return;
          }

          const savedMessage = response?.data?.message;

          if (savedMessage?.id) {
            setMessage((prev) => {
              const alreadyExists = prev.some(
                (item) => item.id === savedMessage.id
              );

              if (alreadyExists) {
                return prev;
              }

              return [...prev, savedMessage];
            });
          }

          setSending(false);
        }
      );
    };

    if (socket.connected) {
      send();
      return;
    }

    const handleConnect = () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      send();
    };

    const handleConnectError = (error) => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);

      console.error(
        "SOCKET CONNECTION ERROR:",
        error.message
      );

      setInput(text);
      setSending(false);

      showToast(
        "Unable to connect to chat server",
        "error"
      );
    };

    socket.once("connect", handleConnect);
    socket.once("connect_error", handleConnectError);
    socket.connect();
  };

  const getOtherUser = (item) => {
    if (item.buyerId === user?.id) {
      return item.seller;
    }

    return item.buyer;
  };
  
  const selectedOtherUser = selectedConversation
    ? getOtherUser(selectedConversation)
    : null;
  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 text-[#151515] sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

        <aside className="flex w-full max-w-[340px] shrink-0 flex-col border-r border-black/[0.08] bg-[#FBFAF7]">

          <div className="border-b border-black/[0.08] px-6 py-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8A8A82]">
              Ecoloom
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
              Messages
            </h1>

            <p className="mt-1 text-sm text-[#8A8A82]">
              Your conversations
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3">

            {loading ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm text-[#8A8A82]">
                  Loading conversations...
                </p>
              </div>
            ) : error ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm text-red-500">
                  {error}
                </p>
              </div>
            ) : conversation.length === 0 ? (
              <div className="px-4 py-12 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EDECE7]">
                  <span className="text-lg">
                    💬
                  </span>
                </div>

                <p className="mt-4 text-sm font-medium">
                  No conversations yet
                </p>

                <p className="mt-2 text-xs leading-5 text-[#8A8A82]">
                  Your conversations with buyers
                  and sellers will appear here.
                </p>

              </div>
            ) : (
              <div className="space-y-1">

                {conversation.map((item) => {
                  const otherUser = getOtherUser(item);

                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/messages/${item.id}`)}
                      className={`w-full rounded-2xl p-3 text-left transition ${String(item.id) === String(conversationId)
                          ? "bg-[#151515] text-white"
                          : "hover:bg-black/[0.04]"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E9E9E2] text-sm font-medium text-[#151515]">
                          {otherUser?.avatar ? (
                            <img
                              src={otherUser.avatar}
                              alt={otherUser.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            otherUser?.name?.charAt(0)?.toUpperCase() || "?"
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {otherUser?.name || "Unknown user"}
                          </p>

                          <p
                            className={`truncate text-xs ${String(item.id) === String(conversationId)
                                ? "text-white/60"
                                : "text-[#6B6B63]"
                              }`}
                          >
                            {item.listing?.title || "Listing"}
                          </p>
                        </div>

                        {item.unreadCount > 0 && (
                          <span
                            className={`ml-auto flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-2 text-[10px] font-semibold ${
                              String(item.id) === String(conversationId)
                                ? "bg-white text-[#151515]"
                                : "bg-[#3F4635] text-white"
                            }`}
                          >
                            {item.unreadCount > 99
                              ? "99+"
                              : item.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

              </div>
            )}

          </div>
        </aside>

        <main className="hidden min-w-0 flex-1 flex-col lg:flex">

          {!conversationId ? (
            <div className="flex flex-1 items-center justify-center px-6">

              <div className="max-w-sm text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EDECE7]">
                  <span className="text-2xl">
                    💬
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-medium tracking-[-0.02em]">
                  Select a conversation
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#8A8A82]">
                  Choose a conversation from the
                  left to view your messages.
                </p>

              </div>

            </div>
          ) : (
            <>

              <header className="flex items-center justify-between border-b border-black/[0.08] px-7 py-5">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EDECE7] text-sm font-medium text-[#151515]">
                    {selectedOtherUser?.avatar ? (
                      <img
                        src={selectedOtherUser.avatar}
                        alt={selectedOtherUser.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      selectedOtherUser?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "?"
                    )}
                  </div>

                  <div className="min-w-0">

                    <h2 className="truncate text-base font-medium">
                      {selectedOtherUser?.name || "Conversation"}
                    </h2>

                    <p className="mt-1 truncate text-xs text-[#8A8A82]">
                      {selectedConversation?.listing?.title || "Listing"}
                      {selectedConversation?.listing?.city
                        ? ` · ${selectedConversation.listing.city}`
                        : ""}
                    </p>

                  </div>

                </div>

                <div className="hidden items-center gap-2 sm:flex">

                  <span className="h-2 w-2 rounded-full bg-[#8B9A72]" />

                  <span className="text-xs text-[#8A8A82]">
                    Conversation
                  </span>

                </div>

              </header>

              <section className="flex flex-1 overflow-y-auto px-6 py-8">

                <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">

                  {message.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">

                      <div className="max-w-sm text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EDECE7]">
                          <span className="text-xl">
                            💬
                          </span>
                        </div>

                        <h2 className="mt-5 text-lg font-medium">
                          No messages yet
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#8A8A82]">
                          Start the conversation
                          by sending a message.
                        </p>

                      </div>

                    </div>
                  ) : (
                    message.map(
                      (msg, index) => {
                        const isUser =
                          msg.senderId ===
                          user?.id;

                        return (
                          <div
                            key={
                              msg.id ||
                              index
                            }
                            className={`flex ${isUser
                                ? "justify-end"
                                : "justify-start"
                              }`}
                          >

                            <div
                              className={`flex max-w-[75%] gap-3 ${isUser
                                  ? "flex-row-reverse"
                                  : "flex-row"
                                }`}
                            >

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EDECE7] text-xs font-medium text-[#151515]">

                                {msg.sender?.avatar ? (
                                  <img
                                    src={
                                      msg
                                        .sender
                                        .avatar
                                    }
                                    alt={
                                      msg
                                        .sender
                                        .name ||
                                      "User"
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  msg
                                    .sender
                                    ?.name
                                    ?.charAt(
                                      0
                                    )
                                    .toUpperCase() ||
                                  "U"
                                )}

                              </div>

                              <div
                                className={`flex flex-col ${isUser
                                    ? "items-end"
                                    : "items-start"
                                  }`}
                              >

                                <div
                                  className={`rounded-2xl px-4 py-3 text-sm leading-6 ${isUser
                                      ? "rounded-br-sm bg-[#151515] text-white"
                                      : "rounded-bl-sm bg-[#F1F0EB] text-[#151515]"
                                    }`}
                                >
                                  {
                                    msg.content
                                  }
                                </div>

                                <div className="mt-1 flex items-center gap-2 px-1">

                                  {!isUser &&
                                    msg
                                      .sender
                                      ?.name && (
                                      <span className="text-[10px] font-medium text-[#8A8A82]">
                                        {
                                          msg
                                            .sender
                                            .name
                                        }
                                      </span>
                                    )}

                                  {msg.createdAt && (
                                    <span className="text-[10px] text-[#A0A098]">
                                      {new Date(
                                        msg.createdAt
                                      ).toLocaleTimeString(
                                        [],
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )}
                                    </span>
                                  )}

                                </div>

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )
                  )}

                </div>

              </section>

              {typingUser && (
                <div className="px-7 pb-2 text-xs text-[#8A8A82]">
                  {(() => {
                    const typingUserData = selectedOtherUser;
                    return `${typingUserData?.name || "User"} is typing...`;
                  })()}
                </div>
              )}

              <footer className="border-t border-black/[0.08] bg-[#FBFAF7] p-4">

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSendMessage();
                  }}
                  className="mx-auto flex max-w-3xl gap-3"
                >

                  <input
                    type="text"
                    value={input}
                    onChange={(event) =>
                      handleTyping(event.target.value)
                    }
                    placeholder="Write a message..."
                    disabled={sending}
                    className="h-12 min-w-0 flex-1 rounded-xl border border-black/[0.1] bg-white px-4 text-sm outline-none transition placeholder:text-[#A0A098] focus:border-black/[0.25] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={
                      sending ||
                      !input.trim()
                    }
                    className="h-12 rounded-xl bg-[#151515] px-6 text-sm font-medium text-white transition hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending
                      ? "Sending..."
                      : "Send"}
                  </button>

                </form>

              </footer>

            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default Messages;

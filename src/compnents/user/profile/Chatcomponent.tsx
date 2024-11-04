import React, { useEffect, useState } from "react";
import { Send, X, ImageIcon } from "lucide-react"; 
import { useSendmessageMutation, useGetmessagesQuery } from "../../../store/slice/Userapislice";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Message } from "../../../interfacetypes/type";
import { toast } from "react-toastify";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  chatId?: string;
}

const ENDPOINTS = "http://localhost:3000";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, chatId }) => {
  const [userdata, setUserdata] = useState<{ username?: string; _id?: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [socketconnected, setSocketconnected] = useState(false);
  const [sendmessages, { isLoading: isSending }] = useSendmessageMutation();

  const { data: messagesData, isLoading: messagesLoading, isError: messagesError, refetch: refetchMessages } = useGetmessagesQuery(chatId || "");

  // Socket connection setup and message handling
  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINTS);
    }

    if (userdata && userdata._id) {
      socket.emit("setup", userdata._id);

      socket.off("message recieved");
      socket.on("message recieved", (newMessageReceived: Message) => {
        if (chatId === newMessageReceived.chat?.[0]) {
          setMessages((prevMessages) => {
            const exists = prevMessages.some(msg => msg._id === newMessageReceived._id);
            if (!exists) {
              return [...prevMessages, newMessageReceived];
            }
            return prevMessages;
          });
        }
      });

      socket.off("connected");
      socket.on("connected", () => {
        setSocketconnected(true);
      });
    }

    return () => {
      socket.off("message recieved");
      socket.off("connected");
    };
  }, [chatId, userdata]);

  useEffect(() => {
    if (chatId && socket) {
      socket.emit("join chat", { _id: chatId });
    }
  }, [chatId]);

  // User data setup
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserdata(parsedUserInfo.user);
      } catch (error) {
        console.error("Failed to parse userInfo from localStorage:", error);
      }
    }
  }, []);

  // Messages setup
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  useEffect(() => {
    if (chatId) {
      refetchMessages();
    }
  }, [chatId, refetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatId || (!currentMessage.trim() && !image) || !userdata?._id || isSending) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("chatid", chatId);

      if (currentMessage.trim()) {
        formData.append("content", currentMessage.trim());
      }

      if (image) {
        formData.append("image", image);
      }

      const tempMessage = {
        _id: `temp-${Date.now()}`,
        content: currentMessage.trim(),
        image: image ? URL.createObjectURL(image) : null,
        sender: userdata._id,
        chat: chatId,
        createdAt: new Date()
      };

      setMessages(prev => [...prev, tempMessage]);
      setCurrentMessage("");
      setImage(null);

      const response = await sendmessages(formData).unwrap();

      if (response?.data) {
        setMessages(prev =>
          prev.map(msg => msg._id === tempMessage._id ? response.data : msg)
        );

        if (socketconnected) {
          socket.emit("new message", response.data);
        }
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg._id !== `temp-${Date.now()}`));
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and GIF files are allowed");
      return;
    }

    setImage(file);
  };

  const isSender = (message: Message) => {
    return message?.sender?.[0] === userdata?._id;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed md:bottom-20 md:right-6 bottom-0 right-0 md:w-96 w-full md:h-[30rem] h-screen bg-white md:rounded-lg shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold">Customer Support</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 p-2"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-sm mb-4">
          Welcome {userdata?.username ? userdata.username : "Guest"}! How can we help you today?
        </p>

        {messagesLoading && (
          <div className="flex justify-center">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        )}
        
        {messagesError && (
          <div className="flex justify-center">
            <p className="text-red-500">Error loading messages</p>
          </div>
        )}

        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg, index) =>
              msg && (msg.content || msg.image) ? (
                <ChatMessage
                  key={index}
                  message={msg.content}
                  image={msg.image ?? null}
                  isUser={isSender(msg)}
                />
              ) : null
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No messages yet</p>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white sticky bottom-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ImageIcon size={20} className="text-gray-600" />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isSending || (!currentMessage.trim() && !image)}
          >
            <Send size={20} />
          </button>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="mt-2 flex items-center bg-gray-50 p-2 rounded-md">
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="w-16 h-16 rounded-md object-cover"
            />
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-600 px-2 py-1"
              onClick={() => setImage(null)}
            >
              Remove
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const ChatMessage: React.FC<{
  message?: string;
  image?: string | null;
  isUser: boolean;
}> = ({ message, image, isUser }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] px-4 py-2 rounded-lg ${
        isUser
          ? "bg-blue-500 text-white rounded-br-none"
          : "bg-gray-200 text-black rounded-bl-none"
      }`}
    >
      {image && (
        <div className="mb-2">
          <img
            src={image}
            alt="chat"
            className="max-w-full rounded-lg"
            loading="lazy"
          />
        </div>
      )}
      {message && <div className="break-words">{message}</div>}
    </div>
  </div>
);

export default ChatWidget;
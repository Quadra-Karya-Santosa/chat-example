"use client"

import { Loader2 } from "lucide-react"
import useChat from "./useChat.hooks";
import ChatHeader from "./sections/header.section";
import { timeFormatter } from "../../_utils/time-formatter";

export const ChatPath = '/chat';
const ChatPage = () => {
  const {
    user,
    chatContainerRef,
    observerRef,
    isLoading,
    messages,
    messagesEndRef,
    newMessage,
    handleMessageChange,
    handleKeyPress,
    sendMessage,
  } = useChat();

  return (
    <div className="bg-white rounded-lg shadow-md w-full h-screen flex flex-col">
      <ChatHeader username={user!.username} />
      <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
        <div ref={observerRef} className="h-4 w-full flex justify-center">
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-gray-500" />}
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 ${msg.user.id === user!.id ? "text-right" : "text-left"}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.user.id === user!.id ? "bg-indigo-100" : "bg-gray-100"}`}>
              <p className="font-semibold">{msg.user.username}</p>
              <p className="whitespace-pre-wrap">{msg.message}</p>
              <p className="text-xs text-gray-500">{timeFormatter(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex border border-slate-100 rounded-md">
          <textarea
            value={newMessage}
            autoFocus
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white py-2 px-4 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage;

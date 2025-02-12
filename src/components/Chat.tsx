"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { getChatHistory } from "../utils/api"
import { getSocket } from "../utils/socket"
import { Loader2 } from "lucide-react"
import { LoginI, User } from "../App"
import { debounce } from "../utils/debounce"

interface Message {
  id: string
  message: string
  createdAt: string
  user: User
}

interface ChatProps {
  loginData: LoginI
}

interface ChatResponse {
  chats: Message[]
  meta: {
    total: number
    skip: number
    limit: number
    lastPage: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
}

export default function Chat({ loginData }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [skip, setSkip] = useState(0)
  const [initialLoad, setInitialLoad] = useState(true)
  const LIMIT = 10

  const socket = getSocket()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && initialLoad) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [initialLoad])

  const fetchChatHistory = useCallback(
    async (skipCount: number) => {
      if (isFetchingRef.current || !hasMore) return

      try {
        isFetchingRef.current = true
        setIsLoading(true)
        const response: ChatResponse = await getChatHistory(loginData.token, skipCount, LIMIT)

        setMessages((prevMessages) => {
          const newMessages = response.chats.filter(
            (newMsg) => !prevMessages.some((existingMsg) => existingMsg.id === newMsg.id),
          )
          return [...newMessages.reverse(), ...prevMessages]
        })

        setHasMore(response.meta.hasNextPage)
        setSkip(skipCount + LIMIT)
      } catch (error) {
        console.error("Failed to fetch chat history:", error)
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    },
    [loginData.token, hasMore],
  )

  const debouncedFetchChatHistory = useCallback(
    debounce((skipCount: number) => fetchChatHistory(skipCount), 300),
    [fetchChatHistory],
  )

  useEffect(() => {
    fetchChatHistory(0)
  }, [fetchChatHistory])

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message])
        setSkip(prev => prev + 1);
        if (initialLoad) {
          setTimeout(scrollToBottom, 100)
        }
      }

      socket.on("newMessage", handleNewMessage)

      return () => {
        socket.off("newMessage", handleNewMessage)
      }
    }
  }, [socket, initialLoad, scrollToBottom])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0]
      if (firstEntry.isIntersecting && hasMore && !isFetchingRef.current) {
        debouncedFetchChatHistory(skip)
      }
    }, options)

    const currentObserverRef = observerRef.current

    if (currentObserverRef) {
      observer.observe(currentObserverRef)
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef)
      }
    }
  }, [debouncedFetchChatHistory, hasMore, skip])

  useEffect(() => {
    if (messages.length > 0 && initialLoad) {
      scrollToBottom()
      setInitialLoad(false)
    }
  }, [messages, initialLoad, scrollToBottom])

  const sendMessage = useCallback(() => {
    if (socket && newMessage.trim()) {
      socket.emit("sendMessage", { message: newMessage })
      setNewMessage("")
    }
  }, [socket, newMessage])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-2xl h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chat Room</h2>
        <p className="text-sm text-gray-500">Logged in as {loginData.user.username}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
        {/* Loading indicator at the top */}
        <div ref={observerRef} className="h-4 w-full flex justify-center">
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-gray-500" />}
        </div>

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 ${msg.user.id === loginData.user.id ? "text-right" : "text-left"}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.user.id === loginData.user.id ? "bg-indigo-100" : "bg-gray-100"}`}>
              <p className="font-semibold">{msg.user.username}</p>
              <p className="whitespace-pre-wrap">{msg.message}</p>
              <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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


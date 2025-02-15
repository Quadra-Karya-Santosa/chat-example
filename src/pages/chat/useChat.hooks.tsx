import { useState, useRef, useCallback, useEffect } from "react"
import { Message, ChatResponse } from "../../_interfaces/chat"
import { useAppSelector } from "../../store"
import { getChatHistory } from "../../utils/api"
import { debounce } from "../../utils/debounce"
import { getSocket } from "../../utils/socket"

const useChat = () => {
  const { user, accessToken } = useAppSelector(state => state.auth)
  const socket = getSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [skip, setSkip] = useState(0)
  const [initialLoad, setInitialLoad] = useState(true)
  const LIMIT = 10

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const fetchChatHistory = useCallback(
    async (skipCount: number) => {
      if (isFetchingRef.current || !hasMore) return

      try {
        isFetchingRef.current = true
        setIsLoading(true)
        const response: ChatResponse = await getChatHistory(accessToken!, skipCount, LIMIT)

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
    [accessToken, hasMore],
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
        setSkip(prev => prev + 1)
        setTimeout(scrollToBottom, 100)
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

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  }

  return {
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
  }
}

export default useChat

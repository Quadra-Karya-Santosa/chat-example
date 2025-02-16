import { useState, useRef, useCallback, useEffect } from "react"
import { Message } from "../../interfaces/chat"
import { useAppSelector } from "../../_store"
import { debounce } from "../../_utils/debounce"
import { getSocket } from "../../services/socket"
import { useLazyListChatQuery } from "../../services/modules/chat"
import { errorHandler } from "../../services/errorHandler"

const useChat = () => {
  const { user } = useAppSelector(state => state.auth)
  const socket = getSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [hasMore, setHasMore] = useState(true)
  const [skip, setSkip] = useState(0)
  const [initialLoad, setInitialLoad] = useState(true)
  const LIMIT = 10

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)
  const [getChatHistory, getChatHistoryState] = useLazyListChatQuery();
  const isLoading = getChatHistoryState.isFetching || getChatHistoryState.isLoading

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
        const response = await getChatHistory({ skip: skipCount, limit: LIMIT }).unwrap();

        setMessages((prevMessages) => {
          const newMessages = response.chats.filter(
            (newMsg: Message) => !prevMessages.some((existingMsg) => existingMsg.id === newMsg.id),
          )
          return [...newMessages.reverse(), ...prevMessages]
        })

        setHasMore(response.meta.hasNextPage)
        setSkip(skipCount + LIMIT)
      } catch (error) {
        errorHandler(error)
      } finally {
        isFetchingRef.current = false
      }
    },
    [getChatHistory, hasMore],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

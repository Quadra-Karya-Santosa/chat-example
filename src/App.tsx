"use client"

import { BrowserRouter } from "react-router"
import AppRoutes from "./_routes"
import { useAppSelector } from "./store"
import { useEffect } from "react"
import { closeSocket, setupSocket } from "./utils/socket"

export default function App() {
  const { accessToken } = useAppSelector(state => state.auth)

  useEffect(() => {
    if (accessToken) {
      setupSocket(accessToken)

      return () => {
        closeSocket()
      }
    }
  }, [accessToken])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}


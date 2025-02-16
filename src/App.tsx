"use client"

import { BrowserRouter } from "react-router"
import AppRoutes from "./routes"
import { useAppSelector } from "./_store"
import { useEffect } from "react"
import { closeSocket, setupSocket } from "./services/socket"
import { ToastContainer } from "react-toastify"

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
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
  )
}


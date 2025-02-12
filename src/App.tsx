"use client"

import { useState, useEffect } from "react"
import Login from "./components/Login"
import Chat from "./components/Chat"
import { loginUser } from "./utils/api"
import { closeSocket, setupSocket } from "./utils/socket"

export interface LoginI {
  token: string
  user: User
}

export interface User {
  id: string
  email: string
  username: string
  role: string
}


export default function App() {
  const [user, setUser] = useState<LoginI>()
  const [loginError, setLoginError] = useState("")

  useEffect(() => {
    if (user && user.token) {
      setupSocket(user.token)

      return () => {
        closeSocket()
      }
    }
  }, [user])

  const handleLogin = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password)
      setUser(userData)
      setLoginError("")
    } catch (error) {
      console.error("Login failed:", error)
      setLoginError("Login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? <Chat loginData={user} /> : <Login onLogin={handleLogin} error={loginError} />}
    </div>
  )
}


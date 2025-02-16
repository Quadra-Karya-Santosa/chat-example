"use client"

import { Navigate } from "react-router";
import { useAppSelector } from "../../_store";
import useLogin from "./useLogin.hooks";
import { ChatPath } from "../chat/chat.page";

export const LoginPath = '/login';
const LoginPage = () => {
  const { email, password, handleEmailChange, handlePasswordChange, handleSubmit } = useLogin();
  const { accessToken } = useAppSelector(state => state.auth)
  if (accessToken) return <Navigate to={ChatPath} replace />

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              required
              autoComplete="password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

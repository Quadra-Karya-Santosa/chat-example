import React from "react"
import { useAppSelector } from "../_store";
import { Navigate, Outlet } from "react-router";
import { LoginPath } from "../pages/login/login.page";

interface LoggedInRouteProps {
  children?: React.ReactNode;
}

const LoggedInRoute = ({ children }: LoggedInRouteProps) => {
  const { accessToken } = useAppSelector(state => state.auth);

  if (!accessToken) return <Navigate to={LoginPath} replace />

  return children ?? <Outlet />
}

export default LoggedInRoute

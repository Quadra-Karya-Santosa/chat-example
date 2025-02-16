import { Navigate, RouteObject } from "react-router";
import DashboardLayout from "../_layouts/dashboard.layout";
import LoginPage, { LoginPath } from "../pages/login/login.page";
import ChatPage, { ChatPath } from "../pages/chat/chat.page";
import ArticlePage, { ArticlePath } from "../pages/article/article.page";
import LoggedInRoute from "../_utils/logged-in-route";

const routeConfig: RouteObject[] = [
  {
    path: "",
    element: 
    <LoggedInRoute>
      <DashboardLayout />
    </LoggedInRoute>,
    children: [
      { path: ChatPath, element: <ChatPage /> },
      { path: ArticlePath, element: <ArticlePage /> },
      { path: "not-found", element: <>Page Not Found</> },
      { path: "*", element: <Navigate to="/not-found" /> },
    ],
  },
  {
    path: LoginPath,
    element: <LoginPage />
  },
  {
    path: "*", element: <Navigate to={LoginPath} />
  }
];

export { routeConfig };


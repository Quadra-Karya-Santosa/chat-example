import { LoginI, User } from "./login"

export interface Message {
  id: string
  message: string
  createdAt: string
  user: User
}

export interface ChatProps {
  loginData: LoginI
}

export interface ChatResponse {
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

export interface ChatPaginationI {
  skip: number;
  limit: number;
}

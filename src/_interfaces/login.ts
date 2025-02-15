
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

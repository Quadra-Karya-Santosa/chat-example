import { useState } from "react";
import { useAppDispatch } from "../../store";
import { saveTokenAuth } from "../../store/auth";
import { loginUser } from "../../utils/api";

const useLogin = () => {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const handleLogin = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password)
      dispatch(saveTokenAuth(userData))
    } catch (error) {
      console.error("Login failed:", error)
      setLoginError("Login failed. Please try again.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(email, password)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  return {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    loginError,
  }
}

export default useLogin;
import { useState } from "react";
import { useAppDispatch } from "../../_store";
import { saveTokenAuth } from "../../_store/auth";
import { LoginReqI } from "../../interfaces/login";
import { useLoginMutation } from "../../services/modules/auth";
import { errorHandler } from "../../services/errorHandler";

const useLogin = () => {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [login] = useLoginMutation();

  const handleLogin = async (payload: LoginReqI) => {
    try {
      const userData = await login(payload).unwrap();
      dispatch(saveTokenAuth(userData))
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin({email, password})
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
  }
}

export default useLogin;
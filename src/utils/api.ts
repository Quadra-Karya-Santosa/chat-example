const API_BASE_URL = "https://open-api.quadrakaryasantosa.com"

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Login failed")
  }

  return data
}

export async function getChatHistory(token: string, skip: number = 0, limit: number = 10) {
  const response = await fetch(`${API_BASE_URL}/free/chat?skip=${skip}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch chat history")
  }

  return response.json()
}


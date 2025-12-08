"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

// Role is simply a string based on your console log
interface User {
  id: string
  email: string
  role: string; // <--- CHANGED FROM OBJECT TO STRING
}

interface AuthContextType {
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      try {
        const decoded = jwtDecode<User>(token)
        
        // Ensure we map the decoded token correctly
        setUser({
          id: decoded.id, // or decoded.sub depending on your JWT structure
          email: decoded.email,
          role: decoded.role, // This is a string "RESTAURANT_ADMIN"
        })
      } catch (error) {
        console.error("Invalid token", error)
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const login = (token: string, userData: User) => {
    Cookies.set("token", token, { expires: 1 })
    setUser(userData)
    
    if (userData.role === "RESTAURANT_ADMIN") {
      router.push("/merchant")
    } else {
      router.push("/")
    }
  }

  const logout = () => {
    Cookies.remove("token")
    setUser(null)
    router.push("/signin")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
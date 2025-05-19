"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "@/lib/api/api-client"
import type { User, Notification, ApiError } from "@/lib/types"

interface ApiContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  notifications: Notification[]
  unreadNotifications: number
  error: ApiError | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<boolean>
  refreshUser: () => Promise<boolean>
  refreshNotifications: () => Promise<boolean>
  markNotificationAsRead: (id: string) => Promise<boolean>
  clearError: () => void
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState<ApiError | null>(null)

  const isAuthenticated = !!user
  const unreadNotifications = notifications.filter((n) => !n.read).length

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true)
        const userResponse = await refreshUser()

        if (userResponse) {
          await refreshNotifications()
        } else {
          // If we can't get the user, we'll still allow the app to function
          // by using the first user from the mock API
          const mockUsers = await apiClient.getUsers()
          if (mockUsers.success && mockUsers.data && mockUsers.data.length > 0) {
            setUser(mockUsers.data[0])
          }
        }
      } catch (err) {
        console.error("Failed to initialize API context:", err)
        // Allow the app to continue without authentication for demo purposes
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await apiClient.login(email, password)

      if (response.success && response.data) {
        setUser(response.data.user)
        await refreshNotifications()
        return true
      } else {
        setError({
          message: response.error || "Login failed",
          code: "AUTH_ERROR",
          status: response.status,
        })
        return false
      }
    } catch (err) {
      setError({
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        status: 500,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await apiClient.logout()

      if (response.success) {
        setUser(null)
        setNotifications([])
        return true
      } else {
        setError({
          message: response.error || "Logout failed",
          code: "AUTH_ERROR",
          status: response.status,
        })
        return false
      }
    } catch (err) {
      setError({
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        status: 500,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh user
  const refreshUser = async (): Promise<boolean> => {
    try {
      const response = await apiClient.getCurrentUser()

      if (response.success && response.data) {
        setUser(response.data)
        return true
      } else {
        // Not setting error here as this might be a normal "not logged in" state
        return false
      }
    } catch (err) {
      console.error("Failed to refresh user:", err)
      return false
    }
  }

  // Refresh notifications
  const refreshNotifications = async (): Promise<boolean> => {
    try {
      if (!isAuthenticated) return false

      const response = await apiClient.getNotifications()

      if (response.success && response.data) {
        setNotifications(response.data)
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error("Failed to refresh notifications:", err)
      return false
    }
  }

  // Mark notification as read
  const markNotificationAsRead = async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.markNotificationAsRead(id)

      if (response.success && response.data) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
      return false
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    notifications,
    unreadNotifications,
    error,
    login,
    logout,
    refreshUser,
    refreshNotifications,
    markNotificationAsRead,
    clearError,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export function useApi() {
  const context = useContext(ApiContext)

  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider")
  }

  return context
}

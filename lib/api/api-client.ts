import { mockAPI } from "./mock-service"
import type {
  Conversation,
  Message,
  KnowledgeSource,
  User,
  Team,
  Notification,
  ApiResponse,
  Customer,
  SearchParams,
  AnalyticsData,
} from "@/lib/types"

// API Client class
export class ApiClient {
  private authToken: string | null = null

  // Set auth token
  setAuthToken(token: string) {
    this.authToken = token
    localStorage.setItem("auth_token", token)
  }

  // Clear auth token
  clearAuthToken() {
    this.authToken = null
    localStorage.removeItem("auth_token")
  }

  // Initialize from localStorage
  initialize() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
      if (token) {
        this.authToken = token
      }
    } catch (error) {
      console.error("Error initializing API client:", error)
      // Continue without the token
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await mockAPI.login(email, password)

    if (response.success && response.data) {
      this.setAuthToken(response.data.token)
    }

    return response
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await mockAPI.logout()

    if (response.success) {
      this.clearAuthToken()
    }

    return response
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return mockAPI.getCurrentUser()
  }

  // Conversations
  async getConversations(
    params?: SearchParams,
  ): Promise<ApiResponse<{ conversations: Conversation[]; total: number; page: number; totalPages: number }>> {
    return mockAPI.getConversations(params)
  }

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    return mockAPI.getConversation(id)
  }

  async addMessage(conversationId: string, message: Omit<Message, "id">): Promise<ApiResponse<Message>> {
    return mockAPI.addMessage(conversationId, message)
  }

  async createConversation(data: {
    customer: Customer
    message: string
    category: "support" | "orders" | "general"
  }): Promise<ApiResponse<Conversation>> {
    return mockAPI.createConversation(data)
  }

  // Knowledge Base
  async getKnowledgeSources(params?: { search?: string; category?: string }): Promise<ApiResponse<KnowledgeSource[]>> {
    return mockAPI.getKnowledgeSources(params)
  }

  async getRelevantKnowledgeSources(query: string): Promise<ApiResponse<KnowledgeSource[]>> {
    return mockAPI.getRelevantKnowledgeSources(query)
  }

  // AI
  async generateAIResponse(query: string, conversationHistory?: string): Promise<ApiResponse<{ text: string }>> {
    return mockAPI.generateAIResponse(query, conversationHistory)
  }

  async streamAIResponse(
    query: string,
    conversationHistory?: string,
    onChunk?: (chunk: string) => void,
  ): Promise<ApiResponse<{ text: string }>> {
    return mockAPI.streamAIResponse(query, conversationHistory, onChunk)
  }

  // Users and Teams
  async getUsers(): Promise<ApiResponse<User[]>> {
    return mockAPI.getUsers()
  }

  async getTeams(): Promise<ApiResponse<Team[]>> {
    return mockAPI.getTeams()
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return mockAPI.getNotifications()
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<Notification>> {
    return mockAPI.markNotificationAsRead(id)
  }

  // Analytics
  async getAnalyticsData(): Promise<ApiResponse<AnalyticsData>> {
    return mockAPI.getAnalyticsData()
  }
}

// Create a singleton instance
export const apiClient = new ApiClient()

// Initialize on load
if (typeof window !== "undefined") {
  apiClient.initialize()
}

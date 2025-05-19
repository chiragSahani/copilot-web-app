import type {
  Conversation,
  Customer,
  Message,
  KnowledgeSource,
  User,
  Team,
  Notification,
  ApiResponse,
} from "@/lib/types"
import { generateSampleData } from "@/lib/sample-data"
import { mockAIResponses } from "@/lib/mock-data"

// Simulate network delay
const simulateNetworkDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// Simulate API errors (20% chance of error for testing)
const simulateRandomError = (errorRate = 0.05) => {
  return Math.random() < errorRate
}

// Generate a UUID
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Mock API class
export class MockAPI {
  private data: {
    conversations: Conversation[]
    knowledgeSources: KnowledgeSource[]
    users: User[]
    teams: Team[]
    notifications: Notification[]
    currentUser: User
    authToken: string | null
  }

  constructor() {
    const { conversations, knowledgeSources } = generateSampleData()

    // Create mock users
    const users: User[] = [
      {
        id: "user-1",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        role: "admin",
        avatar: "/avatars/alex.jpg",
        status: "online",
        teams: ["team-1", "team-2"],
        lastActive: new Date().toISOString(),
      },
      {
        id: "user-2",
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        role: "agent",
        avatar: "/avatars/sarah.jpg",
        status: "away",
        teams: ["team-1"],
        lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: "user-3",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        role: "agent",
        avatar: "/avatars/michael.jpg",
        status: "offline",
        teams: ["team-2"],
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      },
    ]

    // Create mock teams
    const teams: Team[] = [
      {
        id: "team-1",
        name: "Customer Support",
        description: "Handles general customer inquiries and issues",
        members: ["user-1", "user-2"],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      },
      {
        id: "team-2",
        name: "Technical Support",
        description: "Handles technical issues and product-specific questions",
        members: ["user-1", "user-3"],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
      },
    ]

    // Create mock notifications
    const notifications: Notification[] = [
      {
        id: "notif-1",
        type: "message",
        content: "New message from Luis Davison",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        relatedId: "conv-1",
      },
      {
        id: "notif-2",
        type: "assignment",
        content: "You've been assigned to a new conversation",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        relatedId: "conv-2",
      },
      {
        id: "notif-3",
        type: "system",
        content: "System maintenance scheduled for tonight at 2 AM",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      },
    ]

    this.data = {
      conversations,
      knowledgeSources,
      users,
      teams,
      notifications,
      currentUser: users[0], // Default to first user
      authToken: null,
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await simulateNetworkDelay()

    const user = this.data.users.find((u) => u.email === email)

    if (!user || simulateRandomError()) {
      return {
        success: false,
        error: "Invalid email or password",
        status: 401,
      }
    }

    const token = `mock-jwt-token-${generateUUID()}`
    this.data.authToken = token
    this.data.currentUser = user

    return {
      success: true,
      data: {
        user,
        token,
      },
      status: 200,
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    await simulateNetworkDelay(100, 300)

    this.data.authToken = null

    return {
      success: true,
      data: null,
      status: 200,
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await simulateNetworkDelay(100, 300)

    if (!this.data.authToken) {
      return {
        success: false,
        error: "Not authenticated",
        status: 401,
      }
    }

    return {
      success: true,
      data: this.data.currentUser,
      status: 200,
    }
  }

  // Conversation APIs
  async getConversations(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    sort?: string
  }): Promise<ApiResponse<{ conversations: Conversation[]; total: number; page: number; totalPages: number }>> {
    await simulateNetworkDelay()

    // During initial load, don't simulate errors
    if (simulateRandomError() && params?.page !== undefined) {
      return {
        success: false,
        error: "Failed to fetch conversations",
        status: 500,
      }
    }

    const page = params?.page || 1
    const limit = params?.limit || 10
    const search = params?.search || ""
    const category = params?.category || ""

    let filtered = [...this.data.conversations]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (conv) =>
          conv.customer.name.toLowerCase().includes(searchLower) ||
          conv.customer.email.toLowerCase().includes(searchLower) ||
          conv.lastMessage.toLowerCase().includes(searchLower),
      )
    }

    // Apply category filter
    if (category && category !== "all") {
      filtered = filtered.filter((conv) => conv.category === category)
    }

    // Apply sorting
    if (params?.sort) {
      const [field, direction] = params.sort.split(":")
      const isAsc = direction !== "desc"

      filtered.sort((a, b) => {
        if (field === "date") {
          return isAsc
            ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
            : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        }

        if (field === "name") {
          return isAsc ? a.customer.name.localeCompare(b.customer.name) : b.customer.name.localeCompare(a.customer.name)
        }

        return 0
      })
    }

    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedConversations = filtered.slice(startIndex, endIndex)

    return {
      success: true,
      data: {
        conversations: paginatedConversations,
        total,
        page,
        totalPages,
      },
      status: 200,
    }
  }

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    await simulateNetworkDelay()

    const conversation = this.data.conversations.find((c) => c.id === id)

    if (!conversation || simulateRandomError()) {
      return {
        success: false,
        error: "Conversation not found",
        status: 404,
      }
    }

    return {
      success: true,
      data: conversation,
      status: 200,
    }
  }

  async addMessage(conversationId: string, message: Omit<Message, "id">): Promise<ApiResponse<Message>> {
    await simulateNetworkDelay()

    const conversation = this.data.conversations.find((c) => c.id === conversationId)

    if (!conversation || simulateRandomError()) {
      return {
        success: false,
        error: "Conversation not found",
        status: 404,
      }
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ...message,
    }

    conversation.messages.push(newMessage)
    conversation.lastMessage = newMessage.content
    conversation.updatedAt = new Date().toISOString()

    return {
      success: true,
      data: newMessage,
      status: 201,
    }
  }

  async createConversation(data: {
    customer: Customer
    message: string
    category: "support" | "orders" | "general"
  }): Promise<ApiResponse<Conversation>> {
    await simulateNetworkDelay()

    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to create conversation",
        status: 500,
      }
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      customer: data.customer,
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: data.message,
          sender: "customer",
          timestamp: new Date().toISOString(),
        },
      ],
      lastMessage: data.message,
      updatedAt: new Date().toISOString(),
      category: data.category,
      unread: 1,
    }

    this.data.conversations.unshift(newConversation)

    return {
      success: true,
      data: newConversation,
      status: 201,
    }
  }

  // Knowledge Base APIs
  async getKnowledgeSources(params?: {
    search?: string
    category?: string
  }): Promise<ApiResponse<KnowledgeSource[]>> {
    await simulateNetworkDelay()

    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to fetch knowledge sources",
        status: 500,
      }
    }

    let filtered = [...this.data.knowledgeSources]

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(
        (source) =>
          source.title.toLowerCase().includes(searchLower) ||
          source.content.toLowerCase().includes(searchLower) ||
          source.excerpt.toLowerCase().includes(searchLower),
      )
    }

    // Apply category filter
    if (params?.category) {
      filtered = filtered.filter((source) => source.category === params.category)
    }

    return {
      success: true,
      data: filtered,
      status: 200,
    }
  }

  async getRelevantKnowledgeSources(query: string): Promise<ApiResponse<KnowledgeSource[]>> {
    await simulateNetworkDelay()

    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to fetch relevant knowledge sources",
        status: 500,
      }
    }

    // Simple keyword matching for demo purposes
    const keywords = query.toLowerCase().split(" ")
    const relevantSources = this.data.knowledgeSources
      .filter((source) => {
        const content = (source.title + " " + source.content).toLowerCase()
        return keywords.some((keyword) => content.includes(keyword))
      })
      .slice(0, 5)

    return {
      success: true,
      data: relevantSources,
      status: 200,
    }
  }

  // AI APIs
  async generateAIResponse(query: string, conversationHistory?: string): Promise<ApiResponse<{ text: string }>> {
    await simulateNetworkDelay(800, 2000) // AI responses take longer

    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to generate AI response",
        status: 500,
      }
    }

    // Find a matching mock response or use default
    const mockResponse =
      mockAIResponses.find((mock) => query.toLowerCase().includes(mock.keyword))?.response ||
      mockAIResponses.find((mock) => mock.keyword === "default")?.response ||
      "I'm sorry, I don't have enough information to answer that question properly. Could you provide more details?"

    return {
      success: true,
      data: { text: mockResponse },
      status: 200,
    }
  }

  async streamAIResponse(
    query: string,
    conversationHistory?: string,
    onChunk?: (chunk: string) => void,
  ): Promise<ApiResponse<{ text: string }>> {
    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to stream AI response",
        status: 500,
      }
    }

    // Find a matching mock response or use default
    const mockResponse =
      mockAIResponses.find((mock) => query.toLowerCase().includes(mock.keyword))?.response ||
      mockAIResponses.find((mock) => mock.keyword === "default")?.response ||
      "I'm sorry, I don't have enough information to answer that question properly. Could you provide more details?"

    // Simulate streaming by sending chunks
    const chunks = mockResponse.split(" ")
    let fullResponse = ""

    for (const chunk of chunks) {
      await simulateNetworkDelay(50, 150) // Smaller delays between chunks
      const chunkWithSpace = chunk + " "
      fullResponse += chunkWithSpace

      if (onChunk) {
        onChunk(chunkWithSpace)
      }
    }

    return {
      success: true,
      data: { text: fullResponse.trim() },
      status: 200,
    }
  }

  // User and Team APIs
  async getUsers(): Promise<ApiResponse<User[]>> {
    await simulateNetworkDelay()

    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to fetch users",
        status: 500,
      }
    }

    return {
      success: true,
      data: this.data.users,
      status: 200,
    }
  }

  async getTeams(): Promise<ApiResponse<Team[]>> {
    await simulateNetworkDelay()

    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to fetch teams",
        status: 500,
      }
    }

    return {
      success: true,
      data: this.data.teams,
      status: 200,
    }
  }

  // Notification APIs
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    await simulateNetworkDelay()

    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to fetch notifications",
        status: 500,
      }
    }

    return {
      success: true,
      data: this.data.notifications,
      status: 200,
    }
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<Notification>> {
    await simulateNetworkDelay()

    const notification = this.data.notifications.find((n) => n.id === id)

    if (!notification || simulateRandomError()) {
      return {
        success: false,
        error: "Notification not found",
        status: 404,
      }
    }

    notification.read = true

    return {
      success: true,
      data: notification,
      status: 200,
    }
  }

  // Analytics APIs
  async getAnalyticsData(): Promise<ApiResponse<any>> {
    await simulateNetworkDelay()

    if (simulateRandomError()) {
      return {
        success: false,
        error: "Failed to fetch analytics data",
        status: 500,
      }
    }

    // Generate realistic analytics data
    const today = new Date()
    const conversationData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (29 - i))

      return {
        date: date.toISOString().split("T")[0],
        total: Math.floor(Math.random() * 20) + 5,
        resolved: Math.floor(Math.random() * 15) + 3,
      }
    })

    const responseTimeData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (29 - i))

      return {
        date: date.toISOString().split("T")[0],
        time: Math.random() * 5 + 1, // 1-6 minutes
      }
    })

    const categoryDistribution = {
      support: Math.floor(Math.random() * 30) + 30, // 30-60%
      orders: Math.floor(Math.random() * 20) + 20, // 20-40%
      general: Math.floor(Math.random() * 20) + 10, // 10-30%
    }

    const satisfactionData = {
      verySatisfied: Math.floor(Math.random() * 20) + 30, // 30-50%
      satisfied: Math.floor(Math.random() * 20) + 20, // 20-40%
      neutral: Math.floor(Math.random() * 10) + 5, // 5-15%
      dissatisfied: Math.floor(Math.random() * 5) + 3, // 3-8%
      veryDissatisfied: Math.floor(Math.random() * 3) + 1, // 1-4%
    }

    const aiUsageData = {
      totalQueries: Math.floor(Math.random() * 500) + 1000,
      averageQueryTime: Math.random() * 2 + 1, // 1-3 seconds
      topQueries: [
        { query: "How do I get a refund?", count: Math.floor(Math.random() * 50) + 50 },
        { query: "Where is my order?", count: Math.floor(Math.random() * 40) + 40 },
        { query: "How to reset password?", count: Math.floor(Math.random() * 30) + 30 },
        { query: "Return policy", count: Math.floor(Math.random() * 25) + 25 },
        { query: "Shipping options", count: Math.floor(Math.random() * 20) + 20 },
      ],
      aiAccuracy: Math.random() * 10 + 85, // 85-95%
    }

    return {
      success: true,
      data: {
        conversationData,
        responseTimeData,
        categoryDistribution,
        satisfactionData,
        aiUsageData,
      },
      status: 200,
    }
  }
}

// Create a singleton instance
export const mockAPI = new MockAPI()

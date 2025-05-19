export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  tags?: string[]
  notes?: string
  createdAt?: string
}

export interface Message {
  id: string
  content: string
  sender: "customer" | "agent" | "system" | "ai"
  timestamp: string
  attachments?: Attachment[]
  reactions?: Reaction[]
  edited?: boolean
  status?: "sent" | "delivered" | "read"
}

export interface Attachment {
  id: string
  name: string
  type: "image" | "document" | "video" | "audio" | "other"
  url: string
  size: number
  thumbnailUrl?: string
}

export interface Reaction {
  emoji: string
  userId: string
  timestamp: string
}

export interface Conversation {
  id: string
  customer: Customer
  messages: Message[]
  lastMessage: string
  updatedAt: string
  category: "support" | "orders" | "general"
  unread?: number
  status?: "open" | "closed" | "pending"
  priority?: "low" | "medium" | "high" | "urgent"
  assignedTo?: string
  tags?: string[]
}

export interface KnowledgeSource {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags?: string[]
  lastUpdated?: string
  author?: string
  relatedArticles?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "agent" | "supervisor"
  avatar?: string
  status: "online" | "away" | "offline"
  teams: string[]
  lastActive: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system"
  notifications?: {
    email: boolean
    desktop: boolean
    sound: boolean
  }
  layout?: {
    sidebarCollapsed: boolean
    denseMode: boolean
  }
  shortcuts?: Record<string, string>
}

export interface Team {
  id: string
  name: string
  description: string
  members: string[]
  createdAt: string
  avatar?: string
}

export interface Notification {
  id: string
  type: "message" | "assignment" | "system" | "mention"
  content: string
  read: boolean
  createdAt: string
  relatedId?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  status: number
}

export interface ApiError {
  message: string
  code: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export interface SearchParams {
  query?: string
  filters?: Record<string, string>
  page?: number
  limit?: number
  sort?: string
}

export interface AnalyticsData {
  conversationData: {
    date: string
    total: number
    resolved: number
  }[]
  responseTimeData: {
    date: string
    time: number
  }[]
  categoryDistribution: {
    support: number
    orders: number
    general: number
  }
  satisfactionData: {
    verySatisfied: number
    satisfied: number
    neutral: number
    dissatisfied: number
    veryDissatisfied: number
  }
  aiUsageData: {
    totalQueries: number
    averageQueryTime: number
    topQueries: {
      query: string
      count: number
    }[]
    aiAccuracy: number
  }
}

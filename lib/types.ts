export interface Customer {
  id: string
  name: string
  email: string
}

export interface Message {
  id: string
  content: string
  sender: "customer" | "agent" | "system"
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
}

export interface KnowledgeSource {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
}

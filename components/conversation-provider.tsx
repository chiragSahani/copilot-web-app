"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Conversation, Message, KnowledgeSource } from "@/lib/types"
import { apiClient } from "@/lib/api/api-client"
import { useToast } from "@/hooks/use-toast"
import { generateSampleData } from "@/lib/sample-data"

type ConversationContextType = {
  conversations: Conversation[]
  currentConversation: Conversation | null
  knowledgeSources: KnowledgeSource[]
  isLoading: boolean
  error: string | null
  setCurrentConversation: (conversation: Conversation) => void
  addMessage: (message: Omit<Message, "id">) => Promise<void>
  refreshConversations: () => Promise<void>
  searchConversations: (query: string, category?: string) => Promise<void>
  createConversation: (data: {
    customer: { name: string; email: string }
    message: string
    category: "support" | "orders" | "general"
  }) => Promise<boolean>
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

// Mock data generator for fallback
// const generateSampleData = () => {
//   const sampleConversations: Conversation[] = [
//     {
//       id: "sample-1",
//       customer: { id: "cust-1", name: "John Doe", email: "john.doe@example.com" },
//       messages: [{ id: "msg-1", content: "Hello, this is a sample message.", createdAt: new Date().toISOString(), role: "user" }],
//       category: "support",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       lastMessage: "Hello, this is a sample message.",
//     },
//     {
//       id: "sample-2",
//       customer: { id: "cust-2", name: "Jane Smith", email: "jane.smith@example.com" },
//       messages: [{ id: "msg-2", content: "This is another sample conversation.", createdAt: new Date().toISOString(), role: "user" }],
//       category: "orders",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       lastMessage: "This is another sample conversation.",
//     },
//   ];

//   return { conversations: sampleConversations };
// };

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        await refreshConversations()
        await loadKnowledgeSources()
      } catch (err) {
        console.error("Error loading initial data:", err)
        setError("Failed to load initial data. Please try refreshing the page.")
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Load knowledge sources
  const loadKnowledgeSources = async () => {
    try {
      const response = await apiClient.getKnowledgeSources()

      if (response.success && response.data) {
        setKnowledgeSources(response.data)
      } else {
        console.error("Failed to load knowledge sources:", response.error)
      }
    } catch (err) {
      console.error("Error loading knowledge sources:", err)
    }
  }

  // Refresh conversations
  const refreshConversations = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getConversations()

      if (response.success && response.data) {
        setConversations(response.data.conversations)

        // Set current conversation to the first one if none is selected
        if (!currentConversation && response.data.conversations.length > 0) {
          setCurrentConversation(response.data.conversations[0])
        } else if (currentConversation) {
          // Update current conversation if it exists in the new list
          const updatedCurrentConv = response.data.conversations.find((conv) => conv.id === currentConversation.id)

          if (updatedCurrentConv) {
            setCurrentConversation(updatedCurrentConv)
          }
        }
      } else {
        console.error("Failed to refresh conversations:", response.error)
        // Use sample data as fallback
        const { conversations: sampleConversations } = generateSampleData()
        setConversations(sampleConversations)

        if (!currentConversation && sampleConversations.length > 0) {
          setCurrentConversation(sampleConversations[0])
        }

        toast({
          title: "Warning",
          description: "Using sample data due to API connection issue",
          variant: "default",
        })
      }
    } catch (err) {
      console.error("Error refreshing conversations:", err)
      // Use sample data as fallback
      const { conversations: sampleConversations } = generateSampleData()
      setConversations(sampleConversations)

      if (!currentConversation && sampleConversations.length > 0) {
        setCurrentConversation(sampleConversations[0])
      }

      toast({
        title: "Warning",
        description: "Using sample data due to API connection issue",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Search conversations
  const searchConversations = async (query: string, category?: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.getConversations({
        query,
        filters: category ? { category } : undefined,
      })

      if (response.success && response.data) {
        setConversations(response.data.conversations)
      } else {
        console.error("Failed to search conversations:", response.error)
        setError("Failed to search conversations. Please try again.")
      }
    } catch (err) {
      console.error("Error searching conversations:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add message to conversation
  const addMessage = async (message: Omit<Message, "id">) => {
    if (!currentConversation) return

    try {
      const response = await apiClient.addMessage(currentConversation.id, message)

      if (response.success && response.data) {
        // Update the current conversation with the new message
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, response.data],
          lastMessage: response.data.content,
          updatedAt: new Date().toISOString(),
        }

        setCurrentConversation(updatedConversation)

        // Update the conversation in the list
        setConversations((prev) =>
          prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)),
        )
      } else {
        console.error("Failed to add message:", response.error)
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error adding message:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Create new conversation
  const createConversation = async (data: {
    customer: { name: string; email: string }
    message: string
    category: "support" | "orders" | "general"
  }): Promise<boolean> => {
    try {
      setIsLoading(true)

      const response = await apiClient.createConversation({
        customer: {
          id: `cust-${Date.now()}`,
          ...data.customer,
        },
        message: data.message,
        category: data.category,
      })

      if (response.success && response.data) {
        // Add the new conversation to the list
        setConversations((prev) => [response.data, ...prev])

        // Set it as the current conversation
        setCurrentConversation(response.data)

        toast({
          title: "Success",
          description: "New conversation created successfully.",
        })

        return true
      } else {
        console.error("Failed to create conversation:", response.error)
        toast({
          title: "Error",
          description: "Failed to create conversation. Please try again.",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      console.error("Error creating conversation:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversation,
        knowledgeSources,
        isLoading,
        error,
        setCurrentConversation,
        addMessage,
        refreshConversations,
        searchConversations,
        createConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}

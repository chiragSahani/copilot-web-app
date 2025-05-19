"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Conversation, Message, KnowledgeSource } from "@/lib/types"
import { generateSampleData } from "@/lib/sample-data"

type ConversationContextType = {
  conversations: Conversation[]
  currentConversation: Conversation | null
  setCurrentConversation: (conversation: Conversation) => void
  addMessage: (message: Omit<Message, "id">) => void
  knowledgeSources: KnowledgeSource[]
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([])

  useEffect(() => {
    // Load sample data
    const { conversations, knowledgeSources } = generateSampleData()
    setConversations(conversations)
    setCurrentConversation(conversations[0])
    setKnowledgeSources(knowledgeSources)
  }, [])

  const addMessage = (message: Omit<Message, "id">) => {
    if (!currentConversation) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ...message,
    }

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      lastMessage: newMessage.content,
      updatedAt: new Date().toISOString(),
    }

    setCurrentConversation(updatedConversation)
    setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)))
  }

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversation,
        setCurrentConversation,
        addMessage,
        knowledgeSources,
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

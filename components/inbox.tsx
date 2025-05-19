"use client"

import { useState } from "react"
import { ConversationList } from "@/components/conversation-list"
import { ChatPanel } from "@/components/chat-panel"
import { CopilotPanel } from "@/components/copilot-panel"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Menu, X, Bot } from "lucide-react"

export function Inbox() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(true)
  const isMobile = useMobile()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-50 md:hidden shadow-soft"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Sidebar / Conversation List */}
      <div
        className={`${
          isMobile
            ? sidebarOpen
              ? "absolute inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out shadow-soft"
              : "absolute inset-y-0 left-0 z-40 w-80 transform -translate-x-full transition-transform duration-300 ease-in-out"
            : "w-80 border-r border-border bg-background shadow-soft"
        }`}
      >
        <ConversationList />
      </div>

      {/* Main Chat Area */}
      <div className={`flex flex-1 flex-col ${isMobile && sidebarOpen ? "opacity-50" : ""}`}>
        <ChatPanel />
      </div>

      {/* AI Copilot Panel */}
      <div
        className={`${
          isMobile
            ? copilotOpen
              ? "absolute inset-y-0 right-0 z-40 w-full max-w-sm transform transition-transform duration-300 ease-in-out shadow-soft"
              : "absolute inset-y-0 right-0 z-40 w-full max-w-sm transform translate-x-full transition-transform duration-300 ease-in-out"
            : "w-96 border-l border-border bg-background shadow-soft transition-colors duration-300"
        }`}
      >
        <CopilotPanel />
      </div>

      {/* Mobile Copilot toggle */}
      {isMobile && (
        <Button
          variant="primary"
          size="icon"
          className="absolute right-4 bottom-4 z-50 rounded-full h-12 w-12 shadow-soft"
          onClick={() => setCopilotOpen(!copilotOpen)}
        >
          {copilotOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </Button>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { ConversationList } from "@/components/conversation-list"
import { ChatPanel } from "@/components/chat-panel"
import { CopilotPanel } from "@/components/copilot-panel"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Menu, X, Bot, BarChart3, MessageSquare, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Analytics } from "@/components/analytics"
import { AnimatedBackground, ParticleEffect } from "@/components/visual-assets"
import { useHotkeys } from "react-hotkeys-hook"
import { useConversation } from "@/components/conversation-provider"
import { useToast } from "@/hooks/use-toast"

export function Inbox() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [activeView, setActiveView] = useState<"conversations" | "chat" | "copilot">("conversations")
  const isMobile = useMobile()
  const isTablet = useTablet()
  const { currentConversation } = useConversation()
  const { toast } = useToast()
  const mainContainerRef = useRef<HTMLDivElement>(null)

  // Register keyboard shortcuts
  useHotkeys("ctrl+b, cmd+b", (e) => {
    e.preventDefault()
    setSidebarOpen(!sidebarOpen)
  })

  useHotkeys("ctrl+j, cmd+j", (e) => {
    e.preventDefault()
    setCopilotOpen(!copilotOpen)
  })

  useHotkeys("ctrl+a, cmd+a", (e) => {
    e.preventDefault()
    setAnalyticsOpen(!analyticsOpen)
  })

  // Custom hook for tablet detection
  function useTablet() {
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
      const checkIfTablet = () => {
        setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1280)
      }

      checkIfTablet()
      window.addEventListener("resize", checkIfTablet)

      return () => {
        window.removeEventListener("resize", checkIfTablet)
      }
    }, [])

    return isTablet
  }

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById("conversation-sidebar")
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, sidebarOpen])

  // Set active view based on current conversation
  useEffect(() => {
    if (isMobile && currentConversation) {
      setActiveView("chat")
    }
  }, [currentConversation, isMobile])

  // Handle back button on mobile
  const handleBackToConversations = () => {
    setActiveView("conversations")
  }

  // Handle button actions
  const handleButtonAction = (action: string) => {
    switch (action) {
      case "analytics":
        setAnalyticsOpen(true)
        break
      case "copilot":
        if (isMobile) {
          setActiveView("copilot")
        } else {
          setCopilotOpen(!copilotOpen)
        }
        break
      default:
        toast({
          title: "Feature coming soon",
          description: "This feature is not yet implemented",
        })
    }
  }

  // Render mobile view
  const renderMobileView = () => {
    if (activeView === "conversations") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
          <ConversationList onConversationSelect={() => setActiveView("chat")} />
        </motion.div>
      )
    } else if (activeView === "chat") {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full w-full flex flex-col"
        >
          <div className="flex items-center p-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={handleBackToConversations}
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel />
          </div>
        </motion.div>
      )
    } else if (activeView === "copilot") {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full w-full flex flex-col"
        >
          <div className="flex items-center p-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setActiveView("chat")}
              aria-label="Back to chat"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">AI Copilot</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <CopilotPanel />
          </div>
        </motion.div>
      )
    }
  }

  return (
    <div
      ref={mainContainerRef}
      className="flex h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-background to-background dark:from-slate-900 dark:via-background dark:to-background transition-all duration-500 relative"
    >
      {/* Animated background */}
      <AnimatedBackground />
      <ParticleEffect />

      {/* Mobile view */}
      {isMobile ? (
        <div className="w-full h-full flex flex-col">
          <AnimatePresence mode="wait">{renderMobileView()}</AnimatePresence>

          {/* Mobile bottom navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border z-50 flex justify-around items-center p-2">
            <Button
              variant={activeView === "conversations" ? "secondary" : "ghost"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setActiveView("conversations")}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            {currentConversation && (
              <Button
                variant={activeView === "chat" ? "secondary" : "ghost"}
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setActiveView("chat")}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => handleButtonAction("analytics")}
            >
              <BarChart3 className="h-5 w-5 text-primary" />
            </Button>

            <Button
              variant={activeView === "copilot" ? "secondary" : "primary"}
              size="icon"
              className="h-12 w-12 rounded-full shadow-soft neon-glow border border-primary/50"
              onClick={() => handleButtonAction("copilot")}
            >
              <Bot className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop/Tablet sidebar toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute left-4 top-4 z-50 md:hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              className="shadow-soft rounded-full border border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 transition-all duration-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
            </Button>
          </motion.div>

          {/* Sidebar / Conversation List */}
          <AnimatePresence>
            {(sidebarOpen || !isMobile) && (
              <motion.div
                id="conversation-sidebar"
                initial={isMobile ? { x: -300, opacity: 0 } : false}
                animate={{ x: 0, opacity: 1 }}
                exit={isMobile ? { x: -300, opacity: 0 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`${
                  isMobile
                    ? "absolute inset-y-0 left-0 z-40 w-[85%] max-w-[320px] shadow-lg bg-background/95 backdrop-blur-sm"
                    : isTablet
                      ? "w-[280px] border-r border-border bg-background/90 backdrop-blur-sm shadow-soft"
                      : "w-80 border-r border-border bg-background/90 backdrop-blur-sm shadow-soft"
                }`}
              >
                <ConversationList />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <motion.div
            className={`flex flex-1 flex-col ${isMobile && sidebarOpen ? "opacity-50" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ChatPanel />
          </motion.div>

          {/* AI Copilot Panel */}
          <AnimatePresence>
            {(copilotOpen || !isMobile) && (
              <motion.div
                initial={isMobile ? { x: 300, opacity: 0 } : false}
                animate={{ x: 0, opacity: 1 }}
                exit={isMobile ? { x: 300, opacity: 0 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`${
                  isMobile
                    ? "absolute inset-y-0 right-0 z-40 w-full max-w-sm shadow-lg bg-background/95 backdrop-blur-sm"
                    : isTablet
                      ? "w-[320px] border-l border-border bg-background/90 backdrop-blur-sm shadow-soft transition-all duration-300"
                      : "w-96 border-l border-border bg-background/90 backdrop-blur-sm shadow-soft transition-all duration-300"
                }`}
              >
                <CopilotPanel />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Copilot toggle */}
          <div className="absolute right-4 bottom-4 z-50 flex flex-col gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 shadow-soft border border-primary/30 hover:bg-primary/10 transition-all duration-200"
                onClick={() => setAnalyticsOpen(true)}
              >
                <BarChart3 className="h-5 w-5 text-primary" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="primary"
                size="icon"
                className="rounded-full h-12 w-12 shadow-soft neon-glow border border-primary/50 hover:scale-105 transition-all duration-200"
                onClick={() => setCopilotOpen(!copilotOpen)}
              >
                {copilotOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </Button>
            </motion.div>
          </div>
        </>
      )}

      {/* Analytics Panel */}
      <AnimatePresence>
        {analyticsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md p-4 overflow-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAnalyticsOpen(false)}
                className="hover:bg-destructive/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Analytics />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground opacity-60 hidden md:block">
        <span>Press Ctrl+/ for keyboard shortcuts</span>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ConversationList } from "@/components/conversation-list"
import { ChatPanel } from "@/components/chat-panel"
import { CopilotPanel } from "@/components/copilot-panel"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Menu, X, Bot, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Analytics } from "@/components/analytics"
import { AnimatedBackground, ParticleEffect } from "@/components/visual-assets"
import { useHotkeys } from "react-hotkeys-hook"

export function Inbox() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(true)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const isMobile = useMobile()
  const isTablet = useTablet()

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-background to-background dark:from-slate-900 dark:via-background dark:to-background transition-all duration-500 relative">
      {/* Animated background */}
      <AnimatedBackground />
      <ParticleEffect />

      {/* Mobile sidebar toggle */}
      {isMobile && (
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
      )}

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

      {/* Mobile Copilot toggle */}
      {isMobile && (
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
      )}

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground opacity-60 hidden md:block">
        <span>Press Ctrl+/ for keyboard shortcuts</span>
      </div>
    </div>
  )
}

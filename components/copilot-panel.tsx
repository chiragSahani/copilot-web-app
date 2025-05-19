"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useConversation } from "@/components/conversation-provider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import {
  Expand,
  FileText,
  ArrowRight,
  Search,
  Loader2,
  Bot,
  BookOpen,
  Lightbulb,
  Copy,
  Check,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Keyboard,
  ShoppingCart,
  CreditCard,
  HelpCircle,
  Clock,
  Calendar,
  Settings,
  Mail,
  Phone,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiClient } from "@/lib/api/api-client"
import { useToast } from "@/hooks/use-toast"
import { useHotkeys } from "react-hotkeys-hook"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMobile } from "@/hooks/use-mobile"
import { AIAnimation } from "@/components/ai-animation"
import { useNotification } from "@/components/notification-provider"

export function CopilotPanel() {
  const { currentConversation, knowledgeSources, addMessage } = useConversation()
  const [activeTab, setActiveTab] = useState("ai-copilot")
  const [aiResponse, setAiResponse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [userQuery, setUserQuery] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [aiMessage, setAiMessage] = useState<string | null>(null)
  const [relevantSources, setRelevantSources] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()
  const { addNotification } = useNotification()

  // Suggested queries - expanded list
  const suggestedQueries = [
    { icon: <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />, text: "How do I get a refund?" },
    { icon: <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />, text: "What's our return policy?" },
    { icon: <Clock className="h-3.5 w-3.5 text-muted-foreground" />, text: "How to track an order?" },
    { icon: <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />, text: "Payment methods we accept" },
    { icon: <Calendar className="h-3.5 w-3.5 text-muted-foreground" />, text: "Shipping timeframes" },
    { icon: <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />, text: "How to contact customer support?" },
    { icon: <Settings className="h-3.5 w-3.5 text-muted-foreground" />, text: "How to reset my password?" },
    { icon: <Mail className="h-3.5 w-3.5 text-muted-foreground" />, text: "Email subscription preferences" },
    { icon: <Phone className="h-3.5 w-3.5 text-muted-foreground" />, text: "International shipping options" },
  ]

  // Filter knowledge sources based on search query
  const filteredSources = knowledgeSources.filter(
    (source) => searchQuery === "" || source.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Register keyboard shortcuts
  useHotkeys("ctrl+/, cmd+/", (e) => {
    e.preventDefault()
    setShowKeyboardShortcuts(true)
  })

  useHotkeys("ctrl+enter, cmd+enter", (e) => {
    if (activeTab === "ai-copilot" && userQuery.trim() && !isGenerating) {
      e.preventDefault()
      handleGenerateResponse()
    }
  })

  useEffect(() => {
    // Reset AI response when conversation changes
    setAiResponse("")
    setAiMessage(null)
    setFeedbackGiven(null)
  }, [currentConversation])

  // Focus input when tab changes to AI Copilot
  useEffect(() => {
    if (activeTab === "ai-copilot" && inputRef.current && !aiResponse) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [activeTab, aiResponse])

  const handleGenerateResponse = async () => {
    if (!currentConversation || !userQuery.trim()) return

    setIsGenerating(true)
    setAiResponse("")
    setFeedbackGiven(null)

    try {
      // Get conversation history
      const conversationHistory = currentConversation.messages
        .map((msg) => `${msg.sender === "customer" ? "Customer" : "Agent"}: ${msg.content}`)
        .join("\n\n")

      // Get relevant knowledge sources
      const knowledgeResponse = await apiClient.getRelevantKnowledgeSources(userQuery)

      if (knowledgeResponse.success && knowledgeResponse.data) {
        setRelevantSources(knowledgeResponse.data)
      }

      // Stream AI response
      await apiClient.streamAIResponse(userQuery, conversationHistory, (chunk) => {
        setAiResponse((prev) => prev + chunk)
      })

      // Show notification
      addNotification({
        type: "success",
        title: "AI Response Generated",
        message: "The AI has generated a response to your query.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error generating AI response:", error)
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive",
      })
      addNotification({
        type: "error",
        title: "AI Response Error",
        message: "Failed to generate AI response. Please try again.",
        duration: 5000,
      })
      setAiResponse("I apologize, but I'm having trouble generating a response right now. Please try again later.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddToComposer = () => {
    if (aiResponse) {
      addMessage({
        content: aiResponse,
        sender: "agent",
        timestamp: new Date().toISOString(),
      })
      setAiMessage(null)
      setAiResponse("")
      toast({
        title: "Success",
        description: "Response added to composer",
      })
      addNotification({
        type: "info",
        title: "Response Added",
        message: "AI response has been added to the message composer.",
        duration: 3000,
      })
    }
  }

  const handleCopyToClipboard = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse)
      setCopied(true)
      toast({
        title: "Copied",
        description: "Response copied to clipboard",
      })
      addNotification({
        type: "info",
        title: "Copied to Clipboard",
        message: "AI response has been copied to your clipboard.",
        duration: 3000,
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && userQuery.trim()) {
      e.preventDefault()
      handleGenerateResponse()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between border-b p-4"
      >
        <Tabs defaultValue="ai-copilot" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-copilot" className="text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs">
                    <Bot className="h-3 w-3" />
                  </div>
                </Avatar>
                AI Copilot
              </div>
            </TabsTrigger>
            <TabsTrigger value="details" className="text-sm">
              Details
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="ai-copilot" className="h-full mt-0 border-0 p-0">
              <div className="flex h-full flex-col">
                <AnimatePresence mode="wait">
                  {!aiMessage && !isGenerating && aiResponse === "" ? (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-1 flex-col items-center justify-center p-6 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 rounded-full overflow-hidden w-32 h-32 shadow-soft border border-primary/30"
                      >
                        <AIAnimation type="thinking" />
                      </motion.div>
                      <h3 className="text-lg font-medium">Hi, I'm Fin AI Copilot</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Ask me anything about this conversation.</p>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 w-full"
                      >
                        <Input
                          ref={inputRef}
                          value={userQuery}
                          onChange={(e) => setUserQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="How do I get a refund? (Ctrl+Enter to send)"
                          className="mb-2 transition-all duration-200 focus-ring bg-background/70 backdrop-blur-sm border-primary/30 focus:border-primary/50"
                        />
                        <Button
                          onClick={handleGenerateResponse}
                          className="w-full transition-all duration-200 hover:scale-[1.02] shadow-soft bg-primary/90 hover:bg-primary"
                          disabled={isGenerating || !userQuery.trim()}
                        >
                          {isGenerating ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Generate Response
                            </span>
                          )}
                        </Button>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 w-full"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Suggested</h4>
                          {!isMobile && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs hover:bg-primary/10 transition-colors"
                              onClick={() => setShowKeyboardShortcuts(true)}
                            >
                              <Keyboard className="h-3 w-3 mr-1" />
                              Shortcuts
                            </Button>
                          )}
                        </div>
                        <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {suggestedQueries.map((query, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full justify-start text-sm transition-all duration-200 hover:bg-primary/10 hover-lift border border-primary/10 hover:border-primary/30"
                              onClick={() => {
                                setUserQuery(query.text)
                                handleGenerateResponse()
                              }}
                            >
                              <span className="flex items-center gap-2">
                                {query.icon}
                                {query.text}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="response-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col p-4"
                    >
                      <div className="mb-4 flex items-start gap-3">
                        <Avatar className="mt-1 h-8 w-8 shadow-soft">
                          <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs">
                            <Bot className="h-4 w-4" />
                          </div>
                        </Avatar>
                        <div className="flex-1">
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="rounded-lg bg-secondary/30 p-4 shadow-soft border-l-2 border-primary/50 backdrop-blur-sm"
                          >
                            {isGenerating ? (
                              <div>
                                <div className="mb-3 w-full max-w-[200px] mx-auto">
                                  <AIAnimation type="processing" />
                                </div>
                                <p className="whitespace-pre-wrap text-sm">{aiResponse}</p>
                                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Generating response...</span>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="whitespace-pre-wrap text-sm">{aiResponse}</p>
                                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`h-8 px-2 hover:bg-primary/10 transition-colors ${feedbackGiven === "up" ? "bg-primary/10 text-primary" : ""}`}
                                      onClick={() => {
                                        setFeedbackGiven("up")
                                        addNotification({
                                          type: "success",
                                          title: "Feedback Received",
                                          message: "Thank you for your positive feedback!",
                                          duration: 3000,
                                        })
                                      }}
                                    >
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      Helpful
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`h-8 px-2 hover:bg-primary/10 transition-colors ${feedbackGiven === "down" ? "bg-primary/10 text-primary" : ""}`}
                                      onClick={() => {
                                        setFeedbackGiven("down")
                                        addNotification({
                                          type: "info",
                                          title: "Feedback Received",
                                          message: "Thank you for your feedback. We'll improve our responses.",
                                          duration: 3000,
                                        })
                                      }}
                                    >
                                      <ThumbsDown className="h-4 w-4 mr-1" />
                                      Not helpful
                                    </Button>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 hover:bg-primary/10 transition-colors"
                                    onClick={handleCopyToClipboard}
                                  >
                                    {copied ? (
                                      <Check className="h-4 w-4 mr-1 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4 mr-1" />
                                    )}
                                    {copied ? "Copied" : "Copy"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </motion.div>
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Button
                              onClick={handleAddToComposer}
                              className="mt-2 w-full transition-all duration-200 hover:scale-[1.02] shadow-soft hover:bg-primary/90"
                              disabled={isGenerating || !aiResponse.trim()}
                            >
                              <span className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Add to composer
                              </span>
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4"
                      >
                        <h4 className="mb-2 text-sm font-medium flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {relevantSources.length} relevant sources found
                        </h4>
                        <div className="space-y-2">
                          {relevantSources.slice(0, 3).map((source, index) => (
                            <motion.div
                              key={source.id}
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="flex items-start gap-2 rounded-lg border p-2 transition-all duration-200 hover:bg-muted/50 cursor-pointer shadow-soft hover-lift"
                            >
                              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                              <div>
                                <h5 className="text-sm font-medium">{source.title}</h5>
                                <p className="text-xs text-muted-foreground">{source.excerpt}</p>
                              </div>
                            </motion.div>
                          ))}
                          {relevantSources.length > 3 && (
                            <Button
                              variant="link"
                              className="h-auto p-0 text-xs hover:text-primary transition-colors"
                              onClick={() => {
                                addNotification({
                                  type: "info",
                                  title: "Knowledge Base",
                                  message: "Viewing all relevant knowledge sources.",
                                  duration: 3000,
                                })
                              }}
                            >
                              <span className="flex items-center gap-1">
                                See all <ArrowRight className="h-3 w-3" />
                              </span>
                            </Button>
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6"
                      >
                        <Button
                          variant="outline"
                          className="w-full transition-all duration-200 hover:bg-primary/5 shadow-soft hover-lift"
                          onClick={() => {
                            setAiMessage(null)
                            setAiResponse("")
                            setUserQuery("")
                          }}
                          disabled={isGenerating}
                        >
                          Ask another question
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-0 border-0 p-4">
              <div className="space-y-4">
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Customer Details
                  </h3>
                  {currentConversation && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10 transition-transform duration-200 hover:scale-105 shadow-soft">
                          <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                            {currentConversation.customer.name.charAt(0)}
                          </div>
                        </Avatar>
                        <div>
                          <div className="font-medium">{currentConversation.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{currentConversation.customer.email}</div>
                        </div>
                      </div>

                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-lg border p-3 transition-all duration-200 hover:border-primary/50 shadow-soft hover-lift"
                      >
                        <h4 className="text-sm font-medium">Customer Information</h4>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Customer since:</span>
                            <span>Jan 2023</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total orders:</span>
                            <span>12</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lifetime value:</span>
                            <span>$1,245.00</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>

                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Knowledge Base
                  </h3>
                  <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search knowledge base..."
                      className="pl-8 transition-all duration-200 focus-ring"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredSources.map((source, index) => (
                      <motion.div
                        key={source.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-start gap-2 rounded-lg border p-2 transition-all duration-200 hover:bg-muted/50 cursor-pointer shadow-soft hover-lift"
                        onClick={() => {
                          addNotification({
                            type: "info",
                            title: "Knowledge Article",
                            message: `Viewing: ${source.title}`,
                            duration: 3000,
                          })
                        }}
                      >
                        <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <h5 className="text-sm font-medium flex items-center">
                            {source.title}
                            <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
                          </h5>
                          <p className="text-xs text-muted-foreground">{source.excerpt}</p>
                        </div>
                      </motion.div>
                    ))}

                    {filteredSources.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Search className="mb-2 h-8 w-8 opacity-50" />
                        <p>No knowledge base articles match your search</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 hover:bg-primary/10 transition-colors"
            onClick={() => {
              addNotification({
                type: "info",
                title: "Expand View",
                message: "Expanded AI Copilot view",
                duration: 3000,
              })
            }}
          >
            <Expand className="h-4 w-4" />
          </Button>
        )}
      </motion.div>

      {/* Keyboard shortcuts dialog */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent className={isMobile ? "w-[95%] max-w-md" : "sm:max-w-md"}>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these keyboard shortcuts to navigate the application more efficiently.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">Ctrl</kbd>
                <span>+</span>
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">K</kbd>
              </div>
              <span>Search conversations</span>
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">Ctrl</kbd>
                <span>+</span>
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">N</kbd>
              </div>
              <span>New conversation</span>
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">Ctrl</kbd>
                <span>+</span>
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">Enter</kbd>
              </div>
              <span>Generate AI response</span>
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">Ctrl</kbd>
                <span>+</span>
                <kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">/</kbd>
              </div>
              <span>Show keyboard shortcuts</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

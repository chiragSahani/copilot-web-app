"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useConversation } from "@/components/conversation-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  X,
  Smile,
  Send,
  MoreHorizontal,
  MessageSquare,
  ShoppingCart,
  Info,
  User,
  Clock,
  Calendar,
  Tag,
  ChevronDown,
  Paperclip,
  ImageIcon,
  Mic,
  Loader2,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import EmojiPicker from "emoji-picker-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import { PulseEffect } from "@/components/visual-assets"
import { useHotkeys } from "react-hotkeys-hook"

export function ChatPanel() {
  const { currentConversation, addMessage, isLoading } = useConversation()
  const [inputValue, setInputValue] = useState("")
  const [composerValue, setComposerValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Register keyboard shortcuts
  useHotkeys("ctrl+enter, cmd+enter", (e) => {
    if (inputValue.trim()) {
      e.preventDefault()
      handleSendMessage()
    }
  })

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  useEffect(() => {
    // Simulate typing indicator
    if (currentConversation && currentConversation.messages.length > 0) {
      const lastMessage = currentConversation.messages[currentConversation.messages.length - 1]
      if (lastMessage.sender === "customer") {
        setIsTyping(true)
        const timer = setTimeout(() => {
          setIsTyping(false)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [currentConversation])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage({
      content: inputValue,
      sender: "agent",
      timestamp: new Date().toISOString(),
    })

    setInputValue("")

    // Focus the textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    setInputValue((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)

    // Focus the textarea after adding emoji
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        adjustTextareaHeight()
      }
    }, 0)
  }

  const simulateRecording = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      setInputValue((prev) => prev + " I'm sending this message using voice input.")
    }, 3000)
  }

  const simulateFileUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      addMessage({
        content: "I've attached a screenshot of the issue. [screenshot.png]",
        sender: "agent",
        timestamp: new Date().toISOString(),
      })
    }, 2000)
  }

  if (!currentConversation) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/20">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
          <p className="mt-2 text-sm text-muted-foreground">Select a conversation from the list to start chatting</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mx-auto h-12 w-12 text-primary"
          >
            <Loader2 className="h-12 w-12" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium">Loading conversation...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between border-b border-primary/10 p-4 shadow-soft bg-background/80 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 transition-transform duration-200 hover:scale-105 shadow-soft">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
              {currentConversation.customer.name.charAt(0)}
            </div>
          </Avatar>

          <div>
            <div className="font-medium">{currentConversation.customer.name}</div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-xs">
                {currentConversation.customer.email}
              </span>
              {currentConversation.category === "support" && (
                <Badge variant="outline" className="flex items-center gap-1 px-1 text-xs">
                  <MessageSquare className="h-3 w-3" />
                  Support
                </Badge>
              )}
              {currentConversation.category === "orders" && (
                <Badge variant="outline" className="flex items-center gap-1 px-1 text-xs">
                  <ShoppingCart className="h-3 w-3" />
                  Order
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 transition-colors">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View customer details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors">
                <User className="h-4 w-4" />
                View customer details
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors">
                <Tag className="h-4 w-4" />
                Add tags
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors">
                <Clock className="h-4 w-4" />
                View conversation history
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors">
                <Calendar className="h-4 w-4" />
                Schedule follow-up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="secondary"
            size="sm"
            className="gap-1 shadow-soft hover-lift hover:bg-primary/10 transition-colors hidden sm:flex"
          >
            <X className="h-4 w-4" />
            Close
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden hover:bg-primary/10 transition-colors">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation.messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${message.sender === "customer" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`message-bubble animate-fade-in ${
                message.sender === "customer" ? "message-bubble-customer" : "message-bubble-agent"
              } shadow-soft`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {format(new Date(message.timestamp), "h:mm a")}
              </div>

              {message.sender === "agent" && (
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 transition-colors">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="message-bubble animate-fade-in message-bubble-customer shadow-soft">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer area */}
      <AnimatePresence>
        {composerValue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t p-4"
          >
            <div className="rounded-lg border p-3 bg-card shadow-soft">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Message Draft</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setComposerValue("")}
                  className="hover:bg-destructive/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={composerValue}
                onChange={(e) => setComposerValue(e.target.value)}
                className="mt-2 min-h-24 bg-background focus-ring"
                placeholder="Edit your message..."
              />
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={() => {
                    addMessage({
                      content: composerValue,
                      sender: "agent",
                      timestamp: new Date().toISOString(),
                    })
                    setComposerValue("")
                  }}
                  className="transition-all duration-200 hover:scale-105 shadow-soft hover:bg-primary/90"
                >
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="border-t border-primary/10 p-4 bg-background/80 backdrop-blur-sm shadow-soft relative"
      >
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Ctrl+Enter to send)"
            className="min-h-10 flex-1 resize-none bg-secondary/20 focus:bg-background/70 backdrop-blur-sm transition-all duration-200 focus-ring border-primary/20 focus:border-primary/40"
            rows={1}
          />
          <div className="flex gap-1">
            {!isMobile && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 hover-lift hover:bg-primary/10 transition-colors"
                        onClick={simulateFileUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 hover-lift hover:bg-primary/10 transition-colors"
                        onClick={simulateFileUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 hover-lift hover:bg-primary/10 transition-colors"
                        onClick={simulateRecording}
                        disabled={isRecording}
                      >
                        {isRecording ? <PulseEffect size="sm" /> : <Mic className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voice input</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover-lift hover:bg-primary/10 transition-colors"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="h-10 w-10 transition-all duration-200 hover:scale-105 shadow-soft bg-primary/90 hover:bg-primary border border-primary/50 text-white"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</div>
        </div>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              ref={emojiPickerRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-20 right-4 z-50"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

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
  Paperclip,
  Smile,
  Send,
  MoreHorizontal,
  MessageSquare,
  ShoppingCart,
  ImageIcon,
  FileText,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Info,
  User,
  Clock,
  Calendar,
  Tag,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ChatPanel() {
  const { currentConversation, addMessage } = useConversation()
  const [inputValue, setInputValue] = useState("")
  const [composerValue, setComposerValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 transition-transform duration-200 hover:scale-105 shadow-soft">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
              {currentConversation.customer.name.charAt(0)}
            </div>
          </Avatar>

          <div>
            <div className="font-medium">{currentConversation.customer.name}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{currentConversation.customer.email}</span>
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

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                View customer details
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Add tags
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                View conversation history
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule follow-up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="secondary" size="sm" className="gap-1 shadow-soft hover-lift">
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation.messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "customer" ? "justify-start" : "justify-end"} animate-slide-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`message-bubble ${
                message.sender === "customer" ? "message-bubble-customer" : "message-bubble-agent"
              } shadow-soft`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {format(new Date(message.timestamp), "h:mm a")}
              </div>

              {message.sender === "agent" && (
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="message-bubble message-bubble-customer shadow-soft">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer area */}
      {composerValue && (
        <div className="border-t p-4 animate-slide-in-up">
          <div className="rounded-lg border p-3 bg-card shadow-soft">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Message Draft</h4>
              <Button variant="ghost" size="sm" onClick={() => setComposerValue("")}>
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
                className="transition-all duration-200 hover:scale-105 shadow-soft"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t p-4 bg-background shadow-soft">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-10 flex-1 resize-none bg-muted/30 focus:bg-background transition-colors duration-200 focus-ring"
            rows={1}
          />
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 hover-lift">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Image</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Document</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach files</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 hover-lift">
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
                    className="h-10 w-10 transition-all duration-200 hover:scale-105 shadow-soft"
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
          <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs text-muted-foreground hover-lift">
            <Mic className="h-3 w-3" />
            Voice input
          </Button>
        </div>
      </div>
    </div>
  )
}

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
  Sparkles,
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
} from "lucide-react"
import { mockAIResponses } from "@/lib/mock-data"

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
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter knowledge sources based on search query
  const filteredSources = knowledgeSources.filter(
    (source) => searchQuery === "" || source.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
      // Find relevant knowledge sources based on query keywords
      const keywords = userQuery.toLowerCase().split(" ")
      const sources = knowledgeSources
        .filter((source) => {
          const content = (source.title + " " + source.content).toLowerCase()
          return keywords.some((keyword) => content.includes(keyword))
        })
        .slice(0, 5)

      setRelevantSources(sources)

      // Simulate streaming response with mock data
      let response = ""

      // Find a matching mock response or use default
      const mockResponse =
        mockAIResponses.find((mock) => userQuery.toLowerCase().includes(mock.keyword))?.response ||
        mockAIResponses.find((mock) => mock.keyword === "default")?.response ||
        "I'm sorry, I don't have enough information to answer that question properly. Could you provide more details?"

      // Simulate streaming by adding characters gradually
      const chars = mockResponse.split("")

      for (let i = 0; i < chars.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15)) // Adjust speed as needed
        response += chars[i]
        setAiResponse(response)
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
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
    }
  }

  const handleCopyToClipboard = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse)
      setCopied(true)
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
      <div className="flex items-center justify-between border-b p-4">
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
                {!aiMessage && !isGenerating && aiResponse === "" ? (
                  <div className="flex flex-1 flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shadow-soft hover-lift">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Hi, I'm Fin AI Copilot</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Ask me anything about this conversation.</p>

                    <div className="mt-6 w-full">
                      <Input
                        ref={inputRef}
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="How do I get a refund?"
                        className="mb-2 transition-all duration-200 focus-ring"
                      />
                      <Button
                        onClick={handleGenerateResponse}
                        className="w-full transition-all duration-200 hover:scale-[1.02] shadow-soft"
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
                    </div>

                    <div className="mt-6 w-full">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Suggested</h4>
                      </div>
                      <div className="mt-2 space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-sm transition-all duration-200 hover:bg-primary/5 hover-lift"
                          onClick={() => {
                            setUserQuery("How do I get a refund?")
                            handleGenerateResponse()
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                            How do I get a refund?
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-sm transition-all duration-200 hover:bg-primary/5 hover-lift"
                          onClick={() => {
                            setUserQuery("What's our return policy?")
                            handleGenerateResponse()
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                            What's our return policy?
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-sm transition-all duration-200 hover:bg-primary/5 hover-lift"
                          onClick={() => {
                            setUserQuery("How to track an order?")
                            handleGenerateResponse()
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                            How to track an order?
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col p-4 animate-fade-in">
                    <div className="mb-4 flex items-start gap-3">
                      <Avatar className="mt-1 h-8 w-8 shadow-soft">
                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs">
                          <Bot className="h-4 w-4" />
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <div className="rounded-lg bg-muted/50 p-4 shadow-soft">
                          {isGenerating ? (
                            <div>
                              <p className="whitespace-pre-wrap text-sm">{aiResponse}</p>
                              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Generating response...</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="whitespace-pre-wrap text-sm">{aiResponse}</p>
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 px-2 ${feedbackGiven === "up" ? "bg-primary/10 text-primary" : ""}`}
                                    onClick={() => setFeedbackGiven("up")}
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    Helpful
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 px-2 ${feedbackGiven === "down" ? "bg-primary/10 text-primary" : ""}`}
                                    onClick={() => setFeedbackGiven("down")}
                                  >
                                    <ThumbsDown className="h-4 w-4 mr-1" />
                                    Not helpful
                                  </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleCopyToClipboard}>
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
                        </div>
                        <Button
                          onClick={handleAddToComposer}
                          className="mt-2 w-full transition-all duration-200 hover:scale-[1.02] shadow-soft"
                          disabled={isGenerating || !aiResponse.trim()}
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Add to composer
                          </span>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 animate-slide-in-up">
                      <h4 className="mb-2 text-sm font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {relevantSources.length} relevant sources found
                      </h4>
                      <div className="space-y-2">
                        {relevantSources.slice(0, 3).map((source, index) => (
                          <div
                            key={source.id}
                            className="flex items-start gap-2 rounded-lg border p-2 transition-all duration-200 hover:bg-muted/50 cursor-pointer animate-slide-in-right shadow-soft hover-lift"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <h5 className="text-sm font-medium">{source.title}</h5>
                              <p className="text-xs text-muted-foreground">{source.excerpt}</p>
                            </div>
                          </div>
                        ))}
                        {relevantSources.length > 3 && (
                          <Button variant="link" className="h-auto p-0 text-xs">
                            <span className="flex items-center gap-1">
                              See all <ArrowRight className="h-3 w-3" />
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
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
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-0 border-0 p-4">
              <div className="space-y-4">
                <div className="animate-fade-in">
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

                      <div className="rounded-lg border p-3 transition-all duration-200 hover:border-primary/50 shadow-soft hover-lift">
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
                      </div>
                    </div>
                  )}
                </div>

                <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
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
                      <div
                        key={source.id}
                        className="flex items-start gap-2 rounded-lg border p-2 transition-all duration-200 hover:bg-muted/50 cursor-pointer animate-slide-in-right shadow-soft hover-lift"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <h5 className="text-sm font-medium flex items-center">
                            {source.title}
                            <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
                          </h5>
                          <p className="text-xs text-muted-foreground">{source.excerpt}</p>
                        </div>
                      </div>
                    ))}

                    {filteredSources.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Search className="mb-2 h-8 w-8 opacity-50" />
                        <p>No knowledge base articles match your search</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Button variant="ghost" size="icon" className="ml-2">
          <Expand className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

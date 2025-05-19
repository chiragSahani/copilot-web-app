"use client"

import { useState } from "react"
import { useConversation } from "@/components/conversation-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Search, Plus, MessageSquare, ShoppingCart, Inbox, Filter, Bell, Settings, User, Star } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ConversationList() {
  const { conversations, currentConversation, setCurrentConversation } = useConversation()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && conversation.category === activeTab
  })

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Inbox</h2>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover-lift">
                  <Bell className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover-lift">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ThemeToggle />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="hover-lift">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8 focus-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="px-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="support" className="text-xs">
            Support
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs">
            Orders
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 overflow-auto py-2">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Filter className="mb-2 h-8 w-8" />
            <p>No conversations match your filters</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors duration-200 ${
                currentConversation?.id === conversation.id ? "bg-muted/50" : ""
              } hover-lift`}
              onClick={() => setCurrentConversation(conversation)}
            >
              <Avatar className="h-9 w-9 transition-transform duration-200 hover:scale-105 shadow-soft">
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                  {conversation.customer.name.charAt(0)}
                </div>
              </Avatar>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center gap-1">
                    {conversation.customer.name}
                    {conversation.id === "conv-1" && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </div>
                </div>

                <div className="mt-1 truncate text-sm text-muted-foreground">{conversation.lastMessage}</div>

                <div className="mt-1 flex items-center gap-2">
                  {conversation.category === "support" && (
                    <Badge variant="outline" className="flex items-center gap-1 px-1 text-xs">
                      <MessageSquare className="h-3 w-3" />
                      Support
                    </Badge>
                  )}
                  {conversation.category === "orders" && (
                    <Badge variant="outline" className="flex items-center gap-1 px-1 text-xs">
                      <ShoppingCart className="h-3 w-3" />
                      Order
                    </Badge>
                  )}
                  {conversation.unread && (
                    <Badge className="h-5 w-5 rounded-full p-0 text-xs animate-pulse-subtle">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 shadow-soft">
            <User className="h-4 w-4" />
          </Avatar>
          <div className="text-sm font-medium">Agent Name</div>
        </div>
        <Badge variant="outline" className="text-xs">
          Online
        </Badge>
      </div>
    </div>
  )
}

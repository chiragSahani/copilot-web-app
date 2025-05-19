"use client"

import { useState, useEffect } from "react"
import { useConversation } from "@/components/conversation-provider"
import { useApi } from "@/components/api-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Search, Plus, MessageSquare, ShoppingCart, Inbox, Filter, Settings, User, Star, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { NotificationCenter } from "@/components/notification-center"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useHotkeys } from "react-hotkeys-hook"
import { useMobile } from "@/hooks/use-mobile"

interface ConversationListProps {
  onConversationSelect?: () => void
}

export function ConversationList({ onConversationSelect }: ConversationListProps) {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    isLoading,
    searchConversations,
    createConversation,
  } = useConversation()
  const { user, logout } = useApi()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerEmail, setNewCustomerEmail] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [newCategory, setNewCategory] = useState<"support" | "orders" | "general">("support")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()

  // Register keyboard shortcuts
  useHotkeys("ctrl+k, cmd+k", (e) => {
    e.preventDefault()
    document.querySelector<HTMLInputElement>("#search-conversations")?.focus()
  })

  useHotkeys("ctrl+n, cmd+n", (e) => {
    e.preventDefault()
    setIsNewConversationOpen(true)
  })

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchConversations(searchQuery, activeTab === "all" ? undefined : activeTab)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, activeTab, searchConversations])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    searchConversations(searchQuery, value === "all" ? undefined : value)
  }

  // Handle logout
  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  // Handle conversation selection
  const handleConversationSelect = (conversation: any) => {
    setCurrentConversation(conversation)
    if (onConversationSelect) {
      onConversationSelect()
    }
  }

  // Handle create conversation
  const handleCreateConversation = async () => {
    if (!newCustomerName || !newCustomerEmail || !newMessage) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)

      const success = await createConversation({
        customer: {
          name: newCustomerName,
          email: newCustomerEmail,
        },
        message: newMessage,
        category: newCategory,
      })

      if (success) {
        setIsNewConversationOpen(false)
        setNewCustomerName("")
        setNewCustomerEmail("")
        setNewMessage("")
        setNewCategory("support")

        // Notify mobile users to switch to chat view
        if (isMobile && onConversationSelect) {
          onConversationSelect()
          toast({
            title: "Conversation created",
            description: "Switching to chat view",
          })
        }
      }
    } catch (err) {
      console.error("Error creating conversation:", err)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between border-b p-4 shadow-soft"
      >
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Inbox</h2>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />

          {!isMobile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover-lift hover:bg-primary/10 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <ThemeToggle />

          <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="hover-lift hover:bg-primary/10 transition-colors">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent className={isMobile ? "w-[95%] max-w-md" : ""}>
              <DialogHeader>
                <DialogTitle>New Conversation</DialogTitle>
                <DialogDescription>Create a new customer conversation</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="customer-email">Customer Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newCategory} onValueChange={(value) => setNewCategory(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="orders">Orders</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Initial Message</Label>
                  <Input
                    id="message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="How can we help you today?"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewConversationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConversation} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-4"
      >
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-conversations"
            type="search"
            placeholder="Search conversations... (Ctrl+K)"
            className="pl-8 focus-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tabs defaultValue="all" className="px-4" onValueChange={handleTabChange}>
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
      </motion.div>

      <div className="flex-1 overflow-auto py-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Search className="mb-2 h-8 w-8" />
            </motion.div>
            <p>Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground"
          >
            <Filter className="mb-2 h-8 w-8" />
            <p>No conversations match your filters</p>
          </motion.div>
        ) : (
          conversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className={`flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors duration-200 ${
                currentConversation?.id === conversation.id ? "bg-muted/50" : ""
              } hover-lift`}
              onClick={() => handleConversationSelect(conversation)}
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
            </motion.div>
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="border-t p-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 shadow-soft">
            <User className="h-4 w-4" />
          </Avatar>
          <div className="text-sm font-medium">{user?.name || "Agent"}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Online
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive/10 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    </div>
  )
}

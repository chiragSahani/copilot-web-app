"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useApi } from "@/components/api-provider"
import { Bell, X, MessageSquare, UserPlus, Info, AtSign, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadNotifications, markNotificationAsRead } = useApi()
  const notificationRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const { toast } = useToast()

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "assignment":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-500" />
      case "system":
      default:
        return <Info className="h-4 w-4 text-orange-500" />
    }
  }

  return (
    <div className="relative" ref={notificationRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover-lift hover:bg-primary/10 transition-colors relative"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  variant="destructive"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${
              isMobile
                ? "fixed inset-x-4 top-16 z-50 rounded-lg border bg-card shadow-lg max-h-[80vh]"
                : "absolute right-0 top-10 z-50 w-80 rounded-lg border bg-card shadow-lg"
            }`}
          >
            <div className="flex items-center justify-between border-b p-3">
              <h3 className="font-medium">Notifications</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className={isMobile ? "max-h-[60vh]" : "max-h-[400px]"}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <Bell className="mb-2 h-8 w-8 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-muted/30" : ""
                      }`}
                    >
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>{notification.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(notification.id)
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                <span className="flex items-center gap-1">
                  View all notifications <ChevronRight className="h-3 w-3" />
                </span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

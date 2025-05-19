"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <div className="relative w-full max-w-md px-4">
        <img
          src="https://res.cloudinary.com/dlyctssmy/image/upload/v1747659364/ded0bbdd8485e424327257405a86a884_q1ekeh.gif"
          alt="AI Loading Animation"
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-primary">AI Copilot</h2>
          <p className="mt-2 text-muted-foreground">Initializing your AI assistant...</p>
        </div>
      </div>
    </motion.div>
  )
}

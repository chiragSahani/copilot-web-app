"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AIAnimationProps {
  type: "thinking" | "processing"
  className?: string
}

export function AIAnimation({ type, className = "" }: AIAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  const gifUrl =
    type === "thinking"
      ? "https://res.cloudinary.com/dlyctssmy/image/upload/v1747659361/1_C7Z3JYA_yScejWcK99ZfGQ_nzz0ad.gif"
      : "https://res.cloudinary.com/dlyctssmy/image/upload/v1747659369/original-5eb2f9967073700b38a31280cc2c32e0_m0tb2u.gif"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden rounded-lg ${className}`}
    >
      <img
        src={gifUrl || "/placeholder.svg"}
        alt={type === "thinking" ? "AI Thinking Animation" : "AI Processing Animation"}
        className="w-full h-auto"
      />
    </motion.div>
  )
}

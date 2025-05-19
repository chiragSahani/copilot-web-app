"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

// Animated background component
export function AnimatedBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        {/* Animated gradient blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, 10, 0],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute top-40 right-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 15, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"
        ></motion.div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, ${theme === "dark" ? "white" : "black"} 1px, transparent 1px), linear-gradient(to bottom, ${theme === "dark" ? "white" : "black"} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>
    </div>
  )
}

// Decorative particles
export function ParticleEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

// Animated logo
export function AnimatedLogo() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4 border border-primary/30 relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-primary"
        >
          <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
          <path d="M12 12 2.1 9.1a10 10 0 0 0 9.8 12.9L12 12Z" />
          <path d="M12 12 9.1 2.1a10 10 0 0 0 12.9 9.8L12 12Z" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

// Loading animation
export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-sm text-muted-foreground"
      >
        Loading...
      </motion.p>
    </div>
  )
}

// Pulse effect
export function PulseEffect({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className={`relative ${sizes[size]}`}>
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/40"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
        transition={{ duration: 2, delay: 0.2, repeat: Number.POSITIVE_INFINITY }}
      />
      <div className="absolute inset-0 rounded-full bg-primary/60 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>
    </div>
  )
}

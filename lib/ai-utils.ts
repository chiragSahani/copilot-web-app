"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Conversation } from "./types"

export async function generateAIResponse(conversation: Conversation, query: string): Promise<string> {
  try {
    // Create a prompt from the conversation history
    const conversationHistory = conversation.messages
      .map((msg) => `${msg.sender === "customer" ? "Customer" : "Agent"}: ${msg.content}`)
      .join("\n\n")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `The customer has asked: "${query}"
      
Based on the conversation history:
${conversationHistory}

Provide a helpful response as a customer service representative.`,
      system:
        "You are Fin, a helpful customer service AI assistant. Your goal is to assist customers with their inquiries in a friendly and professional manner. Provide detailed and accurate information based on the company's policies and knowledge base. Be concise but thorough in your responses.",
      temperature: 0.7,
      maxTokens: 500,
    })

    return text
  } catch (error) {
    console.error("Error generating AI response:", error)
    return "I apologize, but I'm having trouble generating a response right now. Please try again later or contact our support team directly for immediate assistance."
  }
}

export async function streamAIResponse(
  conversation: Conversation,
  query: string,
  onChunk: (chunk: string) => void,
): Promise<string> {
  try {
    // Create a prompt from the conversation history
    const conversationHistory = conversation.messages
      .map((msg) => `${msg.sender === "customer" ? "Customer" : "Agent"}: ${msg.content}`)
      .join("\n\n")

    // Create a ReadableStream to handle the streaming response
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        conversationHistory,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error("Response body is null")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let result = ""

    // Read the stream
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // Decode the chunk and update the UI
      const chunk = decoder.decode(value, { stream: true })

      try {
        // Parse the chunk as JSON
        const lines = chunk
          .split("\n")
          .filter(Boolean)
          .map((line) => line.replace(/^data: /, "").trim())
          .filter((line) => line !== "[DONE]")
          .map((line) => JSON.parse(line))

        for (const line of lines) {
          if (line.type === "text-delta") {
            onChunk(line.text)
            result += line.text
          }
        }
      } catch (e) {
        // If parsing fails, just use the raw chunk
        onChunk(chunk)
        result += chunk
      }
    }

    return result
  } catch (error) {
    console.error("Error streaming AI response:", error)
    return "I apologize, but I'm having trouble generating a response right now. Please try again later or contact our support team directly for immediate assistance."
  }
}

export async function getRelevantKnowledgeSources(query: string, knowledgeSources: any[]): Promise<any[]> {
  try {
    // In a real application, you would use embeddings and vector search
    // For this demo, we'll do a simple keyword match
    const keywords = query.toLowerCase().split(" ")

    return knowledgeSources
      .filter((source) => {
        const content = (source.title + " " + source.content).toLowerCase()
        return keywords.some((keyword) => content.includes(keyword))
      })
      .slice(0, 5)
  } catch (error) {
    console.error("Error finding relevant knowledge sources:", error)
    return []
  }
}

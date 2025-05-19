import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 30 // Set max duration to 30 seconds

export async function POST(req: Request) {
  try {
    const { messages, query, conversationHistory } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      prompt: `The customer has asked: "${query}"
      
Based on the conversation history:
${conversationHistory || ""}

Provide a helpful response as a customer service representative.`,
      system:
        "You are Fin, a helpful customer service AI assistant. Your goal is to assist customers with their inquiries in a friendly and professional manner. Provide detailed and accurate information based on the company's policies and knowledge base. Be concise but thorough in your responses.",
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}

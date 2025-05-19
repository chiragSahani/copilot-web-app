import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { prompt, system } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: system || "You are a helpful assistant.",
      temperature: 0.7,
      maxTokens: 500,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error in AI route:", error)
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
  }
}

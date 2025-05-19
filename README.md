# AI Copilot Web App

![AI Copilot](https://res.cloudinary.com/dlyctssmy/image/upload/v1747659364/ded0bbdd8485e424327257405a86a884_q1ekeh.gif)

A modern, responsive AI-powered customer support assistant with a sleek interface and intelligent conversation capabilities.

## ✨ Features

- **Split-Screen Interface**: Intuitive layout with conversation list, chat panel, and AI copilot
- **AI-Powered Responses**: Generate contextual responses using OpenAI's advanced models
- **Knowledge Base Integration**: Access relevant information from the knowledge base to assist customers
- **Responsive Design**: Fully responsive UI that works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes based on preference
- **Real-time Conversation**: Simulate typing indicators and live responses

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **UI**: Tailwind CSS, shadcn/ui components
- **AI Integration**: Vercel AI SDK with OpenAI
- **State Management**: React Context API
- **Styling**: Custom animations and responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

1. Clone this repository:
\`\`\`bash
git clone https://github.com/chiragSahani/copilot-web-app.git
cd copilot-web-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your OpenAI API key:
\`\`\`
OPENAI_API_KEY=your_api_key_here
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## 📱 Responsive Design

The app is designed to work seamlessly across all device sizes:
- **Desktop**: Full split-screen interface with all panels visible
- **Tablet**: Adaptable layout with collapsible panels
- **Mobile**: Stack view with toggleable sidebar and AI copilot panel

## 🧠 AI Capabilities

- **Context-Aware Responses**: The AI understands the conversation context and provides relevant answers
- **Knowledge Base Integration**: Automatically references knowledge articles for accurate information
- **Smart Suggestions**: Offers intelligent suggestions based on conversation content
- **Feedback System**: Allows agents to rate and improve AI responses

## 🎨 Customization

You can customize the app's appearance and behavior:
- Edit the theme colors in `tailwind.config.ts`
- Modify the AI behavior in `lib/ai-utils.ts`
- Add or change mock data in `lib/sample-data.ts` and `lib/mock-data.ts`

## 📄 License

[MIT](LICENSE)

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [OpenAI](https://openai.com/)
\`\`\`


import { Inbox } from "@/components/inbox"
import { ConversationProvider } from "@/components/conversation-provider"
import { ProtectedRoute } from "@/components/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <ConversationProvider>
        <Inbox />
      </ConversationProvider>
    </ProtectedRoute>
  )
}

import { Inbox } from "@/components/inbox"
import { ConversationProvider } from "@/components/conversation-provider"

export default function Home() {
  return (
    <ConversationProvider>
      <Inbox />
    </ConversationProvider>
  )
}

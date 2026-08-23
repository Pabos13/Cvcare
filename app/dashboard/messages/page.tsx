import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { MessageList } from "@/components/message-list"

export default async function MessagesPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/auth/login")

  const messages = await db.message.findMany({
    where: {
      OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
    take: 100,
  })

  // Group by conversation partner
  const conversations = new Map()
  messages.forEach((msg) => {
    const partnerId = msg.senderId === session.user.id ? msg.receiverId : msg.senderId
    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, {
        partner: msg.senderId === session.user.id ? msg.receiver : msg.sender,
        messages: [],
        unread: 0,
      })
    }
    conversations.get(partnerId).messages.push(msg)
    if (!msg.read && msg.receiverId === session.user.id) {
      conversations.get(partnerId).unread++
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      <MessageList 
        conversations={Array.from(conversations.values())} 
        currentUserId={session.user.id}
      />
    </div>
  )
}

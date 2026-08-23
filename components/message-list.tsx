"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Search } from "lucide-react"

export function MessageList({ conversations, currentUserId }: { conversations: any[]; currentUserId: string }) {
  const [selected, setSelected] = useState(conversations[0] || null)
  const [newMsg, setNewMsg] = useState("")
  const [allConversations, setAllConversations] = useState(conversations)

  const sendMessage = async () => {
    if (!newMsg.trim() || !selected) return
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selected.partner.id, content: newMsg }),
    })
    if (res.ok) {
      const msg = await res.json()
      const updated = allConversations.map((c) => {
        if (c.partner.id === selected.partner.id) {
          return { ...c, messages: [...c.messages, { ...msg, sender: { id: currentUserId }, receiver: selected.partner }] }
        }
        return c
      })
      setAllConversations(updated)
      setSelected({ ...selected, messages: [...selected.messages, msg] })
      setNewMsg("")
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-300px)] min-h-[500px]">
      <Card className="lg:col-span-1 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-65px)]">
            {allConversations.map((conv) => (
              <button
                key={conv.partner.id}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-muted transition-colors border-b ${
                  selected?.partner.id === conv.partner.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelected(conv)}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={conv.partner.image} />
                  <AvatarFallback>{conv.partner.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conv.partner.name}</p>
                    {conv.unread > 0 && <Badge className="shrink-0">{conv.unread}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.messages[conv.messages.length - 1]?.content || "No messages"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selected.partner.image} />
                <AvatarFallback>{selected.partner.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selected.partner.name}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selected.messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.senderId === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <span className={`text-xs mt-1 block ${msg.senderId === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage}><Send className="h-4 w-4" /></Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </Card>
    </div>
  )
}

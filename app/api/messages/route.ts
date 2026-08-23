import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const otherUserId = searchParams.get("userId")

    if (otherUserId) {
      // Get conversation between two users
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: session.user.id },
          ],
        },
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { name: true, image: true } },
          receiver: { select: { name: true, image: true } },
        },
      })
      return NextResponse.json(messages)
    }

    // Get all conversations for current user
    const messages = await db.message.findMany({
      where: {
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { name: true, image: true } },
        receiver: { select: { name: true, image: true } },
      },
    })

    return NextResponse.json(messages)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { receiverId, content } = await req.json()

    const message = await db.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
      },
    })

    // Create notification for receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        type: "MESSAGE",
        title: "New Message",
        content: `You received a new message`,
        link: "/dashboard/messages",
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

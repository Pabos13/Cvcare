import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")
    const location = searchParams.get("location")
    const type = searchParams.get("type")
    const level = searchParams.get("level")
    const remote = searchParams.get("remote")

    const where: any = { status: "ACTIVE" }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { skills: { has: q } },
      ]
    }
    if (location) where.location = { contains: location, mode: "insensitive" }
    if (type) where.type = type
    if (level) where.level = level
    if (remote === "true") where.remote = true

    const jobs = await db.job.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: { employer: { select: { name: true, image: true } } },
    })

    return NextResponse.json(jobs)
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

    const body = await req.json()

    // Check if employer has Pro/Enterprise plan for posting
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (user?.plan === "FREE" && user?.role === "EMPLOYER") {
      // Check job posting limit for free plan
      const jobCount = await db.job.count({ where: { employerId: user.id } })
      if (jobCount >= 3) {
        return NextResponse.json(
          { error: "Free plan limited to 3 jobs. Upgrade to Pro." },
          { status: 403 }
        )
      }
    }

    const job = await db.job.create({
      data: {
        ...body,
        employerId: session.user.id,
        status: "ACTIVE",
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

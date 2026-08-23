import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { calculateMatchScore } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { jobId, coverLetter } = body

    // Check if user already applied
    const existing = await db.application.findUnique({
      where: { jobId_candidateId: { jobId, candidateId: session.user.id } },
    })

    if (existing) {
      return NextResponse.json({ error: "Already applied to this job" }, { status: 409 })
    }

    // Get candidate profile and job details for match score
    const [profile, job] = await Promise.all([
      db.profile.findUnique({ where: { userId: session.user.id } }),
      db.job.findUnique({ where: { id: jobId } }),
    ])

    const matchScore = profile?.skills && job?.skills
      ? calculateMatchScore(profile.skills, job.skills)
      : null

    const application = await db.application.create({
      data: {
        jobId,
        candidateId: session.user.id,
        coverLetter,
        matchScore: matchScore ? matchScore / 100 : null,
        status: "PENDING",
      },
    })

    // Create notification for employer
    await db.notification.create({
      data: {
        userId: job?.employerId || "",
        type: "APPLICATION",
        title: "New Application",
        content: `Someone applied to your job: ${job?.title}`,
        link: `/dashboard/jobs`,
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("jobId")

    const where: any = {}

    // If jobId provided, get applications for that job (employer view)
    if (jobId) {
      const job = await db.job.findUnique({ where: { id: jobId } })
      if (job?.employerId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      where.jobId = jobId
    } else {
      // Get user's applications (candidate view)
      where.candidateId = session.user.id
    }

    const applications = await db.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        job: { select: { title: true, company: true, location: true } },
        candidate: { select: { name: true, email: true, image: true } },
      },
    })

    return NextResponse.json(applications)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

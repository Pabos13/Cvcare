import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    if (body.name) {
      await db.user.update({ where: { id: session.user.id }, data: { name: body.name } })
    }
    const profile = await db.profile.upsert({
      where: { userId: session.user.id },
      update: {
        headline: body.headline, bio: body.bio, location: body.location,
        website: body.website, linkedin: body.linkedin, github: body.github,
        skills: body.skills, salaryExpectation: body.salaryExpectation,
        availability: body.availability, companyName: body.companyName,
        companySize: body.companySize, industry: body.industry,
      },
      create: {
        userId: session.user.id, headline: body.headline, bio: body.bio,
        location: body.location, website: body.website, linkedin: body.linkedin,
        github: body.github, skills: body.skills || [],
        salaryExpectation: body.salaryExpectation, availability: body.availability,
        companyName: body.companyName, companySize: body.companySize, industry: body.industry,
      },
    })
    return NextResponse.json(profile)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

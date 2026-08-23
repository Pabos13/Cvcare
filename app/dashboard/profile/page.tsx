import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/auth/login")

  let profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    profile = await db.profile.create({
      data: { userId: session.user.id },
    })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, role: true },
  })

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">Update your information to improve matching</p>
      </div>
      <ProfileForm user={user} profile={profile} />
    </div>
  )
}

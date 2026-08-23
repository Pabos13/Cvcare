import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, MapPin, Calendar } from "lucide-react"

export default async function ApplicationsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/auth/login")

  const applications = await db.application.findMany({
    where: { candidateId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { job: true },
  })

  const statusColors: Record<string, string> = {
    PENDING: "secondary",
    REVIEWING: "default",
    INTERVIEW: "default",
    OFFER: "default",
    REJECTED: "destructive",
    WITHDRAWN: "outline",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track your job applications</p>
      </div>

      <div className="space-y-4">
        {applications.map((app: any) => (
          <Card key={app.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{app.job.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {app.job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {app.job.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  {app.matchScore && (
                    <p className="text-sm mt-2 text-primary">Match Score: {app.matchScore}%</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={statusColors[app.status] as any}>{app.status}</Badge>
                  <Link href={`/jobs/${app.job.id}`}>
                    <Button variant="outline" size="sm">View Job</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {applications.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No applications yet</h3>
            <p className="text-muted-foreground mb-4">Start applying to jobs and track your progress here.</p>
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

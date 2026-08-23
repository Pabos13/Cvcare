import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pencil, Eye, Pause, Play, Trash2, Search } from "lucide-react"

export default async function DashboardJobsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/auth/login")

  const jobs = await db.job.findMany({
    where: { employerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="text-muted-foreground">Manage your job listings</p>
        </div>
        <Link href="/dashboard/post-job">
          <Button>+ Post New Job</Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search your jobs..." className="pl-10" />
      </div>

      <div className="space-y-4">
        {jobs.map((job: any) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <Badge variant={job.status === "ACTIVE" ? "default" : "secondary"}>{job.status}</Badge>
                    {job.featured && <Badge variant="outline">Featured</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{job.type.replace("_", "-")}</span>
                    <span>{job.location}</span>
                    <span>{job._count.applications} applications</span>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm"><Pause className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">You haven&apos;t posted any jobs yet.</p>
            <Link href="/dashboard/post-job">
              <Button>Post Your First Job</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

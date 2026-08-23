import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApplyButton } from "@/components/apply-button"
import { 
  MapPin, Briefcase, DollarSign, Clock, Building2, ArrowLeft
} from "lucide-react"

async function getJob(id: string) {
  const job = await db.job.findUnique({
    where: { id, status: "ACTIVE" },
    include: { 
      employer: { select: { name: true, image: true, id: true } },
      _count: { select: { applications: true } },
    },
  })
  return job
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)
  if (!job) notFound()

  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  let hasApplied = false
  if (session) {
    const existing = await db.application.findUnique({
      where: { jobId_candidateId: { jobId: job.id, candidateId: session.user.id } },
    })
    hasApplied = !!existing
  }

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min || !max) return "Not disclosed"
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency, maximumFractionDigits: 0,
    }).format(min) + " - " + new Intl.NumberFormat("en-US", {
      style: "currency", currency, maximumFractionDigits: 0,
    }).format(max)
  }

  return (
    <div className="container py-8">
      <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{job.title}</h1>
              {job.featured && <Badge>Featured</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {job.employer?.name || "Company"}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location || "Not specified"}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{job.type.replace("_", "-")}</Badge>
            {job.remote && <Badge variant="outline">Remote</Badge>}
            <Badge variant="outline">{job.level}</Badge>
            <Badge variant="outline" className="text-primary">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</Badge>
          </div>

          <Card>
            <CardHeader><CardTitle>About the Role</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-line">{job.description}</div>
            </CardContent>
          </Card>

          {job.requirements.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>{req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Required Skills</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </p>
                <p className="text-sm text-muted-foreground">per year</p>
              </div>

              {session ? (
                <ApplyButton jobId={job.id} hasApplied={hasApplied} />
              ) : (
                <Link href="/auth/login">
                  <Button className="w-full" size="lg">Sign in to Apply</Button>
                </Link>
              )}

              <div className="pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-medium">{job._count.applications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Type</span>
                  <span className="font-medium">{job.type.replace("_", "-")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{job.level}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

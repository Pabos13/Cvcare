"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase } from "lucide-react"

export function JobList({ jobs }: { jobs: any[] }) {
  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min || !max) return "Salary not disclosed"
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency, maximumFractionDigits: 0,
    }).format(min) + " - " + new Intl.NumberFormat("en-US", {
      style: "currency", currency, maximumFractionDigits: 0,
    }).format(max)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{jobs.length} {jobs.length === 1 ? "job" : "jobs"} found</p>
      {jobs.map((job) => (
        <Card key={job.id} className={job.featured ? "border-primary/50" : ""}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  {job.featured && <Badge>Featured</Badge>}
                </div>
                <p className="text-muted-foreground">{job.employer?.name || "Anonymous Company"}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{job.type.replace("_", "-")}</Badge>
                  {job.remote && <Badge variant="outline">Remote</Badge>}
                  <Badge variant="outline">{job.level}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location || "Not specified"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills.slice(0, 5).map((skill: string) => (
                    <span key={skill} className="text-xs bg-muted px-2 py-1 rounded-md">{skill}</span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="text-xs text-muted-foreground">+{job.skills.length - 5} more</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className="font-semibold text-primary">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                <span className="text-xs text-muted-foreground">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <Link href={`/jobs/${job.id}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {jobs.length === 0 && (
        <div className="text-center py-20">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

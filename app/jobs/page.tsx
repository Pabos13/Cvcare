import { Suspense } from "react"
import { db } from "@/lib/db"
import { JobList } from "@/components/job-list"
import { JobFilters } from "@/components/job-filters"
import { Briefcase } from "lucide-react"

async function getJobs(searchParams: { [key: string]: string | undefined }) {
  const where: any = { status: "ACTIVE" }

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
      { skills: { has: searchParams.q } },
    ]
  }
  if (searchParams.location) {
    where.location = { contains: searchParams.location, mode: "insensitive" }
  }
  if (searchParams.type) where.type = searchParams.type
  if (searchParams.level) where.level = searchParams.level
  if (searchParams.remote === "true") where.remote = true

  return db.job.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { employer: { select: { name: true, image: true } } },
  })
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const jobs = await getJobs(searchParams)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <p className="text-muted-foreground mt-1">
          Find your next opportunity from our curated listings
        </p>
      </div>

      <JobFilters />

      <Suspense fallback={<JobsSkeleton />}>
        <JobList jobs={jobs} />
      </Suspense>
    </div>
  )
}

function JobsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  )
}

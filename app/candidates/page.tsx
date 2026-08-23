import { Suspense } from "react"
import { db } from "@/lib/db"
import { CandidateList } from "@/components/candidate-list"
import { CandidateFilters } from "@/components/candidate-filters"

async function getCandidates(searchParams: { [key: string]: string | undefined }) {
  const where: any = {}

  if (searchParams.q) {
    where.OR = [
      { user: { name: { contains: searchParams.q, mode: "insensitive" } } },
      { headline: { contains: searchParams.q, mode: "insensitive" } },
      { skills: { has: searchParams.q } },
    ]
  }
  if (searchParams.location) {
    where.location = { contains: searchParams.location, mode: "insensitive" }
  }
  if (searchParams.remote === "true") where.availability = "immediate"

  return db.profile.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true, email: true } } },
    take: 50,
  })
}

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const candidates = await getCandidates(searchParams)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Candidates</h1>
        <p className="text-muted-foreground mt-1">Discover top talent for your team</p>
      </div>
      <CandidateFilters />
      <Suspense fallback={<CandidatesSkeleton />}>
        <CandidateList candidates={candidates} />
      </Suspense>
    </div>
  )
}

function CandidatesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  )
}

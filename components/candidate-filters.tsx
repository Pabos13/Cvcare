"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState, useTransition } from "react"

export function CandidateFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get("q") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    startTransition(() => {
      router.push(`/candidates?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setQuery("")
    startTransition(() => {
      router.push("/candidates")
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, title, or skills"
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={applyFilters} disabled={isPending}>
          {isPending ? "Loading..." : "Search"}
        </Button>
        {query && <Button variant="ghost" onClick={clearFilters}>Clear</Button>}
      </div>
    </div>
  )
}

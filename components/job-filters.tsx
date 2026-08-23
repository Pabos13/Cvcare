"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"
import { useState, useTransition } from "react"

export function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [type, setType] = useState(searchParams.get("type") || "")
  const [level, setLevel] = useState(searchParams.get("level") || "")
  const [remote, setRemote] = useState(searchParams.get("remote") === "true")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (location) params.set("location", location)
    if (type) params.set("type", type)
    if (level) params.set("level", level)
    if (remote) params.set("remote", "true")

    startTransition(() => {
      router.push(`/jobs?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setQuery("")
    setLocation("")
    setType("")
    setLevel("")
    setRemote(false)
    startTransition(() => {
      router.push("/jobs")
    })
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, or skills"
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Location"
            className="pl-10"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="FULL_TIME">Full-time</SelectItem>
            <SelectItem value="PART_TIME">Part-time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="FREELANCE">Freelance</SelectItem>
            <SelectItem value="INTERNSHIP">Internship</SelectItem>
          </SelectContent>
        </Select>

        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Experience Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            <SelectItem value="JUNIOR">Junior</SelectItem>
            <SelectItem value="MID">Mid-level</SelectItem>
            <SelectItem value="SENIOR">Senior</SelectItem>
            <SelectItem value="LEAD">Lead</SelectItem>
            <SelectItem value="EXECUTIVE">Executive</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={remote ? "default" : "outline"}
          onClick={() => setRemote(!remote)}
        >
          Remote Only
        </Button>

        <Button onClick={applyFilters} disabled={isPending}>
          {isPending ? "Loading..." : "Apply Filters"}
        </Button>

        {(query || location || type || level || remote) && (
          <Button variant="ghost" onClick={clearFilters}>Clear</Button>
        )}
      </div>
    </div>
  )
}

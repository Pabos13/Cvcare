"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { Plus, X, Loader2 } from "lucide-react"

export default function PostJobPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [requirements, setRequirements] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newRequirement, setNewRequirement] = useState("")

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

  const addRequirement = () => {
    if (newRequirement && !requirements.includes(newRequirement)) {
      setRequirements([...requirements, newRequirement])
      setNewRequirement("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      type: formData.get("type"),
      level: formData.get("level"),
      salaryMin: parseInt(formData.get("salaryMin") as string),
      salaryMax: parseInt(formData.get("salaryMax") as string),
      remote: formData.get("remote") === "true",
      skills,
      requirements,
    }

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        addToast("Job posted successfully!", "success")
        router.push("/dashboard/jobs")
        router.refresh()
      } else {
        throw new Error("Failed to post job")
      }
    } catch (err) {
      addToast("Failed to post job. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" name="title" placeholder="e.g. Senior React Developer" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" rows={6} placeholder="Describe the role, responsibilities, and what success looks like..." required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="e.g. San Francisco, CA or Remote" />
              </div>
              <div className="space-y-2">
                <Label>Remote Policy</Label>
                <Select name="remote" defaultValue="true">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Remote</SelectItem>
                    <SelectItem value="false">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select name="type" defaultValue="FULL_TIME">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full-time</SelectItem>
                    <SelectItem value="PART_TIME">Part-time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select name="level" defaultValue="MID">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JUNIOR">Junior</SelectItem>
                    <SelectItem value="MID">Mid-level</SelectItem>
                    <SelectItem value="SENIOR">Senior</SelectItem>
                    <SelectItem value="LEAD">Lead</SelectItem>
                    <SelectItem value="EXECUTIVE">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Min Salary (USD)</Label>
                <Input id="salaryMin" name="salaryMin" type="number" placeholder="100000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Max Salary (USD)</Label>
                <Input id="salaryMax" name="salaryMax" type="number" placeholder="150000" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Add a requirement..." 
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req) => (
                <Badge key={req} variant="secondary" className="gap-1">
                  {req}
                  <button type="button" onClick={() => setRequirements(requirements.filter((r) => r !== req))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Add a skill..." 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Post Job
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/jobs")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

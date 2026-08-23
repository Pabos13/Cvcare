"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toast"
import { Save, Plus, X, Loader2 } from "lucide-react"

export function ProfileForm({ user, profile }: { user: any; profile: any }) {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<string[]>(profile.skills || [])
  const [newSkill, setNewSkill] = useState("")
  const isEmployer = user?.role === "EMPLOYER"

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      headline: formData.get("headline"),
      bio: formData.get("bio"),
      location: formData.get("location"),
      website: formData.get("website"),
      linkedin: formData.get("linkedin"),
      github: formData.get("github"),
      skills,
      salaryExpectation: formData.get("salaryExpectation") ? parseInt(formData.get("salaryExpectation") as string) : null,
      availability: formData.get("availability"),
      companyName: formData.get("companyName"),
      companySize: formData.get("companySize"),
      industry: formData.get("industry"),
    }

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        addToast("Profile saved successfully!", "success")
        router.refresh()
      } else throw new Error("Failed")
    } catch {
      addToast("Failed to save profile", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          {!isEmployer && <TabsTrigger value="preferences">Preferences</TabsTrigger>}
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user?.name || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" name="headline" defaultValue={profile.headline || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={profile.location || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" rows={4} defaultValue={profile.bio || ""} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Online Presence</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Website</Label><Input name="website" defaultValue={profile.website || ""} /></div>
              <div className="space-y-2"><Label>LinkedIn</Label><Input name="linkedin" defaultValue={profile.linkedin || ""} /></div>
              <div className="space-y-2"><Label>GitHub</Label><Input name="github" defaultValue={profile.github || ""} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill..." />
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
          {isEmployer && (
            <Card>
              <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Company Name</Label><Input name="companyName" defaultValue={profile.companyName || ""} /></div>
                <div className="space-y-2"><Label>Company Size</Label><Input name="companySize" defaultValue={profile.companySize || ""} /></div>
                <div className="space-y-2"><Label>Industry</Label><Input name="industry" defaultValue={profile.industry || ""} /></div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {!isEmployer && (
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Job Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Expected Salary (USD)</Label>
                  <Input name="salaryExpectation" type="number" defaultValue={profile.salaryExpectation || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Input name="availability" defaultValue={profile.availability || ""} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      <Button type="submit" disabled={loading} className="mt-6">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save Changes
      </Button>
    </form>
  )
}

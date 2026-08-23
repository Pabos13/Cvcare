import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Mail, Globe, Linkedin, Github, Briefcase, GraduationCap, Award } from "lucide-react"

async function getProfile(userId: string) {
  const profile = await db.profile.findUnique({
    where: { userId },
    include: { user: { select: { name: true, image: true, email: true } } },
  })
  return profile
}

export default async function CandidateDetailPage({ params }: { params: { id: string } }) {
  const profile = await getProfile(params.id)
  if (!profile) notFound()

  return (
    <div className="container py-8">
      <Link href="/candidates" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to candidates
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user?.name}`} />
              <AvatarFallback>{profile.user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{profile.user?.name || "Anonymous"}</h1>
              <p className="text-primary font-medium text-lg">{profile.headline || "Professional"}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                {profile.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile.location}</span>}
                {profile.availability && <Badge variant="outline">{profile.availability}</Badge>}
              </div>
            </div>
          </div>

          {profile.bio && (
            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">{profile.bio}</p></CardContent>
            </Card>
          )}

          <Tabs defaultValue="skills">
            <TabsList>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              {profile.experience && <TabsTrigger value="experience">Experience</TabsTrigger>}
              {profile.education && <TabsTrigger value="education">Education</TabsTrigger>}
            </TabsList>

            <TabsContent value="skills">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {profile.experience && (
              <TabsContent value="experience" className="space-y-4">
                {(profile.experience as any[]).map((work: any, i: number) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold">{work.title}</h3>
                          <p className="text-primary">{work.company}</p>
                          <p className="text-sm text-muted-foreground">{work.period}</p>
                          {work.description && <p className="text-sm text-muted-foreground mt-2">{work.description}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            )}

            {profile.education && (
              <TabsContent value="education" className="space-y-4">
                {(profile.education as any[]).map((edu: any, i: number) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold">{edu.school}</h3>
                          <p className="text-primary">{edu.degree} in {edu.field}</p>
                          <p className="text-sm text-muted-foreground">{edu.period}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <Button className="w-full" size="lg">Contact Candidate</Button>
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Availability</span><span className="font-medium">{profile.availability || "Not specified"}</span></div>
                {profile.salaryExpectation && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Expected Salary</span><span className="font-medium">${(profile.salaryExpectation / 1000).toFixed(0)}k</span></div>
                )}
              </div>
              <div className="pt-4 border-t space-y-2">
                {profile.user?.email && (
                  <a href={`mailto:${profile.user.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Mail className="h-4 w-4" /> {profile.user.email}
                  </a>
                )}
                {profile.website && (
                  <a href={`https://${profile.website}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Globe className="h-4 w-4" /> {profile.website}
                  </a>
                )}
                {profile.linkedin && (
                  <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a href={`https://${profile.github}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

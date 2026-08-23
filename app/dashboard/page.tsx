import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  Bell, 
  TrendingUp,
  ArrowRight,
  Loader2,
  Crown
} from "lucide-react"

export default async function DashboardOverviewPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const user = session.user
  const isEmployer = user.user_metadata?.role === "EMPLOYER"

  // Fetch real stats from database
  let stats = { jobs: 0, applications: 0, messages: 0, notifications: 0 }
  let recentJobs: any[] = []
  let recentApplications: any[] = []

  try {
    if (isEmployer) {
      const [jobsCount, appsCount, msgsCount, notifsCount, jobs] = await Promise.all([
        db.job.count({ where: { employerId: user.id } }),
        db.application.count({ where: { job: { employerId: user.id } } }),
        db.message.count({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } }),
        db.notification.count({ where: { userId: user.id, read: false } }),
        db.job.findMany({
          where: { employerId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { _count: { select: { applications: true } } },
        }),
      ])
      stats = { jobs: jobsCount, applications: appsCount, messages: msgsCount, notifications: notifsCount }
      recentJobs = jobs
    } else {
      const [appsCount, msgsCount, notifsCount, applications] = await Promise.all([
        db.application.count({ where: { candidateId: user.id } }),
        db.message.count({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } }),
        db.notification.count({ where: { userId: user.id, read: false } }),
        db.application.findMany({
          where: { candidateId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { job: { select: { title: true, company: true } } },
        }),
      ])
      stats = { jobs: appsCount, applications: appsCount, messages: msgsCount, notifications: notifsCount }
      recentApplications = applications
    }
  } catch (e) {
    // Fallback to empty state if DB not ready
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user.user_metadata?.name || user.email}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.jobs}</p>
                <p className="text-sm text-muted-foreground">{isEmployer ? "Active Jobs" : "Applications"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.applications}</p>
                <p className="text-sm text-muted-foreground">{isEmployer ? "Total Applications" : "Interviews"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.messages}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.notifications}</p>
                <p className="text-sm text-muted-foreground">Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="quick">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isEmployer ? "Your Recent Jobs" : "Your Applications"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEmployer ? (
                <div className="space-y-4">
                  {recentJobs.length > 0 ? recentJobs.map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job._count.applications} applications</p>
                      </div>
                      <Badge variant={job.status === "ACTIVE" ? "default" : "secondary"}>{job.status}</Badge>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-8">No jobs posted yet. <Link href="/dashboard/post-job" className="text-primary underline">Post your first job</Link></p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.length > 0 ? recentApplications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div>
                        <p className="font-medium">{app.job.title}</p>
                        <p className="text-sm text-muted-foreground">{app.job.company}</p>
                      </div>
                      <Badge variant={app.status === "PENDING" ? "secondary" : "default"}>{app.status}</Badge>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-8">No applications yet. <Link href="/jobs" className="text-primary underline">Browse jobs</Link></p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick">
          <div className="grid md:grid-cols-2 gap-4">
            {isEmployer ? (
              <>
                <Link href="/dashboard/post-job">
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Post a New Job</p>
                        <p className="text-sm text-muted-foreground">Reach thousands of candidates</p>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/candidates">
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Browse Candidates</p>
                        <p className="text-sm text-muted-foreground">Find top talent for your team</p>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              </>
            ) : (
              <>
                <Link href="/jobs">
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Browse Jobs</p>
                        <p className="text-sm text-muted-foreground">Find your next opportunity</p>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/profile">
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Edit Profile</p>
                        <p className="text-sm text-muted-foreground">Improve your matching score</p>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
            <Link href="/pricing">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">Upgrade Plan</p>
                    <p className="text-sm text-muted-foreground">Unlock premium features</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

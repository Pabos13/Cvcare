"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Briefcase, 
  MessageSquare, 
  Star, 
  CreditCard, 
  Bell,
  Check,
  Trash2
} from "lucide-react"

const mockNotifications = [
  { id: "1", type: "APPLICATION", title: "Application Update", content: "Your application for Senior React Developer has been moved to interview stage.", read: false, time: "2 min ago", link: "/dashboard/applications" },
  { id: "2", type: "MESSAGE", title: "New Message", content: "Sarah Chen from TechCorp sent you a message.", read: false, time: "15 min ago", link: "/dashboard/messages" },
  { id: "3", type: "JOB_MATCH", title: "New Job Match", content: "We found a new job matching your profile: Full Stack Developer at StartupXYZ (95% match).", read: false, time: "1 hour ago", link: "/jobs/5" },
  { id: "4", type: "SUBSCRIPTION", title: "Subscription Reminder", content: "Your Pro trial expires in 3 days. Upgrade now to keep premium features.", read: true, time: "3 hours ago", link: "/pricing" },
  { id: "5", type: "SYSTEM", title: "Profile Complete", content: "Great job! Your profile is 95% complete. Add a portfolio link to reach 100%.", read: true, time: "1 day ago", link: "/dashboard/profile" },
  { id: "6", type: "APPLICATION", title: "Application Rejected", content: "Unfortunately, your application for DevOps Engineer was not selected.", read: true, time: "2 days ago", link: "/dashboard/applications" },
]

const icons = {
  APPLICATION: Briefcase,
  MESSAGE: MessageSquare,
  JOB_MATCH: Star,
  SUBSCRIPTION: CreditCard,
  SYSTEM: Bell,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your career activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllRead}>
            <Check className="h-4 w-4 mr-2" /> Mark all read
          </Button>
          <Button variant="outline" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear all
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = icons[notif.type as keyof typeof icons]
          return (
            <Card key={notif.id} className={notif.read ? "opacity-70" : ""}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notif.read ? "bg-muted" : "bg-primary/10"
                }`}>
                  <Icon className={`h-5 w-5 ${notif.read ? "text-muted-foreground" : "text-primary"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{notif.title}</h3>
                    {!notif.read && <Badge variant="default" className="text-xs">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No notifications</h3>
            <p className="text-muted-foreground">You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}

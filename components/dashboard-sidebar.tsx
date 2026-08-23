"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  Bell,
  Settings,
  FileText,
  PlusCircle,
  Crown,
} from "lucide-react"

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const isEmployer = user.user_metadata?.role === "EMPLOYER"
  const plan = user.user_metadata?.plan || "FREE"

  const candidateLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/applications", label: "My Applications", icon: FileText },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: 5 },
    { href: "/dashboard/profile", label: "Profile", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const employerLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/dashboard/post-job", label: "Post Job", icon: PlusCircle },
    { href: "/dashboard/candidates", label: "Candidates", icon: Users },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badge: 2 },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: 4 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const links = isEmployer ? employerLinks : candidateLinks

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium truncate">{user.user_metadata?.name || user.email}</p>
          <div className="flex items-center gap-2">
            <Badge variant={plan === "PRO" ? "default" : "secondary"} className="text-xs">
              {plan}
            </Badge>
            {plan === "FREE" && (
              <Link href="/pricing">
                <Crown className="h-3 w-3 text-yellow-500" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <link.icon className="h-4 w-4" />
              {link.label}
            </div>
            {link.badge && (
              <Badge variant={pathname === link.href ? "secondary" : "default"} className="text-xs">
                {link.badge}
              </Badge>
            )}
          </Link>
        ))}
      </nav>

      {plan === "FREE" && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm font-medium mb-2">Upgrade to Pro</p>
          <p className="text-xs text-muted-foreground mb-3">
            Get unlimited applications, AI matching, and priority placement.
          </p>
          <Link href="/pricing">
            <Button size="sm" className="w-full">Upgrade Now</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

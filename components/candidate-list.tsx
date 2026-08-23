"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search } from "lucide-react"

export function CandidateList({ candidates }: { candidates: any[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {candidates.map((profile) => (
        <Card key={profile.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user?.name}`} />
                <AvatarFallback>{profile.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{profile.user?.name || "Anonymous"}</h3>
                <p className="text-primary font-medium">{profile.headline || "Professional"}</p>
                <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                  {profile.location && (
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile.location}</span>
                  )}
                  {profile.availability && <Badge variant="outline" className="text-xs">{profile.availability}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{profile.bio || "No bio provided"}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.skills.slice(0, 4).map((skill: string) => (
                    <span key={skill} className="text-xs bg-muted px-2 py-1 rounded-md">{skill}</span>
                  ))}
                  {profile.skills.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{profile.skills.length - 4} more</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  {profile.salaryExpectation && (
                    <span className="text-sm font-medium">${(profile.salaryExpectation / 1000).toFixed(0)}k expected</span>
                  )}
                  <Link href={`/candidates/${profile.userId}`}>
                    <Button size="sm">View Profile</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {candidates.length === 0 && (
        <div className="col-span-2 text-center py-20">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No candidates found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

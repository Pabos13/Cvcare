import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-muted-foreground">Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>support@careermatch.pro</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>123 Market St, San Francisco, CA 94105</span>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea rows={4} placeholder="How can we help?" />
            </div>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
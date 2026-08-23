import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    { q: "How do I create an account?", a: "Click 'Get Started' and fill in your details. You can sign up as a job seeker or employer." },
    { q: "Is CareerMatch free?", a: "Yes! We offer a free plan with essential features. Upgrade to Pro for advanced tools." },
    { q: "How does AI matching work?", a: "Our algorithm analyzes your skills, experience, and preferences to find the best job matches with 95% accuracy." },
    { q: "Can employers contact me directly?", a: "Yes, with a Pro plan employers can message you directly through our platform." },
    { q: "How do I delete my account?", a: "Go to Dashboard → Settings → Account and click 'Delete Account'." },
  ]

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Help Center</h1>
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search for help..." className="pl-10" />
      </div>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">{faq.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
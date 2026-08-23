import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

const tips = [
  { title: "Optimize Your Profile", items: ["Use a professional photo", "Write a compelling headline", "List all relevant skills", "Add quantifiable achievements"] },
  { title: "Network Effectively", items: ["Connect with industry leaders", "Join relevant groups", "Engage with content regularly", "Attend virtual events"] },
  { title: "Ace the Interview", items: ["Research the company thoroughly", "Prepare STAR method stories", "Ask insightful questions", "Follow up within 24 hours"] },
  { title: "Negotiate Salary", items: ["Know your market value", "Consider total compensation", "Practice your pitch", "Be confident but flexible"] },
]

export default function CareerTipsPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Career Tips</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {tips.map((tip, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tip.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
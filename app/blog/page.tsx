import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const posts = [
  { title: "10 Tips for a Standout Tech Resume", category: "Career Tips", date: "Jan 15, 2024", excerpt: "Learn how to craft a resume that gets noticed by top tech recruiters." },
  { title: "The Future of Remote Work in 2024", category: "Industry", date: "Jan 10, 2024", excerpt: "Remote work is here to stay. Discover the latest trends and predictions." },
  { title: "How to Prepare for Technical Interviews", category: "Interview", date: "Jan 5, 2024", excerpt: "A comprehensive guide to acing your next technical interview." },
  { title: "AI in Recruitment: What Candidates Need to Know", category: "AI", date: "Dec 28, 2023", excerpt: "Understanding how AI is changing the hiring landscape." },
]

export default function BlogPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CareerMatch Blog</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
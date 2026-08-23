"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Briefcase, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle2
} from "lucide-react"

const stats = [
  { label: "Active Jobs", value: "12,000+", icon: Briefcase },
  { label: "Companies", value: "3,500+", icon: Users },
  { label: "Successful Matches", value: "48,000+", icon: Zap },
  { label: "Countries", value: "45+", icon: Globe },
]

const features = [
  {
    icon: Zap,
    title: "AI-Powered Matching",
    description: "Our algorithm analyzes your skills, experience, and preferences to find the perfect job matches with 95% accuracy.",
  },
  {
    icon: Shield,
    title: "Verified Employers",
    description: "Every company is thoroughly vetted. No scams, no fake listings — only legitimate opportunities from trusted businesses.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth Analytics",
    description: "Track your application progress, get insights on skill gaps, and receive personalized career recommendations.",
  },
  {
    icon: Users,
    title: "Direct Messaging",
    description: "Connect directly with hiring managers. No middlemen, no delays — just transparent communication.",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    content: "CareerMatch found me my dream job in just 2 weeks. The AI matching is incredibly accurate!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "HR Director",
    company: "StartupXYZ",
    content: "We hired 5 amazing engineers through CareerMatch. The quality of candidates is unmatched.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Product Manager",
    company: "InnovateCo",
    content: "The platform is intuitive and the matching algorithm actually works. Highly recommended!",
    rating: 5,
  },
]

const featuredJobs = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    remote: true,
    type: "Full-time",
    salary: "$140k - $180k",
    skills: ["React", "TypeScript", "Node.js"],
    featured: true,
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignStudio",
    location: "New York, NY",
    remote: true,
    type: "Full-time",
    salary: "$100k - $140k",
    skills: ["Figma", "UI/UX", "Design Systems"],
    featured: true,
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudSystems",
    location: "Austin, TX",
    remote: false,
    type: "Full-time",
    salary: "$130k - $160k",
    skills: ["AWS", "Kubernetes", "Terraform"],
    featured: false,
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "DataDriven",
    location: "Remote",
    remote: true,
    type: "Contract",
    salary: "$120k - $150k",
    skills: ["Python", "ML", "SQL"],
    featured: false,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              🚀 Now with AI-Powered Matching
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your{" "}
              <span className="text-primary">Dream Career</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              The most intelligent job matching platform. We connect exceptional talent 
              with world-class companies using advanced AI algorithms.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href={`/jobs?q=${encodeURIComponent(searchQuery)}`}>
                <Button size="lg" className="h-12 px-8">
                  Search Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span>Popular:</span>
              {["React", "Python", "Product Manager", "Designer", "DevOps"].map((tag) => (
                <Link
                  key={tag}
                  href={`/jobs?q=${tag}`}
                  className="hover:text-primary underline underline-offset-4"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <stat.icon className="h-8 w-8 text-primary mb-2" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Jobs</h2>
              <p className="text-muted-foreground mt-1">Hand-picked opportunities from top companies</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline">View All Jobs</Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredJobs.map((job) => (
              <Card key={job.id} className={job.featured ? "border-primary/50" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    {job.featured && <Badge>Featured</Badge>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    {job.remote && <Badge variant="outline">Remote</Badge>}
                    <Badge variant="outline">{job.location}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="text-xs bg-muted px-2 py-1 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-primary">{job.salary}</span>
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm">Apply Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">Why CareerMatch?</h2>
            <p className="text-muted-foreground mt-4">
              We go beyond traditional job boards. Our platform uses cutting-edge technology 
              to ensure every match is meaningful.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-none bg-background">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-4">
              Get started in minutes and land your dream job faster than ever.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Sign up and build your profile with skills, experience, and career goals.",
              },
              {
                step: "02",
                title: "Get Matched",
                description: "Our AI analyzes your profile and matches you with relevant opportunities.",
              },
              {
                step: "03",
                title: "Apply & Connect",
                description: "Apply with one click and connect directly with hiring managers.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-primary/10 absolute -top-4 left-0">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">Loved by Thousands</h2>
            <p className="text-muted-foreground mt-4">
              See what our users say about their CareerMatch experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&ldquo;{t.content}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role} at {t.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl bg-primary p-8 md:p-16 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Accelerate Your Career?</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Join 50,000+ professionals who found their dream jobs through CareerMatch. 
              Start free and upgrade when you are ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  View Pricing
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/80">
              {["No credit card required", "Free forever plan", "Cancel anytime"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

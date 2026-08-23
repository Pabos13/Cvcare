export default function AboutPage() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About CareerMatch</h1>
      <div className="prose prose-sm max-w-none space-y-4">
        <p className="text-lg text-muted-foreground">CareerMatch is the most intelligent career platform, connecting exceptional talent with world-class companies using advanced AI technology.</p>
        <p>Founded in 2024, we have helped over 50,000 professionals find their dream jobs and assisted 3,500+ companies in building their dream teams.</p>
        <p>Our mission is to make job searching and hiring efficient, transparent, and human-centered. We believe that the right match can change a life and transform a company.</p>
        <h2 className="text-2xl font-bold mt-8">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Transparency:</strong> No hidden fees, no fake listings. Every job is verified.</li>
          <li><strong>Efficiency:</strong> AI-powered matching saves time for both candidates and employers.</li>
          <li><strong>Privacy:</strong> Your data belongs to you. We never sell personal information.</li>
          <li><strong>Growth:</strong> We help you build a career, not just find a job.</li>
        </ul>
      </div>
    </div>
  )
}
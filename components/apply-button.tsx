"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { Send, Loader2, Check } from "lucide-react"

export function ApplyButton({ jobId, hasApplied }: { jobId: string; hasApplied: boolean }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(hasApplied)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          coverLetter: formData.get("coverLetter"),
        }),
      })

      if (res.ok) {
        setApplied(true)
        setOpen(false)
        addToast("Application submitted successfully!", "success")
      } else {
        const data = await res.json()
        addToast(data.error || "Failed to apply", "error")
      }
    } catch {
      addToast("Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  if (applied) {
    return (
      <Button className="w-full" size="lg" disabled variant="outline">
        <Check className="h-4 w-4 mr-2" /> Applied
      </Button>
    )
  }

  return (
    <>
      <Button className="w-full" size="lg" onClick={() => setOpen(true)}>
        <Send className="h-4 w-4 mr-2" /> Apply Now
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for this position</DialogTitle>
            <DialogDescription>Submit your application. Make sure your profile is up to date.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
              <Textarea id="coverLetter" name="coverLetter" placeholder="Tell us why you are a great fit..." rows={4} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

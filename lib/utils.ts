import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateMatchScore(candidateSkills: string[], jobSkills: string[]): number {
  if (!jobSkills.length) return 0
  const matched = candidateSkills.filter((skill) =>
    jobSkills.some((js) => js.toLowerCase() === skill.toLowerCase())
  )
  return Math.round((matched.length / jobSkills.length) * 100)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

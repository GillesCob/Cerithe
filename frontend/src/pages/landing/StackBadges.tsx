import { Badge } from "@/components/ui/badge"

const STACK = [
  "Node.js",
  "TypeScript",
  "Express",
  "Prisma",
  "PostgreSQL",
  "React",
  "Supabase",
  "JWT",
  "Zod",
  "argon2",
]

export default function StackBadges() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {STACK.map((tech) => (
        <Badge
          key={tech}
          variant="outline"
          className="border-cerithe-navy/30 text-cerithe-navy text-sm px-3 py-1 font-medium"
        >
          {tech}
        </Badge>
      ))}
    </div>
  )
}

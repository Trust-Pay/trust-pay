import type React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  from?: string
  via?: string
  to?: string
  className?: string
  preset?: "gold" | "bitcoin" | "ethereum" | "blue-purple" | "green-blue" | "orange-pink"
}

export function GradientText({ children, from, via, to, className, preset }: GradientTextProps) {
  let gradientStyle = {}
  let gradientClass = "bg-clip-text text-transparent"

  if (preset === "gold") {
    gradientClass += " bg-gold-gradient"
  } else if (preset === "bitcoin") {
    gradientClass += " bg-bitcoin-gradient"
  } else if (preset === "ethereum") {
    gradientClass += " bg-ethereum-gradient"
  } else if (preset === "blue-purple") {
    gradientClass += " bg-blue-purple-gradient"
  } else if (preset === "green-blue") {
    gradientClass += " bg-green-blue-gradient"
  } else if (preset === "orange-pink") {
    gradientClass += " bg-orange-pink-gradient"
  } else if (from && to) {
    if (via) {
      gradientStyle = {
        backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
      }
    } else {
      gradientStyle = {
        backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
      }
    }
  } else {
    // Default gradient
    gradientClass += " bg-blue-purple-gradient"
  }

  return (
    <span className={cn(gradientClass, className)} style={gradientStyle}>
      {children}
    </span>
  )
}

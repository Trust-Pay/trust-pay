"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark" | "light"
  hoverEffect?: boolean
  borderGradient?: boolean
  animate?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { className, variant = "default", hoverEffect = true, borderGradient = false, animate = true, children, ...props },
    ref,
  ) => {
    const baseClasses = "rounded-xl backdrop-blur-md shadow-lg overflow-hidden"

    let variantClasses = "bg-white/20 border border-white/30"
    if (variant === "dark") {
      variantClasses = "bg-black/20 border border-white/10"
    } else if (variant === "light") {
      variantClasses = "bg-white/40 border border-white/50"
    }

    const gradientBorderClass = borderGradient ? "gradient-border" : ""

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, variantClasses, gradientBorderClass, className)}
        whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
GlassCard.displayName = "GlassCard"

export { GlassCard }

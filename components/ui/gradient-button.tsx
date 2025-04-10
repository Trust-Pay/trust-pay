"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "text-white shadow-lg gradient-border",
        bitcoin: "text-white shadow-lg gradient-border",
        ethereum: "text-white shadow-lg gradient-border",
        glass: "glass text-white shadow-lg",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  gradientFrom?: string
  gradientTo?: string
  gradientVia?: string
  hoverScale?: number
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, gradientFrom, gradientTo, gradientVia, hoverScale = 1.05, children, ...props }, ref) => {
    let gradientStyle = {}

    if (gradientFrom && gradientTo) {
      if (gradientVia) {
        gradientStyle = {
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
        }
      } else {
        gradientStyle = {
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }
      }
    } else if (variant === "gold") {
      gradientStyle = {
        background: "linear-gradient(135deg, #FFD700, #D4AF37, #996515)",
      }
    } else if (variant === "bitcoin") {
      gradientStyle = {
        background: "linear-gradient(135deg, #F7931A, #CB7B16)",
      }
    } else if (variant === "ethereum") {
      gradientStyle = {
        background: "linear-gradient(135deg, #8A92B2, #627EEA, #3C3C3D)",
      }
    }

    return (
      <motion.button
        whileHover={{ scale: hoverScale }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={gradientStyle}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)
GradientButton.displayName = "GradientButton"

export { GradientButton, buttonVariants }


"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
  className,
  ...props
}: CircularProgressProps) {
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2)
  const progress = value / 100
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="rotate-[-90deg]"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        stroke="currentColor"
      >
        <circle
          className="opacity-20"
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm">
        {Math.round(value)}%
      </div>
    </div>
  )
}
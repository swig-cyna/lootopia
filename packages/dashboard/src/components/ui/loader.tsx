import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@lootopia/dashboard/lib/utils"

const loaderVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-3",
      default: "size-4",
      lg: "size-5",
      xl: "size-6",
    },
    color: {
      current: "text-current",
      primary: "text-primary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "default",
    color: "current",
  },
})

function Loader({
  className,
  size,
  color,
}: VariantProps<typeof loaderVariants> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(loaderVariants({ size, color }), className)}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export { Loader, loaderVariants }

import { TooltipProvider } from "@lootopia/dashboard/components/ui/tooltip"
import "@lootopia/dashboard/index.css"
import queryClient from "@lootopia/dashboard/lib/queryClient"
import Router from "@lootopia/dashboard/router"
import { QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

const rootElement = document.getElementById("root")

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
} else {
  throw new Error("Root element not found")
}

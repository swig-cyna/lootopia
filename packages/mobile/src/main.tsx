import { TooltipProvider } from "@lootopia/mobile/components/ui/tooltip"
import "@lootopia/mobile/index.css"
import queryClient from "@lootopia/mobile/lib/queryClient"
import Router from "@lootopia/mobile/router"
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

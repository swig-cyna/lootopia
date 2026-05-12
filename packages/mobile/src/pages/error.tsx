import { Button } from "@lootopia/mobile/components/ui/button"
import { useNavigate } from "react-router"

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
      <p className="text-5xl font-bold">500</p>
      <p className="text-lg font-medium">Something went wrong</p>
      <p className="text-muted-foreground max-w-sm text-sm">
        An unexpected error occurred. Please try again later.
      </p>
      <Button variant="outline" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </main>
  )
}

export default ErrorPage

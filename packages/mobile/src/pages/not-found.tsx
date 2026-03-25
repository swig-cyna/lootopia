import { Button } from "@lootopia/mobile/components/ui/button"
import { useNavigate } from "react-router"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-svh flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-5xl font-bold">404</p>
      <p className="text-lg font-medium">Page not found</p>
      <p className="text-sm text-muted-foreground max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="outline" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </main>
  )
}

export default NotFoundPage

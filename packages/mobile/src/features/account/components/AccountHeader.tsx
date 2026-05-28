import { Button } from "@lootopia/mobile/components/ui/button"
import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router"

const AccountHeader = () => {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/signin")
        },
      },
    })
  }

  const initial = session?.user.name?.charAt(0).toUpperCase() ?? "?"

  return (
    <div className="flex items-center gap-4">
      <div className="bg-primary text-primary-foreground flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-bold">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{session?.user.name}</p>
        <p className="text-muted-foreground truncate text-sm">
          {session?.user.email}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSignOut}>
        <LogOut className="size-5" />
      </Button>
    </div>
  )
}

export default AccountHeader

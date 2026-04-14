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

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground text-sm mt-1">
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

import SigninForm from "@lootopia/mobile/features/auth/components/SigninForm"
import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { Navigate } from "react-router"

const SigninPage = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return null
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <img src="/logo.svg" alt="Lootopia" className="mb-4 h-14" />
      <SigninForm />
    </main>
  )
}

export default SigninPage

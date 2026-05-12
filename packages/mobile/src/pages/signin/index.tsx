import SigninForm from "@lootopia/mobile/features/auth/components/SigninForm"

const SigninPage = () => (
  <main className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-4">
    <img src="/logo.svg" alt="Lootopia" className="mb-4 h-14" />
    <SigninForm />
  </main>
)

export default SigninPage

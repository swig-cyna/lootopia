import SignupForm from "@lootopia/mobile/features/auth/components/SignupForm"

const SignupPage = () => (
  <main className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-4">
    <img src="/logo.svg" alt="Lootopia" className="mb-4 h-14" />
    <SignupForm />
  </main>
)

export default SignupPage

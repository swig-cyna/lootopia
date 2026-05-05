import SigninForm from "@lootopia/mobile/features/auth/components/SigninForm"

const SigninPage = () => (
  <main className="min-h-svh flex flex-col justify-center items-center gap-6 relative p-4">
    <img src="/logo.svg" alt="Lootopia" className="h-14 mb-4" />
    <SigninForm />
  </main>
)

export default SigninPage

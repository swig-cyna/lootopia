import SigninForm from "@lootopia/dashboard/features/auth/components/SigninForm"

const SigninPage = () => (
  <main
    className="min-h-svh flex flex-col justify-center items-center gap-6 relative bg-amber-100/50"
    style={{
      backgroundImage: "url('/img/noise-pattern.svg')",
      backgroundRepeat: "repeat",
      backgroundSize: "600px 600px",
    }}
  >
    <img src="/logo.svg" alt="Lootopia" className="h-10" />
    <SigninForm />
  </main>
)

export default SigninPage

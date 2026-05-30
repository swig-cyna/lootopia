import { Separator } from "@lootopia/mobile/components/ui/separator"
import AccountHeader from "@lootopia/mobile/features/account/components/AccountHeader"
import ChangeEmailForm from "@lootopia/mobile/features/account/components/ChangeEmailForm"
import ChangePasswordForm from "@lootopia/mobile/features/account/components/ChangePasswordForm"
import ProfileForm from "@lootopia/mobile/features/account/components/ProfileForm"
import { KeyRound, UserRound } from "lucide-react"

const SectionTitle = ({
  icon: Icon,
  label,
}: {
  icon: typeof UserRound
  label: string
}) => (
  <div className="flex items-center gap-2">
    <Icon className="text-muted-foreground size-4" />
    <h2 className="text-sm font-semibold uppercase tracking-wide">{label}</h2>
  </div>
)

const AccountPage = () => (
  <div className="flex w-full flex-1 flex-col gap-6">
    <AccountHeader />

    <div className="flex flex-col gap-4">
      <SectionTitle icon={UserRound} label="Personal info" />
      <ProfileForm />
      <Separator />
      <ChangeEmailForm />
    </div>

    <Separator />

    <div className="flex flex-col gap-4">
      <SectionTitle icon={KeyRound} label="Security" />
      <ChangePasswordForm />
    </div>
  </div>
)

export default AccountPage

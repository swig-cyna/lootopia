import { Separator } from "@lootopia/mobile/components/ui/separator"
import AccountHeader from "@lootopia/mobile/features/account/components/AccountHeader"
import ChangeEmailForm from "@lootopia/mobile/features/account/components/ChangeEmailForm"
import ChangePasswordForm from "@lootopia/mobile/features/account/components/ChangePasswordForm"
import ProfileForm from "@lootopia/mobile/features/account/components/ProfileForm"

const AccountPage = () => (
  <div className="flex w-full flex-1 flex-col gap-6">
    <AccountHeader />
    <ProfileForm />
    <Separator />
    <ChangeEmailForm />
    <Separator />
    <ChangePasswordForm />
  </div>
)

export default AccountPage

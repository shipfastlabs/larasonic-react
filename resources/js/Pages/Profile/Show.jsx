import { Separator } from '@/Components/shadcn/ui/separator'
import AppLayout from '@/Layouts/AppLayout'
import { usePage } from '@inertiajs/react'
import { memo } from 'react'
import DeleteUserForm from './Partials/DeleteUserForm'
import LinkedAccountsForm from './Partials/LinkedAccountsForm'
import LogoutOtherBrowserSessionsForm from './Partials/LogoutOtherBrowserSessionsForm'
import TwoFactorAuthenticationForm from './Partials/TwoFactorAuthenticationForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'

const defaultSessions = []
const defaultProviders = []
const defaultOauthProviders = []

export default memo(({
  sessions = defaultSessions,
  confirmsTwoFactorAuthentication = false,
  availableProviders = defaultProviders,
  activeOauthProviders = defaultOauthProviders,
}) => {
  const { props: { jetstream, auth: { user } } } = usePage()

  return (
    <AppLayout title="Settings">
      <div>
        <div className="max-w-7xl">
          {jetstream.canUpdateProfileInformation && (
            <div>
              <UpdateProfileInformationForm user={user} />
            </div>
          )}

          {Object.keys(availableProviders).length > 0 && (
            <>
              <Separator className="hidden my-8 sm:block" />
              <div>
                <LinkedAccountsForm
                  className="mt-10 sm:mt-0"
                  availableProviders={availableProviders}
                  activeProviders={activeOauthProviders}
                />
              </div>
            </>
          )}

          {jetstream.canUpdatePassword && (
            <>
              <Separator className="hidden my-8 sm:block" />
              <div>
                <UpdatePasswordForm className="mt-10 sm:mt-0" />
              </div>
            </>
          )}

          {jetstream.canManageTwoFactorAuthentication && (
            <>
              <Separator className="hidden my-8 sm:block" />
              <div>
                <TwoFactorAuthenticationForm
                  className="mt-10 sm:mt-0"
                  requiresConfirmation={confirmsTwoFactorAuthentication}
                />
              </div>
            </>
          )}

          {sessions.length > 0 && (
            <>
              <Separator className="hidden my-8 sm:block" />
              <div>
                <LogoutOtherBrowserSessionsForm
                  sessions={sessions}
                  className="mt-10 sm:mt-0"
                />
              </div>
            </>
          )}

          {jetstream.hasAccountDeletionFeatures && (
            <>
              <Separator className="hidden my-8 sm:block" />
              <div>
                <DeleteUserForm className="mt-10 sm:mt-0" />
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
})

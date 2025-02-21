import ActionSection from '@/Components/ActionSection'
import ConfirmsPassword from '@/Components/ConfirmsPassword'
import { Button } from '@/Components/shadcn/ui/button'
import { Icon } from '@iconify/react'
import { useForm } from '@inertiajs/react'
import { memo } from 'react'
import { toast } from 'sonner'
import { route } from 'ziggy-js'

const DEFAULT_SESSIONS = []

export default memo(({ sessions = DEFAULT_SESSIONS }) => {
  const { delete: destroy, transform, reset } = useForm({
    password: '',
  })

  const logoutOtherBrowserSessions = (password) => {
    transform(data => ({
      ...data,
      password,
    }))

    destroy(route('other-browser-sessions.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Logged out of other browser sessions')
        reset()
      },
      onFinish: () => reset(),
    })
  }

  return (
    <ActionSection
      title="Browser Sessions"
      description="Manage and log out your active sessions on other browsers and devices."
      content={(
        <>
          <div className="max-w-xl text-sm">
            If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.
          </div>

          {sessions.length > 0 && (
            <div className="mt-5 space-y-6">
              {sessions.map(session => (
                <div key={`${session.ip_address}-${session.last_active}`} className="flex items-center">
                  <div>
                    {session.agent.is_desktop
                      ? (
                          <Icon icon="lucide:laptop" className="size-8" />
                        )
                      : (
                          <Icon icon="lucide:tablet-smartphone" className="size-8" />
                        )}
                  </div>

                  <div className="ms-3">
                    <div className="text-sm">
                      {session.agent.platform ? session.agent.platform : 'Unknown'}
                      {' '}
                      -
                      {session.agent.browser ? session.agent.browser : 'Unknown'}
                    </div>

                    <div>
                      <div className="text-xs">
                        {session.ip_address}
                        ,
                        {session.is_current_device
                          ? (
                              <span className="font-semibold text-green-400">This device</span>
                            )
                          : (
                              <span>
                                Last active
                                {session.last_active}
                              </span>
                            )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center mt-5">
            <ConfirmsPassword
              title="Log Out Other Browser Sessions"
              content="Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices."
              button="Log Out Other Browser Sessions"
              onConfirmed={logoutOtherBrowserSessions}
            >
              <Button>
                Log Out Other Browser Sessions
              </Button>
            </ConfirmsPassword>
          </div>
        </>
      )}
    >
    </ActionSection>
  )
})

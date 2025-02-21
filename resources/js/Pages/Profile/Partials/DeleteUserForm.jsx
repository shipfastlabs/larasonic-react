import ActionSection from '@/Components/ActionSection'
import ConfirmsPassword from '@/Components/ConfirmsPassword'
import { Button } from '@/Components/shadcn/ui/button'
import { useForm } from '@inertiajs/react'
import { memo } from 'react'
import { route } from 'ziggy-js'

export default memo(() => {
  const { delete: destroy, transform, reset } = useForm({})

  const deleteUser = (password) => {
    transform(data => ({
      ...data,
      password,
    }))

    destroy(route('current-user.destroy'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onFinish: () => reset(),
    })
  }

  return (
    <ActionSection
      title="Delete Account"
      description="Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain."
      content={(
        <>
          <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
            Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
          </div>

          <div className="mt-5">
            <ConfirmsPassword
              title="Delete Account"
              content="Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm."
              button="Delete Account"
              onConfirmed={deleteUser}
            >
              <Button variant="destructive">
                Delete Account
              </Button>
            </ConfirmsPassword>
          </div>
        </>
      )}
    >
    </ActionSection>
  )
})

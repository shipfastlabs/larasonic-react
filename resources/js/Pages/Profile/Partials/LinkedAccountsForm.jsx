import ActionSection from '@/Components/ActionSection'
import { Label } from '@/Components/shadcn/ui/label'
import { Switch } from '@/Components/shadcn/ui/switch'
import { Icon } from '@iconify/react'
import { router, usePage } from '@inertiajs/react'
import { memo, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { route } from 'ziggy-js'

const defaultProps = {
  availableProviders: {},
  activeProviders: [],
}

export default memo(({ availableProviders = defaultProps.availableProviders, activeProviders = defaultProps.activeProviders }) => {
  const { props: { flash } } = usePage()
  const [loadingProvider, setLoadingProvider] = useState(null)

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const toggleLink = (provider) => {
    setLoadingProvider(provider)
    if (!activeProviders.includes(provider)) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 1000)),
        {
          loading: 'Redirecting to provider...',
        },
      )
      window.location.href = route('oauth.redirect', { provider })
      return
    }

    router.delete(route('oauth.destroy', { provider }), {
      preserveScroll: true,
      onBefore: () => {
        toast.promise(
          new Promise(resolve => setTimeout(resolve, 1000)),
          {
            loading: 'Unlinking account...',
          },
        )
      },
      onSuccess: () => {
        setTimeout(() => {
          toast.success(flash.success)
        }, 1000)
      },
      onError: () => {
        toast.error(flash.message)
      },
      onFinish: () => {
        setLoadingProvider(null)
      },
    })
  }

  return (
    <ActionSection
      title="Linked Accounts"
      description="Manage your linked social accounts for easier login access."
      content={(
        <>
          <div className="max-w-xl text-sm">
            Link your accounts to enable single sign-on and manage your connected social profiles.
          </div>

          <div>
            {Object.entries(availableProviders).map(([slug, provider]) => (
              <div
                key={slug}
                className="flex items-center p-4 mt-4 space-x-4 rounded-md border"
              >
                <Icon icon={provider.icon} className="size-8" />
                <div className="flex-1 space-y-1">
                  <Label>
                    {provider.slug.charAt(0).toUpperCase() + provider.slug.slice(1)}
                  </Label>
                </div>
                <Switch
                  disabled={loadingProvider}
                  checked={activeProviders.includes(provider.slug)}
                  onCheckedChange={() => toggleLink(provider.slug)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    >
    </ActionSection>
  )
})

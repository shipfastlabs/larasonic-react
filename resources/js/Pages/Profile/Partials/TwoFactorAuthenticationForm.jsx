/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import ActionSection from '@/Components/ActionSection'
import ConfirmsPassword from '@/Components/ConfirmsPassword'
import InputError from '@/Components/InputError'
import { Button } from '@/Components/shadcn/ui/button'
import { Input } from '@/Components/shadcn/ui/input'
import { Label } from '@/Components/shadcn/ui/label'
import { router, useForm, usePage } from '@inertiajs/react'
import axios from 'axios'
import { memo, useEffect, useState } from 'react'
import { route } from 'ziggy-js'

export default memo(({ requiresConfirmation }) => {
  const {
    props: {
      auth: { user },
    },
  } = usePage()
  const [enabling, setEnabling] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [disabling, setDisabling] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [setupKey, setSetupKey] = useState(null)
  const [recoveryCodes, setRecoveryCodes] = useState([])

  const confirmationForm = useForm({
    code: '',
  })

  const { reset, clearErrors } = confirmationForm

  const twoFactorEnabled = !enabling && user?.two_factor_enabled

  useEffect(() => {
    if (!twoFactorEnabled) {
      reset()
      clearErrors()
    }
  }, [twoFactorEnabled, reset, clearErrors])

  const showQrCode = () => {
    return axios.get(route('two-factor.qr-code')).then((response) => {
      setQrCode(response.data.svg)
    })
  }

  const showSetupKey = () => {
    return axios.get(route('two-factor.secret-key')).then((response) => {
      setSetupKey(response.data.secretKey)
    })
  }

  const showRecoveryCodes = () => {
    return axios
      .get(route('two-factor.recovery-codes'))
      .then((response) => {
        setRecoveryCodes(response.data)
      })
  }

  const enableTwoFactorAuthentication = () => {
    setEnabling(true)

    router.post(
      route('two-factor.enable'),
      {},
      {
        preserveScroll: true,
        onSuccess: () =>
          Promise.all([
            showQrCode(),
            showSetupKey(),
            showRecoveryCodes(),
          ]),
        onFinish: () => {
          setEnabling(false)
          setConfirming(requiresConfirmation)
        },
      },
    )
  }

  const confirmTwoFactorAuthentication = () => {
    confirmationForm.post(route('two-factor.confirm'), {
      errorBag: 'confirmTwoFactorAuthentication',
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setConfirming(false)
        setQrCode(null)
        setSetupKey(null)
      },
    })
  }

  const regenerateRecoveryCodes = () => {
    axios
      .post(route('two-factor.recovery-codes'))
      .then(() => showRecoveryCodes())
  }

  const disableTwoFactorAuthentication = () => {
    setDisabling(true)

    router.delete(route('two-factor.disable'), {
      preserveScroll: true,
      onSuccess: () => {
        setDisabling(false)
        setConfirming(false)
      },
    })
  }

  return (
    <ActionSection
      title="Two Factor Authentication"
      description="Add additional security to your account using two factor authentication."
      content={(
        <>
          <h3 className="text-lg font-medium">
            {twoFactorEnabled && !confirming
              ? 'You have enabled two factor authentication.'
              : twoFactorEnabled && confirming
                ? 'Finish enabling two factor authentication.'
                : 'You have not enabled two factor authentication.'}
          </h3>

          <div className="mt-3 max-w-xl text-sm">
            <p>
              When two factor authentication is enabled, you will
              be prompted for a secure, random token during
              authentication. You may retrieve this token from
              your phone's Google Authenticator application.
            </p>
          </div>

          {twoFactorEnabled && (
            <>
              {qrCode && (
                <div>
                  <div className="mt-4 max-w-xl text-sm">
                    <p className="font-semibold">
                      {confirming
                        ? 'To finish enabling two factor authentication, scan the following QR code using your phone\'s authenticator application or enter the setup key and provide the generated OTP code.'
                        : 'Two factor authentication is now enabled. Scan the following QR code using your phone\'s authenticator application or enter the setup key.'}
                    </p>
                  </div>

                  <div className="mt-4 max-w-xl text-sm text-gray-600">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: qrCode,
                      }}
                    />
                  </div>

                  {setupKey && (
                    <div className="mt-4 max-w-xl text-sm">
                      <p className="font-semibold">
                        Setup Key:
                        {' '}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: setupKey,
                          }}
                        />
                      </p>
                    </div>
                  )}

                  {confirming && (
                    <div className="mt-4">
                      <Label htmlFor="code">Code</Label>
                      <Input
                        id="code"
                        type="text"
                        value={
                          confirmationForm.data.code
                        }
                        onChange={e =>
                          confirmationForm.setData(
                            'code',
                            e.target.value,
                          )}
                        className="block mt-1 w-1/2"
                        inputMode="numeric"
                        autoFocus
                        autoComplete="one-time-code"
                        onKeyUp={e =>
                          e.key === 'Enter'
                          && confirmTwoFactorAuthentication()}
                      />
                      <InputError
                        message={
                          confirmationForm.errors.code
                        }
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              )}

              {recoveryCodes.length > 0 && !confirming && (
                <div>
                  <div className="mt-4 max-w-xl text-sm text-gray-600">
                    {recoveryCodes.map(code => (
                      <div key={code}>{code}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-5">
            {!twoFactorEnabled
              ? (
                  <ConfirmsPassword
                    onConfirmed={enableTwoFactorAuthentication}
                  >
                    <Button
                      type="button"
                      disabled={enabling}
                      className={enabling ? 'opacity-25' : ''}
                    >
                      Enable
                    </Button>
                  </ConfirmsPassword>
                )
              : (
                  <div className="space-x-3">
                    {confirming && (
                      <ConfirmsPassword
                        onConfirmed={
                          confirmTwoFactorAuthentication
                        }
                      >
                        <Button
                          type="button"
                          disabled={enabling}
                          className={
                            enabling ? 'opacity-25' : ''
                          }
                        >
                          Confirm
                        </Button>
                      </ConfirmsPassword>
                    )}

                    {recoveryCodes.length > 0 && !confirming && (
                      <ConfirmsPassword
                        onConfirmed={regenerateRecoveryCodes}
                      >
                        <Button variant="secondary">
                          Regenerate Recovery Codes
                        </Button>
                      </ConfirmsPassword>
                    )}

                    {recoveryCodes.length === 0 && !confirming && (
                      <ConfirmsPassword
                        onConfirmed={showRecoveryCodes}
                      >
                        <Button variant="secondary">
                          Show Recovery Codes
                        </Button>
                      </ConfirmsPassword>
                    )}

                    {confirming
                      ? (
                          <ConfirmsPassword
                            onConfirmed={
                              disableTwoFactorAuthentication
                            }
                          >
                            <Button
                              variant="secondary"
                              disabled={disabling}
                              className={
                                disabling ? 'opacity-25' : ''
                              }
                            >
                              Cancel
                            </Button>
                          </ConfirmsPassword>
                        )
                      : (
                          <ConfirmsPassword
                            onConfirmed={
                              disableTwoFactorAuthentication
                            }
                          >
                            <Button
                              variant="destructive"
                              disabled={disabling}
                              className={
                                disabling ? 'opacity-25' : ''
                              }
                            >
                              Disable
                            </Button>
                          </ConfirmsPassword>
                        )}
                  </div>
                )}
          </div>
        </>
      )}
    >
    </ActionSection>
  )
})

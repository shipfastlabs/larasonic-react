import { cn } from '@/Components/lib/utils'
import { Check, Copy } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

export default memo(() => {
  const [terminalStep, setTerminalStep] = useState(0)
  const [copied, setCopied] = useState(false)

  const terminalSteps = [
    'git clone https://github.com/shipfastlabs/larasonic-react',
    'cd larasonic && composer install',
    './vendor/bin/sail up',
    './vendor/bin/sail composer setup',
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setTerminalStep(prev =>
        prev < terminalSteps.length - 1 ? prev + 1 : prev,
      )
    }, 500)

    return () => clearTimeout(timer)
  }, [terminalStep, terminalSteps.length])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(terminalSteps.join(' && '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full rounded-lg shadow-lg overflow-hidden border border-muted text-white font-mono text-sm relative">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <button
            type="button"
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied
              ? (
                  <Check className="h-5 w-5" />
                )
              : (
                  <Copy className="h-5 w-5" />
                )}
          </button>
        </div>
        <div className="space-y-2">
          {terminalSteps.map((step, index) => (
            <div
              key={step}
              className={cn(
                'transition-opacity duration-300 text-foreground',
                index > terminalStep ? 'opacity-0' : 'opacity-100',
              )}
            >
              <span className="text-green-400 dark:text-green-500">$</span>
              {' '}
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

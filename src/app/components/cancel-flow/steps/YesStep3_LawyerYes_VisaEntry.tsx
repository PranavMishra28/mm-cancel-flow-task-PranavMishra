'use client'

import { useState } from 'react'

interface VisaData {
  immigration_support: 'yes' | 'no'
  visa_type: string
}

interface Props {
  onNext: (data: VisaData) => void
  onBack: () => void
  onClose: () => void
  initialData?: Partial<VisaData>
}

export default function YesStep3_LawyerYes_VisaEntry({ 
  onNext, 
  onBack, 
  onClose,
  initialData = {}
}: Props) {
  const [immigrationSupport, setImmigrationSupport] = useState<'yes' | 'no'>(
    initialData.immigration_support || 'yes'
  )
  const [visaType, setVisaType] = useState(initialData.visa_type || '')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const trimmedVisa = visaType.trim()
    if (immigrationSupport === 'yes' && !trimmedVisa) {
      setError('Please enter your visa type.')
      return
    }
    
    setError('')
    onNext({
      immigration_support: immigrationSupport,
      visa_type: trimmedVisa
    })
  }

  const isValid = immigrationSupport === 'yes' && visaType.trim().length > 0

  return (
    <div className="flex flex-col">
      {/* Title */}
      <h1 className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900">
        We helped you land the job, now let's help you secure your visa.
      </h1>

      {/* Radio group */}
      <fieldset className="mt-3">
        <legend className="text-base font-medium text-neutral-900">
          Is your company providing an immigration lawyer to help with your visa?
        </legend>
        
        <div className="mt-3 space-y-3">
          <label className="inline-flex items-center gap-2 text-[15px] text-neutral-900">
            <input
              type="radio"
              name="immigration-support"
              value="yes"
              checked={immigrationSupport === 'yes'}
              onChange={() => setImmigrationSupport('yes')}
              className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-400/50"
            />
            Yes
          </label>
          
          <label className="inline-flex items-center gap-2 text-[15px] text-neutral-900">
            <input
              type="radio"
              name="immigration-support"
              value="no"
              checked={immigrationSupport === 'no'}
              onChange={() => setImmigrationSupport('no')}
              className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-400/50"
            />
            No
          </label>
        </div>
      </fieldset>

      {/* Visa type input (shown when Yes is selected) */}
      {immigrationSupport === 'yes' && (
        <div className="mt-4">
          <label className="block text-base font-medium text-neutral-900">
            What visa will you be applying for?*
          </label>
          <input
            type="text"
            value={visaType}
            onChange={(e) => {
              setVisaType(e.target.value)
              if (error) setError('')
            }}
            placeholder="E.g., E-3, H-1B"
            className={`mt-2 w-full h-11 rounded-xl border bg-white px-4 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${
              error ? 'border-red-400 ring-2 ring-red-400/60' : 'border-neutral-300'
            }`}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="flex-1" />
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="h-12 w-full rounded-xl font-semibold disabled:bg-neutral-100 disabled:text-neutral-400 bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400/50"
        >
          Complete cancellation
        </button>
      </div>
    </div>
  )
}

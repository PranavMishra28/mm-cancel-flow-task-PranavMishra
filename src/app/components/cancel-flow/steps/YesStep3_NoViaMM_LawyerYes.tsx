'use client'

import { useState } from 'react'

interface YesStep3_NoViaMM_LawyerYesProps {
  onNext: (data: { employer_immigration_support: 'yes' | 'no'; visa_type?: string }) => Promise<void>
  onBack: () => void
  onClose: () => void
  initialData?: {
    employer_immigration_support?: 'yes' | 'no'
    visa_type?: string
  }
}

export default function YesStep3_NoViaMM_LawyerYes({
  onNext,
  onBack,
  onClose,
  initialData
}: YesStep3_NoViaMM_LawyerYesProps) {
  const [employerSupport, setEmployerSupport] = useState<'yes' | 'no'>(
    initialData?.employer_immigration_support || 'yes'
  )
  const [visaType, setVisaType] = useState(initialData?.visa_type || '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (employerSupport === 'yes' && !visaType.trim()) {
      setError('Please enter your visa type.')
      return
    }
    
    setError('')
    setIsSubmitting(true)
    
    try {
      await onNext({
        employer_immigration_support: employerSupport,
        visa_type: employerSupport === 'yes' ? visaType.trim() : undefined
      })
    } catch (err) {
      console.error('Submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmployerSupportChange = (value: 'yes' | 'no') => {
    setEmployerSupport(value)
    if (value === 'no') {
      // Route back to the "No" variant - this should be handled by parent component
      // For now, just update state
      setVisaType('')
      setError('')
    }
  }

  const isValid = employerSupport === 'no' || (employerSupport === 'yes' && visaType.trim())

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="mx-auto w-full max-w-[1040px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-2 md:px-2 border-b border-gray-200">
          {/* Left: Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          {/* Center: title + step + dots */}
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">Subscription Cancellation</span>
            <span className="ml-2 text-sm text-gray-500">Step 3 of 3</span>
            <div className="ml-3 flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
            </div>
          </div>
          
          {/* Right: Close button */}
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="mt-6 grid md:grid-cols-[minmax(0,1fr)_minmax(0,480px)] items-start gap-6 md:gap-8">
          {/* Left column (form) */}
          <div className="flex flex-col">
            <div className="flex-1">
              {/* Title */}
              <h1 
                id="no-via-yes-title"
                className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
              >
                You landed the job!<br />
                <em className="not-italic md:italic font-semibold">That's what we live for.</em>
              </h1>

              {/* Subcopy */}
              <p className="mt-2 text-[14px] leading-6 text-neutral-600">
                Even if it wasn't through Migrate Mate, let us help get your visa sorted.
              </p>

              {/* Radio group */}
              <fieldset className="mt-4">
                <legend className="text-base font-medium text-neutral-900">
                  Is your company providing an immigration lawyer to help with your visa?
                </legend>
                <div className="mt-3 space-y-3">
                  <label className="flex items-center gap-2 text-[15px] text-neutral-900">
                    <input
                      type="radio"
                      name="employer_support"
                      value="yes"
                      checked={employerSupport === 'yes'}
                      onChange={(e) => handleEmployerSupportChange(e.target.value as 'yes')}
                      className="h-4 w-4 border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[15px] text-neutral-900">
                    <input
                      type="radio"
                      name="employer_support"
                      value="no"
                      checked={employerSupport === 'no'}
                      onChange={(e) => handleEmployerSupportChange(e.target.value as 'no')}
                      className="h-4 w-4 border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    No
                  </label>
                </div>
              </fieldset>

              {/* Visa field - only show when Yes is selected */}
              {employerSupport === 'yes' && (
                <div className="mt-4">
                  <label htmlFor="visa-type" className="block text-base font-medium text-neutral-900">
                    What visa will you be applying for?*
                  </label>
                  <input
                    id="visa-type"
                    type="text"
                    value={visaType}
                    onChange={(e) => {
                      setVisaType(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Enter visa type…"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'visa-error' : undefined}
                    className={`mt-2 w-full h-11 rounded-xl border bg-white px-4 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${
                      error ? 'border-red-400 ring-2 ring-red-400/60' : 'border-neutral-300'
                    }`}
                  />
                  {error && (
                    <p id="visa-error" className="mt-1 text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom button */}
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="mt-6 h-12 w-full rounded-xl font-semibold disabled:bg-neutral-100 disabled:text-neutral-400 bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400/50"
              >
                {isSubmitting ? 'Processing...' : 'Complete cancellation'}
              </button>
            </form>
          </div>

          {/* Right column (image) */}
          <div className="md:pl-2">
            <img
              src="/images/empire-state-compressed.jpg"
              alt="City skyline"
              className="w-full h-[300px] md:h-[340px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

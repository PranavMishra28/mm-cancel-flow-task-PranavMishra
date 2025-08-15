'use client'

import { useState } from 'react'

interface StillLookingReasonsProps {
  onBack: () => void
  onClose: () => void
  onAcceptOffer: () => void
  onComplete: () => void
}

export default function StillLookingReasons({ 
  onBack, 
  onClose, 
  onAcceptOffer, 
  onComplete 
}: StillLookingReasonsProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [showError, setShowError] = useState<boolean>(false)
  
  // Follow-up input states
  const [willingToPay, setWillingToPay] = useState<string>('')
  const [freeformFeedback, setFreeformFeedback] = useState<string>('')
  
  // Validation error states
  const [priceError, setPriceError] = useState<string>('')
  const [textareaError, setTextareaError] = useState<string>('')

  const reasons = [
    { key: 'too_expensive', label: 'Too expensive' },
    { key: 'platform_not_helpful', label: 'Platform not helpful' },
    { key: 'not_enough_jobs', label: 'Not enough relevant jobs' },
    { key: 'decided_not_to_move', label: 'Decided not to move' },
    { key: 'other', label: 'Other' }
  ]

  const handleReasonSelect = (reasonKey: string) => {
    setSelectedReason(reasonKey)
    setShowError(false)
    setPriceError('')
    setTextareaError('')
    // Clear follow-up inputs when switching reasons
    setWillingToPay('')
    setFreeformFeedback('')
  }

  const validatePrice = (value: string): boolean => {
    const cleanValue = value.replace(/^\$/, '').replace(/,/g, '').trim()
    const numValue = parseFloat(cleanValue)
    return !isNaN(numValue) && numValue >= 0 && numValue <= 999.99 && /^\d+(\.\d{0,2})?$/.test(cleanValue)
  }

  const isFormValid = (): boolean => {
    if (!selectedReason) return false
    
    switch (selectedReason) {
      case 'too_expensive':
        return validatePrice(willingToPay)
      case 'platform_not_helpful':
      case 'not_enough_jobs':
      case 'decided_not_to_move':
      case 'other':
        return freeformFeedback.length >= 25
      default:
        return false
    }
  }

  const handleComplete = () => {
    if (!selectedReason) {
      setShowError(true)
      return
    }

    let hasError = false

    // Validate follow-up input
    if (selectedReason === 'too_expensive') {
      if (!validatePrice(willingToPay)) {
        setPriceError('Please enter a valid amount.')
        hasError = true
      }
    } else {
      if (freeformFeedback.length < 25) {
        setTextareaError('Please enter at least 25 characters so we can understand your feedback*')
        hasError = true
      }
    }

    // Scroll to first invalid field if there's an error
    if (hasError) {
      setTimeout(() => {
        const errorElement = document.querySelector('.ring-red-400')
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

    // If we get here, form is valid
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="mx-auto w-full max-w-[1040px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-2 md:px-2 border-b border-gray-200">
          {/* Left: Back button */}
          <button
            type="button"
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
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body grid */}
        <div className="mt-6 grid md:grid-cols-[minmax(0,1fr)_minmax(0,480px)] items-start gap-6 md:gap-8">
          {/* Left column */}
          <div className="flex flex-col">
            <div className="flex-1">
              {/* H1 */}
              <h1 className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900">
                What's the main reason for cancelling?
              </h1>

              {/* Subcopy */}
              <p className="mt-2 text-[14px] leading-6 text-neutral-600">
                Please take a minute to let us know why:
              </p>

              {/* Error message */}
              {showError && (
                <div className="mt-3 text-red-500">
                  <p className="text-[12px] leading-tight">To help us understand your experience, please select a reason for canceling*</p>
                </div>
              )}

              {/* Reason options */}
              <div className="mt-6 space-y-3">
                {reasons.map((reason) => (
                  <div key={reason.key}>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="cancellation-reason"
                        value={reason.key}
                        checked={selectedReason === reason.key}
                        onChange={() => handleReasonSelect(reason.key)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedReason === reason.key
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-neutral-300'
                      }`}>
                        {selectedReason === reason.key && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-[14px] text-neutral-900">{reason.label}</span>
                    </label>

                    {/* Conditional follow-up inputs */}
                    {selectedReason === reason.key && (
                      <div className="mt-3 ml-7">
                        {reason.key === 'too_expensive' && (
                          <div>
                            <label htmlFor="willing-to-pay" className="block text-[14px] font-medium text-neutral-900 mb-2">
                              What would be the maximum you would be willing to pay?*
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[15px] text-neutral-500">$</span>
                              <input
                                id="willing-to-pay"
                                type="text"
                                value={willingToPay}
                                onChange={(e) => {
                                  setWillingToPay(e.target.value)
                                  // Clear error in real-time if value becomes valid
                                  if (priceError && validatePrice(e.target.value)) {
                                    setPriceError('')
                                  }
                                }}
                                className={`h-11 w-full rounded-xl border bg-white pl-8 pr-4 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 ${
                                  priceError 
                                    ? 'border-red-400 ring-2 ring-red-400/60' 
                                    : 'border-neutral-300 focus:ring-indigo-400/50'
                                }`}
                                placeholder="0.00"
                                aria-invalid={!!priceError}
                              />
                            </div>
                            {priceError && (
                              <p className="text-sm text-red-600 mt-1">{priceError}</p>
                            )}
                          </div>
                        )}

                        {(reason.key === 'platform_not_helpful' || reason.key === 'not_enough_jobs' || reason.key === 'decided_not_to_move' || reason.key === 'other') && (
                          <div>
                            <label htmlFor={`feedback-${reason.key}`} className="block text-[14px] font-medium text-neutral-900 mb-2">
                              {reason.key === 'platform_not_helpful' && 'What can we change to make the platform more helpful?*'}
                              {reason.key === 'not_enough_jobs' && 'In which way can we make the jobs more relevant?*'}
                              {reason.key === 'decided_not_to_move' && 'What changed for you to decide to not move?*'}
                              {reason.key === 'other' && 'What would have helped you the most?*'}
                            </label>
                            <div className="relative">
                              <textarea
                                id={`feedback-${reason.key}`}
                                value={freeformFeedback}
                                onChange={(e) => {
                                  setFreeformFeedback(e.target.value)
                                  // Clear error in real-time if length becomes valid
                                  if (textareaError && e.target.value.length >= 25) {
                                    setTextareaError('')
                                  }
                                }}
                                className={`min-h-[140px] w-full rounded-xl border bg-white p-3 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 resize-none ${
                                  textareaError 
                                    ? 'border-red-400 ring-2 ring-red-400/60' 
                                    : 'border-neutral-300 focus:ring-indigo-400/50'
                                }`}
                                placeholder="Please share your thoughts..."
                                aria-invalid={!!textareaError}
                              />
                              <div className="absolute bottom-2 right-3 text-[12px] text-neutral-500" aria-live="polite">
                                Min 25 characters ({freeformFeedback.length}/25)
                              </div>
                            </div>
                            {textareaError && (
                              <p className="text-sm text-red-600 mt-1">{textareaError}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom action area */}
            <hr className="mt-6 border-neutral-200/70" />

            <div className="mt-3 space-y-2">
              {/* Green discount button */}
              <button
                type="button"
                onClick={onAcceptOffer}
                className="h-11 w-full rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Get 50% off | $12.50 <span className="text-neutral-200"> </span>
                <span className="ml-1 align-middle text-[12px] text-neutral-200 line-through">$25</span>
              </button>

              {/* Complete cancellation button */}
              <button
                type="button"
                onClick={handleComplete}
                className={`h-11 w-full rounded-lg font-semibold focus:outline-none focus:ring-2 ${
                  isFormValid()
                    ? 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-red-300'
                    : 'bg-neutral-100 text-neutral-400 cursor-pointer'
                }`}
              >
                Complete cancellation
              </button>
            </div>
          </div>

          {/* Right column - image */}
          <div>
            <img 
              src="/images/empire-state-compressed.jpg" 
              alt="City skyline" 
              className="w-full h-[360px] md:h-[420px] object-cover rounded-2xl"
              onError={(e) => console.error('Image failed to load:', e)} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

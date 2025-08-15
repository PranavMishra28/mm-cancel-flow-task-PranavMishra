'use client'

import { useState } from 'react'

interface StillLookingUsageSurveyProps {
  onBack: () => void
  onClose: () => void
  onAcceptOffer: () => void
  onContinue: () => void
}

export default function StillLookingUsageSurvey({ 
  onBack, 
  onClose, 
  onAcceptOffer, 
  onContinue 
}: StillLookingUsageSurveyProps) {
  const [row1, setRow1] = useState<string | null>(null)
  const [row2, setRow2] = useState<string | null>(null)
  const [row3, setRow3] = useState<string | null>(null)
  const [showError, setShowError] = useState<boolean>(false)

  const row1Options = ['0', '1–5', '6–20', '20+']
  const row2Options = ['0', '1–5', '6–20', '20+']
  const row3Options = ['0', '1–2', '3–5', '5+']

  const isComplete = row1 && row2 && row3

  const PillButton = ({ 
    value, 
    selected, 
    onClick, 
    children 
  }: { 
    value: string
    selected: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`h-10 rounded-lg border px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50 ${
        selected
          ? 'bg-[#8b5cf6] text-white border-transparent shadow-sm'
          : 'bg-neutral-100/70 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
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
            <span className="ml-2 text-sm text-gray-500">Step 2 of 3</span>
            <div className="ml-3 flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
            </div>
          </div>
          
          {/* Right: Close button */}
          <button
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
              <h1 
                id="usage-title" 
                className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
              >
                Help us understand how you were using Migrate Mate.
              </h1>

              {/* Error message */}
              {showError && (
                <div className="mt-3 text-red-500">
                  <p className="text-[12px] leading-tight">Mind letting us know why you're canceling?</p>
                  <p className="text-[12px] leading-tight">It helps us understand experience and improve the platform.</p>
                </div>
              )}

              {/* Question 1 */}
              <div className="mt-6" role="radiogroup" aria-labelledby="q1-label">
                <p id="q1-label" className="text-[14px] font-medium text-neutral-900">
                  How many roles did you apply for through Migrate Mate?
                </p>
                <div className="mt-2 grid grid-cols-4 gap-3">
                  {row1Options.map((option) => (
                    <PillButton
                      key={option}
                      value={option}
                      selected={row1 === option}
                      onClick={() => {
                        setRow1(option)
                        setShowError(false)
                      }}
                    >
                      {option}
                    </PillButton>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="mt-6" role="radiogroup" aria-labelledby="q2-label">
                <p id="q2-label" className="text-[14px] font-medium text-neutral-900">
                  How many companies did you email directly?
                </p>
                <div className="mt-2 grid grid-cols-4 gap-3">
                  {row2Options.map((option) => (
                    <PillButton
                      key={option}
                      value={option}
                      selected={row2 === option}
                      onClick={() => {
                        setRow2(option)
                        setShowError(false)
                      }}
                    >
                      {option}
                    </PillButton>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="mt-6" role="radiogroup" aria-labelledby="q3-label">
                <p id="q3-label" className="text-[14px] font-medium text-neutral-900">
                  How many different companies did you interview with?
                </p>
                <div className="mt-2 grid grid-cols-4 gap-3">
                  {row3Options.map((option) => (
                    <PillButton
                      key={option}
                      value={option}
                      selected={row3 === option}
                      onClick={() => {
                        setRow3(option)
                        setShowError(false)
                      }}
                    >
                      {option}
                    </PillButton>
                  ))}
                </div>
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

              {/* Continue button */}
              <button
                type="button"
                onClick={() => {
                  if (!isComplete) {
                    setShowError(true)
                  } else {
                    onContinue()
                  }
                }}
                className={`h-11 w-full rounded-lg font-semibold focus:outline-none focus:ring-2 ${
                  isComplete
                    ? 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-red-300'
                    : 'bg-neutral-100 text-neutral-400 cursor-pointer'
                }`}
              >
                Continue
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

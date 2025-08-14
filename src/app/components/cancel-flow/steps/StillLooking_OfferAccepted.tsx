'use client'

interface StillLookingOfferAcceptedProps {
  onContinue: () => void
  onBack: () => void
  onClose: () => void
}

export default function StillLookingOfferAccepted({ 
  onContinue, 
  onBack, 
  onClose 
}: StillLookingOfferAcceptedProps) {
  return (
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
          
          {/* Center: title only */}
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">Subscription</span>
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
                id="still-looking-accepted-title" 
                className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
              >
                Great choice, mate!
              </h1>

              {/* Subheadline with purple part */}
              <p className="mt-1 text-[20px] leading-7 text-neutral-900 font-semibold">
                You're still on the path to your dream role.
                <span className="text-[#7c3aed]"> Let's make it happen together!</span>
              </p>

              {/* Support copy */}
              <p className="mt-3 text-[14px] leading-6 text-neutral-600">
                You've got XX days left on your current plan.
                Starting from XX date, your monthly payment will be $12.50.
              </p>
              <p className="mt-1 text-[12px] leading-5 text-neutral-500">
                You can cancel anytime before then.
              </p>
            </div>

            {/* Primary CTA */}
            <button 
              onClick={onContinue}
              className="mt-6 h-12 w-full rounded-xl bg-[#8b5cf6] text-white font-semibold hover:bg-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50"
            >
              Land your dream role
            </button>
          </div>

          {/* Right column - image */}
          <div>
            <img 
              src="/images/empire-state-compressed.jpg" 
              alt="City skyline" 
              className="w-full h-[300px] md:h-[340px] object-cover rounded-2xl"
              onError={(e) => console.error('Image failed to load:', e)} 
            />
          </div>
        </div>
    </div>
  )
}

'use client'

interface StillLookingOfferProps {
  onAccept: () => void
  onDecline: () => void
  onBack: () => void
  onClose: () => void
}

export default function StillLookingOffer({ 
  onAccept, 
  onDecline, 
  onBack, 
  onClose 
}: StillLookingOfferProps) {
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
          
          {/* Center: title + step + dots */}
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">Subscription Cancellation</span>
            <span className="ml-2 text-sm text-gray-500">Step 1 of 3</span>
            <div className="ml-3 flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
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
                id="still-looking-title" 
                className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
              >
                We built this to help you land the job, this makes it a little easier.
              </h1>

              {/* Subcopy */}
              <p className="mt-2 text-[14px] leading-6 text-neutral-600">
                We've been there and we're here to help you.
              </p>

              {/* Offer panel */}
              <div className="mt-4 rounded-xl border border-[#d9c7fb] bg-[#f3eaff] p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]">
                {/* Headline */}
                <p className="text-center text-[18px] md:text-[20px] font-semibold text-neutral-900">
                  Here's 50% off until you find a job.
                </p>

                {/* Price row */}
                <div className="mt-1 text-center text-[14px]">
                  <span className="text-[#7c3aed] font-semibold">$12.50/month</span>
                  <span className="line-through text-neutral-400 ml-1">$25/month</span>
                </div>

                {/* Accept button */}
                <button 
                  onClick={onAccept}
                  className="mt-3 h-10 w-full rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  Get 50% off
                </button>

                {/* Fine print */}
                <p className="mt-1 text-center text-[11px] text-neutral-500">
                  You won't be charged until your next billing date.
                </p>
              </div>
            </div>

            {/* Secondary button beneath panel */}
            <button 
              onClick={onDecline}
              className="mt-4 h-10 w-full rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
            >
              No thanks
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

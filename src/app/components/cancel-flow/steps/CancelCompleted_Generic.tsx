'use client'

interface CancelCompletedGenericProps {
  onBack: () => void
  onClose: () => void
  onGoToJobs: () => void
}

export default function CancelCompletedGeneric({ 
  onBack, 
  onClose, 
  onGoToJobs 
}: CancelCompletedGenericProps) {
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
          
          {/* Center: title + dots + completed */}
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">Subscription Cancelled</span>
            <div className="ml-3 flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">Completed</span>
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
              {/* Heading */}
              <h1 
                id="cancelled-title" 
                className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
              >
                Sorry to see you go, mate.
              </h1>
              <p className="mt-2 text-[22px] leading-7 font-semibold text-neutral-900">
                Thanks for being with us, and you're always welcome back.
              </p>

              {/* Body copy */}
              <p className="mt-3 text-[14px] leading-6 text-neutral-600">
                Your subscription is set to end on XX date.<br />
                You'll still have full access until then. No further charges after that.
              </p>
              <p className="mt-2 text-[14px] leading-6 text-neutral-600">
                Changed your mind? You can reactivate anytime before your end date.
              </p>
            </div>

            {/* Primary CTA */}
            <button
              onClick={onGoToJobs}
              className="mt-6 h-12 w-full rounded-xl bg-[#8b5cf6] text-white font-semibold hover:bg-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50"
            >
              Back to Jobs
            </button>
          </div>

          {/* Right column - image */}
          <div>
            <img 
              src="/images/empire-state-compressed.jpg" 
              alt="City skyline" 
              className="w-full h-[260px] md:h-[300px] object-cover rounded-2xl"
              onError={(e) => console.error('Image failed to load:', e)} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

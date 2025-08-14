'use client'

interface YesCompletion_VisaHelpProps {
  onFinish: () => void
  onClose: () => void
}

export default function YesCompletion_VisaHelp({
  onFinish,
  onClose
}: YesCompletion_VisaHelpProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="mx-auto w-full max-w-[1040px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200">
          {/* Left: empty for symmetry */}
          <div className="w-5"></div>
          
          {/* Center: title + dots + completed */}
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-gray-900 tracking-wide">Subscription Cancelled</span>
            <div className="flex items-center gap-1 shadow-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
            </div>
            <span className="text-sm font-medium text-gray-500 tracking-wide">Completed</span>
          </div>
          
          {/* Right: Close button */}
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="mt-6 grid md:grid-cols-[minmax(0,1fr)_minmax(0,480px)] items-start gap-6 md:gap-8">
          {/* Left column (content) */}
          <div className="flex flex-col">
            <div className="flex-1">
              {/* Title */}
              <h1 
                id="completion-title"
                className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
              >
                Your cancellation's all sorted, mate, no more charges.
              </h1>

              {/* Contact card */}
              <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                {/* Header row: avatar + name/email */}
                <div className="flex items-center gap-3">
                  <img
                    src="/images/mihailo-profile.jpeg"
                    alt="Mihailo Bozic"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="leading-tight">
                    <div className="text-sm font-medium text-neutral-900">Mihailo Bozic</div>
                    <div className="text-xs text-neutral-500">mihailo@migratemate.co</div>
                  </div>
                </div>

                {/* Body text */}
                <div className="mt-3 space-y-3 text-[14px] leading-6 text-neutral-700">
                  <p>I'll be reaching out soon to help with the visa side of things.</p>
                  <p>
                    We've got your back, whether it's questions, paperwork, or just figuring out your options.
                    Keep an eye on your inbox, I'll be in touch shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Finish button */}
            <button
              onClick={onFinish}
              className="mt-6 h-12 w-full rounded-xl bg-[#8b5cf6] text-white font-semibold hover:bg-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50"
            >
              Finish
            </button>
          </div>

          {/* Right column (image) */}
          <div className="md:pl-2">
            <img
              src="/images/empire-state-compressed.jpg"
              alt="City skyline"
              className="w-full h-[260px] md:h-[300px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
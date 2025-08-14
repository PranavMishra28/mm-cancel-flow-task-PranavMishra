'use client'

interface StillLookingRolesPreviewProps {
  onClose: () => void
}

export default function StillLookingRolesPreview({ 
  onClose 
}: StillLookingRolesPreviewProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="mx-auto w-full max-w-[1040px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-2 md:px-2 border-b border-gray-200">
          {/* Left: Empty for symmetry */}
          <div className="w-5"></div>
          
          {/* Center: Title */}
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
              {/* Hero headline */}
              <h1 
                id="roles-preview-title" 
                className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
              >
                Awesome — we've pulled together<br />
                a few roles that<br />
                seem like a great fit for you.
              </h1>

              {/* Subcopy */}
              <p className="mt-2 text-[14px] leading-6 text-neutral-600">
                Take a look and see what sparks your interest.
              </p>

              {/* Role card */}
              <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                {/* Top row: company + meta */}
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-[#e6f0ff]" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-semibold text-neutral-900">Automation Controls Engineer</span>
                    </div>
                    <div className="text-[12px] text-neutral-500">Randstad USA · Memphis, Tennessee</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-700">Full Time</span>
                      <span className="rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-700">Associate</span>
                      <span className="rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-700">Bachelor's</span>
                      <span className="rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-700">On-Site</span>
                    </div>
                  </div>
                </div>

                {/* Green "NEW JOB" + salary line */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-600">NEW JOB</span>
                  <span className="text-[12px] text-neutral-800">$150,000/yr – $170,000/yr</span>
                </div>

                {/* Visa badges row */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px]">Green Card</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px]">E-3</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px]">OPT</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px]">O-1</span>
                </div>

                {/* Description snippet */}
                <p className="mt-3 text-[12px] leading-5 text-neutral-600">
                  The Electrical Automation Controls Engineer will design, implement, and maintain industrial automation systems, specializing in PLC programming using Siemens TIA Portal. The ideal candidate will have a Bachelor's degree in Electrical Engineering and at least 4 years of industrial automation experience. This role offers autonomy and is ideal for someone seeking growth in a supportive company. Key skills include: experience with...
                </p>

                {/* Footer row */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[11px] text-neutral-500">
                    Company visa contact: <span className="underline">barbara.tuck@randstadusa.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[12px] text-neutral-700 hover:bg-neutral-50">Save Job</button>
                    <button className="rounded-lg bg-[#ede9fe] text-[#6d28d9] px-3 py-1.5 text-[12px] font-medium hover:bg-[#e9e3ff]">Apply</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <button 
              onClick={() => {
                // TODO: Implement navigation - stub for now
                console.log('Land your dream role clicked')
              }}
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
              className="w-full h-[360px] md:h-[420px] object-cover rounded-2xl"
              onError={(e) => console.error('Image failed to load:', e)} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

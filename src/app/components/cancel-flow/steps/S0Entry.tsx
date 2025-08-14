'use client'

export default function S0Entry({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
    return (
        <div>
            <h1 className="text-[30px] md:text-[34px] leading-[1.15] font-semibold tracking-tight text-black">
                <span className="block">Hey mate,</span>
                <span className="block">Quick one before you go.</span>
            </h1>
            <p className="mt-5 italic font-semibold text-[20px] md:text-[22px] text-gray-900">Have you found a job yet?</p>
            <p className="mt-3 text-[13px] md:text-[14px] text-gray-500 max-w-[520px]">
                Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we can do better.
            </p>

            <div className="mt-6 space-y-3 max-w-[520px]">
                <button
                    className="w-full h-11 rounded-[12px] border border-gray-300 bg-white hover:bg-gray-50 transition text-[14px] font-medium text-gray-700 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]"
                    onClick={onYes}
                >
                    Yes, I’ve found a job
                </button>
                <button
                    className="w-full h-11 rounded-[12px] border border-gray-300 bg-white hover:bg-gray-50 transition text-[14px] font-medium text-gray-700 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]"
                    onClick={onNo}
                >
                    Not yet – I’m still looking
                </button>
            </div>
        </div>
    )
}



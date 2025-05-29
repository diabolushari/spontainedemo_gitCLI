import { useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'

export default function MainArea() {
  const [message, setMessage] = useState('')

  return (
    <main className='relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#DEC9E2] to-[#B6C0CF] p-6'>
      {/* Sidebar & Content Container */}
      <div className='flex w-full max-w-6xl'>
        {/* Sidebar */}
        <aside className='flex w-1/5 flex-col gap-4 self-start'>
          <button className='rounded-full bg-[#D9D9D9] px-6 py-3 text-left text-gray-700 shadow-md transition-all hover:bg-gray-400'>
            SLA Improvement
          </button>
          <button className='rounded-full bg-[#DCE9F2] px-6 py-3 text-left text-blue-800 shadow-md transition-all hover:bg-blue-300'>
            Billing Vs Collection
          </button>
        </aside>

        {/* Vertical Divider */}
        <div className='mx-6 h-auto border-r-2 border-white'></div>

        {/* Content Section */}
        <section className='flex w-3/5 flex-1 flex-col space-y-4 px-4 py-6'>
          {/* Question 1 (User Message - Right Aligned) */}
          <div className='flex justify-end'>
            <div className='max-w-[75%] rounded-lg bg-[#F7F7E9] px-6 py-3 text-right text-gray-900 shadow-md'>
              How much was the collection shortfall this quarter?
            </div>
          </div>

          {/* AI Response (Left Aligned) */}
          <div className='flex justify-start'>
            <div className='max-w-[75%] rounded-lg border border-gray-300 bg-white p-6 shadow-md'>
              <span className='text-gray-400'>[ Data Table Here ]</span>
            </div>
          </div>

          {/* Question 2 (User Message - Right Aligned) */}
          <div className='flex justify-end'>
            <div className='max-w-[75%] rounded-lg bg-[#F7F7E9] px-6 py-3 text-right text-gray-900 shadow-md'>
              How many crores did we collect?
            </div>
          </div>

          {/* AI Response (Left Aligned) */}
          <div className='flex justify-start'>
            <div className='max-w-[75%] rounded-lg bg-[#DCE9F2] px-6 py-4 text-left text-gray-900 shadow-md'>
              The total collection hit <strong>704.85 Crores</strong>. That breaks down to 639.6
              Crores in LT, 45.83 in HT, and 19.47 in EHT.
            </div>
          </div>

          {/* Action Buttons (Left Aligned under AI response) */}
          <div className='mt-2 flex justify-start gap-4'>
            <button className='rounded-lg bg-gradient-to-r from-[#FA6B86]/50 via-[#CF5397]/50 to-[#448CBF]/50 p-3 text-white shadow-md'>
              Would you like a comparison with the previous year?
            </button>
            <button className='rounded-lg bg-gradient-to-r from-[#FA6B86]/50 via-[#CF5397]/50 to-[#448CBF]/50 p-3 text-white shadow-md'>
              Want a chart of collection by region?
            </button>
          </div>
        </section>
      </div>

      {/* AI Chat Input Box - Centered at Bottom of Main */}
      <div className='absolute bottom-5 left-1/2 w-[94%] max-w-5xl -translate-x-1/2'>
        <div className='flex w-full items-center rounded-2xl border border-gray-300 bg-white px-4 py-2 shadow-xl'>
          <span className='mr-2 text-sm font-bold text-gray-600'>ASK</span>
          <span className='mr-2 rounded-lg bg-black px-2 py-1 text-xs font-semibold text-white'>
            AI
          </span>

          {/* Increased input field width */}
          <input
            type='text'
            placeholder='Your message here.'
            className='w-[85%] flex-1 border-none bg-transparent p-2 text-base focus:outline-none'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button className='rounded-full bg-pink-500 p-2 text-white shadow-md transition-all hover:bg-pink-600'>
            <AiOutlineSend size={18} />
          </button>
        </div>
      </div>
    </main>
  )
}

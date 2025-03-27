import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

export default function MainArea() {
  const [message, setMessage] = useState("");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#DEC9E2] to-[#B6C0CF] p-6 relative">


      {/* Sidebar & Content Container */}
      <div className="flex w-full max-w-6xl">

        {/* Sidebar */}
        <aside className="flex flex-col gap-4 self-start w-1/5">
  <button className="bg-[#D9D9D9] text-gray-700 px-6 py-3 rounded-full shadow-md text-left hover:bg-gray-400 transition-all">
    SLA Improvement
  </button>
  <button className="bg-[#DCE9F2] text-blue-800 px-6 py-3 rounded-full shadow-md text-left hover:bg-blue-300 transition-all">
    Billing Vs Collection
  </button>
</aside>


        {/* Vertical Divider */}
        <div className="border-r-2 border-white h-auto mx-6"></div>

       {/* Content Section */}
<section className="flex flex-col flex-1 w-3/5 px-4 py-6 space-y-4">

{/* Question 1 (User Message - Right Aligned) */}
<div className="flex justify-end">
  <div className="bg-[#F7F7E9] text-gray-900 px-6 py-3 rounded-lg shadow-md max-w-[75%] text-right">
    How much was the collection shortfall this quarter?
  </div>
</div>

{/* AI Response (Left Aligned) */}
<div className="flex justify-start">
  <div className="bg-white p-6 rounded-lg shadow-md max-w-[75%] border border-gray-300">
    <span className="text-gray-400">[ Data Table Here ]</span>
  </div>
</div>

{/* Question 2 (User Message - Right Aligned) */}
<div className="flex justify-end">
  <div className="bg-[#F7F7E9] text-gray-900 px-6 py-3 rounded-lg shadow-md max-w-[75%] text-right">
    How many crores did we collect?
  </div>
</div>

{/* AI Response (Left Aligned) */}
<div className="flex justify-start">
  <div className="bg-[#DCE9F2] text-gray-900 px-6 py-4 rounded-lg shadow-md max-w-[75%] text-left">
    The total collection hit <strong>704.85 Crores</strong>. That breaks down to 639.6 Crores in LT, 45.83 in HT, and 19.47 in EHT.
  </div>
</div>

{/* Action Buttons (Left Aligned under AI response) */}
<div className="flex justify-start gap-4 mt-2">
  <button className="bg-gradient-to-r from-[#FA6B86]/50 via-[#CF5397]/50 to-[#448CBF]/50 p-3 rounded-lg shadow-md text-white">
    Would you like a comparison with the previous year?
  </button>
  <button className="bg-gradient-to-r from-[#FA6B86]/50 via-[#CF5397]/50 to-[#448CBF]/50 p-3 rounded-lg shadow-md text-white">
    Want a chart of collection by region?
  </button>
</div>

</section>

      </div>

      {/* AI Chat Input Box - Centered at Bottom of Main */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl">
  <div className="bg-white flex items-center shadow-xl rounded-2xl px-4 py-2 w-full border border-gray-300">
    <span className="font-bold text-gray-600 mr-2 text-sm">ASK</span>
    <span className="bg-black text-white px-2 py-1 rounded-lg text-xs font-semibold mr-2">AI</span>
    
    {/* Increased input field width */}
    <input
      type="text"
      placeholder="Your message here."
      className="flex-1 p-2 border-none focus:outline-none text-base bg-transparent w-[85%]"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    
    <button className="bg-pink-500 text-white p-2 rounded-full shadow-md hover:bg-pink-600 transition-all">
      <AiOutlineSend size={18} />
    </button>
  </div>
</div>



    </main>
  );
}

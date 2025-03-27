export default function Sidebar() {
  return (
    <aside className='flex h-screen w-20 flex-col items-center bg-gradient-to-b from-gray-100 to-white py-4 shadow-lg'>
      {/* Logo */}
      <img
        src='/logo.png'
        alt='KSEB Logo'
        className='mb-6 h-16 w-12'
      />

      {/* Sidebar Icons */}
      <div className='flex flex-col gap-4'></div>
    </aside>
  )
}

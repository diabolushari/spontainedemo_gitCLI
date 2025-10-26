interface LayoutSidebarProps {
  onLayoutClick: (layout: string) => void
}

export default function LayoutSidebar({ onLayoutClick }: LayoutSidebarProps) {
  return (
    <div className='space-y-3'>
      <h3 className='mb-3 text-xs font-semibold uppercase text-gray-500'>Choose a layout</h3>

      <div
        className='cursor-pointer rounded-md border border-gray-200 bg-white p-4 hover:border-blue-400'
        onClick={() => onLayoutClick('singleCol')}
      >
        <div className='mb-2 h-20 rounded bg-gray-100'></div>
        <span className='text-sm'>Single Column</span>
      </div>

      <div
        className='cursor-pointer rounded-md border border-gray-200 bg-white p-4 hover:border-blue-400'
        onClick={() => onLayoutClick('doubleCol')}
      >
        <div className='mb-2 grid h-20 grid-cols-2 gap-2'>
          <div className='rounded bg-gray-100'></div>
          <div className='rounded bg-gray-100'></div>
        </div>
        <span className='text-sm'>Two Columns</span>
      </div>

      <div
        className='cursor-pointer rounded-md border border-gray-200 bg-white p-4 hover:border-blue-400'
        onClick={() => onLayoutClick('tripleCol')}
      >
        <div className='mb-2 grid h-20 grid-cols-3 gap-2'>
          <div className='rounded bg-gray-100'></div>
          <div className='rounded bg-gray-100'></div>
          <div className='rounded bg-gray-100'></div>
        </div>
        <span className='text-sm'>Three Columns</span>
      </div>
    </div>
  )
}

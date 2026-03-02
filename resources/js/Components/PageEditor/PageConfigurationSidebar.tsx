import { DashboardPage } from '@/interfaces/data_interfaces'
import { ChevronLeft, MessageSquare } from 'lucide-react'
import PageBuilderChat from './PageBuilderChat'

interface PageConfigurationSidebarProps {
  pageStructure: Partial<DashboardPage>
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onPageUpdate: (data: Partial<DashboardPage>) => void
  agentUrl: string
  onThinking?: (message: string | null) => void
  userId: number
  onSave: () => void
}

export default function PageConfigurationSidebar({
  pageStructure,
  isOpen,
  setIsOpen,
  onPageUpdate,
  agentUrl,
  onThinking,
  userId,
  onSave,
}: Readonly<PageConfigurationSidebarProps>) {
  return (
    <>
      <div
        className={`relative z-10 flex flex-col border-l border-gray-200 bg-white transition-all duration-300 ease-in-out ${isOpen ? 'w-[400px] min-w-[400px] translate-x-0' : 'w-0 min-w-0 translate-x-full overflow-hidden opacity-0'}`}
      >
        <div className='flex h-full w-[400px] flex-col overflow-hidden'>
          {/* Header */}
          <div className='border-b border-gray-100 p-5 pb-4'>
            <h2 className='text-lg font-bold text-gray-900'>AI Assistant</h2>
            <p className='text-xs text-gray-500'>Ask me to build your page</p>
          </div>

          {/* Chat */}
          <PageBuilderChat
            agentUrl={agentUrl}
            onPageUpdate={onPageUpdate}
            onSave={onSave}
            onThinking={onThinking}
            page={pageStructure}
            userId={userId}
          />
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-6 z-20 flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-blue-600 ${isOpen ? 'right-[400px]' : 'right-0'}`}
      >
        {isOpen ? (
          <ChevronLeft className='h-4 w-4 rotate-180 text-gray-600' />
        ) : (
          <MessageSquare className='h-4 w-4 text-gray-600' />
        )}
      </button>
    </>
  )
}

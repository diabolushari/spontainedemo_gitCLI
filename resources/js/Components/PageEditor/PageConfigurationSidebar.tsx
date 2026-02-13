import { DashboardPage, Widget } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import { ChevronLeft, Settings } from 'lucide-react'
import { useState } from 'react'
import PageBuilderChat from './PageBuilderChat'

interface PageConfigurationSidebarProps {
  pageStructure: Partial<DashboardPage>
  pageWidgets: Widget[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setAnchorWidget: (id: number) => void
  onSaveDraft: () => void
  onPublish: () => void
  onPreview: () => void
  isEditMode: boolean
  onPageUpdate: (data: Partial<DashboardPage>) => void
  agentUrl: string
  onThinking?: (message: string | null) => void
  userId: number
}

export default function PageConfigurationSidebar({
  pageStructure,
  pageWidgets,
  isOpen,
  setIsOpen,
  onTitleChange,
  onDescriptionChange,
  onLinkChange,
  setAnchorWidget,
  onSaveDraft,
  onPublish,
  onPreview,
  isEditMode,
  onPageUpdate,
  agentUrl,
  onThinking,
  userId,
}: Readonly<PageConfigurationSidebarProps>) {
  const [isChatMode, setIsChatMode] = useState(false)

  return (
    <>
      <div
        className={`relative z-10 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${isOpen ? 'w-[320px] min-w-[320px] translate-x-0' : 'w-0 min-w-0 -translate-x-full overflow-hidden opacity-0'}`}
      >
        <div className='flex h-full w-[320px] flex-col overflow-hidden'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-gray-100 p-5 pb-4'>
            <div>
              <h2 className='text-lg font-bold text-gray-900'>
                {isChatMode ? 'AI Assistant' : 'Page Settings'}
              </h2>
              <p className='text-xs text-gray-500'>
                {isChatMode ? 'Ask me to build your page' : 'Configure page details'}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className={`text-xs font-medium ${isChatMode ? 'text-blue-600' : 'text-gray-400'}`}
              >
                Chat
              </span>
              <button
                onClick={() => setIsChatMode(!isChatMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isChatMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                role='switch'
                aria-checked={isChatMode}
              >
                <span
                  className={`${isChatMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                />
              </button>
            </div>
          </div>

          {isChatMode ? (
            <PageBuilderChat
              agentUrl={agentUrl}
              onPageUpdate={onPageUpdate}
              onSave={onPublish}
              onThinking={onThinking}
              page={pageStructure}
              userId={userId}
            />
          ) : (
            <div className='flex flex-grow flex-col overflow-y-auto p-5 pt-2'>
              <form
                className='flex-grow space-y-6 pt-4'
                onSubmit={(e) => e.preventDefault()}
              >
                <div className='space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4'>
                  <h3 className='text-sm font-semibold text-gray-900'>Basic Info</h3>
                  <div className='space-y-4'>
                    <div>
                      <label
                        htmlFor='page-title'
                        className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                      >
                        Page Title
                      </label>
                      <input
                        id='page-title'
                        type='text'
                        value={pageStructure.title || ''}
                        onChange={onTitleChange}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='page-description'
                        className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                      >
                        Description
                      </label>
                      <textarea
                        id='page-description'
                        value={pageStructure.description || ''}
                        onChange={onDescriptionChange}
                        rows={3}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='page-link'
                        className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                      >
                        URL Slug
                      </label>
                      <input
                        id='page-link'
                        type='text'
                        value={pageStructure.link || ''}
                        onChange={onLinkChange}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                      />
                    </div>
                  </div>
                </div>
                <div className='space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4'>
                  <h3 className='text-sm font-semibold text-gray-900'>Data Configuration</h3>
                  <SelectList
                    label='Anchor Widget'
                    showLabel={false}
                    list={pageWidgets as any}
                    dataKey={'id'}
                    displayKey='title'
                    setValue={(val: string) => setAnchorWidget(Number(val))}
                    value={pageStructure.anchor_widget ?? undefined}
                  />
                </div>
              </form>
              <div className='mt-auto border-t border-gray-100 pt-6'>
                <div className='grid grid-cols-2 gap-3'>
                  <Button
                    label='Save Draft'
                    variant='secondary'
                    onClick={onSaveDraft}
                    type='button'
                    className='w-full justify-center'
                  />
                  <Button
                    label='Preview'
                    variant='secondary'
                    onClick={onPreview}
                    type='button'
                    className='w-full justify-center'
                  />
                </div>
                <div className='mt-3'>
                  <Button
                    label={isEditMode ? 'Update Page' : 'Publish Page'}
                    variant='primary'
                    onClick={onPublish}
                    type='button'
                    className='w-full justify-center'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-6 z-20 flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-blue-600 ${isOpen ? 'left-[320px]' : 'left-0'}`}
      >
        {isOpen ? (
          <ChevronLeft className='h-4 w-4 text-gray-600' />
        ) : (
          <Settings className='h-4 w-4 text-gray-600' />
        )}
      </button>
    </>
  )
}

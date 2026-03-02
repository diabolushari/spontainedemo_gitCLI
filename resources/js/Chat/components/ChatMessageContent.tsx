import { ChatMessage } from '@/Chat/components/MainArea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/Components/ui/accordion'
import { Download } from 'lucide-react'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import * as XLSX from 'xlsx'
import ChatVisualization from './ChatVisualization'

interface Props {
  message: ChatMessage
}

function stripCodeFencesAndIndent(content: string): string {
  if (!content) return ''
  let cleaned = content.replace(/^```[\w]*\n?/, '').replace(/```$/, '')
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n')
  return cleaned
}

function formatJsonDescription(description: string): string {
  try {
    const parsed = JSON.parse(description)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return description
  }
}

const ChatMessageContent = ({ message }: Readonly<Props>) => {
  const downloadAsExcel = (data: object[], filename: string = 'data') => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  useEffect(() => {
    if (message.contentType === 'explore') {
      console.log(message)
    }
  }, [message])

  return (
    <div className='w-full'>
      {message.contentType === 'text' && message.role === 'action' && (
        <div className='w-[50vw]'>
          <Accordion
            type='single'
            collapsible
            className='w-full'
          >
            <AccordionItem value={String(message.id)}>
              <AccordionTrigger className="text-base font-medium">{message.content}</AccordionTrigger>
              <AccordionContent>
                <pre className='max-h-96 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800 shadow-sm'>
                  {formatJsonDescription(message.description ?? '')}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      {message.contentType === 'final_response' &&
        (
          <div className='w-full prose max-w-none text-base leading-snug text-gray-800'>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => <h1 className='text-2xl font-bold mt-6 mb-3 text-gray-900 border-none' {...props} />,
                h2: ({ ...props }) => <h2 className='text-xl font-bold mt-5 mb-2 text-gray-900' {...props} />,
                h3: ({ ...props }) => <h3 className='text-lg font-bold mt-4 mb-1.5 text-gray-800' {...props} />,
                p: ({ ...props }) => <p className='mb-3 text-base leading-normal' {...props} />,
                ul: ({ ...props }) => <ul className='list-disc ml-6 mb-3 space-y-0.5' {...props} />,
                ol: ({ ...props }) => <ol className='list-decimal ml-6 mb-3 space-y-0.5' {...props} />,
                li: ({ ...props }) => <li className='text-base leading-normal mb-0.5' {...props} />,
                table: ({ ...props }) => (
                  <div className='w-full overflow-x-auto my-4 shadow-sm rounded-xl border border-gray-200'>
                    <table
                      className='min-w-full divide-y divide-gray-200'
                      {...props}
                    />
                    {message.data_table ? (
                      <div className='p-3 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-xl'>
                        <button
                          onClick={() =>
                            downloadAsExcel(message.data_table!, `data_table_${message.id}`)
                          }
                          className='group flex items-center gap-2 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 text-xs font-medium text-green-700 shadow-sm transition-all duration-200 hover:scale-105 hover:from-green-100 hover:to-emerald-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1'
                          title='Download Excel file'
                        >
                          <Download
                            size={14}
                            className='transition-transform group-hover:scale-110'
                          />
                          Download Excel
                        </button>
                      </div>
                    ) : null}
                  </div>
                ),
                th: ({ ...props }) => (
                  <th
                    className='bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'
                    {...props}
                  />
                ),
                td: ({ ...props }) => (
                  <td
                    className='px-4 py-3 text-base text-gray-700 border-t border-gray-100'
                    {...props}
                  />
                ),
                code: ({ ...props }) => <code className='px-1.5 py-0.5 rounded bg-gray-100 text-sm font-mono text-gray-800' {...props} />,
                pre: ({ ...props }) => <pre className='p-4 rounded-lg bg-gray-900 overflow-x-auto my-4 text-sm text-gray-100' {...props} />,
              }}
            >
              {stripCodeFencesAndIndent(message.content)}
            </ReactMarkdown>
          </div>
        )}
      {message.contentType === 'text' &&
        (message.role === 'assistant' || message.role === 'user') && (
          <div className={`w-full prose max-w-none text-base leading-snug ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => <h1 className={`text-2xl font-bold mt-6 mb-3 ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`} {...props} />,
                h2: ({ ...props }) => <h2 className={`text-xl font-bold mt-5 mb-2 ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`} {...props} />,
                h3: ({ ...props }) => <h3 className={`text-lg font-bold mt-4 mb-1.5 ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`} {...props} />,
                p: ({ ...props }) => <p className='mb-3 text-base leading-normal' {...props} />,
                ul: ({ ...props }) => <ul className='list-disc ml-6 mb-3 space-y-0.5' {...props} />,
                ol: ({ ...props }) => <ol className='list-decimal ml-6 mb-3 space-y-0.5' {...props} />,
                li: ({ ...props }) => <li className='text-base leading-normal mb-0.5' {...props} />,
                table: ({ ...props }) => (
                  <div className='w-full overflow-x-auto my-4 shadow-sm rounded-xl border border-gray-200'>
                    <table
                      className='min-w-full divide-y divide-gray-200'
                      {...props}
                    />
                    {message.data_table ? (
                      <div className='p-3 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-xl'>
                        <button
                          onClick={() =>
                            downloadAsExcel(message.data_table!, `data_table_${message.id}`)
                          }
                          className='group flex items-center gap-2 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 text-xs font-medium text-green-700 shadow-sm transition-all duration-200 hover:scale-105 hover:from-green-100 hover:to-emerald-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1'
                          title='Download Excel file'
                        >
                          <Download
                            size={14}
                            className='transition-transform group-hover:scale-110'
                          />
                          Download Excel
                        </button>
                      </div>
                    ) : null}
                  </div>
                ),
                th: ({ ...props }) => (
                  <th
                    className='bg-gray-100 px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'
                    {...props}
                  />
                ),
                td: ({ ...props }) => (
                  <td
                    className='px-4 py-3 text-base text-gray-700 border-t border-gray-100'
                    {...props}
                  />
                ),
                code: ({ ...props }) => <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`} {...props} />,
                pre: ({ ...props }) => <pre className={`p-4 rounded-lg overflow-x-auto my-4 text-sm ${message.role === 'user' ? 'bg-blue-700 text-blue-50' : 'bg-gray-900 text-gray-100'}`} {...props} />,
              }}
            >
              {stripCodeFencesAndIndent(message.content)}
            </ReactMarkdown>
          </div>
        )}
      {message.contentType === 'chart' && (
        <div className='flex w-full items-center justify-center rounded-lg bg-gray-50'>
          <ChatVisualization message={message} />
        </div>
      )}
      {message.contentType === 'explore' && (
        <div className='flex w-[50vw] items-center justify-center'>
          <button
            onClick={() =>
              window.open(`https://dashboard.kseb.in/subset-preview/${message.content}`, '_blank')
            }
            className='group flex items-center gap-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
          >
            <svg
              className='h-5 w-5 transition-transform group-hover:scale-110'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            Explore Data
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatMessageContent

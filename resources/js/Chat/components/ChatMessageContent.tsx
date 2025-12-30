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
import styles from './ChatMessageContent.module.css'
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
    <div className={styles.messageWrapper}>
      {message.contentType === 'text' && message.role === 'action' && (
        <div className='w-[50vw]'>
          <Accordion
            type='single'
            collapsible
            className='w-full'
          >
            <AccordionItem value={String(message.id)}>
              <AccordionTrigger>{message.content}</AccordionTrigger>
              <AccordionContent>
                <pre className='max-h-96 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800 shadow-sm'>
                  {formatJsonDescription(message.description ?? '')}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      {message.contentType === 'text' &&
        (message.role === 'assistant' || message.role === 'user') && (
          <div className='w-full'>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ ...props }) => (
                  <div className='w-full overflow-x-auto'>
                    <table
                      className='min-w-full divide-y divide-gray-200'
                      {...props}
                    />
                    {message.data_table ? (
                      <div className='mt-4 flex justify-end'>
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
                    className='bg-gray-100 px-4 py-2 text-left text-xs font-semibold text-gray-700'
                    {...props}
                  />
                ),
                td: ({ ...props }) => (
                  <td
                    className='px-4 py-2 text-sm text-gray-600'
                    {...props}
                  />
                ),
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

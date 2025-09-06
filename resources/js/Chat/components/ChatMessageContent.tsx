import { ChatMessage } from '@/Chat/components/MainArea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from '@/Components/ui/accordion'
import { Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import * as XLSX from 'xlsx'
import styles from './ChatMessageContent.module.css'
import ChatVisualization from './ChatVisualization'

interface Props {
  message: ChatMessage
}

interface ContentTagInfo {
  tag: string
  start: number
  end: number
}

function stripCodeFencesAndIndent(content: string): string {
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

function findTags(content?: string | null) {
  const positions: ContentTagInfo[] = []

  if (content == null) {
    return positions
  }

  const tagName = '<tool_call>'

  let position = 0
  while (position < content.length) {
    position = content.indexOf(tagName)
    if (position === -1) {
      break
    }

    positions.push({
      tag: tagName,
      start: position,
      end: content.indexOf(`</${tagName.slice(1)}`),
    })

    content = content.slice(position + tagName.length)
  }

  return positions
}

const ChatMessageContent = ({ message }: Readonly<Props>) => {
  const downloadAsExcel = (data: object[], filename: string = 'data') => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  return (
    <div className={styles.messageWrapper}>
      {message.contentType === 'text' && (
        <div>
          {/* Display action messages with description in an accordion */}
          {message.role === 'action' && (
            <Accordion
              type='single'
              collapsible
              className='w-full'
            >
              <AccordionItem value={String(message.id)}>
                <AccordionTrigger>{message.content}</AccordionTrigger>
                <AccordionContent>
                  <pre className='max-h-96 overflow-auto rounded bg-gray-100 p-3 font-mono text-sm'>
                    {formatJsonDescription(message.description ?? '')}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {(message.role === 'assistant' || message.role === 'user') && (
            <div>
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
                            className='flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 opacity-60 transition-all hover:bg-gray-50 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-400'
                            title='Download Excel file'
                          >
                            <Download size={12} />
                            Excel
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
              {message.data_table ? (
                <div className='mt-4 flex justify-end'>
                  <button
                    onClick={() => downloadAsExcel(message.data_table!, `data_table_${message.id}`)}
                    className='flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 opacity-60 transition-all hover:bg-gray-50 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-400'
                    title='Download Excel file'
                  >
                    <Download size={12} />
                    Excel
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
      {message.contentType === 'chart' && (
        <div className='flex w-full items-center justify-center rounded-lg bg-gray-50'>
          <ChatVisualization message={message} />
        </div>
      )}
      {message.contentType === 'explore' && (
        <div>
          <button
            onClick={() => (window.location.href = `/subset-preview/${message.content}`)}
            className='rounded-lg border border-blue-600 bg-blue-300 px-4 py-2 font-semibold text-white shadow-md transition duration-200 hover:bg-blue-400'
          >
            Data Explorer
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatMessageContent

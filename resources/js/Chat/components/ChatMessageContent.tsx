import { ChatMessage } from '@/Chat/components/MainArea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/Components/ui/accordion'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import styles from './ChatMessageContent.module.css'
import ChatVisualization from './ChatVisualization'

interface Props {
  message: ChatMessage
}

function stripCodeFencesAndIndent(content: string): string {
  let cleaned = content.replace(/^```[\w]*\n?/, '').replace(/```$/, '')
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n')
  return cleaned
}

const ChatMessageContent = ({ message }: Readonly<Props>) => {
  return (
    <div className={styles.container}>
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
                <AccordionContent>{message.description ?? ''}</AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {(message.role === 'assistant' || message.role === 'user') && (
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
          )}
        </div>
      )}
      {message.contentType === 'chart' && (
        <div className='flex w-full items-center justify-center rounded-lg bg-gray-50'>
          <ChatVisualization message={message} />
        </div>
      )}
    </div>
  )
}

export default ChatMessageContent

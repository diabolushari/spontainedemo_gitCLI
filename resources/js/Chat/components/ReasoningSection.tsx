import { ChevronDown, MoveRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface ChatMessage {
    id: number
    role: string
    content: string
    description?: string
}

interface ReasoningSectionProps {
    messages: ChatMessage[]
    isComplete: boolean
    isLoading: boolean
    status: string
}

function formatJsonDescription(description: string): string {
    try {
        const parsed = JSON.parse(description)
        return JSON.stringify(parsed, null, 2)
    } catch {
        return description
    }
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

export default function ReasoningSection({
    messages,
    isComplete,
    isLoading,
    status,
}: Readonly<ReasoningSectionProps>) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

    useEffect(() => {
        if (isComplete) {
            setIsExpanded(false)
            setExpandedItems(new Set())
        } else {
            setIsExpanded(true)
        }
    }, [isComplete])

    useEffect(() => {
        if (messages.length > 0 && !isComplete && isExpanded) {
            const lastMessage = messages[messages.length - 1]
            setExpandedItems(new Set([lastMessage.id]))
        }
    }, [messages, isComplete, isExpanded])

    const toggleItem = (id: number) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    if (messages.length === 0 && !isLoading) {
        return null
    }

    const getPreviewTitle = (message: ChatMessage): string => {
        if (message.role === 'action') {
            return message.content
        }
        const lines = message.content.split('\n')
        const firstLine = lines.find(l => l.trim().length > 0) || ''
        return firstLine || '...'
    }

    return (
        <div className="w-full mb-4">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-300 bg-white border border-gray-100 hover:border-pink-200 hover:shadow-sm group"
            >
                <div className="flex items-center gap-2">
                    {isLoading && !isComplete && (
                        <div className="w-3.5 h-3.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin shrink-0" />
                    )}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 font-medium text-sm leading-snug">
                        {isComplete ? 'Reasoning Process Completed' : (status || 'Thinking..')}
                    </span>
                </div>
                <div className="text-pink-400 group-hover:text-pink-500 transition-colors">
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <MoveRight className="w-4 h-4" />
                    )}
                </div>
            </button>

            {/* Content */}
            <div
                className={`
                    overflow-y-auto transition-all duration-300 ease-in-out h-36 pr-1
                    ${isExpanded ? 'max-h-[2000px] opacity-100 mt-2.5' : 'max-h-0 opacity-0 mt-0'}
                `}
            >

                <div className="space-y-2">
                    {messages.map((message, index) => {
                        const stepNumber = index + 1
                        const isItemExpanded = expandedItems.has(message.id)
                        const isAction = message.role === 'action'
                        const previewTitle = getPreviewTitle(message)

                        return (
                            <div
                                key={message.id}
                                className={`
                                    relative transition-all duration-300 ease-in-out rounded-xl
                                    ${isItemExpanded
                                        ? 'bg-white border-2 border-pink-300 shadow-md'
                                        : 'bg-white border-2 border-purple-200 hover:border-purple-300 hover:shadow-sm'
                                    }
                                `}
                            >
                                <div
                                    onClick={() => toggleItem(message.id)}
                                    className="flex gap-3 px-3.5 py-2.5 cursor-pointer"
                                >
                                    {/* Number Badge */}
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-gradient-to-r from-purple-500 to-violet-500 text-white">
                                            {stepNumber}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Collapsed State: Preview */}
                                        {!isItemExpanded && (
                                            <div className="flex items-center justify-between pt-0.5">
                                                <span className="text-sm font-medium text-gray-800 truncate pr-3 leading-normal">
                                                    {previewTitle}
                                                </span>
                                            </div>
                                        )}

                                        {/* Expanded State: Full Content */}
                                        {isItemExpanded && (
                                            <div className="animate-in fade-in zoom-in-95 duration-200">
                                                {isAction && (
                                                    <div className="text-sm font-semibold text-gray-800 mb-2 leading-snug">
                                                        {message.content}
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-700 prose prose-p:my-1 prose-pre:my-1 prose-sm max-w-none leading-relaxed">
                                                    {isAction ? (
                                                        message.description && (
                                                            <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 overflow-auto max-h-48 whitespace-pre-wrap font-mono border border-gray-200 leading-relaxed">
                                                                {formatJsonDescription(message.description)}
                                                            </pre>
                                                        )
                                                    ) : (
                                                        <ReactMarkdown
                                                            rehypePlugins={[rehypeRaw]}
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: ({ node, ...props }) => <p className="mb-1.5 last:mb-0 leading-relaxed" {...props} />
                                                            }}
                                                        >
                                                            {stripCodeFencesAndIndent(message.content)}
                                                        </ReactMarkdown>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}


                </div>
            </div>

        </div>
    )
}
import extractJsonMarkdown from '@/Chat/libs/extract-json-markdown'
import { AgentResponseMetaData } from './chatTypes'

// Constants
export const MARKERS = {
    START_OF_ANSWER: '<spontaine:start_of_answer>',
    END_OF_ANSWER: '<spontaine:end_of_answer>',
    START_OF_META: '<spontaine:meta_data>',
    END_OF_META: '</spontaine:meta_data>',
    START_OF_EXTRAS: '<spontaine:extras>',
    END_OF_EXTRAS: '</spontaine:extras>',
}

export const STATUS = {
    SEARCH_VECTOR: 'Searching Knowledge Base',
    FETCH_DATA: 'Retrieving Relevant Data',
    AFTER_FETCH: 'Finalizing Result',
    AFTER_VECTOR: 'Constructing Search',
    START: 'Analyzing User Query',
    STREAMING_META: 'Processing Results',
}

export type StreamState = {
    isCollectingInlineMeta: boolean
    inlineMetaBuffer: string
    isCollectingExtras: boolean
    extrasBuffer: string
    streamBuffer: string
}

export class StreamProcessor {
    private state: StreamState

    constructor(initialState?: Partial<StreamState>) {
        this.state = {
            isCollectingInlineMeta: false,
            inlineMetaBuffer: '',
            isCollectingExtras: false,
            extrasBuffer: '',
            streamBuffer: '',
            ...initialState,
        }
    }

    reset() {
        this.state = {
            isCollectingInlineMeta: false,
            inlineMetaBuffer: '',
            isCollectingExtras: false,
            extrasBuffer: '',
            streamBuffer: '',
        }
    }

    getState(): StreamState {
        return { ...this.state }
    }

    append(content: string) {
        this.state.streamBuffer += content
    }

    process(): { text: string; meta: AgentResponseMetaData | null; extras: string | null } {
        let text = ''
        let meta: AgentResponseMetaData | null = null
        let extras: string | null = null

        while (this.state.streamBuffer) {
            if (this.state.isCollectingInlineMeta) {
                const endIdx = this.state.streamBuffer.indexOf(MARKERS.END_OF_META)
                if (endIdx !== -1) {
                    this.state.inlineMetaBuffer += this.state.streamBuffer.substring(0, endIdx)

                    try {
                        const parsed = extractJsonMarkdown(this.state.inlineMetaBuffer) as AgentResponseMetaData | null
                        if (parsed && (parsed.visualization || parsed.data_explore || parsed.explore_data || parsed.suggestions || parsed.widget_generation)) {
                            meta = parsed
                        }
                    } catch (e) {
                        console.warn("Failed to parse inline metadata", e)
                    }

                    this.state.inlineMetaBuffer = ''
                    this.state.isCollectingInlineMeta = false
                    this.state.streamBuffer = this.state.streamBuffer.substring(endIdx + MARKERS.END_OF_META.length)
                } else {
                    this.state.inlineMetaBuffer += this.state.streamBuffer
                    this.state.streamBuffer = ''
                }
            } else if (this.state.isCollectingExtras) {
                const endIdx = this.state.streamBuffer.indexOf(MARKERS.END_OF_EXTRAS)
                if (endIdx !== -1) {
                    this.state.extrasBuffer += this.state.streamBuffer.substring(0, endIdx)
                    extras = this.state.extrasBuffer

                    this.state.extrasBuffer = ''
                    this.state.isCollectingExtras = false
                    this.state.streamBuffer = this.state.streamBuffer.substring(endIdx + MARKERS.END_OF_EXTRAS.length)
                } else {
                    this.state.extrasBuffer += this.state.streamBuffer
                    this.state.streamBuffer = ''
                }
            } else {
                const startMetaIdx = this.state.streamBuffer.indexOf(MARKERS.START_OF_META)
                const startExtrasIdx = this.state.streamBuffer.indexOf(MARKERS.START_OF_EXTRAS)

                const hasMeta = startMetaIdx !== -1
                const hasExtras = startExtrasIdx !== -1

                if (hasMeta || hasExtras) {
                    const isMetaFirst = hasMeta && (!hasExtras || startMetaIdx < startExtrasIdx)
                    const firstMarkerIdx = isMetaFirst ? startMetaIdx : startExtrasIdx
                    
                    text += this.state.streamBuffer.substring(0, firstMarkerIdx)

                    if (isMetaFirst) {
                        this.state.isCollectingInlineMeta = true
                        this.state.streamBuffer = this.state.streamBuffer.substring(firstMarkerIdx + MARKERS.START_OF_META.length)
                    } else {
                        this.state.isCollectingExtras = true
                        this.state.streamBuffer = this.state.streamBuffer.substring(firstMarkerIdx + MARKERS.START_OF_EXTRAS.length)
                    }
                } else {
                    let matchedPartial = false
                    
                    for (const marker of [MARKERS.START_OF_META, MARKERS.START_OF_EXTRAS]) {
                        const minLen = Math.min(this.state.streamBuffer.length, marker.length - 1)
                        for (let i = minLen; i > 0; i--) {
                            if (marker.startsWith(this.state.streamBuffer.slice(-i))) {
                                text += this.state.streamBuffer.substring(0, this.state.streamBuffer.length - i)
                                this.state.streamBuffer = this.state.streamBuffer.slice(-i)
                                matchedPartial = true
                                break
                            }
                        }
                        if (matchedPartial) break
                    }

                    if (!matchedPartial) {
                        text += this.state.streamBuffer
                        this.state.streamBuffer = ''
                    }
                    break
                }
            }
        }

        return { text, meta, extras }
    }
}

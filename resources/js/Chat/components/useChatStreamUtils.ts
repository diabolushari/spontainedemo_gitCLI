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
        let resultText = ''
        let resultMeta: AgentResponseMetaData | null = null
        let resultExtras: string | null = null

        // Helper to process recursively
        const processLoop = () => {
            if (this.state.streamBuffer === '') return

            if (this.state.isCollectingInlineMeta) {
                const endIdx = this.state.streamBuffer.indexOf(MARKERS.END_OF_META)
                if (endIdx !== -1) {
                    // Found end of meta data
                    this.state.inlineMetaBuffer += this.state.streamBuffer.substring(0, endIdx)

                    try {
                        const parsed = extractJsonMarkdown(this.state.inlineMetaBuffer) as AgentResponseMetaData | null
                        if (parsed && (parsed.visualization || parsed.data_explore || parsed.suggestions || parsed.widget_generation)) {
                            resultMeta = parsed
                        }
                    } catch (e) {
                        console.warn("Failed to parse inline metadata", e)
                    }

                    this.state.inlineMetaBuffer = ''
                    this.state.isCollectingInlineMeta = false
                    this.state.streamBuffer = this.state.streamBuffer.substring(endIdx + MARKERS.END_OF_META.length)
                    processLoop()
                } else {
                    this.state.inlineMetaBuffer += this.state.streamBuffer
                    this.state.streamBuffer = ''
                }
            } else if (this.state.isCollectingExtras) {
                const endIdx = this.state.streamBuffer.indexOf(MARKERS.END_OF_EXTRAS)
                if (endIdx !== -1) {
                    this.state.extrasBuffer += this.state.streamBuffer.substring(0, endIdx)
                    resultExtras = this.state.extrasBuffer

                    this.state.extrasBuffer = ''
                    this.state.isCollectingExtras = false
                    this.state.streamBuffer = this.state.streamBuffer.substring(endIdx + MARKERS.END_OF_EXTRAS.length)
                    processLoop()
                } else {
                    this.state.extrasBuffer += this.state.streamBuffer
                    this.state.streamBuffer = ''
                }
            } else {
                // Look for markers
                const startMetaIdx = this.state.streamBuffer.indexOf(MARKERS.START_OF_META)
                const startExtrasIdx = this.state.streamBuffer.indexOf(MARKERS.START_OF_EXTRAS)

                let firstMarkerIdx = -1
                let markerType: 'meta' | 'extras' | null = null

                if (startMetaIdx !== -1 && startExtrasIdx !== -1) {
                    if (startMetaIdx < startExtrasIdx) {
                        firstMarkerIdx = startMetaIdx
                        markerType = 'meta'
                    } else {
                        firstMarkerIdx = startExtrasIdx
                        markerType = 'extras'
                    }
                } else if (startMetaIdx !== -1) {
                    firstMarkerIdx = startMetaIdx
                    markerType = 'meta'
                } else if (startExtrasIdx !== -1) {
                    firstMarkerIdx = startExtrasIdx
                    markerType = 'extras'
                }

                if (firstMarkerIdx !== -1) {
                    resultText += this.state.streamBuffer.substring(0, firstMarkerIdx)

                    if (markerType === 'meta') {
                        this.state.isCollectingInlineMeta = true
                        this.state.streamBuffer = this.state.streamBuffer.substring(firstMarkerIdx + MARKERS.START_OF_META.length)
                    } else {
                        this.state.isCollectingExtras = true
                        this.state.streamBuffer = this.state.streamBuffer.substring(firstMarkerIdx + MARKERS.START_OF_EXTRAS.length)
                    }
                    processLoop()
                } else {
                    // No start marker found, handle partial markers at end
                    const minLengthToCheck = MARKERS.START_OF_META.length - 1
                    if (this.state.streamBuffer.length > minLengthToCheck) {
                        let partialMatchLength = 0
                        for (let i = 1; i <= minLengthToCheck; i++) {
                            const tail = this.state.streamBuffer.slice(-i)
                            if (MARKERS.START_OF_META.startsWith(tail)) {
                                partialMatchLength = i
                            }
                        }

                        if (partialMatchLength > 0) {
                            const safeLength = this.state.streamBuffer.length - partialMatchLength
                            resultText += this.state.streamBuffer.substring(0, safeLength)
                            this.state.streamBuffer = this.state.streamBuffer.substring(safeLength)
                        } else {
                            resultText += this.state.streamBuffer
                            this.state.streamBuffer = ''
                        }
                    } else {
                        if (MARKERS.START_OF_META.startsWith(this.state.streamBuffer)) {
                            // Potential marker start, keep in buffer
                        } else {
                            resultText += this.state.streamBuffer
                            this.state.streamBuffer = ''
                        }
                    }
                }
            }
        }

        processLoop()

        return { text: resultText, meta: resultMeta, extras: resultExtras }
    }
}

import React from 'react'
import { Sparkles, ArrowRight, Pencil } from 'lucide-react'
import Modal from '@/ui/Modal/Modal'
import { router } from '@inertiajs/react'

interface WidgetGenerationData {
    should_create_widget: boolean
    rationale?: string
    generation_prompt: string
}

interface WidgetGenerationCardProps {
    widgetGeneration: WidgetGenerationData
}

const WidgetGenerationCard: React.FC<WidgetGenerationCardProps> = ({ widgetGeneration }) => {
    const [prompt, setPrompt] = React.useState(widgetGeneration.generation_prompt)
    const [isEditing, setIsEditing] = React.useState(false)
    const [editedPrompt, setEditedPrompt] = React.useState(prompt)

    React.useEffect(() => {
        setPrompt(widgetGeneration.generation_prompt)
        setEditedPrompt(widgetGeneration.generation_prompt)
    }, [widgetGeneration.generation_prompt])

    if (!widgetGeneration.should_create_widget) {
        return null
    }

    const handleGotoEditor = () => {
        router.get(route('widget-editor.create'), {
            collection_id: 1,
            type: 'overview',
            source_query: prompt
        })
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setPrompt(editedPrompt)
        setIsEditing(false)
    }

    return (
        <>
            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-white to-teal-50/30 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-teal-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-gray-900 font-semibold text-base">
                                Create a widget
                            </h4>
                            <button
                                onClick={() => {
                                    setEditedPrompt(prompt)
                                    setIsEditing(true)
                                }}
                                className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                title="Edit prompt"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                            {prompt}
                        </p>

                        {/* Button */}
                        <button
                            onClick={handleGotoEditor}
                            className="inline-flex items-center justify-between w-full max-w-md px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm rounded-lg transition-colors duration-200 group"
                        >
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Goto Widget Editor
                            </span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <Modal setShowModal={() => setIsEditing(false)} title="Edit Widget Prompt">
                    <form onSubmit={handleSave} className="px-6 pb-2">
                        <div className="mb-4">
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                                Generation Prompt
                            </label>
                            <textarea
                                id="prompt"
                                value={editedPrompt}
                                onChange={(e) => setEditedPrompt(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y min-h-[120px]"
                                placeholder="Enter widget generation prompt..."
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Confirm Edit
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    )
}

export default WidgetGenerationCard

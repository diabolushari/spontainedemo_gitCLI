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
      collectionId: 1,
      type: 'overview',
      sourceQuery: prompt,
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setPrompt(editedPrompt)
    setIsEditing(false)
  }

  return (
    <>
      <div className='rounded-2xl border border-teal-100 bg-gradient-to-br from-white to-teal-50/30 p-4 shadow-sm'>
        <div className='flex items-start gap-3'>
          {/* Icon */}
          <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50'>
            <Sparkles className='h-5 w-5 text-teal-500' />
          </div>

          {/* Content */}
          <div className='min-w-0 flex-1'>
            <div className='mb-1 flex items-center justify-between'>
              <h4 className='text-base font-semibold text-gray-900'>Create a widget</h4>
              <button
                onClick={() => {
                  setEditedPrompt(prompt)
                  setIsEditing(true)
                }}
                className='rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-600'
                title='Edit prompt'
              >
                <Pencil className='h-4 w-4' />
              </button>
            </div>

            <p className='mb-3 line-clamp-2 text-sm leading-relaxed text-gray-500'>{prompt}</p>

            {/* Button */}
            <button
              onClick={handleGotoEditor}
              className='group inline-flex w-full max-w-md items-center justify-between rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600'
            >
              <span className='flex items-center gap-2'>
                <Sparkles className='h-4 w-4' />
                Continue to create widget
              </span>
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <Modal
          setShowModal={() => setIsEditing(false)}
          title='Edit Widget Prompt'
        >
          <form
            onSubmit={handleSave}
            className='px-6 pb-2'
          >
            <div className='mb-4'>
              <label
                htmlFor='prompt'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                Generation Prompt
              </label>
              <textarea
                id='prompt'
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className='min-h-[120px] w-full resize-y rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500'
                placeholder='Enter widget generation prompt...'
                required
              />
            </div>

            <div className='flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={() => setIsEditing(false)}
                className='rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700'
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

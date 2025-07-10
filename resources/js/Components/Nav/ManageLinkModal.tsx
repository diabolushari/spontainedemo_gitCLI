import React, { useState } from 'react'
import Modal from '@/ui/Modal/Modal'

interface ManageLinkModalProps {
  // The mode determines the modal's behavior and appearance
  mode: 'add' | 'edit'
  // Function to control the modal's visibility
  setShowModal: (value: boolean) => void
  // The title to display at the top of the modal (e.g., "Add Link" or "Edit Link")
  title: string
  // The text for the primary action button (e.g., "ADD" or "UPDATE")
  submitButtonText: string
  // Optional initial value for the name field (used in 'edit' mode)
  initialName?: string
  // Optional initial value for the link field (used in 'edit' mode)
  initialLink?: string
  // Optional initial value for the position field (used in 'edit' mode)
  initialPosition?: number
  // Callback for when the form is submitted
  onSubmit: (name: string, link: string, position: number) => void
  // Optional callback for when the "REMOVE" button is clicked (only shown in 'edit' mode)
  onRemove?: () => void
}

/**
 * A reusable modal for both adding and editing a link.
 * Its behavior is configured via props from the parent component.
 */
export default function ManageLinkModal({
  mode,
  setShowModal,
  title,
  submitButtonText,
  initialName = '',
  initialLink = '',
  initialPosition,
  onSubmit,
  onRemove,
}: ManageLinkModalProps) {
  const [name, setName] = useState(initialName)
  const [link, setLink] = useState(initialLink)
  // Add state for the new position field
  const [position, setPosition] = useState(initialPosition?.toString() ?? '')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Parse position to a number before submitting
    const positionAsNumber = parseInt(position, 10)
    // Ensure all fields are valid before submitting
    if (name && link && !isNaN(positionAsNumber)) {
      onSubmit(name, link, positionAsNumber)
    }
  }

  return (
    <Modal
      title={title}
      setShowModal={setShowModal}
    >
      <div className='px-6 pb-2 pt-4'>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className='mb-4'>
            <label
              className='mb-2 block text-sm font-semibold text-gray-800'
              htmlFor='link-name'
            >
              Name
            </label>
            <input
              id='link-name'
              type='text'
              placeholder='e.g. About Us'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Link URL Input */}
          <div className='mb-4'>
            <label
              className='mb-2 block text-sm font-semibold text-gray-800'
              htmlFor='link-url'
            >
              Link
            </label>
            <input
              id='link-url'
              type='text'
              placeholder='e.g. /about'
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className='w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Position Input - NEW */}
          <div className='mb-8'>
            <label
              className='mb-2 block text-sm font-semibold text-gray-800'
              htmlFor='link-position'
            >
              Position
            </label>
            <input
              id='link-position'
              type='number'
              placeholder='e.g. 1'
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className='w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
              min='0'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-end space-x-4'>
            <button
              type='submit'
              className='rounded-md bg-blue-700 px-6 py-2 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              {submitButtonText}
            </button>

            {/* The "Remove" button is only rendered in 'edit' mode */}
            {mode === 'edit' && onRemove && (
              <button
                type='button'
                onClick={onRemove}
                className='rounded-md bg-red-600 px-6 py-2 font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              >
                REMOVE
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  )
}

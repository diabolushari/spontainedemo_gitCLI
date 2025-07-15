import React, { useEffect, useState } from 'react'
import Modal from '@/ui/Modal/Modal'
import { IconDropdownPicker } from '@/Components/Nav/IconDropdownPicker'

interface ManageLinkModalProps {
  mode: 'add' | 'edit'
  setShowModal: (value: boolean) => void
  title: string
  submitButtonText: string
  itemId?: number
  initialName?: string
  initialLink?: string
  initialIcon?: string
  initialPosition?: number
  // onSubmit now passes back the ID for 'edit' mode
  onSubmit: (
    formData: { name: string; link: string; position: number; icon: string },
    id?: number
  ) => void
  // onRemove now passes back the ID of the item to remove
  onRemove?: (id: number) => void
}

/**
 * A reusable modal for adding or editing a navigation item (section or link).
 * It receives its configuration and data via props and communicates actions
 * back to the parent component through callbacks.
 */
export default function ManageLinkModal({
  mode,
  setShowModal,
  title,
  submitButtonText,
  itemId,
  initialName = '',
  initialLink = '',
  initialPosition,
  initialIcon = 'activity',
  onSubmit,
  onRemove,
}: ManageLinkModalProps) {
  const [name, setName] = useState(initialName)
  const [link, setLink] = useState(initialLink)
  const [position, setPosition] = useState(initialPosition?.toString() ?? '')
  const [selectedIcon, setSelectedIcon] = useState<string>(initialIcon)

  // This effect prevents a "stale state" bug by resetting the form fields
  // whenever the modal is opened for a new item.
  useEffect(() => {
    setName(initialName)
    setLink(initialLink)
    setPosition(initialPosition?.toString() ?? '')
    setSelectedIcon(initialIcon || 'activity')
  }, [initialName, initialLink, initialPosition, itemId, initialIcon])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const positionAsNumber = parseInt(position, 10)
    if (name && link && !isNaN(positionAsNumber)) {
      // Pass the form data and the item's ID back to the parent.
      onSubmit({ name, link, position: positionAsNumber, icon: selectedIcon }, itemId)
    } else {
      alert('Please fill out all fields with valid values.')
    }
  }

  const handleRemoveClick = () => {
    // If an onRemove handler exists and we have an ID, call it.
    if (onRemove && itemId !== undefined) {
      onRemove(itemId)
      setShowModal(false) // Close modal after the action is triggered
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
              htmlFor='item-name'
            >
              Name
            </label>
            <input
              id='item-name'
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
              htmlFor='item-url'
            >
              Link
            </label>
            <input
              id='item-url'
              type='text'
              placeholder='e.g. /about'
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className='w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Position Input */}
          <div className='mb-8'>
            <label
              className='mb-2 block text-sm font-semibold text-gray-800'
              htmlFor='item-position'
            >
              Position
            </label>
            <input
              id='item-position'
              type='number'
              placeholder='e.g. 1'
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className='w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
              min='0'
            />
          </div>
          <IconDropdownPicker
            value={selectedIcon}
            onChange={setSelectedIcon}
          />

          {/* Action Buttons */}
          <div className='flex items-center justify-end space-x-4'>
            {/*TODO: Move Remove to separate component.*/}
            {mode === 'edit' && onRemove && (
              <button
                type='button'
                onClick={handleRemoveClick}
                className='rounded-md bg-red-600 px-6 py-2 font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              >
                REMOVE
              </button>
            )}
            <button
              type='submit'
              className='rounded-md bg-blue-700 px-6 py-2 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

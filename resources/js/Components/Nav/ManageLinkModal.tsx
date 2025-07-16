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
  onSubmit: (
    formData: { name: string; link: string; position: number; icon: string },
    id?: number
  ) => void
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
}: ManageLinkModalProps) {
  const [name, setName] = useState(initialName)
  const [link, setLink] = useState(initialLink)
  const [position, setPosition] = useState(initialPosition?.toString() ?? '')
  const [selectedIcon, setSelectedIcon] = useState<string>(initialIcon)

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
      onSubmit({ name, link, position: positionAsNumber, icon: selectedIcon }, itemId)
    } else {
      alert('Please fill out all fields with valid values.')
    }
  }

  return (
    <Modal
      title={title}
      setShowModal={setShowModal}
    >
      <div className='px-6 pb-2 pt-4'>
        <form onSubmit={handleSubmit}>
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

          <div className='flex items-center justify-end space-x-4'>
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

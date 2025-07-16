// src/Pages/Admin/NavEditorIndexPage.tsx

import React, { useEffect, useState } from 'react'
import { AlertCircle, Pencil, Plus, Trash2 } from 'lucide-react'

import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import Card from '@/ui/Card/Card'
import ManageLinkModal from '@/Components/Nav/ManageLinkModal'
import { router } from '@inertiajs/react'

interface NavItem {
  id: number
  item_label: string
  item_url: string
  item_pos: number
  item_icon: string
}

interface NavGroup {
  id: number
  group_label: string
  group_url: string
  group_pos: number
  group_icon: string
  nav_items: NavItem[]
}

interface NavEditorIndexPageProps {
  allNavData: NavGroup[]
}

type ModalType = 'addSection' | 'editSection' | 'addLink' | 'editLink'

interface ModalState {
  isOpen: boolean
  type: ModalType | null
  data?: NavGroup | NavItem | { parentGroupId: number }
}

export default function NavEditorIndexPage({ allNavData }: NavEditorIndexPageProps) {
  const [navData, setNavData] = useState<NavGroup[]>(allNavData || [])
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: undefined,
  })

  useEffect(() => {
    const sanitizedData = (allNavData || []).map((section) => ({
      ...section,
      nav_items: section.nav_items || [],
    }))
    setNavData(sanitizedData)
  }, [allNavData])

  const openModal = (type: ModalType, data?: ModalState['data']) =>
    setModalState({ isOpen: true, type, data })
  const closeModal = () => setModalState({ isOpen: false, type: null, data: undefined })

  const handleApiError = (message: string, error: any) => {
    console.error(message, error)
    alert(`Error: ${message}. See console for details.`)
  }

  // --- CRUD API Handlers ---

  const handleCreateSection = React.useCallback(
    async (formData: { name: string; link: string; position: number; icon: string }) => {
      try {
        router.post('/nav-group', {
          group_label: formData.name,
          group_url: formData.link,
          nav_type: 'dashboard',
          group_pos: formData.position,
          group_icon: formData.icon,
        })
        closeModal()
      } catch (error) {
        handleApiError('Failed to create section', error)
      }
    },
    [closeModal, handleApiError]
  )

  const handleUpdateSection = React.useCallback(
    async (
      formData: { name: string; link: string; position: number; icon: string },
      sectionId: number
    ) => {
      try {
        router.put(`/nav-group/${sectionId}`, {
          group_icon: formData.icon,
          group_label: formData.name,
          group_url: formData.link,
          group_pos: formData.position,
          nav_type: 'dashboard',
        })

        closeModal()
      } catch (error) {
        handleApiError('Failed to update section', error)
      }
    },
    [closeModal, handleApiError]
  )

  const handleDeleteSection = React.useCallback(
    async (sectionId: number) => {
      if (!window.confirm('Are you sure you want to delete this entire section and all its links?'))
        return
      try {
        router.delete(`/nav-group/${sectionId}`)
      } catch (error) {
        handleApiError('Failed to delete section', error)
      }
    },
    [handleApiError]
  )

  const handleCreateLink = React.useCallback(
    async (formData: { name: string; link: string; position: number; icon: string }) => {
      const { parentGroupId } = modalState.data as { parentGroupId: number }
      try {
        await router.post('/nav-item', {
          nav_group_id: parentGroupId,
          item_label: formData.name,
          item_url: formData.link,
          item_pos: formData.position,
          item_icon: formData.icon,
        })
        closeModal()
      } catch (error) {
        handleApiError('Failed to create link', error)
      }
    },
    [modalState, closeModal, handleApiError]
  )

  const handleUpdateLink = React.useCallback(
    async (
      formData: { name: string; link: string; position: number; icon: string },
      linkId: number
    ) => {
      try {
        await router.put(`/nav-item/${linkId}`, {
          item_label: formData.name,
          item_url: formData.link,
          item_pos: formData.position,
          item_icon: formData.icon,
        })
        closeModal()
      } catch (error) {
        handleApiError('Failed to update link', error)
      }
    },
    [closeModal, handleApiError]
  )

  const handleDeleteLink = React.useCallback(
    async (linkId: number) => {
      if (!window.confirm('Are you sure you want to delete this link?')) return
      try {
        await router.delete(`/nav-item/${linkId}`)
      } catch (error) {
        handleApiError('Failed to delete link', error)
      }
    },
    [handleApiError]
  )

  // Compute modalProps using useMemo for optimization
  const modalProps = React.useMemo(() => {
    if (!modalState.isOpen) return null
    const { type, data } = modalState

    switch (type) {
      case 'addSection':
        return {
          mode: 'add' as const,
          title: 'Add Section',
          submitButtonText: 'Create Section',
        }
      case 'editSection': {
        const section = data as NavGroup
        return {
          mode: 'edit' as const,
          title: 'Edit Section',
          submitButtonText: 'Update Section',
          itemId: section.id,
          initialName: section.group_label,
          initialLink: section.group_url,
          initialPosition: section.group_pos,
          initialIcon: section.group_icon,
        }
      }
      case 'addLink':
        return {
          mode: 'add' as const,
          title: 'Add Link',
          submitButtonText: 'Create Link',
        }
      case 'editLink': {
        const link = data as NavItem
        return {
          mode: 'edit' as const,
          title: 'Edit Link',
          submitButtonText: 'Update Link',
          itemId: link.id,
          initialName: link.item_label,
          initialLink: link.item_url,
          initialPosition: link.item_pos,
          initialIcon: link.item_icon,
        }
      }
      default:
        return null
    }
  }, [modalState, handleCreateSection, handleUpdateSection, handleCreateLink, handleUpdateLink])

  const handleSubmit = (
    formData: { name: string; link: string; position: number; icon: string },
    id?: number
  ) => {
    if (!modalState.type) return

    switch (modalState.type) {
      case 'addSection':
        return handleCreateSection(formData)
      case 'editSection':
        if (modalState.data && 'id' in modalState.data) {
          return handleUpdateSection(formData, modalState.data.id)
        }
        break
      case 'addLink':
        return handleCreateLink(formData)
      case 'editLink':
        if (modalState.data && 'id' in modalState.data) {
          return handleUpdateLink(formData, modalState.data.id)
        }
        break
    }
  }

  return (
    <AnalyticsDashboardLayout
      title='Navigation Editor'
      description='Manage site navigation'
      type='Administration'
      subtype='Navigation'
      handleCardRef={() => {}}
    >
      <div className='p-5 md:p-6 lg:p-8'>
        <Card className='p-6'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <h1 className='text-2xl font-bold text-gray-800'>Navigation Editor</h1>
          </div>
          <div className='mt-6 flex items-center gap-3 rounded-md bg-blue-50 p-4'>
            <AlertCircle className='h-6 w-6 flex-shrink-0 text-blue-500' />
            <p className='text-sm font-medium text-blue-800'>
              Changes are saved instantly when you add, edit, or delete items.
            </p>
          </div>
          <div className='mt-8 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-gray-200 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {navData.map((section) => (
              <div
                key={section.id}
                className='flex flex-col gap-2'
              >
                <div className='flex items-center justify-between'>
                  <h3 className='text-base font-bold text-gray-900'>{section.group_label}</h3>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => openModal('editSection', section)}
                      aria-label={`Edit ${section.group_label}`}
                    >
                      <Pencil className='h-4 w-4 text-gray-400 hover:text-gray-700' />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      aria-label={`Delete ${section.group_label}`}
                    >
                      <Trash2 className='h-4 w-4 text-red-400 hover:text-red-600' />
                    </button>
                  </div>
                </div>
                <div className='flex flex-col items-start gap-1 border-l-2 border-gray-100 pl-2'>
                  {/* FIX: Add a fallback empty array to prevent crash if nav_items is undefined */}
                  {(section.nav_items || []).map((link) => (
                    <div
                      key={link.id}
                      className='group flex w-full items-center justify-between'
                    >
                      <button
                        className='text-sm text-blue-600 hover:underline'
                        onClick={() => openModal('editLink', link)}
                      >
                        {link.item_label}
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        aria-label={`Delete ${link.item_label}`}
                        className='opacity-0 transition-opacity group-hover:opacity-100'
                      >
                        <Trash2 className='h-3 w-3 text-red-400 hover:text-red-600' />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => openModal('addLink', { parentGroupId: section.id })}
                  className='mt-2 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800'
                >
                  <Plus className='h-4 w-4' />
                  Add Link
                </button>
              </div>
            ))}
            <div className='flex items-start'>
              <button
                className='flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800'
                onClick={() => openModal('addSection')}
              >
                <Plus className='h-4 w-4' />
                Add Section
              </button>
            </div>
          </div>
        </Card>
      </div>
      {modalState.isOpen && modalProps && (
        <ManageLinkModal
          setShowModal={() => closeModal()}
          onSubmit={handleSubmit}
          mode={modalProps.mode}
          title={modalProps.title}
          submitButtonText={modalProps.submitButtonText}
          itemId={modalProps.itemId}
          initialName={modalProps.initialName}
          initialLink={modalProps.initialLink}
          initialPosition={modalProps.initialPosition}
          initialIcon={modalProps.initialIcon}
        />
      )}
    </AnalyticsDashboardLayout>
  )
}

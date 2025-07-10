import React, { useState } from 'react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import Card from '@/ui/Card/Card'
import { AlertCircle, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import ManageLinkModal from '@/Components/Nav/ManageLinkModal'
import axios from 'axios'

// Mock data to represent the navigation structure
const mockNavData = [
  {
    id: 1,
    title: 'About Kadodo Platform',
    links: [{ id: 101, text: 'Why Kadodo' }],
  },
  {
    id: 2,
    title: 'Resources',
    links: [
      { id: 201, text: 'How-to Guide' },
      { id: 202, text: 'Downloads' },
    ],
  },
  {
    id: 3,
    title: 'Test Section',
    links: [],
  },
]

export default function NavEditorIndexPage({ allNavData }) {
  console.log(allNavData)
  // State to manage the selected navigation section from the dropdown
  const [selectedSection, setSelectedSection] = useState('resources')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddLinkModal, setShowAddLinkModal] = useState(false)
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)
  const [showEditSectionModal, setShowEditSectionModal] = useState(false)
  const [navData, setNavData] = useState(allNavData)
  const [editName, setEditName] = useState('')
  const [editlink, setEditLink] = useState('')
  const [currentSection, setCurrentSection] = useState<number>(null)

  const handleNoOpScroll = () => {
    // No-op function to satisfy the layout's prop requirement.
  }

  const handleCreateSection = async (name: string, link: string, pos: number) => {
    try {
      const response = await axios.post('/nav-group', {
        group_label: name,
        group_url: link,
        nav_type: 'h',
        group_icon: 'h',
        group_pos: pos,
      })
      console.log('Created Nav Group:', response.data.data)
      // setNavData(...navData, response.data.data)
      location.reload()
    } catch (error) {
      console.error('Failed to create nav group:', error)
    }
  }

  const handleCreateLink = async (name: string, link: string, pos: number) => {
    try {
      const response = await axios.post('/nav-item', {
        nav_group_id: currentSection,
        item_label: name,
        item_url: link,
        item_icon: 'fa-dashboard',
        item_pos: pos,
      })
      console.log('Created Item Group:', response.data.data)
      location.reload()
      // setNavData(...navData, response.data.data)
    } catch (error) {
      console.error('Failed to create nav group:', error)
    }
  }

  const handleAddSection = () => {
    setShowAddSectionModal(true)
  }

  const handleEditSection = (section) => {
    setEditName(section.group_label)
    setEditLink(section.group_url)
    setShowEditSectionModal(true)
  }
  const handleEditLink = (section, group_id) => {
    setEditName(section.item_label)
    setEditLink(section.item_url)
    setShowEditModal(true)
  }

  const handleAddLinkModal = (section) => {
    setCurrentSection(section.id)
    setShowAddLinkModal(true)
  }

  return (
    <AnalyticsDashboardLayout
      title='Navigation Editor'
      description='Manage site navigation'
      type='Administration'
      subtype='Navigation'
      handleCardRef={handleNoOpScroll}
    >
      {/* Main content area with padding */}
      <div className='p-5 md:p-6 lg:p-8'>
        <Card className='p-6'>
          {/* 1. Header Section */}
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <h1 className='text-2xl font-bold text-gray-800'>Navigation Editor</h1>
            <button className='flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'>
              English
              <ChevronRight className='h-4 w-4 text-gray-400' />
            </button>
          </div>

          {/* 2. Navigation Section Selector */}
          <div className='mt-6 flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4'>
            <label
              htmlFor='nav-section'
              className='whitespace-nowrap text-sm font-semibold text-gray-700'
            >
              Select Navigation Section
            </label>
            <select
              id='nav-section'
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            >
              <option value='resources'>Resources</option>
              <option value='main'>Main Menu</option>
              <option value='footer'>Footer Links</option>
            </select>
            <button className='flex-shrink-0 rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300'>
              <Plus className='h-5 w-5' />
            </button>
          </div>

          {/* 3. Alert and Actions Banner */}
          <div className='mt-6 flex flex-col items-start justify-between gap-4 rounded-md bg-yellow-50 p-4 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-3'>
              <AlertCircle className='h-6 w-6 flex-shrink-0 text-yellow-500' />
              <p className='text-sm font-medium text-yellow-800'>
                Make sure to save changes before changing nav menu item.
              </p>
            </div>
            <div className='flex w-full flex-shrink-0 items-center gap-2 sm:w-auto'>
              <button className='w-full flex-grow rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto'>
                Save Changes
              </button>
              <button className='rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-100'>
                <Pencil className='h-5 w-5' />
              </button>
              <button className='rounded-md border border-gray-300 bg-white p-2 text-red-500 hover:bg-gray-100'>
                <Trash2 className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* 4. Navigation Tree Grid */}
          <div className='mt-8 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-gray-200 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {navData.map((section) => (
              <div
                key={section.id}
                className='flex flex-col gap-2'
              >
                <h3 className='flex items-center gap-2 text-base font-bold text-gray-900'>
                  {section.group_label}
                  <button onClick={() => handleEditSection(section)}>
                    <Pencil className='h-4 w-4 text-gray-400 hover:text-gray-700' />
                  </button>
                </h3>
                <div className='flex flex-col items-start gap-1'>
                  {section.nav_items.map((link) => (
                    <button
                      key={link.id}
                      className='text-sm text-blue-600 hover:underline'
                      onClick={() => handleEditLink(link, section.id)}
                    >
                      {link.item_label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleAddLinkModal(section)}
                  className='mt-2 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800'
                >
                  <Plus className='h-4 w-4' />
                  Add Link
                </button>
              </div>
            ))}
            {/* "Add Section" Column */}
            <div className='flex items-start'>
              <button
                className='flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800'
                onClick={() => handleAddSection()}
              >
                <Plus className='h-4 w-4' />
                Add Section
              </button>
            </div>
          </div>
        </Card>
      </div>
      {showEditModal && (
        <ManageLinkModal
          mode='edit'
          title='Edit Link'
          setShowModal={setShowEditModal}
          submitButtonText='Update'
          initialName={editName}
          initialLink={editlink}
        />
      )}
      {showAddLinkModal && (
        <ManageLinkModal
          mode='add'
          submitButtonText='Submit'
          title='Add Link'
          onSubmit={handleCreateLink}
          setShowModal={setShowAddLinkModal}
        />
      )}
      {showAddSectionModal && (
        <ManageLinkModal
          mode='add'
          submitButtonText='Submit'
          title='Add Section'
          setShowModal={setShowAddSectionModal}
          onSubmit={handleCreateSection}
        />
      )}
      {showEditSectionModal && (
        <ManageLinkModal
          mode='edit'
          submitButtonText='Update'
          title='Edit Section'
          initialName={editName}
          initialLink={editlink}
          setShowModal={setShowEditSectionModal}
        />
      )}
    </AnalyticsDashboardLayout>
  )
}

import React from 'react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'

/**
 * The NavEditorIndexPage provides a UI for managing the application's navigation.
 * It uses the AnalyticsDashboardLayout for a consistent page frame but applies
 * its own padding directly to the content for a custom layout.
 */
export default function NavEditorIndexPage() {
  const handleNoOpScroll = () => {}

  return (
    <AnalyticsDashboardLayout
      title='Navigation Editor'
      description="Manage the application's main navigation links and structure."
      type='Administration'
      subtype='Navigation'
      handleCardRef={handleNoOpScroll}
    >
      <div className='flex flex-col gap-5 p-5'>
        <CardHeader
          title='Navigation Editor'
          subheading='Add, remove, and reorder items in the main menu.'
        />

        <Card className='p-6'>
          <h3 className='text-xl font-semibold text-gray-800'>Editor Interface</h3>
          <p className='mt-2 text-gray-500'>
            The components for managing the navigation tree will be rendered below.
          </p>

          <div className='mt-6 rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
            <p className='font-medium text-gray-600'>Navigation Tree Editor Component Goes Here</p>
            <span className='text-sm text-gray-500'>(e.g., a drag-and-drop list)</span>
          </div>

          <div className='mt-6 flex justify-end border-t border-gray-200 pt-4'>
            <button
              type='button'
              className='rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
            >
              Save Changes
            </button>
          </div>
        </Card>
      </div>
    </AnalyticsDashboardLayout>
  )
}

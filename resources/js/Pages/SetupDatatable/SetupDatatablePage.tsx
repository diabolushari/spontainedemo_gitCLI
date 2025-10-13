import SetupDataTable from '@/Components/SetupDataTable/SetupDataTable'
import { ReferenceData } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'

interface Props {
  types: ReferenceData[]
}

const SetupDatatablePage = ({ types }: Readonly<Props>) => {
  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        <div className='flex flex-col gap-5 pt-8 sm:pt-14 md:pl-10'>
          <SetupDataTable types={types} />
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

export default SetupDatatablePage

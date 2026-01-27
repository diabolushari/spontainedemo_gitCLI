import { ReferenceData } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import SetupDataTableV2 from '@/Components/SetupDataTable/SetupDataTableV2'

interface Props {
  types: ReferenceData[]
  source: string
}

const SetupDatatablePage = ({ types, source }: Readonly<Props>) => {
  console.log(types)
  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {/*<div className='flex flex-col gap-5 pt-8 sm:pt-14 md:pl-10'>*/}
        {/*<SetupDataTable types={types} />*/}
        <SetupDataTableV2
          types={types}
          source={source}
        />
        {/*</div>*/}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

export default SetupDatatablePage

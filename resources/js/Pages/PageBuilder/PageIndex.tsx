import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import { PagesList, ReferenceData } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import CardHeader from '@/ui/Card/CardHeader'

interface Props {
  pages: PagesList[]
}

const breadCrumb: BreadcrumbItemLink[] = [
  {
    item: 'Data table create',
    link: '',
  },
]

export default function PageIndex({ pages }: Readonly<Props>) {
  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <CardHeader
          title='Create Page Data'
          backUrl={route('page-builder.index', {
            type: 'definitions',
            subtype: 'data',
          })}
          breadCrumb={breadCrumb}
        />
        <div>indexpage</div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

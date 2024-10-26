import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { DataDetail, DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import Card from '@/ui/Card/Card'
import DataSetTable from '@/Components/DataExplorer/DataSetTable'
import Pagination from '@/ui/Pagination/Pagination'

interface Props {
  subset: SubsetDetail
  dataDetail: DataDetail
  data: Paginator<DataTableItem>
}

export default function SubsetTablePage({ subset, dataDetail, data }: Readonly<Props>) {
  return (
    <DashboardLayout type='financial'>
      <DashboardPadding>
        <Card className='snap-y snap-mandatory p-2'>
          <h1 className='font-h1-stop'>{subset.name}</h1>
          <DataSetTable
            dataDetail={dataDetail}
            dataTableItems={data.data}
          />
          <div className='my-5'>
            <Pagination pagination={data} />
          </div>
        </Card>
      </DashboardPadding>
    </DashboardLayout>
  )
}

import { DataDetail, DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import ShowResourcePage from '@/Components/ShowPage/ShowResourcePage'
import DataSetTable from '@/Components/DataExplorer/DataSetTable'

interface Props {
  subset: SubsetDetail
  dataDetail: DataDetail
  data: DataTableItem[]
}

export default function SubsetPreview({ subset, dataDetail, data }: Readonly<Props>) {
  return (
    <ShowResourcePage
      title={subset.name}
      backUrl={route('data-detail.show', dataDetail.id)}
      items={[]}
    >
      <DataSetTable
        dataDetail={dataDetail}
        dataTableItems={data}
      />
    </ShowResourcePage>
  )
}

import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import useFetchList from '@/hooks/useFetchList'
import SubsetTable from '@/Components/DataExplorer/SubsetTable'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'

interface Props {
  subset: SubsetDetail
  officeCode: string
  searchString: string
}

export default function SubsetAccordionTable({
  subset,
  officeCode,
  searchString,
}: Readonly<Props>) {
  const [data, dataLoading] = useFetchList<DataTableItem>(
    route('subset.show', {
      office_code: officeCode,
      subsetDetail: subset,
    }) + `&${searchString}`
  )

  return (
    <FullSpinnerWrapper processing={dataLoading}>
      <SubsetTable
        subset={subset}
        dataTableItems={data}
      />
    </FullSpinnerWrapper>
  )
}

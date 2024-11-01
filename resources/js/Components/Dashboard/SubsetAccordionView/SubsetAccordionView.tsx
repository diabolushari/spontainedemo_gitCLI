import { SubsetDetail } from '@/interfaces/data_interfaces'
import useOfficeHierarchy from '@/Components/OfficeHierarchy/useOfficeHierarchy'
import SubsetAccordionItem from '@/Components/Dashboard/SubsetAccordionView/SubsetAccordionItem'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'

interface Props {
  subset: SubsetDetail
}

export default function SubsetAccordionView({ subset }: Readonly<Props>) {
  const { loadingHierarchy, hierarchy } = useOfficeHierarchy()

  return (
    <FullSpinnerWrapper processing={loadingHierarchy}>
      {hierarchy.map((office) => (
        <SubsetAccordionItem
          office={office}
          key={office.office_code}
          subset={subset}
        />
      ))}
    </FullSpinnerWrapper>
  )
}

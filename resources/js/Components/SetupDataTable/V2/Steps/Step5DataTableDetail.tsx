import SetupDataTableForm from '@/Components/SetupDataTable/SetupDataTableForm'
import { DataTableFieldConfig } from '@/Components/SetupDataTable/ManageDataTableFields'
import { ReferenceData } from '@/interfaces/data_interfaces'
import { DataTableFieldMapping } from '@/Components/DataLoader/useDataTableToJsonMapping'
import { FieldErrors } from '@/Components/SetupDataTable/SetupDataTable'

interface Step5DataTableDetailProps {
  fields: DataTableFieldConfig[]
  types: ReferenceData[]
  selectedAPI: { id: number } | null
  selectedQuery: { id: number } | null
  fieldMapping: DataTableFieldMapping[]
  onErrorsChange: (errors: FieldErrors) => void
}

export default function Step5DataTableDetail({
  fields,
  types,
  selectedAPI,
  selectedQuery,
  fieldMapping,
  onErrorsChange,
}: Readonly<Step5DataTableDetailProps>) {
  return (
    <div>
      <SetupDataTableForm
        fields={fields}
        types={types}
        selectedAPI={selectedAPI}
        selectedQuery={selectedQuery}
        fieldMapping={fieldMapping}
        onErrorsChange={onErrorsChange}
      />
    </div>
  )
}

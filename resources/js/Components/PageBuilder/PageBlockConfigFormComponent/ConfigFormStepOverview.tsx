import React from 'react'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'
import Modal from '@/Components/Modal'

interface SubsetOption {
  id: string
  name: string
}

interface TableConfig {
  rows: number
  columns: number
  columnsConfig: {
    label: string
    subsetId: string | null
  }[]
}

interface ConfigFormStepOverviewProps {
  subsets: SubsetOption[]
  initialData: any
  block: any
  onNext: (data: any) => void
  onBack: () => void
}

export default function ConfigFormStepOverview({
  subsets,
  initialData,
  block,
  onNext,
  onBack,
}: ConfigFormStepOverviewProps) {
  const [formData, setFormData] = React.useState({
    display_type: initialData.display_type ?? '',
    tables: initialData.tables ?? [
      {
        rows: 2,
        columns: 2,
        columnsConfig: [
          { label: '', subsetId: null },
          { label: '', subsetId: null },
        ],
      },
    ],
  })

  const [showModal, setShowModal] = React.useState(false)
  const [modalTableIndex, setModalTableIndex] = React.useState<number | null>(null)
  const [modalRows, setModalRows] = React.useState(2)
  const [modalColumns, setModalColumns] = React.useState(2)

  const openSettingsModal = (tableIndex: number) => {
    const table = formData.tables[tableIndex]
    setModalTableIndex(tableIndex)
    setModalRows(table.rows)
    setModalColumns(table.columns)
    setShowModal(true)
  }

  const saveModalChanges = () => {
    if (modalTableIndex === null) return

    updateTableSize(modalTableIndex, 'rows', modalRows)
    updateTableSize(modalTableIndex, 'columns', modalColumns)
    setShowModal(false)
  }

  const updateTableSize = (tableIndex: number, field: 'rows' | 'columns', value: number) => {
    setFormData((prev) => {
      const tables = [...prev.tables]
      const table = { ...tables[tableIndex] }

      if (field === 'rows') {
        table.rows = value
      } else if (field === 'columns') {
        const diff = value - table.columns
        table.columns = value
        if (diff > 0) {
          table.columnsConfig = [
            ...table.columnsConfig,
            ...Array(diff).fill({ label: '', subsetId: null }),
          ]
        } else if (diff < 0) {
          table.columnsConfig = table.columnsConfig.slice(0, value)
        }
      }

      tables[tableIndex] = table
      return { ...prev, tables }
    })
  }

  const updateColumnConfig = (
    tableIndex: number,
    colIndex: number,
    field: 'label' | 'subsetId',
    value: string | null
  ) => {
    setFormData((prev) => {
      const tables = [...prev.tables]
      const table = { ...tables[tableIndex] }
      const columnsConfig = [...table.columnsConfig]
      columnsConfig[colIndex] = { ...columnsConfig[colIndex], [field]: value }
      table.columnsConfig = columnsConfig
      tables[tableIndex] = table
      return { ...prev, tables }
    })
  }

  const addTable = () => {
    setFormData((prev) => ({
      ...prev,
      tables: [
        ...prev.tables,
        {
          rows: 2,
          columns: 2,
          columnsConfig: [
            { label: '', subsetId: null },
            { label: '', subsetId: null },
          ],
        },
      ],
    }))
  }

  const removeTable = (index: number) => {
    setFormData((prev) => {
      const tables = [...prev.tables]
      tables.splice(index, 1)
      return { ...prev, tables }
    })
  }

  const renderTablePreview = (table: TableConfig, tableIndex: number) => {
    const rows = Array.from({ length: table.rows })
    const cols = Array.from({ length: table.columns })

    return (
      <table className='mt-4 w-full table-auto border-collapse border border-gray-400'>
        <thead>
          <tr>
            {cols.map((_, colIdx) => (
              <th
                key={colIdx}
                className='border border-gray-300 px-2 py-1'
              >
                <Input
                  type='text'
                  placeholder='Label'
                  value={table.columnsConfig[colIdx]?.label || ''}
                  setValue={(val) => updateColumnConfig(tableIndex, colIdx, 'label', val)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((_, rowIdx) => (
            <tr key={rowIdx}>
              {cols.map((_, colIdx) => (
                <td
                  key={colIdx}
                  className='border border-gray-300 px-4 py-2 text-center'
                >
                  Row {rowIdx + 1}, Col {colIdx + 1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onNext(formData)
        }}
        className='flex flex-col gap-6'
      >
        <SelectList
          label='Display Type'
          value={formData.display_type}
          setValue={(val) => setFormData((fd) => ({ ...fd, display_type: val }))}
          list={[
            { id: 'table', name: 'Table Only' },
            { id: 'chart', name: 'Chart Only' },
            { id: 'table_chart', name: 'Table and Chart' },
          ]}
          dataKey='id'
          displayKey='name'
        />

        {(formData.display_type === 'table' || formData.display_type === 'table_chart') &&
          formData.tables.map((table, idx) => (
            <div
              key={idx}
              className='relative rounded border p-4'
            >
              <div className='mb-3 flex items-center justify-between'>
                <h3 className='font-semibold'>Table {idx + 1} Configuration</h3>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    label='Settings'
                    onClick={() => openSettingsModal(idx)}
                  />
                  {formData.tables.length > 1 && (
                    <Button
                      type='button'
                      label='Remove'
                      onClick={() => removeTable(idx)}
                    />
                  )}
                </div>
              </div>
              {renderTablePreview(table, idx)}
            </div>
          ))}

        {(formData.display_type === 'table' || formData.display_type === 'table_chart') && (
          <Button
            type='button'
            label='Add Table'
            onClick={addTable}
          />
        )}

        <div className='mt-6 flex justify-between'>
          <Button
            type='button'
            label='Back'
            onClick={onBack}
          />
          <Button
            type='submit'
            label='Next'
          />
        </div>
      </form>

      {/* Modal */}
      <Modal
        show={showModal && modalTableIndex !== null}
        onClose={() => setShowModal(false)}
        maxWidth='md'
      >
        <div className='p-6'>
          <h2 className='mb-4 text-lg font-semibold'>Edit Table {modalTableIndex! + 1}</h2>
          <div className='flex flex-col gap-4'>
            <Input
              label='Rows'
              type='number'
              value={modalRows}
              setValue={(val) => setModalRows(Number(val))}
            />
            <Input
              label='Columns'
              type='number'
              value={modalColumns}
              setValue={(val) => setModalColumns(Number(val))}
            />
          </div>
          <div className='mt-6 flex justify-end gap-3'>
            <Button
              type='button'
              label='Cancel'
              onClick={() => setShowModal(false)}
            />
            <Button
              type='button'
              label='Save'
              onClick={saveModalChanges}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

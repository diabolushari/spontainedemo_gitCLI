import { DataDetail } from '@/interfaces/data_interfaces'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo } from 'react'

interface Props {
  detail: DataDetail
}

export default function DataDetailShow({ detail }: Readonly<Props>) {
  const displayedItems = useMemo(() => {
    let index = 1
    const records: ShowPageItem[] = [
      {
        id: index++,
        label: 'Last loader Job Status',
        content: '',
        type: 'text',
      },
      {
        id: index++,
        label: 'Jobs',
        content: route('loader-jobs.create'),
        contentDescription: 'Add a new loader job',
        type: 'link',
      },
      {
        id: index++,
        label: 'Fields',
        content: '',
        type: 'text',
      },
    ]

    records.push()

    detail.date_fields?.map((field) => {
      records.push({
        id: index++,
        label: field.field_name ?? '',
        content: 'Date',
        type: 'text',
      })
    })

    detail.dimension_fields?.map((field) => {
      records.push({
        id: index++,
        label: field.field_name ?? '',
        content: `${field.structure?.structure_name} Field`,
        type: 'text',
      })
    })

    detail.measure_fields?.map((field) => {
      records.push({
        id: index++,
        label: `${field.field_name} (${field.unit_field_name})`,
        content: 'Number',
        type: 'text',
      })
    })

    return records
  }, [detail])

  return (
    <ShowResourcePage
      title={detail.name}
      items={displayedItems}
    />
  )
}

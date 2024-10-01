import useCustomForm from '@/hooks/useCustomForm'
import { Paginator } from '@/ui/ui_interfaces'
import { SubjectArea } from '@/interfaces/data_interfaces'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { useMemo } from 'react'
import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'

interface Props {
  subjectAreas: Paginator<SubjectArea>
}

export default function SubjectAreaIndex({ subjectAreas }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      search: {
        type: 'text',
        label: 'Search',
        setValue: setFormValue('search'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true },
      { key: 'is_active', label: 'Is Active', isShownInCard: true },
    ] as ListItemKeys<{
      name: string
      is_active: string
    }>[]
  }, [])

  const data = useMemo(() => {
    return subjectAreas.data.map((subjectArea) => {
      return {
        id: subjectArea.id,
        name: subjectArea.name,
        is_active: subjectArea.is_active === 1 ? 'Yes' : 'No',
        actions: [
          {
            title: 'Show',
            url: route('subject-area.edit', { id: subjectArea.id }),
          },
        ],
      }
    })
  }, [subjectAreas])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey='id'
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('subject-area.create')}
      searchUrl={route('subject-area.index', { type: 'data', subtype: 'subject-area' })}
      title='Subject Areas'
      type='data'
      subtype='subject-area'
      formStyles='bg-[#F5F5FA] p-4 rounded-lg'
      subheading='Subject areas are thematic regions that hold data, and will form logical groupings of reports and dashboards'
    />
  )
}

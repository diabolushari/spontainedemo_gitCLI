import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useMemo } from 'react'

interface Organization {
  id: number
  name: string
  state: string
  country: string
  industry_context: string
}

interface Props {
  organizations: Paginator<Organization>
  filters?: {
    search?: string
  }
}

export default function OrganizationIndexPage({ organizations, filters }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    search: filters?.search ?? '',
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
        placeholder: 'Search by name',
        label: 'Search',
        setValue: setFormValue('search'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const data = useMemo(() => {
    return organizations.data.map((org) => {
      return {
        ...org,
        actions: [
          {
            title: 'View',
            url: route('organization.show', { organization: org.id }),
          },
        ],
      }
    })
  }, [organizations])

  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true },
      { key: 'industry_context', label: 'Context', isShownInCard: true, hideLabel: false },
      { key: 'state', label: 'State', isShownInCard: true, hideLabel: false },
      { key: 'country', label: 'Country', isShownInCard: true, hideLabel: false },
    ] as ListItemKeys<Organization>[]
  }, [])

  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('organization.show', { organization: id }))
  }, [])

  return (
    <ListResourcePage
      formData={formData}
      formItems={formItems}
      keys={keys}
      rows={data}
      paginator={organizations}
      searchUrl={route('organization.index')}
      addUrl={route('organization.create')}
      primaryKey='id'
      type='settings'
      subtype='organizations'
      formStyles='bg-white p-4 rounded-lg shadow-sm border border-gray-100'
      title='Organizations'
      handleCardClick={handleCardClick}
      cardStyles='p-4 hover:scale-[1.02] transition-transform duration-200 shadow-sm hover:shadow-md cursor-pointer'
      subheading='Manage your organization details, business context, and reporting periods.'
    />
  )
}

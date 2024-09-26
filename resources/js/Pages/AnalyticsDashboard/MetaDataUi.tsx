import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import MetaDataUiIndex from '@/Components/MetaDataUi/MetaDataUiIndex'
import { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { MetaData, MetaStructure } from '@/interfaces/meta_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import React, { useCallback, useMemo } from 'react'

interface Props {
  structures: Partial<MetaStructure>[]
  metaData: Paginator<MetaData>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

export default function MetaDataUi({ structures, metaData, type, subtype, oldValues }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
    structure: '',
    type: 'definitions',
    subtype: 'metadata',
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
      structure: {
        type: 'select',
        dataKey: 'id',
        displayKey: 'structure_name',
        label: 'Structure',
        list: structures,
        setValue: setFormValue('structure'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, structures])

  const data = useMemo(() => {
    return metaData.data.map((metaData) => ({
      id: metaData.id,
      name: metaData.name,
      structure: metaData.meta_structure?.structure_name,
      groups: '0',
      hierarchies: '0',
      actions: [
        {
          title: 'Show',
          url: route('meta-data.show', { id: metaData.id }),
        },
      ],
    }))
  }, [metaData])

  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true },
      { key: 'structure', label: 'Structure', isShownInCard: true },
      { key: 'groups', label: 'Groups', isShownInCard: true },
      { key: 'hierarchies', label: 'Hierarchies', isShownInCard: true },
    ] as ListItemKeys<Partial<MetaData>>[]
  }, [])

  return (
    <AnalyticsDashboardLayout
      type={type}
      subtype={subtype}
    >
      <MetaDataUiIndex
        keys={keys}
        oldValues={oldValues}
        primaryKey='id'
        rows={data}
        formData={formData}
        formItems={formItems}
        addUrl={route('meta-data.create')}
        title={'Meta Data'}
        searchUrl={route('meta-data-analytics.index')}
      />
    </AnalyticsDashboardLayout>
  )
}

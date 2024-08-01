import { MetaDataGroup, MetaDataGroupItem } from '@/interfaces/meta_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { useMemo } from 'react'
import StrongText from '@/typograpy/StrongText'
import Card from '@/ui/Card/Card'
import { Link } from '@inertiajs/react'
import NormalText from '@/typograpy/NormalText'

interface Props {
  metaGroup: MetaDataGroup
  groupItems: Paginator<MetaDataGroupItem>
}

export default function MetaGroupItemList({ metaGroup, groupItems }: Props) {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className='flex flex-col gap-5'>
      {groupItems.total === 0 && <StrongText>No items attached to this group.</StrongText>}
      {groupItems.total !== 0 && (
        <>
          <FormBuilder
            formData={formData}
            onFormSubmit={handleSubmit}
            formItems={formItems}
            loading={false}
            buttonText='search'
          />
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {groupItems.data.map((groupItem) => (
              <Card
                className='p-2'
                key={groupItem.id}
              >
                <Link
                  href={route('meta-data.show', groupItem.meta_data_id)}
                  className='link'
                >
                  <NormalText>{groupItem.meta_data?.name}</NormalText>
                </Link>
                <br />
                <Link
                  href={route('meta-data.index', {
                    structure: groupItem.meta_data?.meta_structure_id,
                  })}
                  className='link'
                >
                  <NormalText>{groupItem.meta_data?.meta_structure?.structure_name}</NormalText>
                </Link>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

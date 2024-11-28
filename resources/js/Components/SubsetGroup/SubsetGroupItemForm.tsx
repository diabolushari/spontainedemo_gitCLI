import useCustomForm from '@/hooks/useCustomForm'
import { SubsetDetail, SubsetGroup, SubsetGroupItem } from '@/interfaces/data_interfaces'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import { Dispatch, FormEvent, SetStateAction, useCallback, useMemo } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Props {
  setShowFormModal: Dispatch<SetStateAction<boolean>>
  subsetGroup: SubsetGroup
  selectedItem?: SubsetGroupItem | null
  onDelete: (item: SubsetGroupItem) => void
}

export default function SubsetGroupItemForm({
  setShowFormModal,
  subsetGroup,
  selectedItem,
  onDelete,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    name: selectedItem?.name ?? '',
    item_number: selectedItem?.item_number ?? '',
    subset_detail:
      selectedItem?.subset == null
        ? null
        : ({
            ...selectedItem.subset,
          } as SubsetDetail | null),
  })

  const onCompleted = useCallback(() => {
    setShowFormModal(false)
  }, [setShowFormModal])

  const { post, errors, loading } = useInertiaPost(
    selectedItem == null
      ? route('subset-group-items.store')
      : route('subset-group-items.update', selectedItem.id),
    { onComplete: onCompleted }
  )

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      name: {
        type: 'text',
        label: 'Name',
        setValue: setFormValue('name'),
      },
      item_number: {
        type: 'text',
        label: 'Item #',
        setValue: setFormValue('item_number'),
      },
      subset_detail: {
        type: 'autocomplete',
        label: 'Subset',
        dataKey: 'id',
        displayKey: 'name',
        displayKey2: 'data_detail_name',
        selectListUrl: route('subset.list', {
          search: '',
        }),
        setValue: (subsetDetail: SubsetDetail | null) => {
          setFormValue('subset_detail')(subsetDetail)
        },
        autoCompleteSelection: formData.subset_detail,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, formData.subset_detail])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    post({
      _method: selectedItem != null ? 'PUT' : 'POST',
      name: formData.name,
      item_number: formData.item_number,
      subset_group_id: subsetGroup.id,
      subset_detail_id: formData.subset_detail?.id ?? null,
    })
  }

  const handleDelete = useCallback(() => {
    if (selectedItem == null) {
      return
    }
    onDelete(selectedItem)
  }, [onDelete, selectedItem])

  return (
    <div className='p-2'>
      <FormBuilder
        formData={formData}
        onFormSubmit={handleSubmit}
        formItems={formItems}
        loading={loading}
        formStyles='w-full md:grid-cols-1 gap-5'
        errors={errors}
        showSecondaryButton
        secondaryButtonLabel='DELETE'
        secondaryAction={handleDelete}
      />
    </div>
  )
}

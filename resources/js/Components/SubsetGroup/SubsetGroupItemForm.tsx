import useCustomForm from '@/hooks/useCustomForm'
import {
  SubsetDateField,
  SubsetDetail,
  SubsetDimensionField,
  SubsetGroup,
  SubsetGroupItem,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import { Dispatch, FormEvent, SetStateAction, useCallback, useMemo } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import useFetchRecord from '@/hooks/useFetchRecord'

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
    trend_field: selectedItem?.trend_field ?? '',
  })

  const [fields, loadingFields] = useFetchRecord<{
    dates: SubsetDateField[]
    dimensions: SubsetDimensionField[]
    measures: SubsetMeasureField[]
  }>(
    route('subset-fields', {
      subset_id: formData.subset_detail?.id ?? '',
    })
  )

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
    const nonFilterDimensions = fields?.dimensions.filter(
      (dimension) => dimension.filter_only === 0
    )

    const totalFields = (fields?.dates.length ?? 0) + (nonFilterDimensions?.length ?? 0)

    let hasMonthDimension = false

    nonFilterDimensions?.forEach((dimension) => {
      if (dimension.subset_column === 'month') {
        hasMonthDimension = true
      }
    })

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
          setFormValue('trend_field')('')
          setFormValue('subset_detail')(subsetDetail)
        },
        autoCompleteSelection: formData.subset_detail,
      },
      trend_field: {
        type: 'select',
        label: 'Trend',
        setValue: setFormValue('trend_field'),
        dataKey: 'subset_column',
        displayKey: 'subset_field_name',
        list: fields?.measures ?? [],
        showAllOption: true,
        allOptionText: 'Do Not Show Trend',
        disabled: totalFields <= 1 || !hasMonthDimension,
        // disabled: totalFields !== 1 || !hasMonthDimension,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, formData.subset_detail, fields])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    post({
      _method: selectedItem != null ? 'PUT' : 'POST',
      name: formData.name,
      item_number: formData.item_number,
      subset_group_id: subsetGroup.id,
      subset_detail_id: formData.subset_detail?.id ?? null,
      trend_field: formData.trend_field,
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

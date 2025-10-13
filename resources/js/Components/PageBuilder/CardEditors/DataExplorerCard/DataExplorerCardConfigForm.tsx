import { DrawerDescription, DrawerHeader, DrawerTitle } from '@/Components/ui/drawer'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { useEffect } from 'react'

interface BlockFormProps {
  initialData: any
  onCloseStep?: () => void
  block: any
  setCloseDrawer: (value: boolean) => void
}

const viewOption = [
  { label: 'Map', value: 'map' },
  { label: 'Table', value: 'table' },
  { label: 'Trend', value: 'trend' },
]

export default function DataExplorerCardConfigForm({
  initialData,
  block,
  setCloseDrawer,
}: BlockFormProps) {
  const { formData, setFormValue, setAll } = useCustomForm({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    subset_group_id: initialData?.subset_group_id ?? '',
    default_subset_id: initialData?.default_subset_id ?? '',
    data_table_id: initialData?.data_table_id ?? '',
    default_view: initialData?.default_view ?? 'map',
  })
  const { post, errors } = useInertiaPost(route('config.data-explorer.update', block.id), {
    preserveState: true,
    preserveScroll: true,
    showErrorToast: true,
    onComplete: () => {
      setCloseDrawer(false)
    },
  })

  useEffect(() => {
    if (initialData?.data_table_id !== formData.data_table_id) {
      setAll({
        ...formData,
        subset_group_id: '',
        default_subset_id: '',
        default_view: 'map',
      })
    }
  }, [formData.data_table_id])

  useEffect(() => {
    if (initialData?.subset_group_id !== formData.subset_group_id) {
      setFormValue('default_subset_id')('')
    }
  }, [formData.subset_group_id])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({ ...formData, _method: 'PUT' })
  }

  return (
    <div className='w-full'>
      {/* --- Drawer Header with Title + Stepper --- */}
      <DrawerHeader className='space-y-2 px-4 pt-4'>
        <div>
          <DrawerTitle>Data Explorer Configuration</DrawerTitle>
          <DrawerDescription>Customize your Data Explorer card here.</DrawerDescription>
        </div>
      </DrawerHeader>
      <div>
        <form onSubmit={onSubmit}>
          <div className='flex flex-col gap-4 md:grid md:grid-cols-2'>
            <div className='flex flex-col'>
              <Input
                label='Enter your title'
                value={formData.title}
                setValue={setFormValue('title')}
                error={errors.title}
              />
            </div>

            <div className='flex flex-col'>
              <DynamicSelectList
                label='Select a data table for default date'
                url='/api/data-detail'
                dataKey='id'
                displayKey='name'
                value={formData.data_table_id ?? 0}
                setValue={setFormValue('data_table_id')}
                error={errors?.data_table_id}
              />
            </div>
            <div className='col-span-2 md:grid md:grid-cols-3 md:gap-2'>
              <div className='flex flex-col'>
                {formData.data_table_id ? (
                  <DynamicSelectList
                    label='Subset group'
                    url={`/api/data-detail/subset-group/${formData.data_table_id}`}
                    placeholder='Select a subset group'
                    dataKey='id'
                    displayKey='name'
                    value={formData.subset_group_id}
                    setValue={setFormValue('subset_group_id')}
                    error={errors?.subset_group_id}
                  />
                ) : (
                  <Input
                    label='Select subset group'
                    value={formData.subset_group_id}
                    setValue={setFormValue('subset_group_id')}
                    error={errors.subset_group_id}
                    disabled
                  />
                )}
              </div>
              <div className='flex flex-col'>
                {formData?.subset_group_id ? (
                  <DynamicSelectList
                    label='Default subset'
                    url={`/api/subset-group/${formData?.subset_group_id}`}
                    placeholder='Select a default subset'
                    dataKey='id'
                    displayKey='name'
                    value={formData.default_subset_id ?? ''}
                    setValue={setFormValue('default_subset_id')}
                    error={errors.default_subset_id}
                  />
                ) : (
                  <Input
                    label='Select default subset'
                    value={formData.default_subset_id}
                    setValue={setFormValue('default_subset_id')}
                    error={errors.default_subset_id}
                    disabled
                  />
                )}
              </div>
              <div className='flex flex-col'>
                <SelectList
                  label='Default View'
                  dataKey='value'
                  displayKey='label'
                  list={viewOption}
                  value={formData.default_view}
                  setValue={setFormValue('default_view')}
                  error={errors.default_view}
                  disabled={formData.subset_group_id === ''}
                />
              </div>
            </div>
            <div className='col-span-2 flex flex-col'>
              <TextArea
                label='Enter your description'
                value={formData.description}
                setValue={setFormValue('description')}
                error={errors.description}
              />
            </div>
          </div>
          <div className='mt-4 flex justify-between'>
            <Button
              label='Save'
              type='submit'
            />
          </div>
        </form>
      </div>
    </div>
  )
}

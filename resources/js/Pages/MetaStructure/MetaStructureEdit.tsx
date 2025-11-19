import SelectList from '@/ui/form/SelectList'
import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { MetaStructure, DataClassificationProperty } from '@/interfaces/meta_interfaces'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

interface MetaStructureLabel {
  id: number
  structure_id: number
  data_classification_property_id: number
  data_classification_property?: DataClassificationProperty
}

interface MetaStructureWithLabels extends MetaStructure {
  meta_structure_labels?: MetaStructureLabel[]
}

interface Props {
  metaStructure: MetaStructureWithLabels
  pageNo: string
  dataClassificationProperties: DataClassificationProperty[]
}

export default function MetaStructureEdit({ metaStructure, pageNo, dataClassificationProperties = [] }: Props) {
  
  // Helper to find existing value for a property type
  const getInitialValue = (type: string) => {
    const label = metaStructure.meta_structure_labels?.find(
      (l) => l.data_classification_property?.property_type === type
    )
    return label?.data_classification_property_id ?? ''
  }

  const { formData, setFormValue } = useCustomForm({
    structure_name: metaStructure.structure_name,
    description: metaStructure.description ?? '',
    data_classification_level: getInitialValue('Data Classification Level'),
    data_category: getInitialValue('Data Category'),
    encryption: getInitialValue('Encryption'),
    access_level: getInitialValue('Access Level'),
    data_owner: getInitialValue('Data Owner'),
  })

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Meta structure index',
      link: '/meta-structure?page=' + pageNo,
    },
    {
      item: 'Meta structure',
      link: route('meta-structure.show', { metaStructure: metaStructure.id, page: pageNo }),
    },
    {
      item: 'Meta structure edit',
      link: '',
    },
  ]

  const formItems = useMemo(() => {
    return {
      structure_name: {
        label: 'Structure Name',
        type: 'text',
        setValue: setFormValue('structure_name'),
      } as FormItem<string, never, never, never>,
      description: {
        label: 'Description',
        type: 'textarea',
        setValue: setFormValue('description'),
      } as FormItem<string, never, never, never>,
    }
  }, [])

  // Filter properties for each select list
  const classificationLevels = useMemo(
    () =>
      dataClassificationProperties.filter((p) => p.property_type === 'Data Classification Level'),
    [dataClassificationProperties]
  )

  const dataCategories = useMemo(
    () => dataClassificationProperties.filter((p) => p.property_type === 'Data Category'),
    [dataClassificationProperties]
  )

  const encryptions = useMemo(
    () => dataClassificationProperties.filter((p) => p.property_type === 'Encryption'),
    [dataClassificationProperties]
  )

  const accessLevels = useMemo(
    () => dataClassificationProperties.filter((p) => p.property_type === 'Access Level'),
    [dataClassificationProperties]
  )

  const dataOwners = useMemo(
    () => dataClassificationProperties.filter((p) => p.property_type === 'Data Owner'),
    [dataClassificationProperties]
  )

  return (
    <FormPage
      formItems={formItems}
      formData={formData}
      title={'Update Meta Structure'}
      url={route('meta-structure.update', { id: metaStructure.id, page: pageNo })}
      backUrl={route('meta-structure.show', { metaStructure: metaStructure.id, page: pageNo })}
      formStyles='md:w-1/2  md:grid-cols-1'
      isPatchRequest
      type={'definitions'}
      subtype={'blocks'}
      breadCrumbs={breadCrumb}
    >
      <div className='mt-6 rounded border bg-white p-4 shadow-sm'>
        <h3 className='mb-4 text-lg font-bold'>Data Classification</h3>
        <div className='grid grid-cols-1 gap-4'>
          <div>
            <SelectList
              label='Data Classification Level'
              list={classificationLevels}
              value={formData.data_classification_level}
              setValue={setFormValue('data_classification_level')}
              dataKey='id'
              displayKey='property_value'
            />
          </div>
          <div>
            <SelectList
              label='Data Category'
              list={dataCategories}
              value={formData.data_category}
              setValue={setFormValue('data_category')}
              dataKey='id'
              displayKey='property_value'
            />
          </div>
          <div>
            <SelectList
              label='Encryption'
              list={encryptions}
              value={formData.encryption}
              setValue={setFormValue('encryption')}
              dataKey='id'
              displayKey='property_value'
            />
          </div>
          <div>
            <SelectList
              label='Access Level'
              list={accessLevels}
              value={formData.access_level}
              setValue={setFormValue('access_level')}
              dataKey='id'
              displayKey='property_value'
            />
          </div>
          <div>
            <SelectList
              label='Data Owner'
              list={dataOwners}
              value={formData.data_owner}
              setValue={setFormValue('data_owner')}
              dataKey='id'
              displayKey='property_value'
            />
          </div>
        </div>
      </div>
    </FormPage>
  )
}

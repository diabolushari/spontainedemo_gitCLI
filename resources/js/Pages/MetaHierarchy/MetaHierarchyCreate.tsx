import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import useCustomForm from '@/hooks/useCustomForm'
import { MetaHierarchy, MetaHierarchyLevelInfo, MetaStructure } from '@/interfaces/meta_interfaces'
import ComboBox from '@/ui/form/ComboBox'
import { useEffect, useMemo, useState } from 'react'

interface HierarchyLevelInfo {
  level: number
  meta_structure: MetaStructure | null
}

interface Properties {
  structures: Pick<MetaStructure, 'id' | 'structure_name'>[]
  metaHierarchy?: MetaHierarchy
  levelInfos?: MetaHierarchyLevelInfo[]
}

function initLevelInfo(levelInfos?: MetaHierarchyLevelInfo[]) {
  if (levelInfos == null) {
    return []
  }
  return levelInfos.map((item) => {
    return {
      level: item.level,
      meta_structure: item.structure,
    }
  })
}

export default function MetaHierarchyCreate({ metaHierarchy, levelInfos }: Readonly<Properties>) {
  const { formData, setFormValue } = useCustomForm({
    name: metaHierarchy?.name ?? '',
    description: metaHierarchy?.description ?? '',
    no_of_levels: levelInfos?.length ?? 0,
  })
  const [hierarchyLevelInfos, setHierarchyLevelInfos] = useState<HierarchyLevelInfo[]>(
    initLevelInfo(levelInfos)
  )

  useEffect(() => {
    setHierarchyLevelInfos((oldValues) => {
      const noOfLevels = Number(formData.no_of_levels)

      if (noOfLevels === 0 || Number.isNaN(noOfLevels)) {
        return []
      }
      if (oldValues.length === noOfLevels) {
        return oldValues
      }
      //if the number of levels is less than the current length, remove the rest
      if (oldValues.length > noOfLevels) {
        return oldValues.slice(0, noOfLevels)
      }
      //if the number of levels is greater than the current length, add the rest
      const tempLength: HierarchyLevelInfo[] = []
      for (let i = oldValues.length + 1; i <= noOfLevels; i++) {
        tempLength.push({ level: i, meta_structure: null })
      }
      return [...oldValues, ...tempLength]
    })
  }, [formData.no_of_levels])

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
      description: {
        type: 'textarea',
        label: 'Description',
        setValue: setFormValue('description'),
      },
      no_of_levels: {
        type: 'number',
        label: 'Number of Levels',
        setValue: setFormValue('no_of_levels'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const setHierarchyValue = (item: HierarchyLevelInfo, structure: MetaStructure | null) => {
    setHierarchyLevelInfos((oldValues) => {
      return oldValues.map((tempValues) => {
        if (tempValues.level === item.level) {
          return { ...tempValues, meta_structure: structure }
        }
        return tempValues
      })
    })
  }

  const fullFormData = useMemo(() => {
    return {
      ...formData,
      hierarchy_level_infos: hierarchyLevelInfos,
    }
  }, [formData, hierarchyLevelInfos])
  console.log(hierarchyLevelInfos)

  return (
    <FormPage
      url={
        metaHierarchy != null
          ? route('meta-hierarchy.update', metaHierarchy.id)
          : route('meta-hierarchy.store')
      }
      formData={formData}
      formItems={formItems}
      title='Create Meta Hierarchy'
      backUrl={route('meta-hierarchy.index', { type: 'definitions', subtype: 'heirarchies' })}
      formStyles='w-1/2 md:grid-cols-1'
      customSubmitData={fullFormData}
      isPatchRequest={metaHierarchy != null}
      type={'definitions'}
      subtype={'hierarchies'}
    >
      {hierarchyLevelInfos.length > 0 && (
        <>
          <span className='small-1stop text-sm tracking-normal text-gray-800'>Select levels</span>
          <div className='rounded-lg border-3 border-1stop-gray p-2'>
            <a
              className={`link small-1stop flex justify-end text-xs`}
              href={route('meta-structure.index')}
              target='_blank'
              rel='noreferrer'
            >
              Structural blocks
            </a>
            {hierarchyLevelInfos.map((item) => {
              return (
                <div
                  className='flex flex-col py-1'
                  key={item.level}
                >
                  <ComboBox
                    setValue={(name: MetaStructure | null) => setHierarchyValue(item, name)}
                    dataKey='id'
                    displayKey='structure_name'
                    label={`Level ${item.level}`}
                    value={item.meta_structure}
                    url={route('meta-strucure-search', {
                      search: '',
                    })}
                  />
                </div>
              )
            })}
          </div>
        </>
      )}
    </FormPage>
  )
}

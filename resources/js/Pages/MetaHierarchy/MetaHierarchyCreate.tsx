import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { MetaHierarchy, MetaHierarchyLevelInfo, MetaStructure } from '@/interfaces/meta_interfaces'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import DashboardPadding from '@/Layouts/DashboardPadding'
import CardHeader from '@/ui/Card/CardHeader'
import Card from '@/ui/Card/Card'
import Input from '@/ui/form/Input'
import ComboBox from '@/ui/form/ComboBox'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import ErrorText from '@/typography/ErrorText'

interface HierarchyLevelInfo {
  level: number
  name: string
  primary_structure: MetaStructure | null
  secondary_structure: MetaStructure | null
}

interface Properties {
  structures: Pick<MetaStructure, 'id' | 'structure_name'>[]
  metaHierarchy?: MetaHierarchy
  levelInfos?: MetaHierarchyLevelInfo[]
  page?: string
}

function initLevelInfo(levelInfos?: MetaHierarchyLevelInfo[]): HierarchyLevelInfo[] {
  if (levelInfos == null) {
    return []
  }
  return levelInfos.map((item) => {
    return {
      level: item.level,
      name: item.name ?? '',
      primary_structure: item.primary_structure ?? null,
      secondary_structure: item.secondary_structure ?? null,
    }
  })
}

export default function MetaHierarchyCreate({
  metaHierarchy,
  levelInfos,
  page,
}: Readonly<Properties>) {
  const { post, errors, loading } = useInertiaPost(
    metaHierarchy == null
      ? route('meta-hierarchy.store')
      : route('meta-hierarchy.update', { metaHierarchy: metaHierarchy.id })
  )
  const { formData, setFormValue } = useCustomForm({
    name: metaHierarchy?.name ?? '',
    description: metaHierarchy?.description ?? '',
    no_of_levels: levelInfos?.length ?? 0,
    primary_field_name: metaHierarchy?.primary_field_name ?? '',
    secondary_field_name: metaHierarchy?.secondary_field_name ?? '',
    default_heirarchy: metaHierarchy?.default_heirarchy,
  })

  const [hierarchyLevelInfos, setHierarchyLevelInfos] = useState<HierarchyLevelInfo[]>(
    initLevelInfo(levelInfos)
  )

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Meta hierarchy index',
      link: '/meta-hierarchy?page=' + page,
    },
    {
      item: 'Meta hierarchy create',
      link: '',
    },
  ]

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
        tempLength.push({ level: i, name: '', primary_structure: null, secondary_structure: null })
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
      primary_field_name: {
        type: 'text',
        label: 'Primary Field',
        setValue: setFormValue('primary_field_name'),
      },
      secondary_field_name: {
        type: 'text',
        label: 'Secondary Field (If Any)',
        setValue: setFormValue('secondary_field_name'),
      },
      default_heirarchy: {
        type: 'text',
        label: 'Default Heirarchy',
        setValue: setFormValue('default_heirarchy'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const setPrimaryFieldValue = (item: HierarchyLevelInfo, structure: MetaStructure | null) => {
    setHierarchyLevelInfos((oldValues) => {
      return oldValues.map((tempValues) => {
        if (tempValues.level === item.level) {
          return { ...tempValues, primary_structure: structure }
        }
        return tempValues
      })
    })
  }

  const setSecondaryFieldValue = (item: HierarchyLevelInfo, structure: MetaStructure | null) => {
    setHierarchyLevelInfos((oldValues) => {
      return oldValues.map((tempValues) => {
        if (tempValues.level === item.level) {
          return { ...tempValues, secondary_structure: structure }
        }
        return tempValues
      })
    })
  }

  const setLevelName = (item: HierarchyLevelInfo, name: string) => {
    setHierarchyLevelInfos((oldValues) => {
      return oldValues.map((tempValues) => {
        if (tempValues.level === item.level) {
          return { ...tempValues, name: name }
        }
        return tempValues
      })
    })
  }

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      post({
        _method: metaHierarchy == null ? 'POST' : 'PUT',
        ...formData,
        hierarchy_level_infos: hierarchyLevelInfos.map((item) => {
          return {
            level: item.level,
            name: item.name,
            primary_field_structure_id: item.primary_structure?.id,
            secondary_field_structure_id: item.secondary_structure?.id ?? null,
          }
        }),
      })
    },
    [formData, hierarchyLevelInfos, post, metaHierarchy]
  )

  return (
    <AnalyticsDashboardLayout
      type={'definitions'}
      subtype={'hierarchies'}
    >
      <DashboardPadding>
        <Card>
          <div className='flex flex-col gap-5'>
            <CardHeader
              title='Create Meta Hierarchy'
              backUrl={route('meta-hierarchy.index', {
                type: 'definitions',
                subtype: 'hierarchies',
                page: page,
              })}
              breadCrumb={breadCrumb}
            />
            <div className='flex flex-col gap-5 p-5'>
              <FormBuilder
                formData={formData}
                onFormSubmit={handleFormSubmit}
                formItems={formItems}
                loading={false}
                hideSubmitButton={true}
                formStyles='w-1/2 md:grid-cols-1'
              />
              <form
                className='flex flex-col gap-5 rounded-lg border-3 border-1stop-gray p-2'
                onSubmit={handleFormSubmit}
              >
                {hierarchyLevelInfos.length > 0 && (
                  <>
                    <div className='flex flex-col gap-3'>
                      <a
                        className={`link small-1stop flex justify-end text-xs`}
                        href={route('meta-structure.index')}
                        target='_blank'
                        rel='noreferrer'
                      >
                        Structural blocks
                      </a>
                      {errors['hierarchy_level_infos' as keyof typeof errors] != null && (
                        <div className=''>
                          <ErrorText>
                            {errors['hierarchy_level_infos' as keyof typeof errors]}
                          </ErrorText>
                        </div>
                      )}
                      {hierarchyLevelInfos.map((item, index) => {
                        return (
                          <div
                            key={item.level}
                            className='grid grid-cols-1 gap-3 md:grid-cols-3'
                          >
                            <div className='col-span-full text-xs'>Level {item.level}</div>
                            <div className='flex flex-col'>
                              <Input
                                setValue={(value: string) => setLevelName(item, value)}
                                value={item.name}
                                placeholder='Level Name'
                                error={
                                  errors[
                                    ('hierarchy_level_infos.' +
                                      index +
                                      '.name') as keyof typeof errors
                                  ]
                                }
                              />
                            </div>
                            <div className='flex flex-col py-1'>
                              <ComboBox
                                setValue={(name: MetaStructure | null) =>
                                  setPrimaryFieldValue(item, name)
                                }
                                dataKey='id'
                                displayKey='structure_name'
                                placeholder={`${formData.primary_field_name ?? 'Primary'}'s  MetaStructure`}
                                value={item.primary_structure}
                                url={route('meta-structure-search', {
                                  search: '',
                                })}
                                error={
                                  errors[
                                    ('hierarchy_level_infos.' +
                                      index +
                                      '.primary_field_structure_id') as keyof typeof errors
                                  ]
                                }
                              />
                            </div>
                            <div className='flex flex-col py-1'>
                              {formData.secondary_field_name != '' && (
                                <ComboBox
                                  setValue={(name: MetaStructure | null) =>
                                    setSecondaryFieldValue(item, name)
                                  }
                                  dataKey='id'
                                  displayKey='structure_name'
                                  placeholder={`${formData.secondary_field_name ?? 'Secondary'}'s  MetaStructure`}
                                  value={item.secondary_structure}
                                  url={route('meta-structure-search', {
                                    search: '',
                                  })}
                                  error={
                                    errors[
                                      ('hierarchy_level_infos.' +
                                        index +
                                        '.secondary_field_structure_id') as keyof typeof errors
                                    ]
                                  }
                                />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
                <div className='flex'>
                  <Button
                    label='Save'
                    processing={loading}
                  />
                </div>
              </form>
            </div>
          </div>
        </Card>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

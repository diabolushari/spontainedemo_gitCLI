import HttpHeadersForm from '@/Components/DataLoader/KeyValueList/HttpHeadersForm'
import KeyValueList from '@/Components/DataLoader/KeyValueList/KeyValueList'
import SetDataStructure from '@/Components/DataLoader/SetDataStructure/SetDataStructure'
import useJsonStructure, { JSONStructureDefinition, } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { DataLoaderAPI, KeyValue, Model } from '@/interfaces/data_interfaces'
import ErrorText from '@/typography/ErrorText'
import Button from '@/ui/button/Button'
import axios from 'axios'
import { FormEvent, useMemo, useState } from 'react'
import { handleHttpErrors, showError } from '@/ui/alerts'

const requestTypes = [
  { method: 'GET', label: 'GET' },
  { method: 'POST', label: 'POST' },
]

const httpHeaderFieldPlaceholder = {
  key: 'Header name (e.g., Authorization)',
  value: 'Header value (e.g., Bearer YOUR_API_KEY)',
}

interface DataLoaderAPIFormProps {
  readonly dataLoaderAPI?: DataLoaderAPI
  readonly onSubmit: (formData: Omit<DataLoaderAPI, keyof Model>) => void
  readonly loading: boolean
  readonly errors: Record<string, string | undefined>
}

export default function DataLoaderAPIForm({
  dataLoaderAPI,
  onSubmit,
  loading,
  errors,
}: Readonly<DataLoaderAPIFormProps>) {
  const { formData, setFormValue } = useCustomForm({
    name: dataLoaderAPI?.name ?? '',
    description: dataLoaderAPI?.description ?? '',
    method: dataLoaderAPI?.method ?? 'GET',
    url: dataLoaderAPI?.url ?? '',
  })

  const [headers, setHeaders] = useState<KeyValue[]>(
    dataLoaderAPI?.headers ?? [{ key: '', value: '' }]
  )
  const [params, setParams] = useState<KeyValue[]>(dataLoaderAPI?.body ?? [{ key: '', value: '' }])

  const {
    dataStructure,
    removeFieldFromJson,
    addNewFieldToJson,
    updateJsonFieldName,
    updateJsonFieldType,
    setAsPrimaryField,
    setEntireStructure,
  } = useJsonStructure(
    dataLoaderAPI?.response_structure ?? {
      last_uuid: 1,
      definition: {
        id: 1,
        field_name: 'response',
        field_type: 'array',
        primary_field: true,
        children: [],
      },
    }
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
      description: {
        type: 'textarea',
        label: 'Description',
        setValue: setFormValue('description'),
      },
      method: {
        type: 'select',
        label: 'Method',
        list: requestTypes,
        setValue: setFormValue('method'),
        displayKey: 'label',
        dataKey: 'method',
      },
      url: {
        type: 'text',
        label: 'URL',
        setValue: setFormValue('url'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const customFormData = useMemo(() => {
    return {
      ...formData,
      headers,
      response_structure: dataStructure,
      body: params,
    }
  }, [formData, headers, params, dataStructure])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(customFormData)
  }

  const [testLoading, setTestLoading] = useState(false)

  const handleTestAPI = async () => {
    setTestLoading(true)
    try {
      const response: {
        data: {
          error: boolean
          errorMessage?: string
          result?: JSONStructureDefinition | null
        }
      } = await axios.post(route('get-api-response-structure'), {
        url: formData.url,
        method: formData.method,
        headers,
        body: params,
      })
      if (response.data.error) {
        showError(response.data.errorMessage)
      } else if (response.data.result != null) {
        setEntireStructure(response.data.result)
      }
    } catch (error) {
      handleHttpErrors(error, true)
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <FormBuilder
      formStyles='w-1/2 md:grid-cols-1'
      formData={formData}
      onFormSubmit={handleSubmit}
      formItems={formItems}
      loading={loading}
      errors={errors}
      hideSubmitButton={true}
    >
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-5'>
          <h3>Request Headers</h3>
          {errors['headers'] != null && <ErrorText>{errors['headers']}</ErrorText>}
          <HttpHeadersForm
            list={headers}
            setList={setHeaders}
            errorsKey='headers'
            placeholder={httpHeaderFieldPlaceholder}
          />
        </div>
        <div className='flex flex-col gap-5'>
          <h3>Request Body</h3>
          {errors['body'] != null && <ErrorText>{errors['body']}</ErrorText>}
          <KeyValueList
            list={params}
            setList={setParams}
            errorsKey='body'
          />
        </div>
        <div className='flex'>
          <button
            type='button'
            onClick={handleTestAPI}
            disabled={testLoading}
            className='flex items-center justify-center gap-2 rounded-md border-2 border-indigo-500 bg-white px-6 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {testLoading ? (
              <>
                <svg
                  className='h-4 w-4 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                <span>Detecting...</span>
              </>
            ) : (
              <span>Auto-Detect Structure</span>
            )}
          </button>
        </div>
        <div>
          <h3>Response Structure</h3>
          {errors['response_structure'] != null && (
            <ErrorText>{errors['response_structure']}</ErrorText>
          )}
          <div className='flex flex-col gap-5'>
            <SetDataStructure
              definition={dataStructure.definition}
              addNewFieldToJson={addNewFieldToJson}
              removeFieldFromJson={removeFieldFromJson}
              updateJsonFieldName={updateJsonFieldName}
              updateJsonFieldType={updateJsonFieldType}
              setAsPrimaryField={setAsPrimaryField}
            />
          </div>
        </div>
        <div className='flex gap-3'>
          <Button label='SAVE' />
        </div>
      </div>
    </FormBuilder>
  )
}

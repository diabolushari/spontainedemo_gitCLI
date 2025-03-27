import { DataDetail } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'

interface Props {
  detail: DataDetail
}

export default function DataTableFields({ detail }: Readonly<Props>) {
  return (
    <div className='grid gap-6'>
      <Card>
        <CardHeader title='Date Fields' />
        <div>
          <div className='grid gap-4'>
            {detail.date_fields?.map((field) => (
              <div
                key={field.id}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div>
                  <h3 className='font-medium'>{field.field_name}</h3>
                  <p className='text-sm text-gray-500'>Column: {field.column}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title='Dimension Fields' />
        <div>
          <div className='grid gap-4'>
            {detail.dimension_fields?.map((field) => (
              <div
                key={field.id}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div>
                  <h3 className='font-medium'>{field.field_name}</h3>
                  <p className='text-sm text-gray-500'>Column: {field.column}</p>
                  {field.structure && (
                    <p className='text-sm text-gray-500'>
                      Structure:{' '}
                      <a
                        href={route('meta-structure.show', field.structure?.id)}
                        target='_blank'
                        rel='noreferrer'
                        className='link'
                      >
                        {field.structure.structure_name}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title='Measure Fields' />
        <div>
          <div className='grid gap-4'>
            {detail.measure_fields?.map((field) => (
              <div
                key={field.id}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div>
                  <h3 className='font-medium'>{field.field_name}</h3>
                  <p className='text-sm text-gray-500'>Column: {field.column}</p>
                  {field.unit_field_name && (
                    <p className='text-sm text-gray-500'>
                      Unit: {field.unit_field_name} ({field.unit_column})
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title='Relation Fields' />
        <div>
          <div className='grid gap-4'>
            {detail.relation_fields?.map((field) => (
              <div
                key={field.id}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div>
                  <h3 className='font-medium'>{field.field_name}</h3>
                  <p className='text-sm text-gray-500'>Column: {field.column}</p>
                  <p className='text-sm text-gray-500'>
                    Related Table:{' '}
                    <a
                      href={route('data-detail.show', field.related_table_id)}
                      target='_blank'
                      rel='noreferrer'
                      className='link'
                    >
                      {field.related_table?.name || 'Unknown'}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title='Text Fields' />
        <div>
          <div className='grid gap-4'>
            {detail.text_fields?.map((field) => (
              <div
                key={field.id}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div>
                  <h3 className='font-medium'>{field.field_name}</h3>
                  <p className='text-sm text-gray-500'>Column: {field.column}</p>
                  <p className='text-sm text-gray-500'>
                    Type: {field.is_long_text ? 'Long Text' : 'Short Text'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

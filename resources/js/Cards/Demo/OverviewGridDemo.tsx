const dummyGridItems = [
  {
    id: 1,
    title: 'Total Demand',
    subset_id: '309',
    measure_field: 'total_demand',
    col_span: true,
    filters: [],
    dummyData: { data: [{ month: '202412', total_demand: 17512685145.59 }] },
  },
  {
    id: 2,
    title: 'LT Demand',
    subset_id: '261',
    measure_field: 'total_demand',
    col_span: false,
    filters: [],
    dummyData: { data: [{ month: '202412', total_demand: 12320428648.54 }] },
  },
  {
    id: 3,
    title: 'HT Demand',
    subset_id: '262',
    measure_field: 'total_demand',
    col_span: false,
    filters: [],
    dummyData: { data: [{ month: '202412', total_demand: 3847013478.05 }] },
  },
  {
    id: 4,
    title: 'EHT Demand',
    subset_id: '263',
    measure_field: 'total_demand',
    col_span: true,
    filters: [],
    dummyData: { data: [{ month: '202412', total_demand: 5123456789.12 }] },
  },
]

function OverviewGridWrapper({ config }: any) {
  return (
    <div className={config.col_span ? 'col-span-2' : ''}>
      <div className='overflow-hidden rounded-lg border bg-white p-4 text-center shadow'>
        <p className='text-sm uppercase text-gray-600'>{config.title}</p>
        <p className='break-words text-xl font-bold'>
          {config.dummyData.data[0].total_demand.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default function OverviewGridDemo() {
  return (
    <div className='grid grid-cols-2 gap-4 p-4'>
      {dummyGridItems.map((item) => (
        <OverviewGridWrapper
          key={item.id}
          config={item}
        />
      ))}
    </div>
  )
}

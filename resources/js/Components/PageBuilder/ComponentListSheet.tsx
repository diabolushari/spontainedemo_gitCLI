import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/ui/sheet'
import Button from '@/ui/button/Button'
import { SampleChart } from './SampleChart'
type ComponentListSheetProps = {
  onChartClick: (id: number, name: string) => void
}
const pageBuilderCharts = [
  { id: 1, name: 'Active connection', component: <SampleChart /> },
  { id: 2, name: 'New connection', component: <SampleChart /> },
  { id: 3, name: 'Old', component: <SampleChart /> },
  { id: 4, name: 'New ', component: <SampleChart /> },
  { id: 5, name: 'another 1', component: <SampleChart /> },
  { id: 6, name: 'another two', component: <SampleChart /> },
]

export function ComponentListSheet({ onChartClick }: ComponentListSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type='submit'
          label='Open'
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Here you can select component to add to your page</SheetDescription>
        </SheetHeader>

        <div className='px-4'>
          <div className='grid max-h-[400px] gap-4 overflow-y-auto'>
            {pageBuilderCharts.map((chart) => (
              <div
                key={chart.id}
                role='button'
                tabIndex={0}
                onClick={() => onChartClick(chart.id, chart.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChartClick(chart.id, chart.name)
                  }
                }}
                className='group transform cursor-pointer rounded-md border border-solid p-2 text-sm shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                {chart.name}
                <div style={{ pointerEvents: 'none' }}>{chart.component}</div>
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className='mt-4'>
          <SheetClose asChild>
            <Button
              type='submit'
              label='Cancel'
            />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

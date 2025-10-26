import HighlightCard from '@/Components/WidgetsEditor/WidgetComponents/HighlightCard'
import { HighlightCardData } from '../ConfigSection/HighlightConfigSection'

interface Props {
  highlightCards: HighlightCardData[]
  selectedMonth: Date
}

export default function HighlightBar({ highlightCards, selectedMonth }: Props) {
  return (
    <div className='flex gap-4 overflow-x-auto pb-2'>
      {highlightCards.map((card, index) => (
        <HighlightCard
          key={index}
          card={card}
          selectedMonth={selectedMonth}
        />
      ))}
    </div>
  )
}

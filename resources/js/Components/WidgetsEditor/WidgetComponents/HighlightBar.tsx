import HighlightCard from '@/Components/WidgetsEditor/WidgetComponents/HighlightCard'

import { HighlightCardData } from '@/interfaces/data_interfaces'

interface Props {
  highlightCards: HighlightCardData[]
  selectedMonth: Date
  onEditSection?: (section: string) => void
}

export default function HighlightBar({ highlightCards, selectedMonth, onEditSection }: Props) {
  return (
    <div
      className='flex w-full gap-4 overflow-x-auto pb-2'
      onClick={() => onEditSection?.('highlight_cards')}
    >
      {highlightCards.map((card, index) => (
        <div
          key={index}
          className='flex-1 cursor-pointer transition-transform hover:scale-[1.02]'
        >
          <HighlightCard
            card={card}
            selectedMonth={selectedMonth}
          />
        </div>
      ))}
    </div>
  )
}

import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import { camelToNormal } from '@/formaters/NameFormater'
import { MouseEvent } from 'react'

interface ColorPaletteSelectorProps {
  selectedPalette: string
  onPaletteChange: (palette: string) => void
}

const paletteOptions = Object.entries(chartPallet).map(([key, value]) => ({
  label: camelToNormal(key),
  value: key,
}))

export default function ColorPaletteSelector({
  selectedPalette,
  onPaletteChange,
}: ColorPaletteSelectorProps) {
  return (
    <div className='flex flex-col'>
      <label className='mb-3 text-sm font-medium text-slate-700'>Color palette</label>
      <div className='grid grid-cols-4 gap-2'>
        {paletteOptions.map((palette) => (
          <div
            key={palette.value}
            role='button'
            tabIndex={0}
            onClick={() => onPaletteChange(palette.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onPaletteChange(palette.value)
              }
            }}
            className={`group cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              selectedPalette === palette.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
            }`}
          >
            <input
              name='color_palette'
              type='radio'
              className='sr-only'
              id={palette.value}
              value={palette.value}
              checked={selectedPalette === palette.value}
              readOnly
            />
            <div className='mb-2 flex gap-0.5'>
              {chartPallet[palette.value as keyof typeof chartPallet]
                .slice(0, 5)
                .map((color, idx) => (
                  <div
                    key={idx}
                    className='h-5 flex-1 rounded-sm'
                    style={{ backgroundColor: color }}
                  />
                ))}
            </div>
            <span
              className={`block text-center text-xs font-medium ${
                selectedPalette === palette.value ? 'text-blue-600' : 'text-slate-600'
              }`}
            >
              {palette.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

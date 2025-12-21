import React from 'react'

interface HeadingStyle {
  container: string
  title: string
  description: string
  accent: string
  titleClass?: string
}

interface HeadingStyleComponentProps {
  title: string
  description?: string
  onChange?: (styleIndex: number) => void
  currentStyle: number
  readOnly?: boolean
  noBackground?: boolean
}

const HeadingStyleComponent: React.FC<HeadingStyleComponentProps> = ({
  title,
  description,
  onChange,
  currentStyle,
  readOnly = false,
  noBackground = false,
}) => {
  const styles: HeadingStyle[] = [
    // Style 1 - Clean Minimalist
    {
      container: 'flex flex-col justify-center py-12 space-y-4',
      title: 'text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-tight',
      description: 'text-base text-gray-600 font-light tracking-wide',
      accent: 'w-20 h-0.5 bg-gray-900',
    },
    // Style 2 - Centered Professional
    {
      container: 'flex flex-col items-center text-center py-14 space-y-5',
      title: 'text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight',
      description: 'text-sm text-gray-500 uppercase tracking-[0.2em] font-medium',
      accent: 'w-16 h-px bg-gray-400',
    },
    // Style 3 - Corporate Elegant
    {
      container: 'flex flex-col justify-center py-12 space-y-6',
      title: 'text-6xl md:text-7xl font-light text-gray-900 tracking-tight leading-none',
      description: 'text-lg text-gray-600 font-normal',
      accent: 'w-24 h-1 bg-gray-800',
    },
    // Style 4 - Modern Business
    {
      container: 'flex flex-col items-center text-center py-16 space-y-4',
      title: 'text-6xl md:text-7xl font-semibold text-gray-900 leading-tight tracking-tight',
      description: 'text-base text-gray-500 tracking-wide',
      accent: 'w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent',
    },
    // Style 5 - Bold Statement
    {
      container: 'flex flex-col justify-center py-14 space-y-5',
      title: 'text-6xl md:text-7xl font-bold text-gray-900 uppercase tracking-wide leading-tight',
      description: 'text-sm text-gray-600 tracking-[0.25em] uppercase font-light',
      accent: 'w-full max-w-xs h-0.5 bg-gray-900',
    },
    // Style 6 - Refined Serif
    {
      container: 'flex flex-col items-center text-center py-12 space-y-6',
      title: 'text-5xl md:text-6xl font-serif font-semibold text-gray-900 leading-tight',
      description: 'text-sm text-gray-500 italic',
      accent: 'flex flex-col space-y-2 items-center',
    },
    // Style 7 - Underline Emphasis
    {
      container: 'flex flex-col justify-center py-12 space-y-3',
      title:
        'text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-tight border-b-2 border-gray-900 pb-4 inline-block',
      description: 'text-base text-gray-600 mt-4',
      accent: '',
    },
    // Style 8 - Side Border
    {
      container: 'flex items-start py-12 space-x-6',
      title: 'text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight',
      description: 'text-base text-gray-600 mt-2',
      accent: 'w-1 h-24 bg-gray-900 flex-shrink-0',
    },
    // Style 9 - Subtle Lines
    {
      container: 'flex flex-col items-center justify-center text-center py-14 space-y-6',
      title: 'text-5xl md:text-6xl font-light text-gray-900 tracking-tight leading-tight',
      description: 'text-xs text-gray-500 uppercase tracking-[0.3em]',
      accent: 'w-full max-w-lg h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent',
    },
    // Style 10 - Heavyweight Professional
    {
      container: 'flex flex-col justify-center py-16 space-y-5',
      title: 'text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-none uppercase',
      description: 'text-sm text-gray-600 tracking-[0.2em] font-light',
      accent: 'w-28 h-1.5 bg-gray-900',
    },
    // Style 11 - Dual Tone
    {
      container: 'flex flex-col items-center text-center py-12 space-y-4',
      title: 'text-5xl md:text-6xl font-semibold tracking-tight leading-tight',
      titleClass: 'text-gray-900',
      description: 'text-base text-gray-600 font-light',
      accent: 'flex space-x-2',
    },
    // Style 12 - Executive Style
    {
      container: 'flex flex-col justify-center py-14 space-y-6',
      title: 'text-6xl md:text-7xl font-light text-gray-900 tracking-wide leading-tight',
      description: 'text-sm text-gray-500 tracking-[0.3em] uppercase',
      accent: 'flex space-x-1',
    },
  ]

  const handlePrevious = () => {
    const nextStyle = currentStyle === 0 ? styles.length - 1 : currentStyle - 1
    if (onChange) onChange(nextStyle)
  }

  const handleNext = () => {
    const nextStyle = currentStyle === styles.length - 1 ? 0 : currentStyle + 1
    if (onChange) onChange(nextStyle)
  }

  const renderStyle = (styleIndex: number) => {
    const style = styles[styleIndex]

    switch (styleIndex) {
      case 0: // Clean Minimalist
        return (
          <div className={style.container}>
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent} />
          </div>
        )

      case 1: // Centered Professional
        return (
          <div className={style.container}>
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent} />
          </div>
        )

      case 2: // Corporate Elegant
        return (
          <div className={style.container}>
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent} />
          </div>
        )

      case 3: // Modern Business
        return (
          <div className={style.container}>
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent} />
          </div>
        )

      case 4: // Bold Statement
        return (
          <div className={style.container}>
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent} />
          </div>
        )

      case 5: // Refined Serif
        return (
          <div className={style.container}>
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent}>
              <div className='h-px w-24 bg-gray-300' />
              <div className='h-0.5 w-16 bg-gray-700' />
            </div>
          </div>
        )

      case 6: // Underline Emphasis
        return (
          <div className={style.container}>
            <div>
              <h2 className={style.title}>{title}</h2>
            </div>
            {description && <p className={style.description}>{description}</p>}
          </div>
        )

      case 7: // Side Border
        return (
          <div className={style.container}>
            <div className={style.accent} />
            <div className='flex flex-col space-y-3'>
              <h2 className={style.title}>{title}</h2>
              {description && <p className={style.description}>{description}</p>}
            </div>
          </div>
        )

      case 8: // Subtle Lines
        return (
          <div className={style.container}>
            <div className={style.accent} />
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent} />
          </div>
        )

      case 9: // Heavyweight Professional
        return (
          <div className={style.container}>
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent} />
          </div>
        )

      case 10: // Dual Tone
        return (
          <div className={style.container}>
            <h2 className={`${style.title} ${style.titleClass}`}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent}>
              <div className='h-px w-12 bg-gray-900' />
              <div className='h-px w-12 bg-gray-400' />
            </div>
          </div>
        )

      case 11: // Executive Style
        return (
          <div className={style.container}>
            <h2 className={style.title}>{title}</h2>
            {description && <p className={style.description}>{description}</p>}
            <div className={style.accent}>
              <div className='h-1 w-8 bg-gray-900' />
              <div className='h-1 w-8 bg-gray-700' />
              <div className='h-1 w-8 bg-gray-500' />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`relative w-full ${noBackground ? '' : 'rounded-lg border border-gray-200 bg-white p-8'}`}
    >
      {/* Navigation Buttons */}
      {!readOnly && (
        <>
          <button
            onClick={handlePrevious}
            className='absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white p-2.5 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md'
            aria-label='Previous style'
          >
            <svg
              className='h-5 w-5 text-gray-700'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className='absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white p-2.5 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md'
            aria-label='Next style'
          >
            <svg
              className='h-5 w-5 text-gray-700'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </>
      )}

      {/* Heading Style Display */}
      <div className={`${readOnly ? '' : 'flex min-h-[220px] items-center justify-center px-12'}`}>
        {renderStyle(currentStyle)}
      </div>

      {/* Style Indicator */}
      {!readOnly && (
        <div className='mt-8 flex items-center justify-center space-x-4'>
          <span className='text-sm font-medium text-gray-600'>
            Style {currentStyle + 1} of {styles.length}
          </span>
          <div className='flex space-x-1.5'>
            {Array.from({ length: styles.length }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStyle ? 'w-6 bg-gray-900' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeadingStyleComponent

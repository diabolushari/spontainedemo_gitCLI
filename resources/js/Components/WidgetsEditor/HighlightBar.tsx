import React from 'react'

interface DataItem {
  request_type: string
  pend_with_sla_cnt: number
  compl_wit_sla_cnt: number
}

interface HighlightBarProps {
  data: DataItem[]
  subsetColumn: keyof DataItem
}

const HighlightBar: React.FC<HighlightBarProps> = ({ data, subsetColumn }) => {
  // Use subsetColumn if provided, otherwise default to 'pend_with_sla_cnt'
  const columnToMeasure = subsetColumn || 'pend_with_sla_cnt'

  const counts = data.map((item) => item[columnToMeasure] as number)
  const lowValue = Math.min(...counts)
  const topValue = Math.max(...counts)
  const averageValue = counts.reduce((sum, count) => sum + count, 0) / (counts.length || 1)

  // Find the request types for top and low
  const topItem = data.find((item) => item[columnToMeasure] === topValue)
  const lowItem = data.find((item) => item[columnToMeasure] === lowValue)

  const formatIndianNumber = (num: number): string => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Cr`
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} L`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)} K`
    }
    return num.toString()
  }

  const formattedLow = formatIndianNumber(lowValue)
  const formattedAverage = formatIndianNumber(averageValue)
  const formattedTop = formatIndianNumber(topValue)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: '16px 24px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        gap: '24px',
      }}
    >
      {/* Top Section */}
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div
          style={{
            fontSize: '11px',
            color: '#9ca3af',
            fontWeight: 500,
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Top
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '2px',
          }}
        >
          {formattedTop}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#6b7280',
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {topItem?.request_type ?? 'N/A'}
        </div>
      </div>

      {/* Average Section */}
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div
          style={{
            fontSize: '11px',
            color: '#9ca3af',
            fontWeight: 500,
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Average
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '2px',
          }}
        >
          {formattedAverage}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#6b7280',
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          Across all types
        </div>
      </div>

      {/* Low Section */}
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div
          style={{
            fontSize: '11px',
            color: '#9ca3af',
            fontWeight: 500,
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Low
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '2px',
          }}
        >
          {formattedLow}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#6b7280',
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {lowItem?.request_type ?? 'N/A'}
        </div>
      </div>
    </div>
  )
}

export default HighlightBar

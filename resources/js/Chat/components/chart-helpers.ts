import { MapDataItem } from '@/Components/DataExplorer/OfficeRanking/Map/OfficeClusterMap'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import { ChartData } from '@/Chat/components/ChatVisualization'
import React from 'react'

export function downloadExcel(chartData: ChartData, chartIndex: number) {
  if (!chartData.data || chartData.data.length === 0) {
    return
  }
  const now = new Date()

  const timestamp =
    String(now.getDate()).padStart(2, '0') +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getFullYear()).slice(-2) +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')

  const workbook = XLSX.utils.book_new()

  const worksheet = XLSX.utils.json_to_sheet(chartData.data)

  const sheetName = 'Chart_' + timestamp
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const filename = `${sheetName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.xlsx`

  XLSX.writeFile(workbook, filename)
}

export async function downloadChartAsImage(
  chartRef: React.RefObject<HTMLDivElement>,
  chartData: ChartData
) {
  if (!chartRef.current) {
    return
  }

  try {
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
    })

    // Create timestamp for filename
    const now = new Date()
    const timestamp =
      String(now.getDate()).padStart(2, '0') +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getFullYear()).slice(-2) +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0')

    // Create download link
    const link = document.createElement('a')
    link.download = `chart_${timestamp}.png`
    link.href = canvas.toDataURL('image/png')

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading chart as image:', error)
  }
}

export function convertChartDataToMapDataItems(chartData: ChartData): MapDataItem[] {
  if (!chartData.data) {
    return [] // Handle the case where data is missing.
  }

  const mapDataItems: MapDataItem[] = chartData.data.map((item) => {
    const mapDataItem: MapDataItem = {
      office_name: item[chartData.category_field || ''] as string | undefined,
      office_code: item[chartData.value_field || ''] as string | undefined,
      ...item,
    }

    return mapDataItem
  })

  return mapDataItems
}

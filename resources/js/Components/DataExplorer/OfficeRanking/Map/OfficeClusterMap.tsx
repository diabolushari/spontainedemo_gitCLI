import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { OfficeCoordinates } from '@/interfaces/data_interfaces'
import useFetchList from '@/hooks/useFetchList'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

export interface MapDataItem {
  [key: string]: string | number | null | undefined
  office_name: string | null | undefined
  office_code: string | null | undefined
}

interface Props {
  mapData: MapDataItem[]
  onOfficeSelect?: (office: MapDataItem) => void
  selectedOfficeCode?: string | number
  officeLevel?: string
}

const OfficeClusterMap = ({ mapData, onOfficeSelect, selectedOfficeCode, officeLevel }: Props) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Circle[]>([])
  const [hasShownMessage, setHasShownMessage] = useState(false)

  const [coordinates] = useFetchList<OfficeCoordinates>(route('office-coordinates'))

  // Function to calculate bounds based on markers
  const calculateBounds = (markers: L.Circle[]) => {
    if (markers.length === 0) return null

    const bounds = L.latLngBounds([])
    markers.forEach((marker) => {
      bounds.extend(marker.getLatLng())
    })
    return bounds
  }

  // Function to get default zoom level based on office level
  const getDefaultZoom = (level?: string) => {
    switch (level) {
      case 'state':
        return 7
      case 'region':
        return 8
      case 'circle':
        return 9
      case 'division':
        return 10
      case 'subdivision':
        return 11
      case 'section':
        return 12
      default:
        return 7
    }
  }

  // Function to get base radius based on office level
  const getBaseRadius = (level?: string) => {
    switch (level) {
      case 'state':
        return 10000
      case 'region':
        return 8000
      case 'circle':
        return 6000
      case 'division':
        return 4000
      case 'subdivision':
        return 2000
      case 'section':
        return 1000
      default:
        return 10000
    }
  }

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current || !coordinates) return

    const bounds = L.latLngBounds([8.17, 74.85], [12.78, 77.7])

    mapRef.current = L.map(mapContainerRef.current, {
      center: [9.66505, 76.55606],
      zoom: getDefaultZoom(officeLevel),
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      keyboard: true,
      dragging: true,
      zoomControl: true,
      boxZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: false,
      touchZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current)

    const enableScroll = () => mapRef.current?.scrollWheelZoom.enable()
    const disableScroll = () => mapRef.current?.scrollWheelZoom.disable()

    if (mapContainerRef.current && mapRef.current) {
      mapContainerRef.current.addEventListener('click', enableScroll)
      mapContainerRef.current.addEventListener('mouseleave', disableScroll)
    }

    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.removeEventListener('click', enableScroll)
        mapContainerRef.current.removeEventListener('mouseleave', disableScroll)
      }
      if (mapRef.current) {
        mapRef.current.off()
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [coordinates, officeLevel])

  useEffect(() => {
    if (!mapRef.current || !coordinates || mapData.length === 0) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const values = mapData.map((dataItem) => {
      const key = Object.keys(dataItem).find(
        (k) => typeof dataItem[k] === 'number' && k !== 'office_code'
      )
      return key && typeof dataItem[key] === 'number' ? (dataItem[key] as number) : 0
    })
    const maxValue = Math.max(...values)
    const baseRadius = getBaseRadius(officeLevel)

    mapData.forEach((dataItem) => {
      const matchedOffice = coordinates.find(
        (office) => office.office_code === dataItem.office_code
      )

      if (matchedOffice) {
        const radiusKey = Object.keys(dataItem).find(
          (key) => typeof dataItem[key] === 'number' && key !== 'office_code'
        )

        const value =
          radiusKey && typeof dataItem[radiusKey] === 'number' ? (dataItem[radiusKey] as number) : 0

        const scaledRadius = maxValue > 0 ? (value / maxValue) * baseRadius : 0

        const isSelected =
          selectedOfficeCode != null &&
          dataItem.office_code != null &&
          String(dataItem.office_code) === String(selectedOfficeCode)

        const circle = L.circle([matchedOffice.latitude, matchedOffice.longitude], {
          radius: scaledRadius,
          color: isSelected ? '#FFB700' : '#0066CC',
          fillColor: isSelected ? '#FFB700' : '#0066CC',
          fillOpacity: isSelected ? 0.2 : 0.4,
          weight: isSelected ? 3 : 2,
        }).addTo(mapRef.current!)

        markersRef.current.push(circle)

        const popupContent = `<b>${dataItem.office_name}</b><br>${radiusKey}: ${formatNumber(value)}`

        circle.on('mouseover', function (e) {
          L.popup({ closeButton: false })
            .setLatLng(e.latlng)
            .setContent(popupContent)
            .openOn(mapRef.current!)
        })

        circle.on('mouseout', function () {
          mapRef.current?.closePopup()
        })

        if (onOfficeSelect) {
          circle.on('click', function () {
            onOfficeSelect(dataItem)
          })
        }
      }
    })

    // Fit bounds to markers with padding
    const bounds = calculateBounds(markersRef.current)
    if (bounds) {
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 12,
      })
    }
  }, [coordinates, mapData, onOfficeSelect, selectedOfficeCode, officeLevel])

  const handleMapMouseOver = () => {
    if (!hasShownMessage && mapRef.current) {
      const center = mapRef.current.getCenter()
      L.popup({ closeButton: true, autoClose: true, closeOnClick: true })
        .setLatLng(center)
        .setContent(
          '<div style="text-align: center; padding: 10px;"><b>Click on the map to enable zooming</b></div>'
        )
        .openOn(mapRef.current)
      setHasShownMessage(true)
    }
  }

  const handleMapFocus = () => {
    handleMapMouseOver()
  }

  return (
    <div>
      <button
        className='h-[500px] w-full border-0 bg-transparent p-0'
        onMouseOver={handleMapMouseOver}
        onFocus={handleMapFocus}
        aria-label='Interactive map showing office locations'
      >
        <div
          ref={mapContainerRef}
          id='map'
          style={{ height: '500px', width: '100%' }}
        />
      </button>
    </div>
  )
}

export default OfficeClusterMap

'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MapViewProps } from '@/lib/types'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
)
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
})

// Helper functions remain the same
function getMagnitudeColor(magnitude: number): string {
  if (magnitude <= 2) return '#00ff00'
  if (magnitude <= 4) return '#ffff00'
  if (magnitude <= 6) return '#ffa500'
  return '#ff0000'
}

function getMagnitudeRadius(magnitude: number): number {
  return Math.max(6, Math.min(magnitude * 3, 15))
}

export function MapView({ data }: MapViewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Import Leaflet CSS only on client side
    void import('leaflet/dist/leaflet.css')
  }, [])

  if (!mounted) {
    return (
      <Card className="h-full">
        <CardHeader className="flex-none">
          <CardTitle>Earthquake Locations</CardTitle>
          <CardDescription>Loading map...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 relative h-[500px] p-0">
          <div className="absolute inset-0 flex items-center justify-center">
            Loading map...
          </div>
        </CardContent>
      </Card>
    )
  }

  const center: [number, number] = [20, 0]

  return (
    <Card className="h-full">
      <CardHeader className="flex-none">
        <CardTitle>Earthquake Locations</CardTitle>
        <CardDescription>
          Geographical distribution of earthquakes. Circle size and color
          indicate magnitude.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 relative h-[500px] p-0">
        <div className="absolute inset-0">
          <MapContainer
            center={center}
            zoom={2}
            minZoom={2}
            maxZoom={18}
            className="h-full w-full rounded-md"
            scrollWheelZoom={true}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((quake) => (
              <CircleMarker
                key={quake._id}
                center={[quake.Latitude, quake.Longitude]}
                radius={getMagnitudeRadius(quake.Mag)}
                fillColor={getMagnitudeColor(quake.Mag)}
                color={getMagnitudeColor(quake.Mag)}
                weight={1}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium">{quake.Place}</p>
                    <p>Magnitude: {quake.Mag.toFixed(1)}</p>
                    <p>Time: {new Date(quake.Time).toLocaleString()}</p>
                    <p>
                      Location: {quake.Latitude.toFixed(4)},{' '}
                      {quake.Longitude.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}

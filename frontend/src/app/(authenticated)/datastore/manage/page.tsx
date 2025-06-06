'use client'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Download, BarChart2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TableView } from './table-view'
import { GraphView } from './graph-view'
import { MapView } from './map-view'
import { ContentLayout } from '@/components/admin-panel/content-layout'

export interface EarthquakeData {
  _id: string
  Place: string
  Mag: number
  Time: string | number
  Latitude: number
  Longitude: number
}

export default function Manage() {
  const [earthquakeData, setEarthquakeData] = useState<EarthquakeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchEarthquakeData() {
      try {
        const response = await fetch('/api/earthquakes')
        if (!response.ok) throw new Error('Failed to fetch earthquake data')
        const data = await response.json()
        setEarthquakeData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEarthquakeData()
  }, [])

  const filteredData = earthquakeData.filter((quake) =>
    quake.Place.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ContentLayout title="Manage">
      <div className="h-full flex flex-col space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search earthquakes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="graph">Graph View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <TableView data={filteredData} />
            </TabsContent>
            <TabsContent value="graph">
              <GraphView data={filteredData} />
            </TabsContent>
            <TabsContent value="map">
              <MapView data={filteredData} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ContentLayout>
  )
}

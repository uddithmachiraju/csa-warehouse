'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { DatasetCard } from './datasetcard'

const sampleData = [
  {
    title: 'Agricultural Land Use Data 2023',
    imageSrc: '/images/agriculture.jpg',
  },
  {
    title: 'Climate Change Impact Study',
    imageSrc: '/images/climate.jpg',
  },
  {
    title: 'Urban Development Patterns',
    imageSrc: '/images/urban.jpg',
  },
  {
    title: 'Rainfall Distribution Analysis',
    imageSrc: '/images/rainfall.jpg',
  },
]

export default function Browse() {
  return (
    <div className="h-full flex flex-col space-y-4 p-4">
      <div className="relative p-4 shrink-0">
        <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search dataset"
          className="pl-10 w-full"
        />
      </div>
      <div className="flex-1 overflow-auto px-4">
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {sampleData.map((dataset, index) => (
            <DatasetCard
              key={index}
              title={dataset.title}
              imageSrc={dataset.imageSrc}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

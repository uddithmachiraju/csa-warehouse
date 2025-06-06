'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { DatasetCard } from './datasetcard'
import { ContentLayout } from '@/components/admin-panel/content-layout'

 export default function Browse() {
  const datasets = [
    {
      title: 'Earthquake Dataset',
      imageSrc: '/earthquake.jpg',
    },
    {
      title: 'Climate Dataset',
      imageSrc: '/climate.jpg',
    },
    {
      title: 'Land Use Dataset',
      imageSrc: '/land-use.jpg',
    },
    {
      title: 'Agriculture Dataset',
      imageSrc: '/agriculture.jpg',
    },
  ]

  return (
    <ContentLayout title="Browse">
      <div className="h-full flex flex-col p-6">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search datasets..."
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {datasets.map((dataset, index) => (
            <DatasetCard
              key={index}
              title={dataset.title}
              imageSrc={dataset.imageSrc}
            />
          ))}
        </div>
      </div>
    </ContentLayout>
  )
}

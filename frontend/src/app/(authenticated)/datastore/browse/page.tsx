'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { DatasetCard } from './datasetcard'
import { ContentLayout } from '@/components/admin-panel/content-layout'

 export default function Browse() {
  const datasets = [
    {
      title: 'Crop Yield Dataset',
      description: 'Comprehensive agricultural yield data covering major crops including corn, wheat, soybeans, and rice across different regions and growing seasons. This dataset includes soil quality metrics, weather conditions, irrigation data, and farming practices that influence crop productivity. Essential for precision agriculture and yield prediction models.',
      uploaderName: 'Alice Smith',
      uploaderEmail: 'alice@example.com',
      uploadDate: '2023-05-01T10:30:00Z',
    },
    {
      title: 'Climate Dataset',
      description: 'Climate data from 1900 to present covering temperature variations, precipitation patterns, atmospheric pressure, humidity levels, and wind speed measurements across different geographical regions. This extensive dataset supports climate change research and weather forecasting models.',
      uploaderName: 'Bob Johnson',
      uploaderEmail: 'bob@example.com',
      uploadDate: '2023-04-15T14:00:00Z',
    },
    {
      title: 'Land Use Dataset',
      description: 'Land use patterns and changes over time including urban development, agricultural expansion, forest cover changes, and infrastructure development. This dataset provides valuable insights into environmental impact assessment and sustainable development planning.',
      uploaderName: 'Carol Lee',
      uploaderEmail: 'carol@example.com',
      uploadDate: '2023-03-20T09:15:00Z',
    },
    {
      title: 'Agriculture Dataset',
      description: 'Agricultural production and yield statistics covering crop types, harvest volumes, soil quality metrics, irrigation patterns, and farming techniques across different regions and seasons. This comprehensive dataset supports agricultural research and food security analysis.',
      uploaderName: 'David Kim',
      uploaderEmail: 'david@example.com',
      uploadDate: '2023-02-10T16:45:00Z',
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
              description={dataset.description}
              uploaderName={dataset.uploaderName}
              uploaderEmail={dataset.uploaderEmail}
              uploadDate={dataset.uploadDate}
            />
          ))}
        </div>
      </div>
    </ContentLayout>
  )
}

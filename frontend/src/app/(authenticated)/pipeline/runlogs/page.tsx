import { Input } from '@/components/ui/input'
import { PipelineItem } from './pipe-item'
import { Search } from 'lucide-react'
import { ContentLayout } from '@/components/admin-panel/content-layout'

export default function RunLogs() {
  return (
    <ContentLayout title="Run Logs">
      <div className="h-full flex flex-col space-y-4 p-4">
        <div className="relative p-4 shrink-0">
          <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search dataset"
            className="pl-10 w-full"
          />
        </div>

        <div className="space-y-4">
          <PipelineItem number={1} />
          <PipelineItem number={2} />
          <PipelineItem number={3} />
          <PipelineItem number={4} />
        </div>
      </div>
    </ContentLayout>
  )
}

'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, ChevronDown, ChevronUp } from 'lucide-react'

interface PipelineItemProps {
  number: number
}

export function PipelineItem({ number }: PipelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-muted/50"
              aria-label={`Run Pipeline ${number}`}
            >
              <Play className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">Pipeline {number}</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Details
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t mt-2">This is the pipeline</div>
      )}
    </div>
  )
}

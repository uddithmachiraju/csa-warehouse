import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Mail } from 'lucide-react'

export function DatasetCard({
  title,
  description,
  uploaderName,
  uploaderEmail,
  uploadDate,
}: {
  title: string
  description?: string
  uploaderName: string
  uploaderEmail?: string
  uploadDate: string
}) {
  return (
    <Card className="bg-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold truncate">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between pt-4 border-t border-border/20">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-foreground">{uploaderName}</p>
            {uploaderEmail && (
              <p className="text-xs text-muted-foreground flex items-center">
                <Mail className="w-3 h-3 mr-1.5" />
                {uploaderEmail}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Uploaded</p>
            <p className="text-sm font-medium text-foreground">{formatDate(uploadDate)}</p>
          </div>
        </div>
        <Button className="w-full mt-4">Open</Button>
      </CardContent>
    </Card>
  )
}

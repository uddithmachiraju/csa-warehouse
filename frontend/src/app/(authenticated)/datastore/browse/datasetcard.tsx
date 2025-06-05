import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export function DatasetCard({
  title,
  imageSrc,
}: {
  title: string
  imageSrc: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3">
            <Image
              src={imageSrc}
              alt="Image"
              width={300}
              height={200}
              className="h-full w-full object-cover bg-muted"
            />
          </div>
          <div className="flex flex-col justify-between p-6 w-full md:w-2/3">
            <div>
              <CardTitle className="mb-4">{title}</CardTitle>
              <ul className="space-y-2 list-disc pl-5">
                <li>High level details</li>
                <li>ipsum dolor sit amet</li>
                <li>ipsum dolor sit amet</li>
              </ul>
            </div>
            <div className="mt-4">
              <Button className="w-full">Open</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

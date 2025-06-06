'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Upload } from 'lucide-react'
import { DatasetConfigurationDialog } from './dataset-cofig-dialogue'
import { useState } from 'react'
import { FormData } from './dataset-cofig-dialogue'
import { ContentLayout } from '@/components/admin-panel/content-layout'

export default function Create() {
  const [open, setOpen] = useState(false)

  const handleComplete = (data: FormData) => {
    console.log('Configuration complete:', data)
  }
  return (
    <ContentLayout title="Create">
      <div className="h-full flex flex-col space-y-6 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search dataset"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Dataset Information</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dataset-name">Dataset name</Label>
                <Input id="dataset-name" placeholder="Enter dataset name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permission">Permission</Label>
                <Select defaultValue="public">
                  <SelectTrigger id="permission" className="w-full">
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataset-type">Dataset type</Label>
                <Select defaultValue="land-use">
                  <SelectTrigger id="dataset-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="land-use">Land use</SelectItem>
                    <SelectItem value="climate">Climate</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Select defaultValue="none">
                  <SelectTrigger id="tags" className="w-full">
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Data Selection</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <p className="text-sm text-muted-foreground">
                Choose a file with relevant data from your local computer to upload.
                <br />
                Acceptable file formats include: CSV
              </p>
              <div className="space-y-4">
                <Input id="picture" type="file" />
                <Button onClick={() => setOpen(true)} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Configure Dataset
                </Button>
              </div>
              <DatasetConfigurationDialog
                open={open}
                onOpenChange={setOpen}
                onComplete={handleComplete}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  )
}

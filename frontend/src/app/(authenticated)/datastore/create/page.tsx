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
export default function Create() {
  const [open, setOpen] = useState(false)

  const handleComplete = (data: FormData) => {
    console.log('Configuration complete:', data)
  }
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
      <h1 className="text-3xl font-bold mb-8">Create New Dataset</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dataset-name">Dataset name</Label>
            <Input id="dataset-name" placeholder="Sample" />
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Choose a file with relevant data from tour local computer to
              upload.
              <br />
              Acceptable file formats include: CSV
            </p>
            <Input id="picture" type="file" />
            <Button onClick={() => setOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Configure Dataset
            </Button>
            <DatasetConfigurationDialog
              open={open}
              onOpenChange={setOpen}
              onComplete={handleComplete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

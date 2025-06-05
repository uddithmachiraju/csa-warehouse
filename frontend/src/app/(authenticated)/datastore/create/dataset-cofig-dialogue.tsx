'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

export interface FormData {
  time: string
  location: string
  latitude: string
  longitude: string
  mag: string
}

interface DatasetConfigurationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: FormData) => void
}

interface Step {
  id: number
  title: string
  completed: boolean
  current: boolean
}

interface DatasetConfigurationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: FormData) => void
}

export function DatasetConfigurationDialog({
  open,
  onOpenChange,
  onComplete,
}: DatasetConfigurationDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    time: '',
    location: '',
    latitude: '',
    longitude: '',
    mag: '',
  })

  const steps: Step[] = [
    {
      id: 1,
      title: 'Time/Location Data Checking',
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: 'Select Data Column',
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: 'Select Granularity',
      completed: currentStep > 3,
      current: currentStep === 3,
    },
  ]

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
      onOpenChange(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Dataset Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border',
                      step.completed
                        ? 'bg-primary text-primary-foreground'
                        : step.current
                          ? 'border-primary'
                          : 'bg-muted'
                    )}
                  >
                    {step.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span className="ml-2 text-sm">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-4 h-0.5 w-10 bg-muted"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {currentStep === 1 && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    My Dataset Contains Time Data
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    My Dataset Contains Location Data
                  </label>
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="space-y-4">
                  <Select
                    value={formData.time}
                    onValueChange={(value) => handleChange('time', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timestamp">Timestamp</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="datetime">DateTime</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coordinates">Coordinates</SelectItem>
                      <SelectItem value="address">Address</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.latitude}
                    onValueChange={(value) => handleChange('latitude', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Latitude" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lat">lat</SelectItem>
                      <SelectItem value="latitude">latitude</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.longitude}
                    onValueChange={(value) => handleChange('longitude', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Longitude" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lng">lng</SelectItem>
                      <SelectItem value="longitude">longitude</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.mag}
                    onValueChange={(value) => handleChange('mag', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="magnitude">magnitude</SelectItem>
                      <SelectItem value="mag">mag</SelectItem>
                      <SelectItem value="intensity">intensity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <Select
                    value={formData.time}
                    onValueChange={(value) => handleChange('time', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timestamp">Timestamp</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="datetime">DateTime</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Coordinate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coordinates">Coordinates</SelectItem>
                      <SelectItem value="address">Address</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="mt-8 flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="min-w-[100px]"
              >
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button onClick={handleNext} className="min-w-[100px]">
                  {currentStep === steps.length
                    ? 'Save and Upload'
                    : 'Continue'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

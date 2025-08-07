'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'

// --- Zod Schema ---
const datasetConfigSchema = z.object({
  isSpatial: z.boolean(),
  isTemporal: z.boolean(),
})

type DatasetConfigFormType = z.infer<typeof datasetConfigSchema>

// --- Types ---
export interface DatasetConfigFormData {
  isSpatial: boolean
  isTemporal: boolean
}

interface DatasetConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: DatasetConfigFormData) => void
  onSubmitForm?: (configData: DatasetConfigFormData) => void
}

// --- Main Dialog Component ---
export function DatasetConfigurationDialog({
  open,
  onOpenChange,
  onComplete,
  onSubmitForm,
}: DatasetConfigDialogProps) {
  // --- React Hook Form ---
  const form = useForm<DatasetConfigFormType>({
    resolver: zodResolver(datasetConfigSchema),
    defaultValues: {
      isSpatial: false,
      isTemporal: false,
    },
  })

  // --- Handlers ---
  const handleSubmit = async (data: DatasetConfigFormType) => {
    try {
      onComplete(data)
      if (onSubmitForm) {
        await onSubmitForm(data)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // --- UI ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Dataset Configuration
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isSpatial"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="isSpatial"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="isSpatial" className="text-sm font-medium">
                        My Dataset Contains Spatial Data
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isTemporal"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="isTemporal"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="isTemporal" className="text-sm font-medium">
                        My Dataset Contains Temporal Data
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Configuration
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableViewProps } from '@/lib/types'

export function TableView({ data }: TableViewProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Magnitude</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((quake) => (
            <TableRow key={quake._id}>
              <TableCell>{quake.Place}</TableCell>
              <TableCell>{quake.Mag.toFixed(1)}</TableCell>
              <TableCell>{new Date(quake.Time).toLocaleString()}</TableCell>
              <TableCell>{quake.Latitude.toFixed(4)}</TableCell>
              <TableCell>{quake.Longitude.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

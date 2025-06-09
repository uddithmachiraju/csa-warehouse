import { DataTable } from '@/components/TableView/data-table';
import { columns } from './columns';
import type { EarthquakeData } from './page';

export function TableView({ data }: { data: EarthquakeData[] }) {
  return <DataTable columns={columns} data={data} />;
}

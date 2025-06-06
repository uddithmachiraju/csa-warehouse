import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { EarthquakeData } from './page'

interface GraphViewProps {
  data: EarthquakeData[]
}

const chartConfig = {
  magnitude: {
    label: 'Magnitude',
    color: 'hsl(var(--chart-1))',
  },
}

export function GraphView({ data }: GraphViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earthquake Magnitude by Location</CardTitle>
        <CardDescription>
          Distribution of earthquake magnitudes across different locations
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[500px]">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="Place"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              dataKey="Mag"
              label={{
                value: 'Magnitude',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Location: ${label}`}
                  formatter={(value) => [
                    `Magnitude: ${Number(value).toFixed(1)}`,
                  ]}
                />
              }
            />
            <Bar
              dataKey="Mag"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

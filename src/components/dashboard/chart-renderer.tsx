"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartRendererProps {
  data: any[];
  chartType: string;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const getKeys = (data: any[]) => {
  if (!data || data.length === 0) return { categoryKey: null, valueKey: null, valueKeys: [] };
  const sample = data[0];
  const allKeys = Object.keys(sample);
  
  const categoryKey = allKeys.find(key => typeof sample[key] === 'string') || allKeys[0];
  const valueKeys = allKeys.filter(key => typeof sample[key] === 'number');
  const valueKey = valueKeys[0] || null;

  return { categoryKey, valueKey, valueKeys };
};

export default function ChartRenderer({ data, chartType }: ChartRendererProps) {
  const { categoryKey, valueKey, valueKeys } = getKeys(data);

  if (!categoryKey || !valueKey) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4">
        Could not determine appropriate data keys for this chart type.
      </div>
    );
  }

  const chartConfig: ChartConfig = {
    [valueKey]: {
      label: valueKey,
      color: "hsl(var(--primary))",
    },
    [categoryKey]: {
      label: categoryKey,
    }
  };
  
  const pieChartConfig = React.useMemo(() => {
    if (!data || !categoryKey) return {};
    return data.reduce((acc, item) => {
      const name = item[categoryKey!];
      if (name) {
        acc[name] = { label: name };
      }
      return acc;
    }, {} as ChartConfig);
  }, [data, categoryKey]);


  switch (chartType) {
    case "Bar chart":
      return (
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={valueKey} fill={`var(--color-${valueKey})`} radius={4} />
          </BarChart>
        </ChartContainer>
      );
    case "Line chart":
      return (
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey={valueKey} stroke={`var(--color-${valueKey})`} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      );
    case "Pie chart":
      return (
        <ChartContainer config={pieChartConfig} className="min-h-[250px] w-full aspect-square">
            <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={data} dataKey={valueKey} nameKey={categoryKey} cx="50%" cy="50%" outerRadius={80}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey={categoryKey} />} />
            </PieChart>
        </ChartContainer>
      );
    case "Scatter plot":
        if (valueKeys.length < 2) return <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4">Scatter plot requires at least two numeric columns.</div>;
        const scatterConfig: ChartConfig = {
            [valueKeys[0]]: { label: valueKeys[0], color: "hsl(var(--chart-1))"},
            [valueKeys[1]]: { label: valueKeys[1], color: "hsl(var(--chart-2))" },
        }
        return (
            <ChartContainer config={scatterConfig} className="min-h-[250px] w-full">
                <ScatterChart accessibilityLayer data={data}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey={valueKeys[0]} name={valueKeys[0]} />
                    <YAxis type="number" dataKey={valueKeys[1]} name={valueKeys[1]} />
                    <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
                    <Scatter name="Data Points" data={data} fill={`var(--color-${valueKeys[0]})`} />
                </ScatterChart>
            </ChartContainer>
        );
    default:
      return <div className="flex items-center justify-center h-full text-muted-foreground">Unknown chart type</div>;
  }
}

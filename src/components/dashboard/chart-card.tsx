import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartRenderer from "@/components/dashboard/chart-renderer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ChartConfig {
  id: number;
  type: string;
}

interface ChartCardProps {
  chart: ChartConfig;
  data: any[];
  onRemove: (id: number) => void;
}

export default function ChartCard({ chart, data, onRemove }: ChartCardProps) {
  return (
    <Card className="flex flex-col animate-in fade-in zoom-in-95">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
        <CardTitle className="text-base font-medium">{chart.type}</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(chart.id)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Remove chart</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-2">
        <ChartRenderer data={data} chartType={chart.type} />
      </CardContent>
    </Card>
  );
}

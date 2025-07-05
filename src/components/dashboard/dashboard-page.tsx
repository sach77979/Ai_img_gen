"use client";

import { useState, useTransition } from "react";
import { suggestChartTypes, type SuggestChartTypesOutput } from "@/ai/flows/suggest-chart-types";
import { useToast } from "@/hooks/use-toast";

import EmptyState from "@/components/dashboard/empty-state";
import InsightsPanel from "@/components/dashboard/insights-panel";
import DataTable from "@/components/dashboard/data-table";
import ChartCard from "@/components/dashboard/chart-card";

interface ChartConfig {
  id: number;
  type: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<any[] | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [insights, setInsights] = useState<SuggestChartTypesOutput | null>(null);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const parseCSV = (csvText: string): Record<string, any>[] => {
    const lines = csvText.trim().split(/\r\n|\n/);
    if (lines.length < 2) return [];
  
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const result = [];
  
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
      if (values.length !== headers.length) continue;
  
      const row: Record<string, any> = {};
      for (let j = 0; j < headers.length; j++) {
        const value = values[j];
        const numValue = Number(value);
        row[headers[j]] = isNaN(numValue) || value === '' ? value : numValue;
      }
      result.push(row);
    }
    return result;
  };

  const handleFileUpload = (file: File) => {
    startTransition(async () => {
      try {
        const text = await file.text();
        setFileContent(text);

        let parsedData;
        if (file.type === "application/json") {
          parsedData = JSON.parse(text);
        } else {
          parsedData = parseCSV(text);
        }

        if (!parsedData || parsedData.length === 0) {
            throw new Error("Failed to parse data or file is empty.");
        }

        setData(parsedData);

        const aiResult = await suggestChartTypes({ dataset: text });
        setInsights(aiResult);
        toast({
            title: "Analysis Complete",
            description: "We've analyzed your data and generated some insights.",
        });

      } catch (error) {
        console.error("File processing error:", error);
        toast({
          variant: "destructive",
          title: "An error occurred.",
          description: error instanceof Error ? error.message : "Could not process the file.",
        });
        setData(null);
        setInsights(null);
        setCharts([]);
      }
    });
  };

  const handleAddChart = (chartType: string) => {
    setCharts((prev) => [...prev, { id: Date.now(), type: chartType }]);
  };

  const handleRemoveChart = (id: number) => {
    setCharts((prev) => prev.filter((chart) => chart.id !== id));
  };

  if (!data) {
    return <EmptyState onFileUpload={handleFileUpload} isLoading={isPending} />;
  }

  return (
    <div className="space-y-8">
      {insights && <InsightsPanel insights={insights} onAddChart={handleAddChart} />}
      
      {charts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {charts.map((chart) => (
            <ChartCard key={chart.id} chart={chart} data={data} onRemove={handleRemoveChart} />
          ))}
        </div>
      )}

      <DataTable data={data} />
    </div>
  );
}

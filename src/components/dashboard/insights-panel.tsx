"use client";

import { Lightbulb, BarChart, LineChart, PieChart, ScatterChart } from "lucide-react";
import { type SuggestChartTypesOutput } from "@/ai/flows/suggest-chart-types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InsightsPanelProps {
  insights: SuggestChartTypesOutput;
  onAddChart: (chartType: string) => void;
}

const chartIcons: { [key: string]: React.ElementType } = {
  "Bar chart": BarChart,
  "Line chart": LineChart,
  "Pie chart": PieChart,
  "Scatter plot": ScatterChart,
};

export default function InsightsPanel({ insights, onAddChart }: InsightsPanelProps) {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    <span>Smart Insights</span>
                </CardTitle>
                <CardDescription>
                    We've analyzed your dataset. Here are some key takeaways and suggested visualizations.
                </CardDescription>
            </div>
            <Badge variant="secondary">Powered by GenAI</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="font-semibold mb-2">Key Trends & Outliers</h3>
            <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">{insights.insights}</p>
        </div>
        <div>
            <h3 className="font-semibold mb-2">Suggested Charts</h3>
            <div className="flex flex-wrap gap-2">
            {insights.suggestedChartTypes.map((type) => {
                const Icon = chartIcons[type] || BarChart;
                return (
                <Button key={type} variant="outline" onClick={() => onAddChart(type)}>
                    <Icon className="mr-2 h-4 w-4" />
                    Add {type}
                </Button>
                );
            })}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

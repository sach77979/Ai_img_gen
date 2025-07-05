"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export default function EmptyState({ onFileUpload, isLoading }: EmptyStateProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.type === "application/json") {
        onFileUpload(file);
      } else {
        toast({
          variant: "destructive",
          title: "Unsupported File Type",
          description: "Please upload a CSV or JSON file.",
        });
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.type === "application/json") {
        onFileUpload(file);
      } else {
        toast({
          variant: "destructive",
          title: "Unsupported File Type",
          description: "Please upload a CSV or JSON file.",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
        <Card className="w-full max-w-2xl text-center" onDragEnter={handleDrag}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .json"
              onChange={handleFileChange}
              className="hidden"
            />
            <CardHeader>
                <CardTitle className="text-2xl">Welcome to Data Canvas</CardTitle>
                <CardDescription>Start by uploading a dataset to generate insights and visualizations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${dragActive ? 'border-primary bg-accent/20' : 'border-border'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-sm text-muted-foreground">Analyzing your data...</p>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 font-semibold">Drag & drop your CSV or JSON file here</p>
                            <p className="text-sm text-muted-foreground">or</p>
                            <Button size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                                Browse Files
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}

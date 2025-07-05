"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DataTableProps {
  data: any[];
}

const ROWS_PER_PAGE = 10;

export default function DataTable({ data }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const selectedData = data.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Preview</CardTitle>
        <CardDescription>A preview of your uploaded dataset.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header) => (
                      <TableCell key={header}>{String(row[header])}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex items-center justify-end space-x-2 pt-4">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

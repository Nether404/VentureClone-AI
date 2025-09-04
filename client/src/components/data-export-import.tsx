import { useState, useRef } from "react";
import { Download, Upload, FileJson, FileText, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { BusinessAnalysis } from "@/types";

interface DataExportImportProps {
  analyses: BusinessAnalysis[];
  onImport: (analyses: BusinessAnalysis[]) => void;
}

export function DataExportImport({ analyses, onImport }: DataExportImportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(analyses, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ventureclone-analyses-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Exported ${analyses.length} analyses to JSON`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      // Create CSV headers
      const headers = [
        "URL",
        "Business Model",
        "Target Market",
        "Main Offering",
        "Overall Score",
        "Technical Complexity",
        "Market Opportunity",
        "Competitive Landscape",
        "Resource Requirements",
        "Time to Market",
        "Created At"
      ];
      
      // Create CSV rows
      const rows = analyses.map(analysis => [
        analysis.url || "",
        analysis.businessModel || "",
        analysis.targetMarket || "",
        analysis.mainOffering || "",
        analysis.overallScore?.toString() || "",
        analysis.technicalComplexity?.toString() || "",
        analysis.marketOpportunity?.toString() || "",
        analysis.competitiveLandscape?.toString() || "",
        analysis.resourceRequirements?.toString() || "",
        analysis.timeToMarket?.toString() || "",
        new Date(analysis.createdAt).toISOString()
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => 
          row.map(cell => 
            cell.includes(",") || cell.includes('"') || cell.includes("\n")
              ? `"${cell.replace(/"/g, '""')}"` 
              : cell
          ).join(",")
        )
      ].join("\n");
      
      const dataBlob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ventureclone-analyses-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Exported ${analyses.length} analyses to CSV`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate imported data
        if (!Array.isArray(importedData)) {
          throw new Error("Invalid data format");
        }
        
        // Basic validation of each analysis
        const validAnalyses = importedData.filter(item => 
          typeof item === "object" && 
          (item.url || item.businessModel)
        );
        
        if (validAnalyses.length === 0) {
          throw new Error("No valid analyses found in file");
        }
        
        onImport(validAnalyses);
        
        toast({
          title: "Import Successful",
          description: `Imported ${validAnalyses.length} analyses`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Failed to import data",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <Card className="bg-vc-card border-vc-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-vc-text flex items-center justify-between">
          <span>Data Management</span>
          <Badge className="bg-vc-border text-vc-text">
            {analyses.length} analyses
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-vc-text-muted flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </h3>
            <div className="space-y-2">
              <Button
                onClick={exportToJSON}
                disabled={isExporting || analyses.length === 0}
                variant="outline"
                className="w-full border-vc-border text-vc-text hover:bg-vc-border/50"
                data-testid="button-export-json"
              >
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <Button
                onClick={exportToCSV}
                disabled={isExporting || analyses.length === 0}
                variant="outline"
                className="w-full border-vc-border text-vc-text hover:bg-vc-border/50"
                data-testid="button-export-csv"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-vc-text-muted flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Data
            </h3>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                data-testid="input-import-file"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                variant="outline"
                className="w-full border-vc-border text-vc-text hover:bg-vc-border/50"
                data-testid="button-import-json"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? "Importing..." : "Import JSON"}
              </Button>
              <p className="text-xs text-vc-text-muted">
                Import previously exported analyses
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-3 bg-vc-dark rounded-lg border border-vc-border/50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-vc-accent mt-0.5" />
            <div className="space-y-1 text-xs text-vc-text-muted">
              <p>Export your analyses to backup or share with others</p>
              <p>JSON format preserves all data, CSV is better for spreadsheets</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
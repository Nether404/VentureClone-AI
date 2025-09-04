import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BusinessAnalysis } from "@/types";

interface AnalysisComparisonProps {
  analyses: BusinessAnalysis[];
  onRemove?: (analysisId: string) => void;
}

export function AnalysisComparison({ analyses, onRemove }: AnalysisComparisonProps) {
  const [selectedMetric, setSelectedMetric] = useState<"overall" | "technical" | "market" | "competitive" | "resource" | "time">("overall");

  if (analyses.length === 0) {
    return (
      <Card className="bg-vc-card border-vc-border">
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-vc-text-muted mb-4" />
          <p className="text-vc-text-muted">Select at least 2 analyses to compare</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    { key: "overall", label: "Overall Score", field: "overallScore" },
    { key: "technical", label: "Technical Complexity", field: "technicalComplexity" },
    { key: "market", label: "Market Opportunity", field: "marketOpportunity" },
    { key: "competitive", label: "Competitive Landscape", field: "competitiveLandscape" },
    { key: "resource", label: "Resource Requirements", field: "resourceRequirements" },
    { key: "time", label: "Time to Market", field: "timeToMarket" },
  ];

  const getScoreValue = (analysis: BusinessAnalysis, field: string) => {
    if (field === "overallScore") {
      return analysis.overallScore || 0;
    }
    return analysis[field as keyof BusinessAnalysis] || 0;
  };

  const getScoreTrend = (score: number) => {
    if (score >= 7) return { icon: TrendingUp, color: "text-green-400" };
    if (score >= 5) return { icon: Minus, color: "text-yellow-400" };
    return { icon: TrendingDown, color: "text-red-400" };
  };

  const selectedMetricData = metrics.find(m => m.key === selectedMetric);

  return (
    <Card className="bg-vc-card border-vc-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-vc-text flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-vc-accent" />
          Analysis Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <Button
              key={metric.key}
              variant={selectedMetric === metric.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(metric.key as any)}
              className={cn(
                "text-xs",
                selectedMetric === metric.key 
                  ? "bg-vc-primary text-white" 
                  : "border-vc-border text-vc-text hover:bg-vc-border/50"
              )}
              data-testid={`button-metric-${metric.key}`}
            >
              {metric.label}
            </Button>
          ))}
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map(analysis => {
            const score = getScoreValue(analysis, selectedMetricData!.field);
            const trend = getScoreTrend(score);
            const TrendIcon = trend.icon;

            return (
              <div 
                key={analysis.id}
                className="p-4 bg-vc-dark rounded-lg border border-vc-border/50 space-y-3"
                data-testid={`comparison-card-${analysis.id}`}
              >
                {/* Header with Remove Button */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-vc-text truncate">
                      {analysis.businessModel || "Unknown Model"}
                    </p>
                    <p className="text-xs text-vc-text-muted truncate">
                      {analysis.url || "No URL"}
                    </p>
                  </div>
                  {onRemove && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-vc-text-muted hover:text-red-400"
                      onClick={() => onRemove(analysis.id)}
                      data-testid={`button-remove-${analysis.id}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Score Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-vc-text">
                      {score.toFixed(1)}
                    </div>
                    <TrendIcon className={cn("h-5 w-5", trend.color)} />
                  </div>
                  <Badge 
                    className={cn(
                      "text-xs",
                      score >= 7 ? "bg-green-500/20 text-green-400" :
                      score >= 5 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    )}
                  >
                    {score >= 7 ? "Strong" : score >= 5 ? "Moderate" : "Weak"}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-vc-card rounded-full h-2 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      score >= 7 ? "bg-green-400" :
                      score >= 5 ? "bg-yellow-400" :
                      "bg-red-400"
                    )}
                    style={{ width: `${(score / 10) * 100}%` }}
                  />
                </div>

                {/* Additional Info */}
                <div className="space-y-1">
                  <p className="text-xs text-vc-text-muted">
                    Target: {analysis.targetMarket || "Unknown"}
                  </p>
                  <p className="text-xs text-vc-text-muted">
                    Analyzed: {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        {analyses.length > 1 && (
          <div className="p-4 bg-vc-dark rounded-lg border border-vc-border/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-vc-text-muted">Average</p>
                <p className="text-lg font-semibold text-vc-text">
                  {(analyses.reduce((sum, a) => sum + getScoreValue(a, selectedMetricData!.field), 0) / analyses.length).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-vc-text-muted">Highest</p>
                <p className="text-lg font-semibold text-green-400">
                  {Math.max(...analyses.map(a => getScoreValue(a, selectedMetricData!.field))).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-vc-text-muted">Lowest</p>
                <p className="text-lg font-semibold text-red-400">
                  {Math.min(...analyses.map(a => getScoreValue(a, selectedMetricData!.field))).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
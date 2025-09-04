import { useState, useMemo } from "react";
import { Search, Filter, X, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BusinessAnalysis } from "@/types";

interface AnalysisSearchProps {
  analyses: BusinessAnalysis[];
  onFiltered: (filtered: BusinessAnalysis[]) => void;
}

export function AnalysisSearch({ analyses, onFiltered }: AnalysisSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedAnalyses = useMemo(() => {
    let filtered = [...analyses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (analysis) =>
          analysis.url?.toLowerCase().includes(query) ||
          analysis.businessModel?.toLowerCase().includes(query) ||
          analysis.targetMarket?.toLowerCase().includes(query) ||
          analysis.mainOffering?.toLowerCase().includes(query)
      );
    }

    // Score filter
    if (scoreFilter !== "all") {
      switch (scoreFilter) {
        case "high":
          filtered = filtered.filter((a) => (a.overallScore || 0) >= 7);
          break;
        case "medium":
          filtered = filtered.filter(
            (a) => (a.overallScore || 0) >= 5 && (a.overallScore || 0) < 7
          );
          break;
        case "low":
          filtered = filtered.filter((a) => (a.overallScore || 0) < 5);
          break;
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score-high":
          return (b.overallScore || 0) - (a.overallScore || 0);
        case "score-low":
          return (a.overallScore || 0) - (b.overallScore || 0);
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [analyses, searchQuery, scoreFilter, sortBy]);

  // Update parent component whenever filters change
  useMemo(() => {
    onFiltered(filteredAndSortedAnalyses);
  }, [filteredAndSortedAnalyses, onFiltered]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (scoreFilter !== "all") count++;
    if (sortBy !== "date") count++;
    return count;
  }, [searchQuery, scoreFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setScoreFilter("all");
    setSortBy("date");
  };

  return (
    <Card className="bg-vc-card border-vc-border p-4 mb-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-vc-text-muted" />
            <Input
              placeholder="Search by URL, business model, or market..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-vc-dark border-vc-border text-vc-text"
              data-testid="input-search-analyses"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={`border-vc-border ${showFilters ? "bg-vc-primary text-white" : ""}`}
            data-testid="button-toggle-filters"
          >
            <Filter className="h-4 w-4" />
          </Button>
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-vc-accent text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-40 bg-vc-dark border-vc-border text-vc-text">
                <SelectValue placeholder="Score Filter" />
              </SelectTrigger>
              <SelectContent className="bg-vc-card border-vc-border">
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (7+)</SelectItem>
                <SelectItem value="medium">Medium (5-7)</SelectItem>
                <SelectItem value="low">Low (&lt;5)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-vc-dark border-vc-border text-vc-text">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-vc-card border-vc-border">
                <SelectItem value="date">Latest First</SelectItem>
                <SelectItem value="score-high">
                  <div className="flex items-center gap-1">
                    Score <TrendingUp className="h-3 w-3" />
                  </div>
                </SelectItem>
                <SelectItem value="score-low">
                  <div className="flex items-center gap-1">
                    Score <TrendingDown className="h-3 w-3" />
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-vc-text-muted hover:text-vc-text"
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-vc-text-muted">
            Showing {filteredAndSortedAnalyses.length} of {analyses.length} analyses
          </span>
          {searchQuery && (
            <Badge className="bg-vc-border text-vc-text">
              Searching: "{searchQuery}"
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
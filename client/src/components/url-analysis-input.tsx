import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Search, Link, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/lib/ai-service";
import type { BusinessAnalysis, SearchResult } from "@/types";

interface URLAnalysisInputProps {
  onAnalysisComplete: (analysis: BusinessAnalysis) => void;
}

export function URLAnalysisInput({ onAnalysisComplete }: URLAnalysisInputProps) {
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  
  const { toast } = useToast();

  const { data: activeProvider } = useQuery({
    queryKey: ['/api/ai-providers/active'],
    queryFn: () => AIService.getActiveProvider(),
  });

  const analyzeURLMutation = useMutation({
    mutationFn: (url: string) => AIService.analyzeURL(url),
    onSuccess: (analysis) => {
      toast({
        title: "Analysis Complete",
        description: `Business analysis completed with score: ${analysis.overallScore}/10`,
      });
      onAnalysisComplete(analysis);
      setUrl('');
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to analyze URL";
      let title = "Analysis Failed";
      let description = errorMessage;
      
      // Provide specific guidance based on error type
      if (errorMessage.includes('API key')) {
        title = "Invalid API Key";
        description = "Please check your AI provider configuration and ensure your API key is valid.";
      } else if (errorMessage.includes('temporarily unavailable')) {
        title = "Service Temporarily Unavailable";
        description = "The AI service is currently unavailable. Please try again in a few moments.";
      } else if (errorMessage.includes('rate limit')) {
        title = "Rate Limit Exceeded";
        description = "You've made too many requests. Please wait a few moments before trying again.";
      } else if (errorMessage.includes('No active AI provider')) {
        title = "Configuration Required";
        description = "Please configure an AI provider in settings before analyzing URLs.";
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      });
    },
  });

  const searchBusinessesMutation = useMutation({
    mutationFn: (query: string) => AIService.searchBusinesses(query),
    onSuccess: (results) => {
      setSearchResults(results);
      toast({
        title: "Search Complete",
        description: `Found ${results.businesses.length} business opportunities`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to search businesses";
      let title = "Search Failed";
      let description = errorMessage;
      
      // Provide specific guidance based on error type
      if (errorMessage.includes('API key')) {
        title = "Invalid API Key";
        description = "Please check your AI provider configuration and ensure your API key is valid.";
      } else if (errorMessage.includes('temporarily unavailable')) {
        title = "Service Temporarily Unavailable";
        description = "The AI service is currently unavailable. Please try again in a few moments.";
      } else if (errorMessage.includes('rate limit')) {
        title = "Rate Limit Exceeded";
        description = "You've made too many requests. Please wait a few moments before trying again.";
      } else if (errorMessage.includes('No active AI provider')) {
        title = "Configuration Required";
        description = "Please configure an AI provider in settings before searching.";
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!activeProvider) {
      toast({
        title: "Error",
        description: "Please configure an AI provider first",
        variant: "destructive",
      });
      return;
    }

    analyzeURLMutation.mutate(url.trim());
  };

  const handleAISearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    if (!activeProvider) {
      toast({
        title: "Error",
        description: "Please configure an AI provider first",
        variant: "destructive",
      });
      return;
    }

    searchBusinessesMutation.mutate(searchQuery.trim());
  };

  const handleSearchResultAnalyze = (businessUrl: string) => {
    setUrl(businessUrl);
    analyzeURLMutation.mutate(businessUrl);
    setSearchResults(null);
  };

  return (
    <Card className="glass-heavy border-vc-border/50 hover-glow transition-all" data-testid="card-url-analysis">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-vc-text mb-2">Business Discovery & Analysis</h2>
          <p className="text-vc-text-muted">Input a URL to analyze or use AI-powered search to discover cloneable opportunities</p>
        </div>

        <div className="space-y-4">
          {/* URL Input */}
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                type="url"
                placeholder="Enter business URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full glass border-vc-border/50 pr-10 text-vc-text placeholder-vc-text-muted focus:border-vc-primary focus:ring-vc-primary/20 backdrop-blur-sm transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                data-testid="input-url"
              />
              <Link className="absolute right-3 top-3 h-4 w-4 text-vc-text-muted" />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={analyzeURLMutation.isPending || !url.trim()}
              className="gradient-animated hover:scale-105 text-white px-6 font-semibold transition-all shadow-lg hover-glow"
              data-testid="button-analyze"
            >
              <Search className="mr-2 h-4 w-4" />
              {analyzeURLMutation.isPending ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>

          {/* AI Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Or describe what type of business you want to clone (e.g., 'task management apps like Trello')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass border-vc-border/50 pr-12 text-vc-text placeholder-vc-text-muted focus:border-vc-accent focus:ring-vc-accent/20 backdrop-blur-sm transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
              data-testid="input-search"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAISearch}
              disabled={searchBusinessesMutation.isPending || !searchQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-vc-accent hover:text-vc-accent/80 h-8 w-8"
              data-testid="button-ai-search"
            >
              <Bot className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-vc-text mb-4">AI-Discovered Opportunities</h3>
            <div className="space-y-3">
              {searchResults.businesses.map((business, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 glass rounded-lg border border-vc-border/50 hover:border-vc-accent hover-lift transition-all"
                  data-testid={`search-result-${index}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {business.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-vc-text font-medium">{business.name}</p>
                        <p className="text-vc-text-muted text-sm">
                          {business.businessModel} • Est. Score: {business.estimatedScore}/10
                        </p>
                        <p className="text-vc-text-muted text-xs mt-1">
                          {business.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearchResultAnalyze(business.url)}
                    className="text-vc-primary border-vc-primary hover:bg-vc-primary/10"
                    data-testid={`button-analyze-result-${index}`}
                  >
                    Analyze
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

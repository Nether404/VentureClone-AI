import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, FileText, Play, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AIService } from "@/lib/ai-service";

interface BatchAnalysisProps {
  onAnalysisComplete?: (analysisId: string) => void;
}

export function BatchAnalysis({ onAnalysisComplete }: BatchAnalysisProps) {
  const [urls, setUrls] = useState<string>("");
  const [processingUrls, setProcessingUrls] = useState<string[]>([]);
  const [completedUrls, setCompletedUrls] = useState<{ url: string; id: string; success: boolean }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const batchAnalyzeMutation = useMutation({
    mutationFn: async (urls: string[]) => {
      return await apiRequest('/api/business-analyses/batch', {
        method: 'POST',
        body: JSON.stringify({ urls })
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/business-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      
      // Update completed URLs based on results
      const completed = processingUrls.map(url => {
        const analysis = data.analyses?.find((a: any) => a.url === url);
        return {
          url,
          id: analysis?.id || '',
          success: !!analysis
        };
      });
      setCompletedUrls(completed);
      
      toast({
        title: "Batch Analysis Complete",
        description: `Successfully analyzed ${data.successful} of ${data.successful + data.failed} URLs`,
      });
      
      // Select the first successful analysis
      const firstSuccess = data.analyses?.[0];
      if (firstSuccess && onAnalysisComplete) {
        onAnalysisComplete(firstSuccess.id);
      }
    },
    onError: (error) => {
      toast({
        title: "Batch Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze URLs",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const handleBatchAnalysis = async () => {
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')));

    if (urlList.length === 0) {
      toast({
        title: "Invalid URLs",
        description: "Please enter valid URLs starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    if (urlList.length > 10) {
      toast({
        title: "Too Many URLs",
        description: "Please limit batch analysis to 10 URLs at a time",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingUrls(urlList);
    setCompletedUrls([]);

    await batchAnalyzeMutation.mutateAsync(urlList);
    setIsProcessing(false);
  };

  const progress = processingUrls.length > 0 
    ? (completedUrls.length / processingUrls.length) * 100 
    : 0;

  return (
    <Card className="bg-vc-card border-vc-border" data-testid="card-batch-analysis">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-vc-text flex items-center">
          <Upload className="mr-2 h-5 w-5 text-vc-primary" />
          Batch Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-vc-text-muted mb-2 block">
            Enter URLs (one per line, max 10)
          </label>
          <Textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="https://example.com&#10;https://another-site.com&#10;https://third-site.com"
            className="bg-vc-dark border-vc-border text-vc-text placeholder:text-vc-text-muted h-32 font-mono text-sm"
            disabled={isProcessing}
            data-testid="input-batch-urls"
          />
        </div>

        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-vc-text-muted">Processing...</span>
              <span className="text-sm text-vc-accent font-medium">
                {completedUrls.length}/{processingUrls.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {completedUrls.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-vc-text">Results:</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {completedUrls.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-vc-dark rounded border border-vc-border/50"
                  data-testid={`batch-result-${index}`}
                >
                  <span className="text-xs text-vc-text-muted truncate flex-1 mr-2 font-mono">
                    {result.url}
                  </span>
                  {result.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleBatchAnalysis}
          disabled={isProcessing || !urls.trim()}
          className="w-full bg-gradient-to-r from-vc-primary to-vc-secondary hover:opacity-90"
          data-testid="button-start-batch"
        >
          {isProcessing ? (
            <>
              <FileText className="mr-2 h-4 w-4 animate-pulse" />
              Analyzing {completedUrls.length + 1} of {processingUrls.length}...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Batch Analysis
            </>
          )}
        </Button>

        {!isProcessing && urls.trim() && (
          <p className="text-xs text-vc-text-muted text-center">
            {urls.split('\n').filter(u => u.trim()).length} URLs ready for analysis
          </p>
        )}
      </CardContent>
    </Card>
  );
}
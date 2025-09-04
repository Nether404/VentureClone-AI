import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function AnalysisSkeleton() {
  return (
    <Card className="bg-vc-card border-vc-border p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  );
}

export function AnalysisListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <AnalysisSkeleton key={i} />
      ))}
    </div>
  );
}
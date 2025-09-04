import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Flame, Settings, User, BarChart3, Book, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme-toggle";
import { AIProviderModal } from "@/components/ai-provider-modal";
import { URLAnalysisInput } from "@/components/url-analysis-input";
import { EnhancedWorkflow } from "@/components/enhanced-workflow";
import { AIInsightsPanel } from "@/components/ai-insights-panel";
import { ProgressTracker } from "@/components/progress-tracker";
import { RecentAnalyses } from "@/components/recent-analyses";
import { QuickStats } from "@/components/quick-stats";
import { BusinessComparison } from "@/components/business-comparison";
import { AIService } from "@/lib/ai-service";
import { FloatingActionButton } from "@/components/floating-action-button";
import { AnalysisListSkeleton } from "@/components/analysis-skeleton";
import type { BusinessAnalysis } from "@/types";

export default function Dashboard() {
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<BusinessAnalysis | null>(null);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: activeProvider } = useQuery({
    queryKey: ['/api/ai-providers/active'],
    queryFn: () => AIService.getActiveProvider(),
  });

  const { data: analyses } = useQuery<BusinessAnalysis[]>({
    queryKey: ['/api/business-analyses'],
    queryFn: async () => {
      const response = await fetch('/api/business-analyses');
      return response.json();
    },
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for quick actions
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const fabButton = document.querySelector('[data-testid="fab-button"]') as HTMLButtonElement;
        if (fabButton) fabButton.click();
      }
      // Ctrl/Cmd + / for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('[data-testid="input-search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
      // Ctrl/Cmd + A for analytics
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && e.shiftKey) {
        e.preventDefault();
        setLocation('/analytics');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setLocation]);

  // Handle analysis updates in useEffect (TanStack Query v5 pattern)
  useEffect(() => {
    if (selectedAnalysis && analyses) {
      const updatedAnalysis = analyses.find((a) => a.id === selectedAnalysis.id);
      if (updatedAnalysis) {
        setSelectedAnalysis(updatedAnalysis);
      }
    }
  }, [analyses]);

  const handleAnalysisSelect = (analysis: BusinessAnalysis) => {
    setSelectedAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-vc-dark text-vc-text font-inter">
      {/* Header */}
      <header className="glass-heavy border-b border-vc-border/50 sticky top-0 z-50" data-testid="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3" data-testid="brand">
              <div className="w-10 h-10 gradient-animated rounded-lg flex items-center justify-center shadow-lg hover-scale">
                <Flame className="text-vc-text text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-vc-text">VentureClone AI</h1>
                <p className="text-xs text-vc-text-muted">Systematic Business Cloning Platform</p>
              </div>
            </div>

            {/* AI Provider Selection */}
            <div className="flex items-center space-x-4">
              <Link href="/analytics">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 glass border-vc-border/50 hover:border-vc-primary hover-glow transition-all"
                  data-testid="button-analytics"
                >
                  <BarChart3 className="h-4 w-4 text-vc-primary" />
                  <span className="text-sm text-vc-text">Analytics</span>
                </Button>
              </Link>

              <Link href="/docs">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 glass border-vc-border/50 hover:border-vc-primary hover-glow transition-all"
                  data-testid="button-documentation"
                >
                  <Book className="h-4 w-4 text-vc-primary" />
                  <span className="text-sm text-vc-text">Docs</span>
                </Button>
              </Link>

              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 glass border-vc-border/50 hover:border-vc-primary hover-glow transition-all"
                  onClick={() => setShowAIModal(true)}
                  data-testid="button-ai-provider"
                >
                  <span className="text-vc-accent">🤖</span>
                  <span className="text-sm text-vc-text">
                    {activeProvider ? `${activeProvider.provider.toUpperCase()}` : 'No AI Provider'}
                  </span>
                  <span className="text-xs">▼</span>
                </Button>
              </div>

              <ThemeToggle />

              <Button
                variant="outline"
                size="icon"
                className="border-vc-border hover:border-vc-accent transition-colors"
                onClick={() => setShowAIModal(true)}
                data-testid="button-settings"
              >
                <Settings className="h-4 w-4 text-vc-text-muted" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="border-vc-border hover:border-destructive transition-colors"
                onClick={() => window.location.href = '/api/logout'}
                data-testid="button-logout"
                title="Logout"
              >
                <LogOut className="h-4 w-4 text-vc-text-muted" />
              </Button>

              <div className="w-8 h-8 gradient-animated rounded-full flex items-center justify-center hover-scale shadow-lg" title={user?.email || 'User'}>
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-vc-dark" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <URLAnalysisInput onAnalysisComplete={handleAnalysisSelect} />
            </motion.div>
            
            {selectedAnalysis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold text-vc-text mb-6">6-Stage Workflow Pipeline</h2>
                <EnhancedWorkflow analysis={selectedAnalysis} />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RecentAnalyses 
                analyses={analyses || []} 
                onAnalysisSelect={handleAnalysisSelect}
              />
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {selectedAnalysis && (
              <AIInsightsPanel analysis={selectedAnalysis} />
            )}
            
            {selectedAnalysis && (
              <ProgressTracker analysis={selectedAnalysis} />
            )}
            
            <BusinessComparison analyses={analyses || []} />
            
            <QuickStats />
          </div>
        </div>
      </div>

      {/* AI Provider Configuration Modal */}
      <AIProviderModal 
        isOpen={showAIModal} 
        onClose={() => setShowAIModal(false)}
      />
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}

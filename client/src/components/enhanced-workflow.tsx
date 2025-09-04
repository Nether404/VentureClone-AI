import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  Sparkles,
  AlertCircle,
  Download,
  Play,
  RotateCcw,
  Target,
  Zap,
  TrendingUp,
  Rocket,
  Bot,
  ChevronRight,
  FileDown,
  FileJson,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/lib/ai-service";
import { ExportService } from "@/lib/export-utils";
import type { BusinessAnalysis, WorkflowStage } from "@/types";

interface EnhancedWorkflowProps {
  analysis: BusinessAnalysis;
}

const STAGE_CONFIG = [
  {
    number: 1,
    name: 'Discovery & Selection',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    description: 'Initial business analysis and validation'
  },
  {
    number: 2,
    name: 'Lazy-Entrepreneur Filter',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    description: 'Effort vs reward optimization'
  },
  {
    number: 3,
    name: 'MVP Launch Planning',
    icon: Rocket,
    color: 'from-green-500 to-emerald-500',
    description: 'Minimum viable product roadmap'
  },
  {
    number: 4,
    name: 'Demand Testing Strategy',
    icon: TrendingUp,
    color: 'from-orange-500 to-yellow-500',
    description: 'Market validation approach'
  },
  {
    number: 5,
    name: 'Scaling & Growth',
    icon: Sparkles,
    color: 'from-red-500 to-rose-500',
    description: 'Sustainable expansion planning'
  },
  {
    number: 6,
    name: 'AI Automation Mapping',
    icon: Bot,
    color: 'from-indigo-500 to-purple-500',
    description: 'Intelligence integration strategy'
  }
];

export function EnhancedWorkflow({ analysis }: EnhancedWorkflowProps) {
  const [activeStage, setActiveStage] = useState(analysis.currentStage || 1);
  const [expandedStage, setExpandedStage] = useState<number | null>(activeStage);
  const [autoProgress, setAutoProgress] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stages = [] } = useQuery({
    queryKey: ['/api/workflow-stages', analysis.id],
    queryFn: async () => {
      const response = await fetch(`/api/workflow-stages/${analysis.id}`);
      return response.json();
    },
  });

  const generateStageMutation = useMutation({
    mutationFn: (stageNumber: number) => 
      AIService.generateStageContent(analysis.id, stageNumber),
    onSuccess: (stage, stageNumber) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflow-stages', analysis.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/business-analyses'] });
      
      toast({
        title: "Stage Generated",
        description: `${STAGE_CONFIG[stageNumber - 1].name} content generated successfully`,
      });

      // Auto-progress to next stage if enabled
      if (autoProgress && stageNumber < 6) {
        setTimeout(() => {
          setActiveStage(stageNumber + 1);
          generateStageMutation.mutate(stageNumber + 1);
        }, 2000);
      }
    },
    onError: (error: any) => {
      setAutoProgress(false);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate stage content",
        variant: "destructive",
      });
    },
  });

  const getStageStatus = (stageNumber: number) => {
    const stage = stages.find((s: WorkflowStage) => s.stageNumber === stageNumber);
    if (stage?.status === 'completed') return 'completed';
    if (stage?.status === 'in_progress') return 'in_progress';
    if (stageNumber <= (analysis.currentStage || 1)) return 'available';
    return 'locked';
  };

  const getStageData = (stageNumber: number) => {
    return stages.find((s: WorkflowStage) => s.stageNumber === stageNumber);
  };

  const calculateOverallProgress = () => {
    const completedStages = stages.filter((s: WorkflowStage) => s.status === 'completed').length;
    return (completedStages / 6) * 100;
  };

  const handleExportStage = (stage: WorkflowStage, format: 'markdown' | 'json') => {
    ExportService.exportStage(stage, analysis, { format, includeMetadata: true });
    toast({
      title: "Export Successful",
      description: `Stage ${stage.stageNumber} exported as ${format.toUpperCase()}`,
    });
  };

  const handleExportFullWorkflow = (format: 'markdown' | 'json') => {
    const completedStages = stages.filter((s: WorkflowStage) => s.status === 'completed');
    if (completedStages.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please generate at least one stage before exporting",
        variant: "destructive",
      });
      return;
    }
    ExportService.exportFullWorkflow(completedStages, analysis, format);
    toast({
      title: "Export Successful",
      description: `Full workflow exported as ${format.toUpperCase()}`,
    });
  };

  const StageIcon = ({ stage, status }: { stage: typeof STAGE_CONFIG[0], status: string }) => {
    const Icon = stage.icon;
    
    if (status === 'completed') {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center`}>
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      );
    }
    
    if (status === 'in_progress') {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center opacity-70`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </motion.div>
      );
    }
    
    if (status === 'available') {
      return (
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      );
    }
    
    return (
      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
        <Lock className="h-5 w-5 text-gray-500" />
      </div>
    );
  };

  const renderStageContent = (stageNumber: number) => {
    const stageData = getStageData(stageNumber);
    const status = getStageStatus(stageNumber);
    
    if (status === 'locked') {
      return (
        <div className="text-center py-12">
          <Lock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-vc-text-muted">
            Complete previous stages to unlock this content
          </p>
        </div>
      );
    }
    
    if (!stageData?.data) {
      return (
        <div className="text-center py-12">
          <Button
            onClick={() => generateStageMutation.mutate(stageNumber)}
            disabled={generateStageMutation.isPending}
            className="bg-gradient-to-r from-vc-primary to-vc-secondary hover:opacity-90 text-white font-semibold shadow-neon"
            data-testid={`button-generate-stage-${stageNumber}`}
          >
            {generateStageMutation.isPending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <RotateCcw className="h-4 w-4" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate {STAGE_CONFIG[stageNumber - 1].name}
              </>
            )}
          </Button>
        </div>
      );
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {stageData.data.milestones && (
          <Card className="bg-vc-card border-vc-border">
            <CardHeader>
              <CardTitle className="text-vc-text text-lg">Milestones & Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stageData.data.milestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-500" />
                    )}
                    <span className={`text-sm ${milestone.completed ? 'text-vc-text' : 'text-vc-text-muted'}`}>
                      {milestone.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {stageData.data.completionCriteria && (
          <Card className="bg-vc-card border-vc-border">
            <CardHeader>
              <CardTitle className="text-vc-text text-lg">Completion Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-vc-text-muted">
                {stageData.data.completionCriteria.map((criteria: string, index: number) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {stageData.data.nextStepActions && (
          <Card className="bg-vc-card border-vc-border">
            <CardHeader>
              <CardTitle className="text-vc-text text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stageData.data.nextStepActions.map((action: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ChevronRight className="h-4 w-4 text-vc-accent mt-0.5" />
                    <span className="text-sm text-vc-text-muted">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stage-specific content rendering based on stage number */}
        {stageNumber === 1 && renderDiscoveryContent()}
        {stageNumber === 2 && renderFilterContent(stageData.data)}
        {stageNumber === 3 && renderMVPContent(stageData.data)}
        {stageNumber === 4 && renderDemandContent(stageData.data)}
        {stageNumber === 5 && renderGrowthContent(stageData.data)}
        {stageNumber === 6 && renderAIContent(stageData.data)}
      </motion.div>
    );
  };

  const renderDiscoveryContent = () => {
    if (!analysis.scoreDetails) return null;
    
    return (
      <div className="space-y-6">
        <Card className="bg-vc-card border-vc-border">
          <CardHeader>
            <CardTitle className="text-vc-text">Analysis Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-vc-text-muted">Business Model</label>
                <p className="text-vc-text font-medium">{analysis.businessModel}</p>
              </div>
              <div>
                <label className="text-xs text-vc-text-muted">Target Market</label>
                <p className="text-vc-text font-medium">{analysis.targetMarket}</p>
              </div>
              <div>
                <label className="text-xs text-vc-text-muted">Revenue Stream</label>
                <p className="text-vc-text font-medium">{analysis.revenueStream}</p>
              </div>
              <div>
                <label className="text-xs text-vc-text-muted">Overall Score</label>
                <Badge className="bg-vc-primary text-white">{analysis.overallScore}/10</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFilterContent = (data: any) => (
    <Card className="bg-vc-card border-vc-border">
      <CardHeader>
        <CardTitle className="text-vc-text">Lazy Entrepreneur Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <Badge className={`text-lg px-4 py-2 ${
            data.recommendation === 'PROCEED' ? 'bg-green-500' :
            data.recommendation === 'MODIFY' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {data.recommendation}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-vc-text-muted mb-2">Effort Score</p>
            <div className="text-3xl font-bold text-vc-accent">{data.effortScore}/10</div>
          </div>
          <div className="text-center">
            <p className="text-sm text-vc-text-muted mb-2">Reward Score</p>
            <div className="text-3xl font-bold text-vc-primary">{data.rewardScore}/10</div>
          </div>
        </div>
        
        <p className="text-vc-text-muted">{data.reasoning}</p>
      </CardContent>
    </Card>
  );

  const renderMVPContent = (data: any) => (
    <div className="space-y-6">
      <Card className="bg-vc-card border-vc-border">
        <CardHeader>
          <CardTitle className="text-vc-text">Core MVP Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.coreFeatures?.map((feature: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-vc-dark rounded-lg">
                <span className="text-vc-text">{feature.name || feature}</span>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {feature.priority || 'Must Have'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {feature.effort || 'Medium'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {data.techStack && (
        <Card className="bg-vc-card border-vc-border">
          <CardHeader>
            <CardTitle className="text-vc-text">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.techStack).map(([category, techs]: [string, any]) => (
                <div key={category}>
                  <p className="text-xs text-vc-text-muted mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(techs) ? techs : [techs]).map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDemandContent = (data: any) => (
    <Card className="bg-vc-card border-vc-border">
      <CardHeader>
        <CardTitle className="text-vc-text">Demand Testing Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.validationMethods?.map((method: any, index: number) => (
          <div key={index} className="p-3 bg-vc-dark rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-vc-text font-medium">
                {typeof method === 'string' ? method : method.method}
              </span>
              {method.timeline && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {method.timeline}
                </Badge>
              )}
            </div>
            {method.expectedOutcome && (
              <p className="text-sm text-vc-text-muted">{method.expectedOutcome}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderGrowthContent = (data: any) => (
    <div className="space-y-6">
      <Card className="bg-vc-card border-vc-border">
        <CardHeader>
          <CardTitle className="text-vc-text">Growth Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.growthStrategies?.map((strategy: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-vc-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-vc-text">
                    {typeof strategy === 'string' ? strategy : strategy.strategy}
                  </p>
                  {strategy.expectedROI && (
                    <p className="text-xs text-vc-text-muted mt-1">ROI: {strategy.expectedROI}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAIContent = (data: any) => (
    <Card className="bg-vc-card border-vc-border">
      <CardHeader>
        <CardTitle className="text-vc-text">AI Automation Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.customerServiceAI?.map((item: any, index: number) => (
            <div key={index} className="p-3 bg-vc-dark rounded-lg">
              <div className="flex items-start space-x-3">
                <Bot className="h-5 w-5 text-vc-accent mt-0.5" />
                <div className="flex-1">
                  <p className="text-vc-text font-medium">
                    {typeof item === 'string' ? item : item.solution}
                  </p>
                  {item.timeToValue && (
                    <p className="text-xs text-vc-text-muted mt-1">Time to value: {item.timeToValue}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="bg-vc-card border-vc-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-vc-text">Workflow Progress</h3>
              <p className="text-sm text-vc-text-muted">
                {stages.filter((s: WorkflowStage) => s.status === 'completed').length} of 6 stages completed
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-vc-card border-vc-border hover:border-vc-primary"
                    data-testid="button-export-workflow"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export All
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-vc-card border-vc-border">
                  <DropdownMenuLabel className="text-vc-text">Export Format</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-vc-border" />
                  <DropdownMenuItem
                    className="text-vc-text hover:bg-vc-dark cursor-pointer"
                    onClick={() => handleExportFullWorkflow('markdown')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Markdown Report
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-vc-text hover:bg-vc-dark cursor-pointer"
                    onClick={() => handleExportFullWorkflow('json')}
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoProgress(!autoProgress)}
                className={`${autoProgress ? 'bg-vc-primary text-white' : ''}`}
                data-testid="button-auto-progress"
              >
                <Play className="h-4 w-4 mr-1" />
                Auto Progress
              </Button>
            </div>
          </div>
          <Progress value={calculateOverallProgress()} className="h-2 bg-vc-dark" />
        </CardContent>
      </Card>

      {/* Stage Navigation */}
      <div className="flex items-center justify-between overflow-x-auto pb-4">
        {STAGE_CONFIG.map((stage) => {
          const status = getStageStatus(stage.number);
          const isActive = activeStage === stage.number;
          
          return (
            <motion.div
              key={stage.number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <button
                onClick={() => status !== 'locked' && setActiveStage(stage.number)}
                disabled={status === 'locked'}
                className={`relative flex flex-col items-center space-y-2 p-3 rounded-lg transition-all ${
                  isActive ? 'bg-vc-dark' : ''
                } ${status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-vc-dark/50'}`}
                data-testid={`stage-nav-${stage.number}`}
              >
                <StageIcon stage={stage} status={status} />
                <span className={`text-xs font-medium ${
                  isActive ? 'text-vc-text' : 'text-vc-text-muted'
                }`}>
                  Stage {stage.number}
                </span>
                <span className={`text-xs ${
                  isActive ? 'text-vc-text-muted' : 'text-gray-600'
                } max-w-[100px] text-center`}>
                  {stage.name}
                </span>
                
                {/* Connection line to next stage */}
                {stage.number < 6 && (
                  <div className={`absolute left-full top-6 w-8 h-0.5 ${
                    status === 'completed' ? 'bg-green-500' : 'bg-gray-700'
                  }`} />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Stage Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-vc-card border-vc-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                    STAGE_CONFIG[activeStage - 1].color
                  } flex items-center justify-center`}>
                    {(() => {
                      const StageIcon = STAGE_CONFIG[activeStage - 1].icon;
                      return <StageIcon className="h-5 w-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <CardTitle className="text-vc-text">
                      {STAGE_CONFIG[activeStage - 1].name}
                    </CardTitle>
                    <p className="text-sm text-vc-text-muted">
                      {STAGE_CONFIG[activeStage - 1].description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {getStageData(activeStage)?.data && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-export-stage-${activeStage}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-vc-card border-vc-border">
                        <DropdownMenuLabel className="text-vc-text">Export Stage {activeStage}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-vc-border" />
                        <DropdownMenuItem
                          className="text-vc-text hover:bg-vc-dark cursor-pointer"
                          onClick={() => {
                            const stage = getStageData(activeStage);
                            if (stage) handleExportStage(stage, 'markdown');
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-vc-text hover:bg-vc-dark cursor-pointer"
                          onClick={() => {
                            const stage = getStageData(activeStage);
                            if (stage) handleExportStage(stage, 'json');
                          }}
                        >
                          <FileJson className="h-4 w-4 mr-2" />
                          JSON
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {activeStage > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveStage(activeStage - 1)}
                      data-testid="button-prev-stage"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  {activeStage < 6 && getStageStatus(activeStage + 1) !== 'locked' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveStage(activeStage + 1)}
                      data-testid="button-next-stage"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderStageContent(activeStage)}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
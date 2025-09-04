import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Activity, PieChart } from "lucide-react";
import type { BusinessAnalysis } from "@/types";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalysisChartsProps {
  analyses: BusinessAnalysis[];
}

export function AnalysisCharts({ analyses }: AnalysisChartsProps) {
  // Chart options with dark theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8', // text-slate-400
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b', // slate-800
        titleColor: '#f1f5f9', // slate-100
        bodyColor: '#cbd5e1', // slate-300
        borderColor: '#334155', // slate-700
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: '#334155', // slate-700
          borderColor: '#475569' // slate-600
        },
        ticks: {
          color: '#94a3b8' // slate-400
        }
      },
      y: {
        grid: {
          color: '#334155', // slate-700
          borderColor: '#475569' // slate-600
        },
        ticks: {
          color: '#94a3b8' // slate-400
        }
      }
    }
  };

  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        grid: {
          color: '#334155'
        },
        pointLabels: {
          color: '#94a3b8',
          font: {
            size: 10
          }
        },
        ticks: {
          color: '#94a3b8',
          backdropColor: 'transparent'
        }
      }
    }
  };

  // Score trends over time
  const trendData = useMemo(() => {
    const sortedAnalyses = [...analyses].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return {
      labels: sortedAnalyses.map(a => 
        new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        label: 'Overall Score',
        data: sortedAnalyses.map(a => a.overallScore || 0),
        borderColor: 'rgb(147, 51, 234)', // purple-600
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }, [analyses]);

  // Score distribution
  const distributionData = useMemo(() => {
    const scoreRanges = {
      '0-3': 0,
      '3-5': 0,
      '5-7': 0,
      '7-10': 0
    };

    analyses.forEach(a => {
      const score = a.overallScore || 0;
      if (score < 3) scoreRanges['0-3']++;
      else if (score < 5) scoreRanges['3-5']++;
      else if (score < 7) scoreRanges['5-7']++;
      else scoreRanges['7-10']++;
    });

    return {
      labels: Object.keys(scoreRanges),
      datasets: [{
        label: 'Number of Analyses',
        data: Object.values(scoreRanges),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',  // red-500
          'rgba(245, 158, 11, 0.8)', // amber-500
          'rgba(234, 179, 8, 0.8)',  // yellow-500
          'rgba(34, 197, 94, 0.8)'   // green-500
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)'
        ],
        borderWidth: 1
      }]
    };
  }, [analyses]);

  // Average scores by metric (radar chart)
  const metricsData = useMemo(() => {
    if (analyses.length === 0) return null;

    const avgScores = {
      Technical: 0,
      Market: 0,
      Competitive: 0,
      Resources: 0,
      TimeToMarket: 0
    };

    analyses.forEach(a => {
      avgScores.Technical += a.technicalComplexity || 0;
      avgScores.Market += a.marketOpportunity || 0;
      avgScores.Competitive += a.competitiveLandscape || 0;
      avgScores.Resources += a.resourceRequirements || 0;
      avgScores.TimeToMarket += a.timeToMarket || 0;
    });

    const count = analyses.length;
    Object.keys(avgScores).forEach(key => {
      avgScores[key as keyof typeof avgScores] /= count;
    });

    return {
      labels: Object.keys(avgScores),
      datasets: [{
        label: 'Average Score',
        data: Object.values(avgScores),
        borderColor: 'rgb(168, 85, 247)', // purple-500
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(168, 85, 247)'
      }]
    };
  }, [analyses]);

  // Business model distribution
  const modelData = useMemo(() => {
    const models: Record<string, number> = {};
    
    analyses.forEach(a => {
      const model = a.businessModel || 'Unknown';
      models[model] = (models[model] || 0) + 1;
    });

    return {
      labels: Object.keys(models),
      datasets: [{
        data: Object.values(models),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',  // purple-600
          'rgba(236, 72, 153, 0.8)',  // pink-500
          'rgba(59, 130, 246, 0.8)',  // blue-500
          'rgba(34, 197, 94, 0.8)',   // green-500
          'rgba(251, 146, 60, 0.8)',  // orange-400
          'rgba(250, 204, 21, 0.8)'   // yellow-400
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(236, 72, 153)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
          'rgb(250, 204, 21)'
        ],
        borderWidth: 1
      }]
    };
  }, [analyses]);

  if (analyses.length === 0) {
    return (
      <Card className="bg-vc-card border-vc-border">
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-vc-text-muted mb-4" />
          <p className="text-vc-text-muted">No data available for visualization</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Trends */}
      <Card className="bg-vc-card border-vc-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-vc-text flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-vc-accent" />
            Score Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Line data={trendData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card className="bg-vc-card border-vc-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-vc-text flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-vc-accent" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={distributionData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Metrics Radar */}
        {metricsData && (
          <Card className="bg-vc-card border-vc-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-vc-text flex items-center gap-2">
                <Activity className="h-5 w-5 text-vc-accent" />
                Average Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Radar data={metricsData} options={radarOptions} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Business Model Distribution */}
      <Card className="bg-vc-card border-vc-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-vc-text flex items-center gap-2">
            <PieChart className="h-5 w-5 text-vc-accent" />
            Business Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex justify-center">
            <div className="w-full max-w-sm">
              <Doughnut 
                data={modelData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: 'bottom' as const
                    }
                  }
                }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
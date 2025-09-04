import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import type { BusinessAnalysis } from "@/types";

interface EnhancedAnalyticsProps {
  analyses: BusinessAnalysis[];
}

export function EnhancedAnalytics({ analyses }: EnhancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("all");
  const [selectedMetric, setSelectedMetric] = useState("overallScore");

  // Prepare time series data
  const timeSeriesData = analyses
    .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
    .map((analysis) => ({
      date: new Date(analysis.createdAt || 0).toLocaleDateString(),
      overallScore: analysis.overallScore || 0,
      technicalComplexity: (analysis.scoreDetails as any)?.technicalComplexity?.score || 0,
      marketOpportunity: (analysis.scoreDetails as any)?.marketOpportunity?.score || 0,
      competitiveLandscape: (analysis.scoreDetails as any)?.competitiveLandscape?.score || 0,
      resourceRequirements: (analysis.scoreDetails as any)?.resourceRequirements?.score || 0,
      timeToMarket: (analysis.scoreDetails as any)?.timeToMarket?.score || 0,
      businessModel: analysis.businessModel || "Unknown",
    }));

  // Prepare category distribution data
  const categoryData = [
    {
      name: "Technical Complexity",
      avg: analyses.reduce((acc, a) => acc + ((a.scoreDetails as any)?.technicalComplexity?.score || 0), 0) / analyses.length,
      color: "hsl(16, 100%, 50%)",
    },
    {
      name: "Market Opportunity",
      avg: analyses.reduce((acc, a) => acc + ((a.scoreDetails as any)?.marketOpportunity?.score || 0), 0) / analyses.length,
      color: "hsl(348, 83%, 47%)",
    },
    {
      name: "Competitive Landscape",
      avg: analyses.reduce((acc, a) => acc + ((a.scoreDetails as any)?.competitiveLandscape?.score || 0), 0) / analyses.length,
      color: "hsl(51, 100%, 50%)",
    },
    {
      name: "Resource Requirements",
      avg: analyses.reduce((acc, a) => acc + ((a.scoreDetails as any)?.resourceRequirements?.score || 0), 0) / analyses.length,
      color: "hsl(120, 60%, 50%)",
    },
    {
      name: "Time to Market",
      avg: analyses.reduce((acc, a) => acc + ((a.scoreDetails as any)?.timeToMarket?.score || 0), 0) / analyses.length,
      color: "hsl(280, 60%, 50%)",
    },
  ];

  // Prepare radar chart data for top 5 analyses
  const topAnalyses = [...analyses]
    .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
    .slice(0, 5);

  const radarData = [
    "Technical",
    "Market",
    "Competition",
    "Resources",
    "Time to Market",
  ].map((category) => ({
    category,
    ...topAnalyses.reduce((acc, analysis, index) => {
      const scoreKeyMap: Record<string, string> = {
        Technical: "technicalComplexity",
        Market: "marketOpportunity",
        Competition: "competitiveLandscape",
        Resources: "resourceRequirements",
        "Time to Market": "timeToMarket",
      };
      const scoreKey = scoreKeyMap[category];
      
      if (scoreKey) {
        acc[`business${index + 1}`] = (analysis.scoreDetails as any)?.[scoreKey]?.score || 0;
      }
      return acc;
    }, {} as any),
  }));

  // Calculate trends
  const calculateTrend = (metric: string) => {
    if (timeSeriesData.length < 2) return 0;
    const recent = timeSeriesData.slice(-5);
    const older = timeSeriesData.slice(-10, -5);
    const recentAvg = recent.reduce((acc, d) => acc + (d as any)[metric], 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((acc, d) => acc + (d as any)[metric], 0) / older.length : recentAvg;
    return ((recentAvg - olderAvg) / olderAvg) * 100;
  };

  const overallTrend = calculateTrend("overallScore");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-vc-card border-vc-border hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-vc-text-muted">Average Score</p>
                <p className="text-2xl font-bold text-vc-accent">
                  {(analyses.reduce((acc, a) => acc + (a.overallScore || 0), 0) / analyses.length).toFixed(1)}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${overallTrend > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {overallTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
            <p className="text-xs text-vc-text-muted mt-2">
              {overallTrend > 0 ? '+' : ''}{overallTrend.toFixed(1)}% trend
            </p>
          </CardContent>
        </Card>

        <Card className="bg-vc-card border-vc-border hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-vc-text-muted">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {Math.round((analyses.filter(a => (a.overallScore || 0) >= 7).length / analyses.length) * 100)}%
                </p>
              </div>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-xs text-vc-text-muted mt-2">
              Score 7+ candidates
            </p>
          </CardContent>
        </Card>

        <Card className="bg-vc-card border-vc-border hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-vc-text-muted">Analyzed</p>
                <p className="text-2xl font-bold text-vc-primary">
                  {analyses.length}
                </p>
              </div>
              <Activity className="h-5 w-5 text-vc-primary" />
            </div>
            <p className="text-xs text-vc-text-muted mt-2">
              Total businesses
            </p>
          </CardContent>
        </Card>

        <Card className="bg-vc-card border-vc-border hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-vc-text-muted">Best Category</p>
                <p className="text-lg font-bold text-vc-secondary">
                  {categoryData.sort((a, b) => b.avg - a.avg)[0]?.name.split(' ')[0]}
                </p>
              </div>
              <div className="text-2xl font-bold text-vc-secondary">
                {categoryData.sort((a, b) => b.avg - a.avg)[0]?.avg.toFixed(1)}
              </div>
            </div>
            <p className="text-xs text-vc-text-muted mt-2">
              Highest avg score
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-vc-card border-vc-border">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48 bg-vc-card border-vc-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overallScore">Overall Score</SelectItem>
              <SelectItem value="technicalComplexity">Technical Complexity</SelectItem>
              <SelectItem value="marketOpportunity">Market Opportunity</SelectItem>
              <SelectItem value="competitiveLandscape">Competitive Landscape</SelectItem>
              <SelectItem value="resourceRequirements">Resource Requirements</SelectItem>
              <SelectItem value="timeToMarket">Time to Market</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="trends">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-vc-card border-vc-border">
              <CardHeader>
                <CardTitle className="text-vc-text">Score Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(16, 100%, 50%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(16, 100%, 50%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--vc-border)" opacity={0.3} />
                    <XAxis dataKey="date" stroke="var(--vc-text-muted)" />
                    <YAxis stroke="var(--vc-text-muted)" domain={[0, 10]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="hsl(16, 100%, 50%)"
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="distribution">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-vc-card border-vc-border">
              <CardHeader>
                <CardTitle className="text-vc-text">Category Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--vc-border)" opacity={0.3} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="var(--vc-text-muted)" />
                    <YAxis stroke="var(--vc-text-muted)" domain={[0, 10]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="comparison">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-vc-card border-vc-border">
              <CardHeader>
                <CardTitle className="text-vc-text">Top 5 Businesses Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--vc-border)" />
                    <PolarAngleAxis dataKey="category" stroke="var(--vc-text-muted)" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="var(--vc-text-muted)" />
                    {topAnalyses.map((_, index) => (
                      <Radar
                        key={`business${index + 1}`}
                        name={`Business ${index + 1}`}
                        dataKey={`business${index + 1}`}
                        stroke={["hsl(16, 100%, 50%)", "hsl(348, 83%, 47%)", "hsl(51, 100%, 50%)", "hsl(120, 60%, 50%)", "hsl(280, 60%, 50%)"][index]}
                        fill={["hsl(16, 100%, 50%)", "hsl(348, 83%, 47%)", "hsl(51, 100%, 50%)", "hsl(120, 60%, 50%)", "hsl(280, 60%, 50%)"][index]}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="performance">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-vc-card border-vc-border">
              <CardHeader>
                <CardTitle className="text-vc-text">Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Excellent (9-10)", value: analyses.filter(a => (a.overallScore || 0) >= 9).length, color: "hsl(120, 60%, 50%)" },
                        { name: "Good (7-8)", value: analyses.filter(a => (a.overallScore || 0) >= 7 && (a.overallScore || 0) < 9).length, color: "hsl(51, 100%, 50%)" },
                        { name: "Average (5-6)", value: analyses.filter(a => (a.overallScore || 0) >= 5 && (a.overallScore || 0) < 7).length, color: "hsl(16, 100%, 50%)" },
                        { name: "Poor (<5)", value: analyses.filter(a => (a.overallScore || 0) < 5).length, color: "hsl(0, 85%, 60%)" },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {[
                        { color: "hsl(120, 60%, 50%)" },
                        { color: "hsl(51, 100%, 50%)" },
                        { color: "hsl(16, 100%, 50%)" },
                        { color: "hsl(0, 85%, 60%)" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
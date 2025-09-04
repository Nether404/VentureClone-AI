import { useState } from "react";
import { Link } from "wouter";
import { 
  Book, 
  Rocket, 
  Shield, 
  Zap, 
  Target, 
  Brain,
  Settings,
  HelpCircle,
  ChevronRight,
  Search,
  Home,
  ArrowLeft,
  Sparkles,
  Globe,
  BarChart,
  Workflow,
  Key,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Code,
  DollarSign,
  Clock,
  Users,
  Layers
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  const sections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4 gradient-text-animated">Welcome to VentureClone AI</h2>
            <p className="text-muted-foreground mb-6">
              Your intelligent companion for identifying and analyzing cloneable business opportunities. 
              This guide will help you get up and running in minutes.
            </p>
          </div>

          <Card className="p-6 glass-card-light">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Quick Start Checklist
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <strong>Configure AI Provider:</strong> Set up at least one AI provider (OpenAI, Gemini, or Grok)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <strong>Enter API Keys:</strong> Add your API keys in the AI Provider settings
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <strong>First Analysis:</strong> Enter a website URL to analyze your first business
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <strong>Review Results:</strong> Explore the comprehensive analysis and scoring
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-6 glass-card-gradient border-primary/20">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              First Steps
            </h3>
            <ol className="space-y-4">
              <li>
                <strong className="text-lg">1. Set Up Your AI Provider</strong>
                <p className="text-muted-foreground mt-1">
                  Click the settings icon in the header to configure your preferred AI provider. 
                  We support OpenAI (GPT-4), Google Gemini, and X.AI's Grok.
                </p>
              </li>
              <li>
                <strong className="text-lg">2. Analyze Your First Business</strong>
                <p className="text-muted-foreground mt-1">
                  Enter any website URL in the analysis input field. The AI will crawl the site 
                  and provide a comprehensive clonability analysis.
                </p>
              </li>
              <li>
                <strong className="text-lg">3. Understand the Scores</strong>
                <p className="text-muted-foreground mt-1">
                  Each business is scored across 5 dimensions. Scores above 7.0 indicate 
                  strong cloning potential in that area.
                </p>
              </li>
            </ol>
          </Card>
        </div>
      )
    },
    {
      id: "core-features",
      title: "Core Features",
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4 gradient-text-animated">Core Features</h2>
            <p className="text-muted-foreground mb-6">
              Discover the powerful features that make VentureClone AI your competitive advantage.
            </p>
          </div>

          <div className="grid gap-4">
            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">URL-Based Analysis</h3>
                  <p className="text-muted-foreground mb-3">
                    Simply paste any business website URL and our AI will analyze its entire business model, 
                    technology stack, market positioning, and revenue potential.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">Auto-crawling</Badge>
                    <Badge variant="outline">Deep analysis</Badge>
                    <Badge variant="outline">Real-time</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-muted-foreground mb-3">
                    Leverage multiple AI providers for diverse perspectives. Each provider brings unique 
                    strengths to analyze technical complexity, market opportunities, and competitive landscape.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">OpenAI GPT-4</Badge>
                    <Badge variant="outline">Google Gemini</Badge>
                    <Badge variant="outline">X.AI Grok</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BarChart className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">5-Dimensional Scoring</h3>
                  <p className="text-muted-foreground mb-3">
                    Every business is evaluated across five critical dimensions, providing you with a 
                    comprehensive understanding of cloning feasibility and potential.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Technical Complexity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Market Opportunity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Competitive Landscape</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Resource Requirements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Time to Market</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Workflow className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">6-Stage Workflow Pipeline</h3>
                  <p className="text-muted-foreground mb-3">
                    Follow our proven methodology from discovery to launch. Each stage provides specific 
                    guidance, tasks, and AI-generated content to accelerate your cloning process.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">Discovery</Badge>
                    <Badge variant="secondary">Research</Badge>
                    <Badge variant="secondary">Development</Badge>
                    <Badge variant="secondary">Testing</Badge>
                    <Badge variant="secondary">Launch</Badge>
                    <Badge variant="secondary">AI Automation</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "analysis-guide",
      title: "Analysis Guide",
      icon: Target,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4 gradient-text-animated">Business Analysis Guide</h2>
            <p className="text-muted-foreground mb-6">
              Learn how to interpret analysis results and make data-driven decisions about which businesses to clone.
            </p>
          </div>

          <Card className="p-6 glass-card-light">
            <h3 className="text-xl font-semibold mb-4">Understanding Scores</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">9-10</Badge>
                <div>
                  <strong>Excellent</strong>
                  <p className="text-muted-foreground text-sm">Highly favorable for cloning with minimal barriers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">7-8.9</Badge>
                <div>
                  <strong>Good</strong>
                  <p className="text-muted-foreground text-sm">Strong potential with some manageable challenges</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">5-6.9</Badge>
                <div>
                  <strong>Moderate</strong>
                  <p className="text-muted-foreground text-sm">Feasible but requires careful planning and resources</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Below 5</Badge>
                <div>
                  <strong>Challenging</strong>
                  <p className="text-muted-foreground text-sm">Significant barriers that may not be worth overcoming</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card-gradient">
            <h3 className="text-xl font-semibold mb-4">Scoring Dimensions Explained</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4" />
                  Technical Complexity (Lower is Better)
                </h4>
                <p className="text-muted-foreground text-sm mb-2">
                  Evaluates the technical difficulty of replicating the business model and technology stack.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• Simple tech stack vs. proprietary technology</li>
                  <li>• Standard features vs. complex algorithms</li>
                  <li>• Open-source solutions availability</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Market Opportunity (Higher is Better)
                </h4>
                <p className="text-muted-foreground text-sm mb-2">
                  Assesses the market size, growth potential, and revenue opportunities.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• Total addressable market (TAM)</li>
                  <li>• Growth rate and trends</li>
                  <li>• Revenue model viability</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" />
                  Competitive Landscape (Higher is Better)
                </h4>
                <p className="text-muted-foreground text-sm mb-2">
                  Analyzes market saturation and differentiation opportunities.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• Number of existing competitors</li>
                  <li>• Market concentration</li>
                  <li>• Differentiation potential</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4" />
                  Resource Requirements (Lower is Better)
                </h4>
                <p className="text-muted-foreground text-sm mb-2">
                  Estimates the capital, team, and infrastructure needed.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• Initial capital requirements</li>
                  <li>• Team size and expertise needed</li>
                  <li>• Infrastructure and operational costs</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  Time to Market (Lower is Better)
                </h4>
                <p className="text-muted-foreground text-sm mb-2">
                  Projects the timeline from start to revenue generation.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• Development timeline</li>
                  <li>• MVP feasibility</li>
                  <li>• Time to first revenue</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: "workflow-stages",
      title: "Workflow Stages",
      icon: Workflow,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4 gradient-text-animated">6-Stage Workflow Pipeline</h2>
            <p className="text-muted-foreground mb-6">
              Follow our systematic approach to transform ideas into successful ventures.
            </p>
          </div>

          <div className="space-y-4">
            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-500">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Discovery & Ideation</h3>
                  <p className="text-muted-foreground mb-3">
                    Identify and validate business opportunities. Use AI to discover hidden gems and evaluate 
                    their cloning potential.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <strong className="text-sm">Key Activities:</strong>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Market trend analysis</li>
                      <li>• Competitor identification</li>
                      <li>• Opportunity validation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-500">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Research & Planning</h3>
                  <p className="text-muted-foreground mb-3">
                    Deep dive into the business model, technology requirements, and market dynamics. 
                    Create a comprehensive clone strategy.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <strong className="text-sm">Key Activities:</strong>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Technical architecture design</li>
                      <li>• Feature prioritization</li>
                      <li>• Resource planning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-500">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Development & Build</h3>
                  <p className="text-muted-foreground mb-3">
                    Execute the development plan with AI assistance. Build your MVP efficiently using 
                    proven patterns and best practices.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <strong className="text-sm">Key Activities:</strong>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• MVP development</li>
                      <li>• Core feature implementation</li>
                      <li>• Integration setup</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-orange-500">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Testing & Validation</h3>
                  <p className="text-muted-foreground mb-3">
                    Validate your clone with real users. Gather feedback, iterate quickly, and ensure 
                    product-market fit.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <strong className="text-sm">Key Activities:</strong>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• User testing</li>
                      <li>• Performance optimization</li>
                      <li>• Feedback integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-light">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-pink-500">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Launch & Scale</h3>
                  <p className="text-muted-foreground mb-3">
                    Go to market with confidence. Launch your clone, acquire users, and scale operations 
                    based on market response.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <strong className="text-sm">Key Activities:</strong>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Marketing campaign launch</li>
                      <li>• User acquisition</li>
                      <li>• Growth optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-gradient border-primary/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">AI Automation & Optimization</h3>
                  <p className="text-muted-foreground mb-3">
                    Leverage AI to automate operations, optimize performance, and discover new growth 
                    opportunities continuously.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <strong className="text-sm">Key Activities:</strong>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Process automation</li>
                      <li>• AI-driven optimization</li>
                      <li>• Continuous improvement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "ai-configuration",
      title: "AI Configuration",
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4 gradient-text-animated">AI Provider Configuration</h2>
            <p className="text-muted-foreground mb-6">
              Set up and manage your AI providers for optimal analysis performance.
            </p>
          </div>

          <Card className="p-6 glass-card-light">
            <h3 className="text-xl font-semibold mb-4">Supported AI Providers</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">OpenAI (GPT-4)</h4>
                  <Badge variant="outline">Recommended</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Industry-leading language model with excellent business analysis capabilities.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Best for:</strong> Comprehensive analysis, technical insights
                  </div>
                  <div className="text-sm">
                    <strong>API Key:</strong> Get from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="text-primary hover:underline">platform.openai.com</a>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Google Gemini</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Google's advanced AI with strong reasoning and multimodal capabilities.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Best for:</strong> Market analysis, competitive insights
                  </div>
                  <div className="text-sm">
                    <strong>API Key:</strong> Get from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener" className="text-primary hover:underline">Google AI Studio</a>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">X.AI Grok</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  X's AI model with real-time information access and unique perspectives.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Best for:</strong> Trend analysis, social insights
                  </div>
                  <div className="text-sm">
                    <strong>API Key:</strong> Get from <a href="https://x.ai" target="_blank" rel="noopener" className="text-primary hover:underline">x.ai</a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card-gradient">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Key Setup Guide
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">1</span>
                <div>
                  <strong>Click the Settings icon</strong> in the header navigation
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">2</span>
                <div>
                  <strong>Select your AI provider</strong> from the dropdown menu
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">3</span>
                <div>
                  <strong>Enter your API key</strong> in the secure input field
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">4</span>
                <div>
                  <strong>Set as active provider</strong> using the toggle switch
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">5</span>
                <div>
                  <strong>Save configuration</strong> to start using the AI provider
                </div>
              </li>
            </ol>
          </Card>

          <Card className="p-6 border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Security Note</h4>
                <p className="text-sm text-muted-foreground">
                  API keys are encrypted and stored securely. Never share your API keys publicly. 
                  Each provider has different rate limits and pricing - check their documentation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard Shortcuts",
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4 gradient-text-animated">Keyboard Shortcuts</h2>
            <p className="text-muted-foreground mb-6">
              Master these shortcuts to navigate VentureClone AI like a pro.
            </p>
          </div>

          <Card className="p-6 glass-card-light">
            <h3 className="text-xl font-semibold mb-4">Global Shortcuts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <span className="text-sm">Open Quick Actions</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">Ctrl + K</kbd>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <span className="text-sm">Focus Search</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">Ctrl + /</kbd>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <span className="text-sm">Go to Analytics</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">Ctrl + Shift + A</kbd>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <span className="text-sm">New Analysis</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">Ctrl + N</kbd>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <span className="text-sm">Settings</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">Ctrl + ,</kbd>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card-gradient">
            <h3 className="text-xl font-semibold mb-4">Navigation Shortcuts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <span className="text-sm">Dashboard</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">G then D</kbd>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <span className="text-sm">Analytics</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">G then A</kbd>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <span className="text-sm">Documentation</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">G then H</kbd>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: "tips-tricks",
      title: "Tips & Best Practices",
      icon: Lightbulb,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4 gradient-text-animated">Tips & Best Practices</h2>
            <p className="text-muted-foreground mb-6">
              Expert advice to maximize your success with VentureClone AI.
            </p>
          </div>

          <Card className="p-6 glass-card-light">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Choosing Businesses to Clone
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <div>
                  <strong>Look for Simple Business Models:</strong> Start with businesses that have 
                  straightforward revenue models and clear value propositions.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <div>
                  <strong>Target Growing Markets:</strong> Focus on industries with rising demand 
                  and emerging trends.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <div>
                  <strong>Identify Differentiation Opportunities:</strong> Look for businesses where 
                  you can add unique value or serve an underserved segment.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <div>
                  <strong>Consider Local Market Gaps:</strong> Global successes often have local 
                  market opportunities.
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-6 glass-card-gradient">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Maximizing AI Analysis
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-1 text-blue-500" />
                <div>
                  <strong>Use Multiple Providers:</strong> Different AI providers excel at different 
                  aspects - use multiple for comprehensive insights.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-1 text-blue-500" />
                <div>
                  <strong>Analyze Competitors:</strong> Run analyses on multiple competitors to 
                  understand the full landscape.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-1 text-blue-500" />
                <div>
                  <strong>Regular Re-analysis:</strong> Markets change - re-analyze businesses 
                  periodically for updated insights.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-1 text-blue-500" />
                <div>
                  <strong>Deep Dive on High Scores:</strong> When you find high-scoring opportunities, 
                  use the workflow stages for detailed planning.
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border-red-500/20 bg-red-500/5">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Common Pitfalls to Avoid
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-red-500">✕</span>
                <div>
                  <strong>Ignoring Legal Considerations:</strong> Always research intellectual 
                  property, patents, and regulatory requirements.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✕</span>
                <div>
                  <strong>Underestimating Resources:</strong> Be realistic about time, money, 
                  and team requirements.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✕</span>
                <div>
                  <strong>Copying Without Innovation:</strong> Direct clones rarely succeed - 
                  always add your unique value.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✕</span>
                <div>
                  <strong>Rushing to Launch:</strong> Follow the workflow stages systematically 
                  for best results.
                </div>
              </li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      id: "faq",
      title: "FAQ",
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4 gradient-text-animated">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-6">
              Quick answers to common questions about VentureClone AI.
            </p>
          </div>

          <div className="space-y-4">
            <Card className="p-6 glass-card-light">
              <h4 className="font-semibold mb-2">How accurate are the AI analyses?</h4>
              <p className="text-muted-foreground text-sm">
                Our AI analyses are highly accurate for general business assessment, typically achieving 
                85-90% accuracy when compared to manual expert analysis. However, they should be used as 
                a starting point and supplemented with your own research and domain expertise.
              </p>
            </Card>

            <Card className="p-6 glass-card-light">
              <h4 className="font-semibold mb-2">Can I analyze any website?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, you can analyze any publicly accessible website. The AI will crawl and analyze the 
                visible content, structure, and business model. Note that some sites with heavy JavaScript 
                or authentication requirements may have limited analysis depth.
              </p>
            </Card>

            <Card className="p-6 glass-card-light">
              <h4 className="font-semibold mb-2">How many analyses can I run?</h4>
              <p className="text-muted-foreground text-sm">
                The number of analyses depends on your API key limits with your chosen AI provider. 
                Each analysis typically uses 1-2 API calls. Check your provider's pricing and rate 
                limits for specific details.
              </p>
            </Card>

            <Card className="p-6 glass-card-light">
              <h4 className="font-semibold mb-2">Which AI provider should I use?</h4>
              <p className="text-muted-foreground text-sm">
                We recommend starting with OpenAI GPT-4 for the most comprehensive analysis. You can 
                add multiple providers to get different perspectives. Each provider has unique strengths: 
                OpenAI for depth, Gemini for market insights, and Grok for real-time trends.
              </p>
            </Card>

            <Card className="p-6 glass-card-light">
              <h4 className="font-semibold mb-2">How long does an analysis take?</h4>
              <p className="text-muted-foreground text-sm">
                Most analyses complete within 30-60 seconds. Complex websites or detailed workflow 
                content generation may take up to 2-3 minutes. The speed also depends on your AI 
                provider's response time.
              </p>
            </Card>

            <Card className="p-6 glass-card-light">
              <h4 className="font-semibold mb-2">Can I export my analysis results?</h4>
              <p className="text-muted-foreground text-sm">
                Currently, all analyses are saved in your dashboard for future reference. You can 
                copy individual sections or take screenshots. Export functionality is planned for 
                a future update.
              </p>
            </Card>

            <Card className="p-6 glass-card-light">
              <h4 className="font-semibold mb-2">Is my data secure?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, all data is encrypted in transit and at rest. API keys are securely stored and 
                never exposed. Analysis data is private to your account and not shared with third 
                parties beyond the AI provider calls.
              </p>
            </Card>

            <Card className="p-6 glass-card-light">
              <h4 className="font-semibold mb-2">What makes a good clone candidate?</h4>
              <p className="text-muted-foreground text-sm">
                Good candidates typically score 7+ on market opportunity, have technical complexity 
                below 6, reasonable resource requirements, and clear differentiation opportunities. 
                Look for businesses with proven demand but room for improvement or localization.
              </p>
            </Card>
          </div>

          <Card className="p-6 glass-card-gradient border-primary/20 mt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Still have questions?</h4>
                <p className="text-sm text-muted-foreground">
                  Check our documentation regularly for updates, or use the quick actions menu (Ctrl+K) 
                  to explore features hands-on. Remember, the best way to learn is by analyzing your 
                  first business!
                </p>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof section.content === 'string' && section.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass-morphism border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold">Documentation</h1>
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="w-3 h-3" />
              v1.0.0
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card className="glass-card-light sticky top-24">
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search docs..."
                    className="pl-9 glass-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-docs-search"
                  />
                </div>
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <nav className="space-y-1">
                    {filteredSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            activeSection === section.id
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                          }`}
                          data-testid={`nav-${section.id}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{section.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </ScrollArea>
              </div>
            </Card>
          </aside>

          {/* Content */}
          <main className="flex-1 max-w-4xl">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentSection.content}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
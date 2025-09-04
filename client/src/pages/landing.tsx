import { motion } from "framer-motion";
import { Flame, TrendingUp, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Analysis",
      description: "Analyze any website to assess clonability potential with advanced AI",
    },
    {
      icon: Zap,
      title: "6-Stage Workflow",
      description: "Systematic process from discovery to AI automation",
    },
    {
      icon: Shield,
      title: "Multi-Provider Support",
      description: "Connect OpenAI, Gemini, or Grok with your own API keys",
    },
    {
      icon: Sparkles,
      title: "Comprehensive Scoring",
      description: "5-dimensional scoring across technical, market, and resource factors",
    },
  ];

  return (
    <div className="min-h-screen bg-vc-dark text-vc-text">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vc-primary/10 via-transparent to-vc-secondary/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 gradient-animated rounded-2xl flex items-center justify-center shadow-2xl hover-scale">
                <Flame className="text-vc-text text-4xl" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-vc-primary to-vc-secondary">
              VentureClone AI
            </h1>
            
            <p className="text-xl text-vc-text-muted mb-8 max-w-3xl mx-auto">
              The systematic business cloning platform that analyzes existing online businesses 
              for clonability potential using AI-powered insights
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => window.location.href = "/api/login"}
                size="lg"
                className="gradient-animated text-vc-dark font-semibold px-8 py-6 text-lg hover-scale"
                data-testid="button-login"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass border-vc-border/50 hover:border-vc-primary/50 transition-all hover-glow"
              >
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-vc-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-vc-text-muted">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-vc-text-muted">
              Transform your business ideas into reality with AI-driven insights and systematic execution
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
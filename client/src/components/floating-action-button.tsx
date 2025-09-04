import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Bot, 
  Download, 
  BarChart3,
  Settings,
  Sparkles,
  X,
  Zap,
  Link,
  Book
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  action: () => void;
}

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const quickActions: QuickAction[] = [
    {
      id: 'analyze',
      icon: <Search className="h-5 w-5" />,
      label: 'Quick Analyze',
      description: 'Analyze a URL instantly',
      color: 'from-blue-500 to-cyan-500',
      action: () => {
        const url = window.prompt('Enter URL to analyze:');
        if (url) {
          toast({
            title: "Analysis Started",
            description: `Analyzing ${url}...`,
          });
        }
        setIsOpen(false);
      }
    },
    {
      id: 'ai-search',
      icon: <Bot className="h-5 w-5" />,
      label: 'AI Discovery',
      description: 'Find business opportunities',
      color: 'from-purple-500 to-pink-500',
      action: () => {
        const element = document.querySelector('[data-testid="input-search"]');
        if (element) {
          (element as HTMLInputElement).focus();
          setIsOpen(false);
        }
      }
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'View Analytics',
      description: 'Check your insights',
      color: 'from-green-500 to-emerald-500',
      action: () => {
        setLocation('/analytics');
        setIsOpen(false);
      }
    },
    {
      id: 'docs',
      icon: <Book className="h-5 w-5" />,
      label: 'Documentation',
      description: 'View guides and help',
      color: 'from-teal-500 to-cyan-500',
      action: () => {
        setLocation('/docs');
        setIsOpen(false);
      }
    },
    {
      id: 'generate',
      icon: <Sparkles className="h-5 w-5" />,
      label: 'Generate Report',
      description: 'Create analysis report',
      color: 'from-orange-500 to-yellow-500',
      action: () => {
        toast({
          title: "Report Generation",
          description: "Generating comprehensive report...",
        });
        setIsOpen(false);
      }
    },
    {
      id: 'quick-clone',
      icon: <Zap className="h-5 w-5" />,
      label: 'Quick Clone',
      description: 'Start cloning process',
      color: 'from-red-500 to-rose-500',
      action: () => {
        toast({
          title: "Quick Clone",
          description: "Starting quick clone wizard...",
        });
        setIsOpen(false);
      }
    },
    {
      id: 'connect',
      icon: <Link className="h-5 w-5" />,
      label: 'Integrations',
      description: 'Connect services',
      color: 'from-indigo-500 to-purple-500',
      action: () => {
        toast({
          title: "Integrations",
          description: "Opening integrations panel...",
        });
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Quick Actions Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-20 right-0 w-80 glass-heavy rounded-xl p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-vc-text">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={action.action}
                    className="group relative p-4 glass rounded-lg border border-vc-border/50 hover:border-vc-primary hover-lift transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="text-sm font-medium text-vc-text">
                      {action.label}
                    </div>
                    <div className="text-xs text-vc-text-muted mt-1">
                      {action.description}
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-4 p-3 glass-light rounded-lg">
                <div className="flex items-center space-x-2 text-xs text-vc-text-muted">
                  <Settings className="h-3 w-3" />
                  <span>Press <kbd className="px-1 py-0.5 bg-vc-dark rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-vc-dark rounded text-xs">K</kbd> for quick access</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-2xl
          flex items-center justify-center
          transition-all duration-300
          ${isOpen 
            ? 'bg-vc-dark rotate-45' 
            : 'gradient-animated hover:shadow-neon'
          }
        `}
      >
        <Plus className={`h-6 w-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </motion.button>
      
      {/* Pulse Animation when closed */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full gradient-animated opacity-30 animate-ping pointer-events-none" />
      )}
    </div>
  );
}
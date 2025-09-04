import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import { Analytics } from "@/pages/analytics";
import Documentation from "@/pages/documentation";
import { AIAssistant } from "@/components/ai-assistant";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/docs" component={Documentation} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <motion.div 
            className="min-h-screen bg-vc-dark transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Toaster />
            <Router />
            <AIAssistant />
          </motion.div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAiProviderSchema, insertBusinessAnalysisSchema } from "@shared/schema";
import { AIProviderService } from "./services/ai-providers";
import { BusinessAnalyzerService } from "./services/business-analyzer";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // AI Provider routes
  app.get("/api/ai-providers", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const providers = await storage.getAiProviders(userId);
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI providers" });
    }
  });

  app.get("/api/ai-providers/active", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const provider = await storage.getActiveAiProvider(userId);
      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active AI provider" });
    }
  });

  app.post("/api/ai-providers", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAiProviderSchema.parse({ ...req.body, userId });
      const provider = await storage.createAiProvider(validatedData);
      res.json(provider);
    } catch (error) {
      res.status(400).json({ message: "Invalid AI provider data" });
    }
  });

  app.put("/api/ai-providers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const provider = await storage.updateAiProvider(id, updates);
      if (!provider) {
        return res.status(404).json({ message: "AI provider not found" });
      }
      res.json(provider);
    } catch (error) {
      res.status(400).json({ message: "Failed to update AI provider" });
    }
  });

  app.delete("/api/ai-providers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteAiProvider(id);
      if (!success) {
        return res.status(404).json({ message: "AI provider not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete AI provider" });
    }
  });

  app.post("/api/ai-providers/test", isAuthenticated, async (req: any, res) => {
    try {
      const { provider, apiKey } = req.body;
      const aiService = new AIProviderService(apiKey, provider);
      const isConnected = await aiService.testConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(400).json({ connected: false, message: "Connection test failed" });
    }
  });

  // Business Analysis routes
  app.get("/api/business-analyses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;
      
      // Get all analyses for the user (in real app, this would be optimized at DB level)
      let analyses = await storage.getBusinessAnalyses(userId);
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        analyses = analyses.filter(a => 
          a.url?.toLowerCase().includes(searchLower) ||
          a.businessModel?.toLowerCase().includes(searchLower) ||
          a.targetMarket?.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      analyses.sort((a, b) => {
        let aVal = a[sortBy as keyof BusinessAnalysis];
        let bVal = b[sortBy as keyof BusinessAnalysis];
        
        if (sortBy === 'createdAt') {
          aVal = new Date(aVal as string).getTime();
          bVal = new Date(bVal as string).getTime();
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      // Apply pagination
      const paginatedAnalyses = analyses.slice(offset, offset + limitNum);
      
      res.json({
        data: paginatedAnalyses,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: analyses.length,
          totalPages: Math.ceil(analyses.length / limitNum)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business analyses" });
    }
  });

  app.get("/api/business-analyses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getBusinessAnalysis(id);
      if (!analysis) {
        return res.status(404).json({ message: "Business analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business analysis" });
    }
  });

  app.post("/api/business-analyses/analyze", isAuthenticated, async (req: any, res) => {
    try {
      const { url } = req.body;
      const userId = req.user.claims.sub;

      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Get active AI provider
      const activeProvider = await storage.getActiveAiProvider(userId);
      if (!activeProvider) {
        return res.status(400).json({ message: "No active AI provider configured" });
      }

      // Initialize AI service
      const aiService = new AIProviderService(activeProvider.apiKey, activeProvider.provider as any);
      const analyzer = new BusinessAnalyzerService(aiService);

      // Perform analysis
      const analysisResult = await analyzer.analyzeURL(url);

      // Save analysis
      const analysisData = insertBusinessAnalysisSchema.parse({
        userId,
        url: analysisResult.url,
        businessModel: analysisResult.businessModel,
        revenueStream: analysisResult.revenueStream,
        targetMarket: analysisResult.targetMarket,
        overallScore: analysisResult.overallScore,
        scoreDetails: analysisResult.scoreDetails,
        aiInsights: analysisResult.aiInsights,
        currentStage: 1,
        stageData: {}
      });

      const savedAnalysis = await storage.createBusinessAnalysis(analysisData);
      res.json(savedAnalysis);
    } catch (error) {
      console.error("Analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze business URL";
      
      // Provide more specific error messages
      if (errorMessage.includes('API key')) {
        res.status(400).json({ message: "Invalid API key. Please check your AI provider configuration." });
      } else if (errorMessage.includes('temporarily unavailable')) {
        res.status(503).json({ message: "AI service temporarily unavailable. Please try again in a moment." });
      } else if (errorMessage.includes('rate limit')) {
        res.status(429).json({ message: "Rate limit reached. Please wait a few moments before trying again." });
      } else {
        res.status(500).json({ message: errorMessage });
      }
    }
  });

  // Batch analysis endpoint
  app.post("/api/business-analyses/batch", isAuthenticated, async (req: any, res) => {
    try {
      const { urls } = req.body;
      const userId = req.user.claims.sub;

      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ message: "URLs array is required" });
      }

      if (urls.length > 10) {
        return res.status(400).json({ message: "Maximum 10 URLs allowed per batch" });
      }

      // Get active AI provider
      const activeProvider = await storage.getActiveAiProvider(userId);
      if (!activeProvider) {
        return res.status(400).json({ message: "No active AI provider configured" });
      }

      // Initialize AI service
      const aiService = new AIProviderService(activeProvider.apiKey, activeProvider.provider as any);
      const analyzer = new BusinessAnalyzerService(aiService);

      const results = {
        successful: 0,
        failed: 0,
        analyses: [] as any[]
      };

      // Process each URL
      for (const url of urls) {
        try {
          // Perform analysis
          const analysisResult = await analyzer.analyzeURL(url);

          // Save analysis
          const analysisData = insertBusinessAnalysisSchema.parse({
            userId,
            url: analysisResult.url,
            businessModel: analysisResult.businessModel,
            revenueStream: analysisResult.revenueStream,
            targetMarket: analysisResult.targetMarket,
            overallScore: analysisResult.overallScore,
            scoreDetails: analysisResult.scoreDetails,
            aiInsights: analysisResult.aiInsights,
            currentStage: 1,
            stageData: {}
          });

          const savedAnalysis = await storage.createBusinessAnalysis(analysisData);
          results.analyses.push(savedAnalysis);
          results.successful++;
        } catch (error) {
          console.error(`Failed to analyze ${url}:`, error);
          results.failed++;
        }
      }

      res.json(results);
    } catch (error) {
      console.error("Batch analysis error:", error);
      res.status(500).json({ message: "Failed to perform batch analysis" });
    }
  });

  app.post("/api/business-analyses/search", isAuthenticated, async (req: any, res) => {
    try {
      const { query } = req.body;
      const userId = req.user.claims.sub;

      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // Get active AI provider
      const activeProvider = await storage.getActiveAiProvider(userId);
      if (!activeProvider) {
        return res.status(400).json({ message: "No active AI provider configured" });
      }

      // Initialize AI service
      const aiService = new AIProviderService(activeProvider.apiKey, activeProvider.provider as any);
      const analyzer = new BusinessAnalyzerService(aiService);

      // Perform search
      const searchResults = await analyzer.searchBusinesses(query);
      res.json(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to search businesses";
      
      // Provide more specific error messages
      if (errorMessage.includes('API key')) {
        res.status(400).json({ message: "Invalid API key. Please check your AI provider configuration." });
      } else if (errorMessage.includes('temporarily unavailable')) {
        res.status(503).json({ message: "AI service temporarily unavailable. Please try again in a moment." });
      } else if (errorMessage.includes('rate limit')) {
        res.status(429).json({ message: "Rate limit reached. Please wait a few moments before trying again." });
      } else {
        res.status(500).json({ message: errorMessage });
      }
    }
  });

  app.put("/api/business-analyses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const analysis = await storage.updateBusinessAnalysis(id, updates);
      if (!analysis) {
        return res.status(404).json({ message: "Business analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(400).json({ message: "Failed to update business analysis" });
    }
  });

  // Workflow Stage routes
  app.get("/api/workflow-stages/:analysisId", isAuthenticated, async (req: any, res) => {
    try {
      const { analysisId } = req.params;
      const stages = await storage.getWorkflowStages(analysisId);
      res.json(stages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workflow stages" });
    }
  });

  app.post("/api/workflow-stages/:analysisId/generate/:stageNumber", isAuthenticated, async (req: any, res) => {
    try {
      const { analysisId, stageNumber } = req.params;
      const userId = req.user.claims.sub;
      const stage = parseInt(stageNumber);

      // Get analysis data
      const analysis = await storage.getBusinessAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Business analysis not found" });
      }

      // Get active AI provider
      const activeProvider = await storage.getActiveAiProvider(userId);
      if (!activeProvider) {
        return res.status(400).json({ message: "No active AI provider configured" });
      }

      // Initialize AI service
      const aiService = new AIProviderService(activeProvider.apiKey, activeProvider.provider as any);
      
      // Import the enhanced workflow service
      const { WorkflowStageService } = await import('./services/workflow-stages');
      const workflowService = new WorkflowStageService(aiService);

      // Get all stages data for context
      const stages = await storage.getWorkflowStages(analysisId);
      const previousStage = stages.find(s => s.stageNumber === stage - 1);

      // Generate stage content with enhanced prompts
      const stageContent = await workflowService.generateStageContent(
        stage,
        {
          analysisData: analysis,
          previousStageData: previousStage?.data,
          allStagesData: stages
        }
      );

      // Save or update stage
      let workflowStage = stages.find(s => s.stageNumber === stage);
      if (workflowStage) {
        workflowStage = await storage.updateWorkflowStage(workflowStage.id, {
          data: stageContent,
          status: 'completed'
        });
      } else {
        const stageNames = [
          '', 'Discovery & Selection', 'Lazy-Entrepreneur Filter', 'MVP Launch Planning',
          'Demand Testing Strategy', 'Scaling & Growth', 'AI Automation Mapping'
        ];
        
        workflowStage = await storage.createWorkflowStage({
          analysisId,
          stageNumber: stage,
          stageName: stageNames[stage] || `Stage ${stage}`,
          status: 'completed',
          data: stageContent,
          aiGeneratedContent: stageContent
        });
      }

      // Update analysis current stage
      await storage.updateBusinessAnalysis(analysisId, { currentStage: stage });

      res.json(workflowStage);
    } catch (error) {
      console.error("Stage generation error:", error);
      res.status(500).json({ message: "Failed to generate stage content" });
    }
  });

  // Stats route
  app.get("/api/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analyses = await storage.getBusinessAnalyses(userId);
      
      const stats = {
        totalAnalyses: analyses.length,
        strongCandidates: analyses.filter(a => (a.overallScore || 0) >= 7).length,
        inProgress: analyses.filter(a => (a.currentStage || 1) > 1 && (a.currentStage || 1) < 6).length,
        aiQueries: analyses.length * 15 // Rough estimate
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

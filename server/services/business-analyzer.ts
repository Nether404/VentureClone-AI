import { AIProviderService } from './ai-providers';

export interface BusinessAnalysisResult {
  url: string;
  businessModel: string;
  revenueStream: string;
  targetMarket: string;
  overallScore: number;
  scoreDetails: {
    technicalComplexity: { score: number; reasoning: string };
    marketOpportunity: { score: number; reasoning: string };
    competitiveLandscape: { score: number; reasoning: string };
    resourceRequirements: { score: number; reasoning: string };
    timeToMarket: { score: number; reasoning: string };
  };
  aiInsights: {
    keyInsight: string;
    riskFactor: string;
    opportunity: string;
  };
}

export interface SearchResult {
  businesses: Array<{
    name: string;
    url: string;
    description: string;
    businessModel: string;
    estimatedScore: number;
  }>;
}

export class BusinessAnalyzerService {
  constructor(private aiService: AIProviderService) {}

  async analyzeURL(url: string): Promise<BusinessAnalysisResult> {
    const analysisPrompt = `
      Analyze the business at ${url} for cloneability. 
      
      IMPORTANT: Be CONCISE - keep each reasoning to 2-3 sentences maximum.
      
      Provide:
      1. Business model (1 sentence)
      2. Primary revenue stream (1 sentence)
      3. Target market (1 sentence)
      4. Scores (1-10) with brief reasoning:
         - Technical complexity
         - Market opportunity
         - Competitive landscape
         - Resource requirements
         - Time to market
      5. One key insight (1 sentence)
      6. One risk factor (1 sentence)
      7. One opportunity (1 sentence)
    `;

    const systemPrompt = `
      You are a venture analyst. Be extremely concise. Each reasoning should be 2-3 sentences maximum. Focus on actionable insights.
    `;

    const schema = {
      type: "object",
      properties: {
        businessModel: { type: "string" },
        revenueStream: { type: "string" },
        targetMarket: { type: "string" },
        scoreDetails: {
          type: "object",
          properties: {
            technicalComplexity: {
              type: "object",
              properties: {
                score: { type: "number" },
                reasoning: { type: "string" }
              }
            },
            marketOpportunity: {
              type: "object",
              properties: {
                score: { type: "number" },
                reasoning: { type: "string" }
              }
            },
            competitiveLandscape: {
              type: "object",
              properties: {
                score: { type: "number" },
                reasoning: { type: "string" }
              }
            },
            resourceRequirements: {
              type: "object",
              properties: {
                score: { type: "number" },
                reasoning: { type: "string" }
              }
            },
            timeToMarket: {
              type: "object",
              properties: {
                score: { type: "number" },
                reasoning: { type: "string" }
              }
            }
          }
        },
        aiInsights: {
          type: "object",
          properties: {
            keyInsight: { type: "string" },
            riskFactor: { type: "string" },
            opportunity: { type: "string" }
          }
        }
      }
    };

    let result;
    try {
      result = await this.aiService.generateStructuredContent(analysisPrompt, schema, systemPrompt);
    } catch (error) {
      console.error('Failed to generate business analysis:', error);
      // Provide a fallback response if AI fails
      throw new Error('AI analysis temporarily unavailable. Please check your AI provider configuration and try again.');
    }

    // Validate result
    if (!result || !result.scoreDetails) {
      throw new Error('AI failed to generate valid analysis. Please try again.');
    }

    // Ensure all required score details exist with fallbacks
    const requiredScores = ['technicalComplexity', 'marketOpportunity', 'competitiveLandscape', 'resourceRequirements', 'timeToMarket'];
    for (const scoreType of requiredScores) {
      if (!result.scoreDetails[scoreType]) {
        // Provide default values if missing
        result.scoreDetails[scoreType] = {
          score: 5,
          reasoning: 'Unable to assess - using default score'
        };
      } else if (typeof result.scoreDetails[scoreType].score !== 'number') {
        // Try to parse as number or use default
        const parsed = parseFloat(result.scoreDetails[scoreType].score);
        result.scoreDetails[scoreType].score = isNaN(parsed) ? 5 : parsed;
      }
    }
    
    // Ensure AI insights exist
    if (!result.aiInsights) {
      result.aiInsights = {
        keyInsight: 'Analysis pending',
        riskFactor: 'To be determined',
        opportunity: 'Further investigation needed'
      };
    }

    // Calculate overall score
    const weights = {
      technicalComplexity: 0.20,
      marketOpportunity: 0.25,
      competitiveLandscape: 0.15,
      resourceRequirements: 0.20,
      timeToMarket: 0.20
    };

    const overallScore = parseFloat(
      (result.scoreDetails.technicalComplexity.score * weights.technicalComplexity +
       result.scoreDetails.marketOpportunity.score * weights.marketOpportunity +
       result.scoreDetails.competitiveLandscape.score * weights.competitiveLandscape +
       result.scoreDetails.resourceRequirements.score * weights.resourceRequirements +
       result.scoreDetails.timeToMarket.score * weights.timeToMarket).toFixed(1)
    );

    return {
      url,
      businessModel: result.businessModel,
      revenueStream: result.revenueStream,
      targetMarket: result.targetMarket,
      overallScore,
      scoreDetails: result.scoreDetails,
      aiInsights: result.aiInsights
    };
  }

  async searchBusinesses(query: string): Promise<SearchResult> {
    const searchPrompt = `
      Based on the query "${query}", suggest 5 real web businesses/applications that match this criteria and would be good candidates for cloning. For each business, provide:
      1. Business name
      2. URL (if publicly known)
      3. Brief description
      4. Business model
      5. Estimated cloneability score (1-10)
      
      Focus on businesses that are:
      - Technically feasible to clone
      - Have proven market demand
      - Not overly complex for a startup to replicate
      - Have clear monetization strategies
    `;

    const systemPrompt = `
      You are a business research specialist helping entrepreneurs find cloneable opportunities. Suggest real, existing businesses that match the criteria and would be good learning examples.
    `;

    const schema = {
      type: "object",
      properties: {
        businesses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              url: { type: "string" },
              description: { type: "string" },
              businessModel: { type: "string" },
              estimatedScore: { type: "number" }
            }
          }
        }
      }
    };

    return await this.aiService.generateStructuredContent(searchPrompt, schema, systemPrompt);
  }

  async generateStageContent(stageNumber: number, analysisData: any, previousStageData?: any): Promise<any> {
    const stagePrompts = {
      1: "Discovery & Selection analysis already completed",
      2: this.getLazyEntrepreneurFilterPrompt(analysisData),
      3: this.getMVPPlanningPrompt(analysisData, previousStageData),
      4: this.getDemandTestingPrompt(analysisData, previousStageData),
      5: this.getScalingGrowthPrompt(analysisData, previousStageData),
      6: this.getAIAutomationPrompt(analysisData, previousStageData)
    };

    const prompt = stagePrompts[stageNumber as keyof typeof stagePrompts];
    if (!prompt || stageNumber === 1) return null;

    const systemPrompt = `You are an expert startup advisor providing detailed, actionable guidance for each stage of the business cloning process.`;

    return await this.aiService.generateStructuredContent(prompt, this.getStageSchema(stageNumber), systemPrompt);
  }

  private getLazyEntrepreneurFilterPrompt(analysisData: any): string {
    return `
      Based on the business analysis for ${analysisData.url} (score: ${analysisData.overallScore}/10), apply the "Lazy Entrepreneur Filter" to determine if this is worth pursuing with minimal effort. Consider:
      
      1. Effort vs Reward ratio
      2. Complexity barriers
      3. Market validation requirements
      4. Competitive advantages needed
      5. Resource intensity
      
      Provide a recommendation: PROCEED, MODIFY, or SKIP with detailed reasoning.
    `;
  }

  private getMVPPlanningPrompt(analysisData: any, previousStageData: any): string {
    return `
      Create a detailed MVP launch plan for cloning ${analysisData.url}. Include:
      
      1. Core features for MVP (prioritized list)
      2. Technical stack recommendations
      3. Development timeline (weeks/months)
      4. Team requirements
      5. Budget estimates
      6. Key validation metrics
      7. Launch strategy
      
      Focus on the minimum viable version that proves the concept.
    `;
  }

  private getDemandTestingPrompt(analysisData: any, previousStageData: any): string {
    return `
      Design a demand testing strategy for the ${analysisData.businessModel} clone. Include:
      
      1. Pre-launch validation methods
      2. Landing page strategy
      3. Customer acquisition tests
      4. Pricing validation approaches
      5. Market feedback collection
      6. Success metrics and KPIs
      7. Pivot indicators
      
      Focus on lean startup methodology and data-driven decisions.
    `;
  }

  private getScalingGrowthPrompt(analysisData: any, previousStageData: any): string {
    return `
      Develop a scaling and growth strategy for the validated ${analysisData.businessModel} clone. Include:
      
      1. Growth marketing strategies
      2. Customer acquisition channels
      3. Revenue optimization
      4. Product expansion roadmap
      5. Team scaling plan
      6. Technology infrastructure
      7. Competitive positioning
      
      Focus on sustainable, profitable growth.
    `;
  }

  private getAIAutomationPrompt(analysisData: any, previousStageData: any): string {
    return `
      Identify AI automation opportunities for the ${analysisData.businessModel} business. Include:
      
      1. Customer service automation
      2. Marketing automation
      3. Operations optimization
      4. Product feature automation
      5. Data analysis automation
      6. Implementation priorities
      7. ROI projections
      
      Focus on practical, implementable AI solutions.
    `;
  }

  private getStageSchema(stageNumber: number): any {
    const schemas = {
      2: {
        type: "object",
        properties: {
          recommendation: { type: "string", enum: ["PROCEED", "MODIFY", "SKIP"] },
          effortScore: { type: "number" },
          rewardScore: { type: "number" },
          reasoning: { type: "string" },
          modifications: { type: "array", items: { type: "string" } },
          riskMitigation: { type: "array", items: { type: "string" } }
        }
      },
      3: {
        type: "object",
        properties: {
          coreFeatures: { type: "array", items: { type: "string" } },
          techStack: { type: "array", items: { type: "string" } },
          timeline: { type: "string" },
          teamRequirements: { type: "array", items: { type: "string" } },
          budgetEstimate: { type: "string" },
          validationMetrics: { type: "array", items: { type: "string" } },
          launchStrategy: { type: "string" }
        }
      },
      4: {
        type: "object",
        properties: {
          validationMethods: { type: "array", items: { type: "string" } },
          landingPageStrategy: { type: "string" },
          acquisitionTests: { type: "array", items: { type: "string" } },
          pricingValidation: { type: "string" },
          feedbackCollection: { type: "array", items: { type: "string" } },
          successMetrics: { type: "array", items: { type: "string" } },
          pivotIndicators: { type: "array", items: { type: "string" } }
        }
      },
      5: {
        type: "object",
        properties: {
          growthStrategies: { type: "array", items: { type: "string" } },
          acquisitionChannels: { type: "array", items: { type: "string" } },
          revenueOptimization: { type: "array", items: { type: "string" } },
          productRoadmap: { type: "array", items: { type: "string" } },
          teamScaling: { type: "string" },
          infrastructure: { type: "array", items: { type: "string" } },
          positioning: { type: "string" }
        }
      },
      6: {
        type: "object",
        properties: {
          customerServiceAI: { type: "array", items: { type: "string" } },
          marketingAutomation: { type: "array", items: { type: "string" } },
          operationsAI: { type: "array", items: { type: "string" } },
          productFeatureAI: { type: "array", items: { type: "string" } },
          dataAnalysisAI: { type: "array", items: { type: "string" } },
          implementationPriorities: { type: "array", items: { type: "string" } },
          roiProjections: { type: "string" }
        }
      }
    };

    return schemas[stageNumber as keyof typeof schemas] || {};
  }
}

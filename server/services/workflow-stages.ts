import { AIProviderService } from './ai-providers';

export interface StagePromptContext {
  analysisData: any;
  previousStageData?: any;
  allStagesData?: any[];
}

export class WorkflowStageService {
  constructor(private aiService: AIProviderService) {}

  async generateStageContent(
    stageNumber: number,
    context: StagePromptContext
  ): Promise<any> {
    if (stageNumber === 1) {
      return null; // Discovery already completed during initial analysis
    }

    const prompt = this.getEnhancedStagePrompt(stageNumber, context);
    const schema = this.getEnhancedStageSchema(stageNumber);
    const systemPrompt = this.getStageSystemPrompt(stageNumber);

    const result = await this.aiService.generateStructuredContent(
      prompt,
      schema,
      systemPrompt
    );

    // Add metadata and milestones
    return {
      ...result,
      milestones: this.generateMilestones(stageNumber, result),
      completionCriteria: this.getCompletionCriteria(stageNumber),
      nextStepActions: this.getNextStepActions(stageNumber)
    };
  }

  private getEnhancedStagePrompt(
    stageNumber: number,
    context: StagePromptContext
  ): string {
    const { analysisData, previousStageData } = context;

    const prompts: { [key: number]: string } = {
      2: `
        Apply the "Lazy Entrepreneur Filter" to ${analysisData.url} (${analysisData.businessModel}).
        
        Current Score: ${analysisData.overallScore}/10
        Business Model: ${analysisData.businessModel}
        Revenue Stream: ${analysisData.revenueStream}
        Target Market: ${analysisData.targetMarket}
        
        Evaluate based on:
        1. EFFORT ANALYSIS
           - Technical complexity (current score: ${analysisData.scoreDetails?.technicalComplexity?.score}/10)
           - Resource requirements (current score: ${analysisData.scoreDetails?.resourceRequirements?.score}/10)
           - Time to market (current score: ${analysisData.scoreDetails?.timeToMarket?.score}/10)
        
        2. REWARD POTENTIAL
           - Market opportunity (current score: ${analysisData.scoreDetails?.marketOpportunity?.score}/10)
           - Revenue potential based on ${analysisData.revenueStream}
           - Competitive advantage possibilities
        
        3. LAZY OPTIMIZATION
           - Identify shortcuts and simplifications
           - Find existing tools/APIs to leverage
           - Suggest MVV (Minimum Viable Version) approach
           - List what NOT to build
        
        Provide actionable recommendation with clear go/no-go decision.
      `,
      
      3: `
        Create a detailed MVP Launch Plan for cloning ${analysisData.businessModel} business.
        
        Previous Filter Result: ${previousStageData?.recommendation || 'PROCEED'}
        Suggested Modifications: ${JSON.stringify(previousStageData?.modifications || [])}
        
        Design the MVP with:
        
        1. CORE FEATURE SET (Limit to 5-7 essential features)
           - Focus on ${analysisData.revenueStream} monetization
           - Target ${analysisData.targetMarket} specifically
           - Consider competitive landscape score: ${analysisData.scoreDetails?.competitiveLandscape?.score}/10
        
        2. TECHNICAL ARCHITECTURE
           - Modern, scalable tech stack
           - Cloud-first approach
           - API-driven design
           - Security best practices
        
        3. DEVELOPMENT ROADMAP
           - Sprint-based timeline (2-week sprints)
           - Milestone deliverables
           - Testing strategy
           - Launch checklist
        
        4. RESOURCE PLANNING
           - Team composition (roles and skills)
           - Budget breakdown by category
           - Tool and service costs
           - Risk buffer allocation
        
        Focus on speed to market while maintaining quality.
      `,
      
      4: `
        Design a comprehensive Demand Testing Strategy for the MVP.
        
        MVP Features: ${JSON.stringify(previousStageData?.coreFeatures || [])}
        Timeline: ${previousStageData?.timeline || '3-6 months'}
        Budget: ${previousStageData?.budgetEstimate || 'TBD'}
        
        Create testing framework including:
        
        1. PRE-LAUNCH VALIDATION
           - Landing page A/B tests
           - Value proposition testing
           - Pricing sensitivity analysis
           - Feature prioritization surveys
        
        2. SOFT LAUNCH STRATEGY
           - Beta user acquisition (target 100-500 users)
           - Cohort analysis setup
           - Feedback loops implementation
           - Iteration protocol
        
        3. METRICS FRAMEWORK
           - North star metric definition
           - Leading indicators
           - Lagging indicators
           - Dashboard requirements
        
        4. PIVOT TRIGGERS
           - Red flags to watch
           - Decision criteria
           - Alternative directions
           - Sunset conditions
        
        Focus on data-driven validation with clear success/failure criteria.
      `,
      
      5: `
        Develop a Scaling & Growth Strategy for validated business.
        
        Validation Results: ${JSON.stringify(previousStageData?.successMetrics || [])}
        Current Target Market: ${analysisData.targetMarket}
        
        Design growth plan including:
        
        1. GROWTH CHANNELS (Prioritized by CAC/LTV)
           - Organic growth tactics
           - Paid acquisition channels
           - Partnership opportunities
           - Content marketing strategy
           - Community building
        
        2. PRODUCT EXPANSION
           - Feature roadmap (6-12 months)
           - Platform extensions
           - Market segment expansion
           - Geographic expansion
        
        3. OPERATIONAL SCALING
           - Team growth plan
           - System architecture evolution
           - Process automation priorities
           - Quality maintenance strategies
        
        4. FINANCIAL PROJECTIONS
           - Revenue growth targets
           - Unit economics optimization
           - Funding requirements
           - Profitability timeline
        
        Focus on sustainable, capital-efficient growth.
      `,
      
      6: `
        Map AI Automation Opportunities for ${analysisData.businessModel}.
        
        Current Scale: Based on growth strategies ${JSON.stringify(previousStageData?.growthStrategies || [])}
        
        Identify AI integration points:
        
        1. CUSTOMER EXPERIENCE AI
           - Chatbot/support automation
           - Personalization engine
           - Recommendation systems
           - Predictive user behavior
        
        2. OPERATIONAL AI
           - Process automation
           - Quality assurance
           - Fraud detection
           - Resource optimization
        
        3. MARKETING & SALES AI
           - Lead scoring
           - Content generation
           - Campaign optimization
           - Churn prediction
        
        4. PRODUCT AI FEATURES
           - Core feature enhancements
           - AI-native features
           - Data insights products
           - API offerings
        
        5. IMPLEMENTATION ROADMAP
           - Priority matrix (impact vs effort)
           - Build vs buy decisions
           - Integration timeline
           - ROI projections
        
        Focus on practical, high-ROI implementations.
      `
    };

    return prompts[stageNumber] || '';
  }

  private getEnhancedStageSchema(stageNumber: number): any {
    const schemas: { [key: number]: any } = {
      2: {
        type: "object",
        properties: {
          recommendation: {
            type: "string",
            enum: ["PROCEED", "MODIFY", "SKIP"]
          },
          effortScore: {
            type: "number",
            minimum: 1,
            maximum: 10
          },
          rewardScore: {
            type: "number",
            minimum: 1,
            maximum: 10
          },
          effortBreakdown: {
            type: "object",
            properties: {
              technical: { type: "number" },
              marketing: { type: "number" },
              operational: { type: "number" },
              financial: { type: "number" }
            }
          },
          reasoning: {
            type: "string"
          },
          modifications: {
            type: "array",
            items: { type: "string" }
          },
          shortcuts: {
            type: "array",
            items: { type: "string" }
          },
          toolsToLeverage: {
            type: "array",
            items: { type: "string" }
          },
          riskMitigation: {
            type: "array",
            items: { type: "string" }
          }
        }
      },
      
      3: {
        type: "object",
        properties: {
          coreFeatures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                priority: { type: "string", enum: ["Must Have", "Should Have", "Nice to Have"] },
                effort: { type: "string", enum: ["Low", "Medium", "High"] },
                value: { type: "string", enum: ["Low", "Medium", "High"] }
              }
            }
          },
          techStack: {
            type: "object",
            properties: {
              frontend: { type: "array", items: { type: "string" } },
              backend: { type: "array", items: { type: "string" } },
              database: { type: "array", items: { type: "string" } },
              infrastructure: { type: "array", items: { type: "string" } },
              thirdPartyServices: { type: "array", items: { type: "string" } }
            }
          },
          timeline: {
            type: "object",
            properties: {
              total: { type: "string" },
              phases: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    duration: { type: "string" },
                    deliverables: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          },
          teamRequirements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: { type: "string" },
                level: { type: "string" },
                commitment: { type: "string" },
                cost: { type: "string" }
              }
            }
          },
          budgetBreakdown: {
            type: "object",
            properties: {
              development: { type: "string" },
              infrastructure: { type: "string" },
              marketing: { type: "string" },
              operations: { type: "string" },
              buffer: { type: "string" },
              total: { type: "string" }
            }
          },
          validationMetrics: {
            type: "array",
            items: { type: "string" }
          },
          launchStrategy: {
            type: "string"
          }
        }
      },
      
      4: {
        type: "object",
        properties: {
          validationMethods: {
            type: "array",
            items: {
              type: "object",
              properties: {
                method: { type: "string" },
                timeline: { type: "string" },
                cost: { type: "string" },
                expectedOutcome: { type: "string" }
              }
            }
          },
          landingPageStrategy: {
            type: "object",
            properties: {
              variants: { type: "array", items: { type: "string" } },
              copyTesting: { type: "array", items: { type: "string" } },
              conversionTargets: { type: "string" }
            }
          },
          betaProgram: {
            type: "object",
            properties: {
              targetUsers: { type: "number" },
              acquisitionChannels: { type: "array", items: { type: "string" } },
              incentives: { type: "array", items: { type: "string" } },
              feedbackMethods: { type: "array", items: { type: "string" } }
            }
          },
          pricingTests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                model: { type: "string" },
                pricePoints: { type: "array", items: { type: "string" } },
                testMethod: { type: "string" }
              }
            }
          },
          successMetrics: {
            type: "object",
            properties: {
              northStar: { type: "string" },
              leading: { type: "array", items: { type: "string" } },
              lagging: { type: "array", items: { type: "string" } },
              targets: { type: "object" }
            }
          },
          pivotIndicators: {
            type: "array",
            items: {
              type: "object",
              properties: {
                indicator: { type: "string" },
                threshold: { type: "string" },
                action: { type: "string" }
              }
            }
          }
        }
      },
      
      5: {
        type: "object",
        properties: {
          growthStrategies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                strategy: { type: "string" },
                timeline: { type: "string" },
                investment: { type: "string" },
                expectedROI: { type: "string" }
              }
            }
          },
          acquisitionChannels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                channel: { type: "string" },
                CAC: { type: "string" },
                scalability: { type: "string", enum: ["Low", "Medium", "High"] },
                priority: { type: "number" }
              }
            }
          },
          retentionStrategies: {
            type: "array",
            items: { type: "string" }
          },
          productRoadmap: {
            type: "array",
            items: {
              type: "object",
              properties: {
                quarter: { type: "string" },
                features: { type: "array", items: { type: "string" } },
                objectives: { type: "array", items: { type: "string" } }
              }
            }
          },
          teamScaling: {
            type: "object",
            properties: {
              currentSize: { type: "number" },
              sixMonthTarget: { type: "number" },
              twelveMonthTarget: { type: "number" },
              keyHires: { type: "array", items: { type: "string" } }
            }
          },
          infrastructure: {
            type: "array",
            items: {
              type: "object",
              properties: {
                component: { type: "string" },
                currentState: { type: "string" },
                targetState: { type: "string" },
                timeline: { type: "string" }
              }
            }
          },
          positioning: {
            type: "object",
            properties: {
              uniqueValue: { type: "string" },
              competitiveDifferentiators: { type: "array", items: { type: "string" } },
              messaging: { type: "string" }
            }
          },
          financialProjections: {
            type: "object",
            properties: {
              sixMonthRevenue: { type: "string" },
              twelveMonthRevenue: { type: "string" },
              burnRate: { type: "string" },
              profitabilityTimeline: { type: "string" }
            }
          }
        }
      },
      
      6: {
        type: "object",
        properties: {
          customerServiceAI: {
            type: "array",
            items: {
              type: "object",
              properties: {
                solution: { type: "string" },
                implementation: { type: "string" },
                cost: { type: "string" },
                timeToValue: { type: "string" }
              }
            }
          },
          marketingAutomation: {
            type: "array",
            items: {
              type: "object",
              properties: {
                solution: { type: "string" },
                useCase: { type: "string" },
                expectedImpact: { type: "string" }
              }
            }
          },
          operationsAI: {
            type: "array",
            items: {
              type: "object",
              properties: {
                process: { type: "string" },
                automationApproach: { type: "string" },
                efficiencyGain: { type: "string" }
              }
            }
          },
          productFeatureAI: {
            type: "array",
            items: {
              type: "object",
              properties: {
                feature: { type: "string" },
                aiEnhancement: { type: "string" },
                userValue: { type: "string" },
                complexity: { type: "string", enum: ["Low", "Medium", "High"] }
              }
            }
          },
          dataAnalysisAI: {
            type: "array",
            items: {
              type: "object",
              properties: {
                analysisType: { type: "string" },
                dataSource: { type: "string" },
                insights: { type: "string" },
                businessImpact: { type: "string" }
              }
            }
          },
          implementationRoadmap: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phase: { type: "string" },
                timeline: { type: "string" },
                initiatives: { type: "array", items: { type: "string" } },
                investment: { type: "string" }
              }
            }
          },
          roiProjections: {
            type: "object",
            properties: {
              costSavings: { type: "string" },
              revenueIncrease: { type: "string" },
              efficiencyGains: { type: "string" },
              paybackPeriod: { type: "string" }
            }
          },
          buildVsBuy: {
            type: "array",
            items: {
              type: "object",
              properties: {
                capability: { type: "string" },
                recommendation: { type: "string", enum: ["Build", "Buy", "Partner"] },
                rationale: { type: "string" }
              }
            }
          }
        }
      }
    };

    return schemas[stageNumber] || {};
  }

  private getStageSystemPrompt(stageNumber: number): string {
    const prompts: { [key: number]: string } = {
      2: "You are a pragmatic startup advisor focused on effort minimization and smart shortcuts. Be brutally honest about feasibility and provide actionable simplifications.",
      3: "You are an experienced product manager and technical architect. Focus on practical, implementable plans with realistic timelines and modern best practices.",
      4: "You are a growth hacker and lean startup expert. Emphasize rapid testing, data-driven decisions, and fail-fast mentality.",
      5: "You are a growth strategist and scale-up advisor. Focus on sustainable, capital-efficient growth with clear metrics and milestones.",
      6: "You are an AI implementation specialist. Provide practical, high-ROI automation opportunities with clear implementation paths."
    };

    return prompts[stageNumber] || "You are an expert business advisor.";
  }

  private generateMilestones(stageNumber: number, stageData: any): any[] {
    const milestoneMaps: { [key: number]: any[] } = {
      2: [
        { name: "Initial Assessment", completed: true },
        { name: "Effort Analysis", completed: true },
        { name: "Simplification Strategy", completed: true },
        { name: "Go/No-Go Decision", completed: true }
      ],
      3: [
        { name: "Feature Prioritization", completed: !!stageData.coreFeatures },
        { name: "Tech Stack Selection", completed: !!stageData.techStack },
        { name: "Timeline Definition", completed: !!stageData.timeline },
        { name: "Budget Approval", completed: !!stageData.budgetBreakdown }
      ],
      4: [
        { name: "Landing Page Launch", completed: false },
        { name: "Beta User Acquisition", completed: false },
        { name: "Metrics Dashboard Setup", completed: false },
        { name: "First Cohort Analysis", completed: false }
      ],
      5: [
        { name: "Growth Channel Validation", completed: false },
        { name: "Product-Market Fit", completed: false },
        { name: "Team Expansion", completed: false },
        { name: "Series A Ready", completed: false }
      ],
      6: [
        { name: "AI Roadmap Defined", completed: !!stageData.implementationRoadmap },
        { name: "First AI Feature Live", completed: false },
        { name: "Automation ROI Validated", completed: false },
        { name: "Full AI Integration", completed: false }
      ]
    };

    return milestoneMaps[stageNumber] || [];
  }

  private getCompletionCriteria(stageNumber: number): string[] {
    const criteria: { [key: number]: string[] } = {
      2: [
        "Clear go/no-go decision made",
        "All simplifications identified",
        "Resource requirements validated",
        "Risk mitigation plan in place"
      ],
      3: [
        "MVP scope fully defined",
        "Development team assembled",
        "Budget secured",
        "Launch date set"
      ],
      4: [
        "Minimum 100 beta users acquired",
        "Key metrics tracking live",
        "Initial feedback collected",
        "Pivot decision made"
      ],
      5: [
        "Sustainable CAC/LTV ratio achieved",
        "Growth channels validated",
        "Team scaled appropriately",
        "Next funding round prepared"
      ],
      6: [
        "AI roadmap approved",
        "First implementations live",
        "ROI metrics validated",
        "Scaling plan defined"
      ]
    };

    return criteria[stageNumber] || [];
  }

  private getNextStepActions(stageNumber: number): string[] {
    const actions: { [key: number]: string[] } = {
      2: [
        "Review simplification opportunities",
        "Validate resource estimates",
        "Seek advisor feedback",
        "Proceed to MVP planning"
      ],
      3: [
        "Assemble development team",
        "Set up development environment",
        "Create project roadmap",
        "Begin sprint planning"
      ],
      4: [
        "Launch landing page",
        "Start user acquisition",
        "Set up analytics",
        "Schedule user interviews"
      ],
      5: [
        "Optimize acquisition channels",
        "Hire key positions",
        "Develop partnerships",
        "Prepare investor deck"
      ],
      6: [
        "Prioritize AI initiatives",
        "Start pilot implementations",
        "Measure impact metrics",
        "Scale successful automations"
      ]
    };

    return actions[stageNumber] || [];
  }
}
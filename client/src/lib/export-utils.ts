import type { BusinessAnalysis, WorkflowStage } from "@/types";

interface ExportOptions {
  format: 'markdown' | 'json' | 'pdf';
  includeMetadata?: boolean;
}

export class ExportService {
  static exportStage(stage: WorkflowStage, analysis: BusinessAnalysis, options: ExportOptions): void {
    switch (options.format) {
      case 'markdown':
        this.exportMarkdown(stage, analysis, options.includeMetadata);
        break;
      case 'json':
        this.exportJSON(stage, analysis, options.includeMetadata);
        break;
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  static exportFullWorkflow(stages: WorkflowStage[], analysis: BusinessAnalysis, format: 'markdown' | 'json'): void {
    if (format === 'markdown') {
      const content = this.generateFullMarkdown(stages, analysis);
      this.downloadFile(`${analysis.url.replace(/https?:\/\/|www\.|\//g, '') || 'venture'}-complete-workflow.md`, content, 'text/markdown');
    } else {
      const data = {
        analysis,
        stages: stages.map(s => ({
          stageNumber: s.stageNumber,
          status: s.status,
          data: s.data,
          createdAt: s.createdAt
        })),
        exportedAt: new Date().toISOString()
      };
      this.downloadFile(`${analysis.url.replace(/https?:\/\/|www\.|\//g, '') || 'venture'}-complete-workflow.json`, JSON.stringify(data, null, 2), 'application/json');
    }
  }

  private static exportMarkdown(stage: WorkflowStage, analysis: BusinessAnalysis, includeMetadata?: boolean): void {
    const content = this.generateStageMarkdown(stage, analysis, includeMetadata);
    const filename = `${analysis.url.replace(/https?:\/\/|www\.|\//g, '') || 'venture'}-stage-${stage.stageNumber}.md`;
    this.downloadFile(filename, content, 'text/markdown');
  }

  private static exportJSON(stage: WorkflowStage, analysis: BusinessAnalysis, includeMetadata?: boolean): void {
    const data: any = {
      stageNumber: stage.stageNumber,
      status: stage.status,
      data: stage.data
    };

    if (includeMetadata) {
      data.analysisId = analysis.id;
      data.businessUrl = analysis.url;
      data.createdAt = stage.createdAt;
      data.exportedAt = new Date().toISOString();
    }

    const filename = `${analysis.url.replace(/https?:\/\/|www\.|\//g, '') || 'venture'}-stage-${stage.stageNumber}.json`;
    this.downloadFile(filename, JSON.stringify(data, null, 2), 'application/json');
  }

  private static generateStageMarkdown(stage: WorkflowStage, analysis: BusinessAnalysis, includeMetadata?: boolean): string {
    const stageNames = [
      'Discovery & Selection',
      'Lazy-Entrepreneur Filter',
      'MVP Launch Planning',
      'Demand Testing Strategy',
      'Scaling & Growth',
      'AI Automation Mapping'
    ];

    let markdown = `# ${stageNames[stage.stageNumber - 1]}\n\n`;
    
    if (includeMetadata) {
      markdown += `## Metadata\n`;
      markdown += `- **URL**: ${analysis.url}\n`;
      markdown += `- **Business Model**: ${analysis.businessModel || 'Unknown'}\n`;
      markdown += `- **Stage**: ${stage.stageNumber} of 6\n`;
      markdown += `- **Created**: ${new Date(stage.createdAt).toLocaleDateString()}\n`;
      markdown += `- **Overall Score**: ${analysis.overallScore}/10\n\n`;
    }

    markdown += `## Stage Content\n\n`;
    
    // Stage-specific content formatting
    const data = stage.data || {};
    
    // Milestones
    if (data.milestones && Array.isArray(data.milestones)) {
      markdown += `### Milestones\n\n`;
      data.milestones.forEach((milestone: any) => {
        const status = milestone.completed ? '✅' : '⏳';
        markdown += `${status} ${milestone.name || milestone}\n`;
      });
      markdown += '\n';
    }

    // Completion Criteria
    if (data.completionCriteria && Array.isArray(data.completionCriteria)) {
      markdown += `### Completion Criteria\n\n`;
      data.completionCriteria.forEach((criteria: string) => {
        markdown += `- ${criteria}\n`;
      });
      markdown += '\n';
    }

    // Next Steps
    if (data.nextStepActions && Array.isArray(data.nextStepActions)) {
      markdown += `### Next Steps\n\n`;
      data.nextStepActions.forEach((action: string) => {
        markdown += `1. ${action}\n`;
      });
      markdown += '\n';
    }

    // Stage-specific sections
    switch (stage.stageNumber) {
      case 1: // Discovery
        if (analysis.scoreDetails) {
          markdown += `### Analysis Scores\n\n`;
          markdown += `- **Technical Complexity**: ${analysis.scoreDetails.technicalComplexity}/10\n`;
          markdown += `- **Market Opportunity**: ${analysis.scoreDetails.marketOpportunity}/10\n`;
          markdown += `- **Competitive Landscape**: ${analysis.scoreDetails.competitiveLandscape}/10\n`;
          markdown += `- **Resource Requirements**: ${analysis.scoreDetails.resourceRequirements}/10\n`;
          markdown += `- **Time to Market**: ${analysis.scoreDetails.timeToMarket}/10\n\n`;
        }
        break;

      case 2: // Filter
        if (data.effortScore !== undefined) {
          markdown += `### Assessment Results\n\n`;
          markdown += `- **Recommendation**: ${data.recommendation}\n`;
          markdown += `- **Effort Score**: ${data.effortScore}/10\n`;
          markdown += `- **Reward Score**: ${data.rewardScore}/10\n`;
          markdown += `- **Reasoning**: ${data.reasoning}\n\n`;
        }
        break;

      case 3: // MVP
        if (data.coreFeatures) {
          markdown += `### Core Features\n\n`;
          data.coreFeatures.forEach((feature: any) => {
            const name = typeof feature === 'string' ? feature : feature.name;
            markdown += `- ${name}\n`;
          });
          markdown += '\n';
        }
        if (data.techStack) {
          markdown += `### Tech Stack\n\n`;
          Object.entries(data.techStack).forEach(([category, techs]: [string, any]) => {
            markdown += `**${category}**: ${Array.isArray(techs) ? techs.join(', ') : techs}\n`;
          });
          markdown += '\n';
        }
        break;

      case 4: // Demand Testing
        if (data.validationMethods) {
          markdown += `### Validation Methods\n\n`;
          data.validationMethods.forEach((method: any) => {
            const methodName = typeof method === 'string' ? method : method.method;
            markdown += `#### ${methodName}\n`;
            if (method.timeline) markdown += `- Timeline: ${method.timeline}\n`;
            if (method.expectedOutcome) markdown += `- Expected Outcome: ${method.expectedOutcome}\n`;
            markdown += '\n';
          });
        }
        break;

      case 5: // Growth
        if (data.growthStrategies) {
          markdown += `### Growth Strategies\n\n`;
          data.growthStrategies.forEach((strategy: any) => {
            const strategyText = typeof strategy === 'string' ? strategy : strategy.strategy;
            markdown += `- ${strategyText}\n`;
            if (strategy.expectedROI) markdown += `  - Expected ROI: ${strategy.expectedROI}\n`;
          });
          markdown += '\n';
        }
        break;

      case 6: // AI
        if (data.customerServiceAI) {
          markdown += `### AI Automation Opportunities\n\n`;
          data.customerServiceAI.forEach((item: any) => {
            const solution = typeof item === 'string' ? item : item.solution;
            markdown += `- ${solution}\n`;
            if (item.timeToValue) markdown += `  - Time to Value: ${item.timeToValue}\n`;
          });
          markdown += '\n';
        }
        break;
    }

    return markdown;
  }

  private static generateFullMarkdown(stages: WorkflowStage[], analysis: BusinessAnalysis): string {
    let markdown = `# VentureClone AI - Complete Workflow Report\n\n`;
    markdown += `## Business Overview\n\n`;
    markdown += `- **URL**: ${analysis.url}\n`;
    markdown += `- **URL**: ${analysis.url}\n`;
    markdown += `- **Business Model**: ${analysis.businessModel}\n`;
    markdown += `- **Target Market**: ${analysis.targetMarket}\n`;
    markdown += `- **Revenue Stream**: ${analysis.revenueStream}\n`;
    markdown += `- **Overall Score**: ${analysis.overallScore}/10\n`;
    markdown += `- **Generated**: ${new Date(analysis.createdAt).toLocaleDateString()}\n\n`;

    markdown += `---\n\n`;

    // Add each stage
    stages
      .sort((a, b) => a.stageNumber - b.stageNumber)
      .forEach(stage => {
        markdown += this.generateStageMarkdown(stage, analysis, false);
        markdown += `\n---\n\n`;
      });

    markdown += `## Summary\n\n`;
    markdown += `This report was generated by VentureClone AI on ${new Date().toLocaleDateString()}. `;
    markdown += `The analysis covers ${stages.length} of 6 workflow stages.\n`;

    return markdown;
  }

  private static downloadFile(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
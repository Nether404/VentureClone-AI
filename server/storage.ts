import { 
  users,
  aiProviders, 
  businessAnalyses, 
  workflowStages,
  type User, 
  type UpsertUser,
  type AiProvider, 
  type InsertAiProvider,
  type BusinessAnalysis, 
  type InsertBusinessAnalysis,
  type WorkflowStage, 
  type InsertWorkflowStage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // AI Provider operations
  getAiProviders(userId: string): Promise<AiProvider[]>;
  getActiveAiProvider(userId: string): Promise<AiProvider | undefined>;
  createAiProvider(data: InsertAiProvider): Promise<AiProvider>;
  updateAiProvider(id: string, updates: Partial<AiProvider>): Promise<AiProvider | undefined>;
  deleteAiProvider(id: string): Promise<boolean>;
  
  // Business Analysis operations
  getBusinessAnalyses(userId: string): Promise<BusinessAnalysis[]>;
  getBusinessAnalysis(id: string): Promise<BusinessAnalysis | undefined>;
  createBusinessAnalysis(data: InsertBusinessAnalysis): Promise<BusinessAnalysis>;
  updateBusinessAnalysis(id: string, updates: Partial<BusinessAnalysis>): Promise<BusinessAnalysis | undefined>;
  
  // Workflow Stage operations
  getWorkflowStages(analysisId: string): Promise<WorkflowStage[]>;
  createWorkflowStage(data: InsertWorkflowStage): Promise<WorkflowStage>;
  updateWorkflowStage(id: string, updates: Partial<WorkflowStage>): Promise<WorkflowStage | undefined>;
  
  // Stats operations
  getStats(userId: string): Promise<{ 
    totalAnalyses: number; 
    strongCandidates: number; 
    inProgress: number; 
    avgScore: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // AI Provider operations
  async getAiProviders(userId: string): Promise<AiProvider[]> {
    return await db
      .select()
      .from(aiProviders)
      .where(eq(aiProviders.userId, userId))
      .orderBy(desc(aiProviders.createdAt));
  }

  async getActiveAiProvider(userId: string): Promise<AiProvider | undefined> {
    const [provider] = await db
      .select()
      .from(aiProviders)
      .where(and(eq(aiProviders.userId, userId), eq(aiProviders.isActive, true)))
      .limit(1);
    return provider;
  }

  async createAiProvider(data: InsertAiProvider): Promise<AiProvider> {
    // If setting as active, deactivate other providers first
    if (data.isActive) {
      await db
        .update(aiProviders)
        .set({ isActive: false })
        .where(eq(aiProviders.userId, data.userId));
    }

    const [provider] = await db
      .insert(aiProviders)
      .values(data)
      .returning();
    return provider;
  }

  async updateAiProvider(id: string, updates: Partial<AiProvider>): Promise<AiProvider | undefined> {
    // If setting as active, deactivate other providers first
    if (updates.isActive && updates.userId) {
      await db
        .update(aiProviders)
        .set({ isActive: false })
        .where(eq(aiProviders.userId, updates.userId));
    }

    const [provider] = await db
      .update(aiProviders)
      .set(updates)
      .where(eq(aiProviders.id, id))
      .returning();
    return provider;
  }

  async deleteAiProvider(id: string): Promise<boolean> {
    const result = await db
      .delete(aiProviders)
      .where(eq(aiProviders.id, id));
    return true;
  }

  // Business Analysis operations
  async getBusinessAnalyses(userId: string): Promise<BusinessAnalysis[]> {
    return await db
      .select()
      .from(businessAnalyses)
      .where(eq(businessAnalyses.userId, userId))
      .orderBy(desc(businessAnalyses.createdAt));
  }

  async getBusinessAnalysis(id: string): Promise<BusinessAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(businessAnalyses)
      .where(eq(businessAnalyses.id, id));
    return analysis;
  }

  async createBusinessAnalysis(data: InsertBusinessAnalysis): Promise<BusinessAnalysis> {
    const [analysis] = await db
      .insert(businessAnalyses)
      .values(data)
      .returning();
    return analysis;
  }

  async updateBusinessAnalysis(id: string, updates: Partial<BusinessAnalysis>): Promise<BusinessAnalysis | undefined> {
    const [analysis] = await db
      .update(businessAnalyses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessAnalyses.id, id))
      .returning();
    return analysis;
  }

  // Workflow Stage operations
  async getWorkflowStages(analysisId: string): Promise<WorkflowStage[]> {
    return await db
      .select()
      .from(workflowStages)
      .where(eq(workflowStages.analysisId, analysisId))
      .orderBy(workflowStages.stageNumber);
  }

  async createWorkflowStage(data: InsertWorkflowStage): Promise<WorkflowStage> {
    const [stage] = await db
      .insert(workflowStages)
      .values(data)
      .returning();
    return stage;
  }

  async updateWorkflowStage(id: string, updates: Partial<WorkflowStage>): Promise<WorkflowStage | undefined> {
    const [stage] = await db
      .update(workflowStages)
      .set(updates)
      .where(eq(workflowStages.id, id))
      .returning();
    return stage;
  }

  // Stats operations
  async getStats(userId: string): Promise<{ 
    totalAnalyses: number; 
    strongCandidates: number; 
    inProgress: number; 
    avgScore: number;
  }> {
    const analyses = await this.getBusinessAnalyses(userId);
    
    const totalAnalyses = analyses.length;
    const strongCandidates = analyses.filter(a => (a.overallScore || 0) >= 7).length;
    const inProgress = analyses.filter(a => a.currentStage && a.currentStage < 6).length;
    const avgScore = totalAnalyses > 0
      ? analyses.reduce((sum, a) => sum + (a.overallScore || 0), 0) / totalAnalyses
      : 0;

    return {
      totalAnalyses,
      strongCandidates,
      inProgress,
      avgScore: Math.round(avgScore * 10) / 10,
    };
  }
}

export const storage = new DatabaseStorage();
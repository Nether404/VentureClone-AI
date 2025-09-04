import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export type AIProvider = 'openai' | 'gemini' | 'grok';

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIProviderService {
  private openaiClient: OpenAI | null = null;
  private geminiClient: GoogleGenAI | null = null;
  private grokClient: OpenAI | null = null;

  constructor(private apiKey: string, private provider: AIProvider) {
    this.initializeClient();
  }

  private initializeClient() {
    switch (this.provider) {
      case 'openai':
        this.openaiClient = new OpenAI({ apiKey: this.apiKey });
        break;
      case 'gemini':
        this.geminiClient = new GoogleGenAI({ apiKey: this.apiKey });
        break;
      case 'grok':
        this.grokClient = new OpenAI({ 
          baseURL: "https://api.x.ai/v1", 
          apiKey: this.apiKey 
        });
        break;
    }
  }

  async generateContent(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      switch (this.provider) {
        case 'openai':
          return await this.generateOpenAIContent(prompt, systemPrompt);
        case 'gemini':
          return await this.generateGeminiContent(prompt, systemPrompt);
        case 'grok':
          return await this.generateGrokContent(prompt, systemPrompt);
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
    } catch (error) {
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStructuredContent(prompt: string, schema: any, systemPrompt?: string): Promise<any> {
    let attempts = 0;
    const maxAttempts = 3;
    let lastError: Error | null = null;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        let result: any;
        
        switch (this.provider) {
          case 'openai':
            result = await this.generateOpenAIStructuredContent(prompt, schema, systemPrompt);
            break;
          case 'gemini':
            result = await this.generateGeminiStructuredContent(prompt, schema, systemPrompt);
            break;
          case 'grok':
            result = await this.generateGrokStructuredContent(prompt, schema, systemPrompt);
            break;
          default:
            throw new Error(`Unsupported AI provider: ${this.provider}`);
        }
        
        // Validate and clean the result
        result = this.cleanAndValidateResponse(result);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Attempt ${attempts}/${maxAttempts} failed:`, lastError.message);
        
        if (attempts === maxAttempts) {
          throw new Error(`Structured AI generation failed after ${maxAttempts} attempts: ${lastError.message}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    throw new Error(`Structured AI generation failed: ${lastError?.message || 'Unknown error'}`);
  }

  private async generateOpenAIContent(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    if (!this.openaiClient) throw new Error('OpenAI client not initialized');

    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const response = await this.openaiClient.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
    });

    return {
      content: response.choices[0].message.content || '',
      usage: response.usage ? {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
      } : undefined,
    };
  }

  private async generateOpenAIStructuredContent(prompt: string, schema: any, systemPrompt?: string): Promise<any> {
    if (!this.openaiClient) throw new Error('OpenAI client not initialized');

    const messages: any[] = [];
    const enhancedSystemPrompt = `${systemPrompt || ''}
IMPORTANT: Keep all text responses concise (max 2-3 sentences per field). Respond with valid JSON only.`;
    messages.push({ role: "system", content: enhancedSystemPrompt });
    
    // Add schema instruction to prompt
    const structuredPrompt = `${prompt}

Respond with a valid JSON object matching this schema:
${JSON.stringify(schema, null, 2)}

Remember: Be concise. Each text field should be 2-3 sentences maximum.`;
    
    messages.push({ role: "user", content: structuredPrompt });

    const response = await this.openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('AI did not return any content');
    }
    
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      console.error('Failed to parse OpenAI response:', content.substring(0, 200));
      throw new Error(`Failed to parse AI response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateGeminiContent(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    if (!this.geminiClient) throw new Error('Gemini client not initialized');

    const config: any = {};
    if (systemPrompt) {
      config.systemInstruction = systemPrompt;
    }

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config
    });
    
    return {
      content: response.text || '',
      usage: undefined, // Gemini doesn't provide detailed usage info in the same format
    };
  }

  private async generateGeminiStructuredContent(prompt: string, schema: any, systemPrompt?: string): Promise<any> {
    if (!this.geminiClient) throw new Error('Gemini client not initialized');

    const structuredPrompt = `${prompt}

Respond with a valid JSON object matching this schema:
${JSON.stringify(schema, null, 2)}

IMPORTANT: Be concise. Each text field should be 2-3 sentences maximum.`;

    const config: any = {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.7,
      maxOutputTokens: 2000
    };
    
    if (systemPrompt) {
      config.systemInstruction = `${systemPrompt}
IMPORTANT: Keep all text responses concise (max 2-3 sentences per field).`;
    }

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: structuredPrompt,
      config
    });
    
    const content = response.text;
    if (!content) {
      throw new Error('AI did not return any content');
    }
    
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      console.error('Failed to parse Gemini response:', content.substring(0, 200));
      throw new Error(`Failed to parse AI response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateGrokContent(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    if (!this.grokClient) throw new Error('Grok client not initialized');

    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const response = await this.grokClient.chat.completions.create({
      model: "grok-2-1212",
      messages,
    });

    return {
      content: response.choices[0].message.content || '',
      usage: response.usage ? {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
      } : undefined,
    };
  }

  private async generateGrokStructuredContent(prompt: string, schema: any, systemPrompt?: string): Promise<any> {
    if (!this.grokClient) throw new Error('Grok client not initialized');

    const messages: any[] = [];
    const enhancedSystemPrompt = `${systemPrompt || ''}
IMPORTANT: Keep all text responses concise (max 2-3 sentences per field). Respond with valid JSON only.`;
    messages.push({ role: "system", content: enhancedSystemPrompt });
    
    // Add schema instruction to prompt
    const structuredPrompt = `${prompt}

Respond with a valid JSON object matching this schema:
${JSON.stringify(schema, null, 2)}

Remember: Be concise. Each text field should be 2-3 sentences maximum.`;
    
    messages.push({ role: "user", content: structuredPrompt });

    const response = await this.grokClient.chat.completions.create({
      model: "grok-2-1212",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('AI did not return any content');
    }
    
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      console.error('Failed to parse Grok response:', content.substring(0, 200));
      throw new Error(`Failed to parse AI response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private cleanAndValidateResponse(response: any): any {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response structure');
    }

    // Truncate long string fields to prevent UI issues
    const maxFieldLength = 500;
    
    const truncateStrings = (obj: any): any => {
      if (typeof obj === 'string') {
        if (obj.length > maxFieldLength) {
          return obj.substring(0, maxFieldLength) + '...';
        }
        return obj;
      } else if (Array.isArray(obj)) {
        return obj.map(item => truncateStrings(item));
      } else if (obj !== null && typeof obj === 'object') {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          cleaned[key] = truncateStrings(value);
        }
        return cleaned;
      }
      return obj;
    };

    // Special handling for scoreDetails to ensure scores are numbers
    if (response.scoreDetails) {
      const scoreTypes = ['technicalComplexity', 'marketOpportunity', 'competitiveLandscape', 'resourceRequirements', 'timeToMarket'];
      for (const scoreType of scoreTypes) {
        if (response.scoreDetails[scoreType]) {
          const score = response.scoreDetails[scoreType].score;
          if (typeof score === 'string') {
            response.scoreDetails[scoreType].score = parseFloat(score);
          }
          // Ensure score is between 1 and 10
          if (response.scoreDetails[scoreType].score < 1) {
            response.scoreDetails[scoreType].score = 1;
          } else if (response.scoreDetails[scoreType].score > 10) {
            response.scoreDetails[scoreType].score = 10;
          }
        }
      }
    }

    return truncateStrings(response);
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.generateContent("Test connection. Respond with 'OK'.");
      return response.content.includes('OK');
    } catch (error) {
      return false;
    }
  }
}

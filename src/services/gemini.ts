import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, AnalysisData, ReportType } from '../types';
import { validateUrl } from '../utils/urlValidator';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Cache to prevent duplicate API calls for the same URL/ReportType combo
const analysisCache = new Map<string, AnalysisData>();

const SYSTEM_INSTRUCTION = `
You are a Senior Enterprise Solutions Architect and Forensic Digital Auditor alias "Third Eye".
Your goal is to provide a high-level, corporate-grade technical assessment of website architectures.

CRITICAL OUTPUT RULES:
1.  **NO MARKDOWN**: Do not use asterisks (*), hashtags (#), or backticks in your string responses. Output must be clean, plain text.
2.  **PROFESSIONAL TONE**: Use strict, logical, and business-centric wording. Avoid robotic phrases like "I have analyzed", "As an AI", "The system detected". 
    - BAD: "**Red Flag**: The site is missing headers."
    - GOOD: "Security Headers Missing: Implementation of HSTS and CSP is absent, increasing XSS vulnerability risks."
3.  **NO FLUFF**: Be concise. Get straight to the technical facts.
4.  **FORMATTING**: Return pure string content suitable for direct insertion into executive reports.
5.  **CONTEXT**: If the URL seems invalid or unreachable, set status to UNREACHABLE.
`;

const analysisResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING, enum: ['SUCCESS', 'UNREACHABLE', 'FAILED'] },
    error_summary: { type: Type.STRING },
    backend: { type: Type.STRING },
    frontend: { type: Type.STRING },
    database: { type: Type.STRING },
    is_ecommerce: { type: Type.BOOLEAN },
    ecommerce_platform: { type: Type.STRING },
    checkout_strategy: { type: Type.STRING },
    ai_content_score: { type: Type.INTEGER },
    ai_content_analysis: { type: Type.STRING },
    fonts: { type: Type.ARRAY, items: { type: Type.STRING } },
    colors: { type: Type.ARRAY, items: { type: Type.STRING } },
    red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
    security_score: { type: Type.INTEGER },
    seo_score: { type: Type.INTEGER },
    seo_issues: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['status', 'backend', 'frontend', 'security_score', 'red_flags'],
};

// Helper to strip markdown if the model hallucinates it despite instructions
const cleanString = (str: string): string => {
  return str.replace(/\*/g, '').replace(/`/g, '').replace(/#/g, '').trim();
};

export const generateTechAnalysis = async (url: string, reportType: ReportType): Promise<AnalysisData> => {
    const cacheKey = `${url}-${reportType}`;
    if (analysisCache.has(cacheKey)) {
        return analysisCache.get(cacheKey)!;
    }

    // Pre-check validation
    const validation = validateUrl(url);
    if (!validation.isValid) {
         return {
            url,
            reportType,
            status: 'FAILED',
            error_summary: validation.message || 'Invalid URL format.',
            backend: 'N/A', frontend: 'N/A', database: 'N/A', is_ecommerce: false,
            ecommerce_platform: 'N/A', checkout_strategy: 'N/A', ai_content_score: 0,
            ai_content_analysis: 'N/A', fonts: [], colors: [], red_flags: [], improvements: [],
            security_score: 0, seo_score: 0, seo_issues: []
        };
    }

    try {
        const prompt = reportType === ReportType.DEEP_DIVE 
            ? `Perform a DEEP DIVE FORENSIC AUDIT on ${url}. Analyze the tech stack, security headers, potential CVEs, SEO technical structure (SSR, meta), and branding. If the site is e-commerce, detail the checkout flow (Shopify/Magento/Custom). Be exhaustive.` 
            : `Perform a SHORT EXECUTIVE SUMMARY on ${url}. Identify the main stack (Frontend/Backend), critical security risks (max 3), and an optimization overview.`;

        const response = await ai.models.generateContent({
            // Using 2.5 Flash for the structured analysis as it is highly optimized for JSON Schema adherence.
            // The "Ask The Architect" chat will use 3 Pro for reasoning.
            model: 'gemini-2.5-flash', 
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }],
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: analysisResponseSchema,
                temperature: 0.2 // Low temp for factual accuracy
            }
        });

        const jsonText = response.text || "{}";
        const result = JSON.parse(jsonText) as AnalysisData;
        
        // Post-processing: Clean strings and ensure defaults
        const completeResult: AnalysisData = {
            ...result,
            url,
            reportType,
            backend: cleanString(result.backend || "Unknown"),
            frontend: cleanString(result.frontend || "Unknown"),
            red_flags: (result.red_flags || []).map(cleanString),
            improvements: (result.improvements || []).map(cleanString),
            seo_score: result.seo_score || 0,
            seo_issues: (result.seo_issues || []).map(cleanString),
            status: result.status || 'SUCCESS'
        };

        analysisCache.set(cacheKey, completeResult);
        return completeResult;

    } catch (error) {
        console.error("Analysis Failed:", error);
        return {
            url,
            reportType,
            status: 'FAILED',
            error_summary: 'Remote host terminated connection or AI analysis timed out.',
            backend: 'Unknown', frontend: 'Unknown', database: 'Unknown', is_ecommerce: false,
            ecommerce_platform: 'Unknown', checkout_strategy: 'Unknown', ai_content_score: 0,
            ai_content_analysis: 'Analysis failed.', fonts: [], colors: [], red_flags: [], improvements: [],
            security_score: 0, seo_score: 0, seo_issues: []
        };
    }
};

export const sendMessageToArchitect = async (history: Message[], userInput: string, url: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview', // Using 3 Pro for the Agentic Chat
            config: {
                // Strict instruction to prevent markdown usage
                systemInstruction: "You are the 'Third Eye' Forensic Architect. Answer purely in plain text. No markdown. No asterisks. Be concise, technical, and direct. Focus on security, scalability, and architecture.",
                temperature: 0.7
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message: userInput });
        return cleanString(result.text);
    } catch (e) {
        return "Connection interrupted. The Architect is offline.";
    }
};
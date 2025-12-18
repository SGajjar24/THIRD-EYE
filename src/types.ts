export enum AnalysisSection {
  DASHBOARD = 'DASHBOARD',
  COMMERCE_AUDIT = 'COMMERCE_AUDIT',
  ASK_ARCHITECT = 'ASK_ARCHITECT',
  REPORT_GEN = 'REPORT_GEN'
}

export enum ReportType {
  SUMMARY = 'SUMMARY',
  DEEP_DIVE = 'DEEP_DIVE'
}

export enum UrlCategory {
  VALID = 'VALID',
  MALFORMED = 'MALFORMED',
  LOCALHOST_PRIVATE = 'LOCALHOST_PRIVATE',
  SHORT_URL = 'SHORT_URL',
  IP_ADDRESS = 'IP_ADDRESS',
  SUSPICIOUS = 'SUSPICIOUS'
}

export interface UrlValidationResult {
  isValid: boolean;
  category: UrlCategory;
  cleanUrl: string;
  message?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AnalysisData {
  url: string;
  reportType: ReportType;
  status: 'SUCCESS' | 'UNREACHABLE' | 'FAILED';
  error_summary?: string;
  backend: string;
  frontend: string;
  database: string;
  is_ecommerce: boolean;
  ecommerce_platform: string;
  checkout_strategy: string;
  ai_content_score: number; // 0-100
  ai_content_analysis: string;
  fonts: string[];
  colors: string[];
  red_flags: string[];
  improvements: string[];
  security_score: number; // 0-100
  seo_score: number; // 0-100 (New)
  seo_issues: string[]; // (New)
}

export interface GhostSession {
  sessionId: string;
  deviceId: string;
  lastActive: string;
  cartItems: {
      id: number;
      name: string;
      price: number;
  }[];
  customerData: {
      email: string;
      phone: string;
      address: string;
      city: string;
  };
}
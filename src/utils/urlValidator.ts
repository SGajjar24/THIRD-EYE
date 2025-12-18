import { UrlCategory, UrlValidationResult } from '../types';

const SHORTENER_DOMAINS = [
  'bit.ly', 'goo.gl', 'tinyurl.com', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 
  'adf.ly', 'bit.do', 'mcaf.ee', 'su.pr', 'bl.ink', 'shorturl.at'
];

const PRIVATE_IP_RANGES = [
  /^127\./,
  /^192\.168\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^0\./,
  /^169\.254\./
];

export const validateUrl = (input: string): UrlValidationResult => {
  let urlStr = input.trim();
  
  // 1. Auto-correction: Add https if missing
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = 'https://' + urlStr;
  }

  try {
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();

    // 2. CHECK: Localhost / Private Network (Strict Block)
    if (hostname === 'localhost' || hostname === '::1') {
      return {
        isValid: false,
        category: UrlCategory.LOCALHOST_PRIVATE,
        cleanUrl: urlStr,
        message: 'Analysis of Localhost is restricted for security reasons.'
      };
    }

    // Check for private IP ranges
    if (PRIVATE_IP_RANGES.some(regex => regex.test(hostname))) {
      return {
        isValid: false,
        category: UrlCategory.LOCALHOST_PRIVATE,
        cleanUrl: urlStr,
        message: 'Analysis of Private Network IPs (LAN) is not permitted.'
      };
    }

    // 3. CHECK: URL Shorteners
    if (SHORTENER_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
      return {
        isValid: true, // We allow it, but warn
        category: UrlCategory.SHORT_URL,
        cleanUrl: urlStr,
        message: 'Shortened URL detected. Redirect analysis is limited in passive mode.'
      };
    }

    // 4. CHECK: Raw Public IP Address
    // Regex for basic IPv4
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return {
        isValid: true,
        category: UrlCategory.IP_ADDRESS,
        cleanUrl: urlStr,
        message: 'Raw IP address detected. SSL verification and domain forensics may be incomplete.'
      };
    }

    // 5. CHECK: Valid TLD (Basic check to ensure it's not just a random word)
    if (!hostname.includes('.') && !hostname.includes(':')) {
       return {
        isValid: false,
        category: UrlCategory.MALFORMED,
        cleanUrl: urlStr,
        message: 'Invalid domain format. Missing Top-Level Domain (e.g., .com, .io).'
      };
    }
    
    // 6. CHECK: Suspicious Length (Potential Phishing/Buffer Overflow attempt)
    if (urlStr.length > 2048) {
         return {
            isValid: false,
            category: UrlCategory.SUSPICIOUS,
            cleanUrl: urlStr,
            message: 'URL exceeds standard length limits. Flagged as suspicious.'
        };
    }

    // Valid Standard URL
    return {
      isValid: true,
      category: UrlCategory.VALID,
      cleanUrl: urlStr
    };

  } catch (e) {
    return {
      isValid: false,
      category: UrlCategory.MALFORMED,
      cleanUrl: input,
      message: 'Malformed URL. Please check syntax.'
    };
  }
};
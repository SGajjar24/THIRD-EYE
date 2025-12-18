
import React, { useState, useEffect } from 'react';
import { FileText, Mail, CheckCircle, Loader2, Download, Building, User, ShieldCheck, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { AnalysisData } from '../types';

interface ReportGeneratorProps {
    currentUrl: string;
    data: AnalysisData | null;
    onNotification: (msg: string, type: 'success' | 'info' | 'error') => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ currentUrl, data, onNotification }) => {
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
  const [loadingStep, setLoadingStep] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  // Randomize math challenge
  const [challenge, setChallenge] = useState(() => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    return { q: `${n1} + ${n2}`, a: (n1 + n2).toString() };
  });

  const [formData, setFormData] = useState({
      name: '',
      email: '',
      role: 'Developer',
      notes: ''
  });

  const LOADING_STEPS = [
      "INIT_HANDSHAKE_PROTOCOL",
      "ENCRYPTING_PAYLOAD_256BIT",
      "COMPRESSING_ASSETS",
      "DISPATCHING_SECURE_CHANNEL"
  ];

  useEffect(() => {
      if (status === 'SENDING') {
          setLoadingStep(0);
          const interval = setInterval(() => {
              setLoadingStep(prev => {
                  if (prev < LOADING_STEPS.length - 1) return prev + 1;
                  return prev;
              });
          }, 800); // Step every 800ms
          return () => clearInterval(interval);
      }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (captchaAnswer !== challenge.a) {
        alert("Security Verification Failed. Please retry.");
        return;
    }

    setStatus('SENDING');
    
    // Construct structured forensic payload for Web3Forms
    const payload = {
        access_key: "83a05dbd-9847-45c4-8be5-a9c911ca5eaf",
        subject: `THIRD EYE: Forensic Report Dispatch - ${currentUrl.replace(/https?:\/\//, '')}`,
        from_name: "Third Eye System",
        
        // Primary Contact Info
        name: formData.name,
        email: formData.email,
        
        // Structured Forensic Data (These will appear as key-value pairs in the email)
        "Target URL": currentUrl,
        "User Role": formData.role,
        "User Notes": formData.notes || "N/A",
        "Analysis Status": data?.status || "UNKNOWN",
        "Security Risk Score": data?.security_score ? `${data.security_score}/100` : "N/A",
        "AI Content Probability": data?.ai_content_score ? `${data.ai_content_score}%` : "N/A",
        "Tech Stack": data ? `${data.frontend || 'Unknown'} / ${data.backend || 'Unknown'}` : "N/A",
        "Report Type": data?.reportType || "SUMMARY",
        "Reference ID": `TE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        "Timestamp": new Date().toISOString()
    };

    try {
        // Enforce a minimum delay for the animation to play at least briefly
        const minDelayPromise = new Promise(resolve => setTimeout(resolve, 2000));
        
        const fetchPromise = fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        const [response] = await Promise.all([fetchPromise, minDelayPromise]);
        const result = await response.json();

        if (result.success) {
            setStatus('SUCCESS');
            onNotification("Secure Dispatch Protocol Complete. Email Sent.", 'success');
        } else {
            console.error("Web3Forms API Error:", result);
            setStatus('IDLE');
            onNotification(`Dispatch Failed: ${result.message || "Upstream Error"}`, 'error');
        }
    } catch (error) {
        console.error("Network Error:", error);
        setStatus('IDLE');
        onNotification("Connection Terminated. Report Dispatch Failed.", 'error');
    }
  };

  const cleanText = (text: string | undefined) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').replace(/#/g, '').trim();
  };

  const generateHTMLReport = (analysis: AnalysisData, userForm: typeof formData) => {
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const refCode = Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const isFailed = analysis.status !== 'SUCCESS';
      
      // DYNAMIC THEME BASED ON REPORT TYPE OR ERROR
      const isDeepDive = analysis.reportType === 'DEEP_DIVE';
      let reportTitle = isDeepDive ? 'DEEP DIVE FORENSIC REPORT' : 'EXECUTIVE SUMMARY REPORT';
      let themeColor = isDeepDive ? '#a855f7' : '#3b82f6';
      let themeRgba = isDeepDive ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)';
      
      if (isFailed) {
          reportTitle = 'TARGET REACHABILITY EXCEPTION LOG';
          themeColor = '#ef4444'; // Red
          themeRgba = 'rgba(239, 68, 68, 0.1)';
      }
      
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle}: ${analysis.url}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root { 
        --bg-dark: #020617; 
        --card-bg: #0f172a; 
        --border: #1e293b; 
        --accent: ${themeColor}; 
        --accent-bg: ${themeRgba};
        --success: #10b981; 
        --danger: #ef4444; 
        --warning: #f59e0b;
        --text-main: #f8fafc; 
        --text-muted: #94a3b8;
    }
    
    * { box-sizing: border-box; }
    
    body { 
        background-color: var(--bg-dark); 
        color: var(--text-main); 
        font-family: 'Inter', sans-serif; 
        line-height: 1.6; 
        margin: 0; 
        padding: 0;
        -webkit-font-smoothing: antialiased;
        background-image: 
            linear-gradient(rgba(2, 6, 23, 0.95), rgba(2, 6, 23, 0.95)),
            linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .03) 25%, rgba(255, 255, 255, .03) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .03) 75%, rgba(255, 255, 255, .03) 76%, transparent 77%, transparent), 
            linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .03) 25%, rgba(255, 255, 255, .03) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .03) 75%, rgba(255, 255, 255, .03) 76%, transparent 77%, transparent);
        background-size: 50px 50px;
    }

    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }

    @media (max-width: 768px) {
        .container { padding: 20px 15px; }
        header { flex-direction: column; align-items: flex-start; gap: 20px; }
        .grid-2, .grid-4 { grid-template-columns: 1fr !important; gap: 15px; }
    }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-enter { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }

    header { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start; 
        border-bottom: 1px solid var(--border); 
        padding-bottom: 30px; 
        margin-bottom: 40px; 
        position: relative;
    }
    header::after {
        content: ''; position: absolute; bottom: -1px; left: 0; width: 100px; height: 1px; background: var(--accent); box-shadow: 0 0 10px var(--accent);
    }

    .logo-section { display: flex; align-items: center; gap: 15px; }
    .logo-icon { width: 48px; height: 48px; color: var(--accent); }
    .brand-name { font-weight: 800; font-size: 24px; letter-spacing: -0.5px; line-height: 1; }
    .brand-sub { font-size: 10px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 2px; margin-top: 4px; display: block; }
    
    .report-meta { text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-muted); }
    .report-badge { 
        display: inline-block; 
        background: var(--accent-bg); 
        color: var(--accent); 
        padding: 6px 10px; 
        border-radius: 4px; 
        border: 1px solid var(--accent);
        margin-bottom: 8px;
        font-weight: 800;
        font-size: 10px;
        letter-spacing: 1px;
    }

    .card { 
        background: var(--card-bg); 
        border: 1px solid var(--border); 
        border-radius: 12px; 
        padding: 25px; 
        margin-bottom: 25px; 
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    }
    
    h2 { 
        color: var(--text-main); 
        font-size: 16px; 
        font-weight: 600; 
        text-transform: uppercase; 
        letter-spacing: 1px; 
        margin-top: 0; 
        margin-bottom: 20px; 
        display: flex; 
        align-items: center; 
        gap: 10px; 
    }
    h2 svg { width: 18px; height: 18px; color: var(--accent); }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }

    .kv-item { margin-bottom: 5px; }
    .kv-label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 4px; font-weight: 600; letter-spacing: 0.5px; }
    .kv-value { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #fff; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); display: block; word-break: break-all; }

    .score-container { display: flex; align-items: center; gap: 15px; }
    .score-circle { 
        width: 60px; height: 60px; min-width: 60px;
        border-radius: 50%; 
        display: flex; align-items: center; justify-content: center; 
        font-weight: 800; font-size: 18px; 
        border: 4px solid;
    }
    .score-high { border-color: var(--success); color: var(--success); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
    .score-med { border-color: var(--warning); color: var(--warning); box-shadow: 0 0 15px rgba(245, 158, 11, 0.2); }
    .score-low { border-color: var(--danger); color: var(--danger); box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
    
    .flag-item { background: rgba(239, 68, 68, 0.1); border-left: 3px solid var(--danger); padding: 10px 15px; margin-bottom: 8px; font-size: 13px; color: #fca5a5; }
    .check-item { background: rgba(16, 185, 129, 0.05); border-left: 3px solid var(--success); padding: 10px 15px; margin-bottom: 8px; font-size: 13px; color: #d1fae5; }
    .warn-item { background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--warning); padding: 10px 15px; margin-bottom: 8px; font-size: 13px; color: #fcd34d; }
    
    .error-box { background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); padding: 20px; border-radius: 8px; text-align: center; color: #fca5a5; font-family: 'JetBrains Mono'; }

    .footer-section { margin-top: 60px; border-top: 1px solid var(--border); padding-top: 30px; font-size: 10px; color: var(--text-muted); text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- HEADER -->
    <header class="animate-enter">
        <div class="logo-section">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            <div>
                <div class="brand-name">THIRD EYE</div>
                <span class="brand-sub">Forensic Vision Lab</span>
            </div>
        </div>
        <div class="report-meta">
            <span class="report-badge">${reportTitle}</span><br>
            REF ID: ${refCode}<br>
            DATE: ${dateStr}
        </div>
    </header>

    <!-- CLIENT INFO -->
    <div class="card animate-enter delay-1">
        <h2>Target & Client Profile</h2>
        <div class="grid-2">
            <div>
                <div class="kv-item"><span class="kv-label">Target URL</span><span class="kv-value" style="color: var(--accent)">${analysis.url}</span></div>
                <div class="kv-item"><span class="kv-label">Analysis Date</span><span class="kv-value">${dateStr}</span></div>
            </div>
            <div>
                <div class="kv-item"><span class="kv-label">Prepared For</span><span class="kv-value">${userForm.name} (${userForm.role})</span></div>
                <div class="kv-item"><span class="kv-label">Recipient</span><span class="kv-value">${userForm.email}</span></div>
            </div>
        </div>
    </div>

    ${isFailed ? `
        <!-- FAILURE STATE -->
        <div class="card animate-enter delay-2">
            <h2 style="color: var(--danger);">Target Reachability Exception</h2>
            <div class="error-box">
                <p><strong>CRITICAL EXCEPTION:</strong> The target URL <span style="color: #fff;">${analysis.url}</span> failed responsiveness checks.</p>
                <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">Diagnostic Info: ${analysis.error_summary || 'DNS/Network Protocol Handshake Failed'}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: var(--text-muted);">
                The Third Eye engine detected an interruption in the reconnaissance phase. The target may be offline, non-existent, or actively blocking automated telemetry. No forensic data could be reliably extracted.
            </p>
        </div>
    ` : `
        <!-- SUCCESS STATE -->
        <div class="grid-2">
            <div class="card animate-enter delay-2">
                <h2>Security Risk Assessment</h2>
                <div class="score-container">
                    <div class="score-circle ${analysis.security_score > 70 ? 'score-high' : 'score-low'}">
                        ${analysis.security_score}
                    </div>
                    <div>
                        <span class="kv-label">Vulnerability Posture</span>
                        <span style="font-weight: bold; color: ${analysis.security_score > 70 ? 'var(--success)' : 'var(--danger)'}">
                            ${analysis.security_score > 80 ? 'SECURE' : analysis.security_score > 50 ? 'MODERATE RISK' : 'CRITICAL RISK'}
                        </span>
                    </div>
                </div>
            </div>

            <div class="card animate-enter delay-2">
                <h2>Content Origin Probability</h2>
                <div style="margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold;">
                        <span>Human</span>
                        <span>${analysis.ai_content_score}% Synthetic Detected</span>
                    </div>
                    <div style="width: 100%; height: 6px; background: #334155; border-radius: 3px; overflow: hidden; margin-top: 8px;">
                        <div style="height: 100%; background: linear-gradient(90deg, var(--success), var(--danger)); width: ${analysis.ai_content_score}%"></div>
                    </div>
                    <p style="font-size: 11px; color: var(--text-muted); margin-top: 10px;">
                        ${cleanText(analysis.ai_content_analysis).slice(0, 150)}...
                    </p>
                </div>
            </div>
        </div>

        <div class="card animate-enter delay-2">
            <h2>System Architecture Map</h2>
            <div class="grid-4">
                <div class="kv-item"><span class="kv-label">Frontend</span><span class="kv-value">${cleanText(analysis.frontend)}</span></div>
                <div class="kv-item"><span class="kv-label">Backend</span><span class="kv-value">${cleanText(analysis.backend)}</span></div>
                <div class="kv-item"><span class="kv-label">Database</span><span class="kv-value">${cleanText(analysis.database)}</span></div>
                <div class="kv-item"><span class="kv-label">Type</span><span class="kv-value">${analysis.is_ecommerce ? 'E-Commerce' : 'Informational'}</span></div>
            </div>
        </div>

        ${isDeepDive ? `
            <div class="card animate-enter delay-2">
                <h2>SEO Forensic Analysis</h2>
                <div class="grid-2">
                    <div class="score-container">
                        <div class="score-circle ${analysis.seo_score > 75 ? 'score-high' : analysis.seo_score > 50 ? 'score-med' : 'score-low'}">
                            ${analysis.seo_score}
                        </div>
                        <div>
                            <span class="kv-label">Search Visibility Health</span>
                            <span style="font-weight: bold; font-size: 11px; color: var(--text-muted)">
                                Technical crawlability & indexability metrics
                            </span>
                        </div>
                    </div>
                    <div>
                         <span class="kv-label" style="margin-bottom: 8px;">Technical Flags</span>
                         ${analysis.seo_issues && analysis.seo_issues.length > 0 
                            ? analysis.seo_issues.map(i => `<div class="warn-item">⚡ ${cleanText(i)}</div>`).join('') 
                            : '<div class="check-item">Structure is optimized for search indexing.</div>'}
                    </div>
                </div>
            </div>
        ` : ''}

        <div class="grid-2">
            <div class="card animate-enter delay-2">
                <h2 style="color: var(--danger);">Critical Vulnerabilities</h2>
                ${analysis.red_flags.length > 0 ? analysis.red_flags.map(f => `<div class="flag-item">⚠️ ${cleanText(f)}</div>`).join('') : '<div class="check-item">No Critical Vulnerabilities Detected</div>'}
            </div>

            <div class="card animate-enter delay-2">
                <h2 style="color: var(--success);">System Hardening</h2>
                ${analysis.improvements.map(i => `<div class="check-item">💡 ${cleanText(i)}</div>`).join('')}
            </div>
        </div>
    `}

    <!-- FOOTER -->
    <div class="footer-section animate-enter delay-2">
        <div style="max-width: 600px; margin: 0 auto;">
            <strong>PASSIVE RECONNAISSANCE DISCLAIMER</strong><br>
            This document is generated for educational and diagnostic purposes via the Third Eye Forensic Engine. It utilizes passive telemetry and AI-driven pattern recognition. It does not constitute a certified penetration test or legal compliance audit.
            <br><br>
            © ${new Date().getFullYear()} Third Eye. All Rights Reserved.
        </div>
    </div>

  </div>
</body>
</html>
      `;
  };

  const handleDownload = () => {
    if (!data) return;
    const htmlContent = generateHTMLReport(data, formData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Third_Eye_Audit_${new Date().toISOString().split('T')[0]}_${currentUrl.replace(/[^a-zA-Z0-9]/g, '')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotification("Download Started: " + a.download, 'success');
  };

  if (!data) {
      return (
          <div className="bg-tech-panel border border-tech-border rounded-lg p-12 flex flex-col items-center justify-center text-center h-[400px]">
              <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-bold text-white">No Forensic Data Available</h3>
              <p className="text-slate-400 mt-2">Initiate a forensic scan on a target URL to populate the report engine.</p>
          </div>
      );
  }

  const isFailed = data.status !== 'SUCCESS';

  if (status === 'SUCCESS') {
      return (
          <div className="bg-tech-panel border border-tech-border rounded-lg p-12 flex flex-col items-center justify-center text-center h-[600px] animate-fade-in">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Secure Dispatch Complete</h2>
              <p className="text-slate-400 mb-8 max-w-md">
                  The forensic audit for <span className="text-tech-accent font-mono">{currentUrl}</span> has been securely compiled and transmitted.
              </p>
              <div className="bg-slate-800 p-4 rounded border border-slate-700 mb-8 text-left max-w-sm w-full">
                  <p className="text-xs text-slate-500 uppercase mb-1">Origin</p>
                  <p className="text-white font-mono text-sm">Third Eye Forensic Cloud (v2.5)</p>
                  <div className="h-px bg-slate-700 my-2"></div>
                  <p className="text-xs text-slate-500 uppercase mb-1">Recipient</p>
                  <p className="text-white font-mono text-sm">{formData.email}</p>
              </div>
              <div className="flex gap-4">
                  <button onClick={() => {
                      setStatus('IDLE'); 
                      setCaptchaAnswer('');
                      const n1 = Math.floor(Math.random() * 10) + 1;
                      const n2 = Math.floor(Math.random() * 10) + 1;
                      setChallenge({ q: `${n1} + ${n2}`, a: (n1 + n2).toString() });
                    }} 
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-600 transition-colors"
                  >
                      New Request
                  </button>
                   <button 
                        onClick={handleDownload}
                        className="px-6 py-2 bg-tech-accent hover:bg-sky-500 text-tech-dark font-bold rounded flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                    >
                      <Download className="w-4 h-4" /> Download Local Copy
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto">
        {isFailed && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-red-400 text-sm">Target Unreachable</h3>
                    <p className="text-xs text-red-300/80 mt-1">
                        System was unable to complete the handshake with the target URL. A limited "Exception Log" report is available for documentation purposes.
                    </p>
                </div>
            </div>
        )}
        <div className="bg-tech-panel border border-tech-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-tech-border bg-slate-900/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-tech-accent" />
                    Secure Report Generation
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Compile the forensic analysis for <span className="font-mono text-indigo-400">{currentUrl}</span>.
                </p>
            </div>
            
            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <User className="w-4 h-4" /> Full Name <span className="text-red-400">*</span>
                            </label>
                            <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition-all"
                                placeholder="Jane Doe"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Recipient Email <span className="text-red-400">*</span>
                            </label>
                            <input 
                                required
                                type="email" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition-all"
                                placeholder="jane@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                            <Building className="w-4 h-4" /> Role / Purpose
                        </label>
                        <select 
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-tech-accent outline-none appearance-none"
                        >
                            <option>Software Engineer / Developer</option>
                            <option>CTO / Technical Lead</option>
                            <option>Product Manager</option>
                            <option>Business Owner</option>
                            <option>Security Researcher</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-300">Additional Notes</label>
                        <textarea 
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition-all h-32 resize-none"
                            placeholder="Specify priority areas for the final report..."
                        ></textarea>
                    </div>

                    {/* CAPTCHA SECTION */}
                    <div className="bg-slate-800/50 p-4 rounded border border-slate-700 flex flex-col md:flex-row items-start md:items-center gap-4">
                         <div className="flex items-center gap-2 text-tech-accent">
                             <ShieldCheck className="w-5 h-5" />
                             <span className="font-mono font-bold text-sm">SECURITY CHECK</span>
                         </div>
                         <div className="flex items-center gap-3">
                             <span className="text-sm text-slate-300">What is <span className="font-bold text-white">{challenge.q}</span> ?</span>
                             <input 
                                required
                                type="text"
                                value={captchaAnswer}
                                onChange={e => setCaptchaAnswer(e.target.value)}
                                className="w-20 bg-slate-900 border border-slate-600 rounded p-2 text-center text-white font-mono focus:border-tech-accent outline-none"
                                placeholder="?"
                             />
                             <button
                                type="button" 
                                onClick={() => {
                                  const n1 = Math.floor(Math.random() * 10) + 1;
                                  const n2 = Math.floor(Math.random() * 10) + 1;
                                  setChallenge({ q: `${n1} + ${n2}`, a: (n1 + n2).toString() });
                                }}
                                className="text-slate-400 hover:text-white"
                             >
                                <RefreshCw className="w-4 h-4" />
                             </button>
                         </div>
                         <p className="text-xs text-slate-500">Validation required to confirm request authenticity.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                         <p className="text-[10px] text-slate-500 mb-4 text-center">
                             By initiating generation, you acknowledge that this document contains passive analysis data and agree to the ethical use protocols.
                         </p>
                        <button 
                            type="submit" 
                            disabled={status === 'SENDING'}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-lg shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            {status === 'SENDING' ? (
                                <div className="w-full flex items-center justify-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="font-mono text-sm uppercase tracking-wider">
                                        {LOADING_STEPS[loadingStep]}...
                                    </span>
                                    <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300" style={{ width: `${(loadingStep + 1) * 25}%` }}></div>
                                </div>
                            ) : (
                                <>
                                    Generate & Dispatch Secure Report
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default ReportGenerator;

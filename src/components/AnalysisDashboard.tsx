
import React from 'react';
import { Server, Globe, Database, Code, Cpu, Palette, Type, AlertTriangle, TrendingUp, Bot, ShieldCheck, ShoppingBag, Info, HelpCircle, CheckCircle2, Search, BarChart3, Copy } from 'lucide-react';
import { AnalysisData, ReportType } from '../types';

interface AnalysisDashboardProps {
    data: AnalysisData;
    onNotification: (msg: string, type: 'success' | 'info') => void;
}

// Utility to ensure clean enterprise wording
const cleanText = (text: string | undefined) => {
    if (!text) return "";
    // Remove markdown symbols that might slip through
    return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').replace(/#/g, '').trim();
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, onNotification }) => {
  return (
    <div className="space-y-6 md:space-y-8 font-sans">
      
      {/* Intro Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 md:p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white mb-2 truncate">Analysis Complete for {data.url.replace('https://','').split('/')[0]}</h2>
          <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
            Architecture mapping successful. Below is the technical breakdown of the stack, security posture, and detected vulnerabilities.
          </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            delay="delay-0" 
            title="Frontend Framework" 
            value={cleanText(data.frontend) || "Custom HTML"} 
            icon={<Globe className="text-blue-400" />} 
            desc="Client-side Rendering"
            onCopy={onNotification} 
        />
        <StatCard 
            delay="delay-100" 
            title="Server Technology" 
            value={cleanText(data.backend) || "Standard Server"} 
            icon={<Server className="text-purple-400" />} 
            desc="Backend Infrastructure"
            onCopy={onNotification}
        />
        <StatCard 
            delay="delay-200" 
            title="Security Risk Score" 
            value={data.security_score + '/100'} 
            icon={<ShieldCheck className={data.security_score > 80 ? "text-green-400" : "text-amber-400"} />} 
            desc="Vulnerability Assessment"
            onCopy={onNotification}
        />
        <StatCard 
            delay="delay-300" 
            title="Data Layer" 
            value={cleanText(data.database) || "Unknown"} 
            icon={<Database className="text-yellow-400" />} 
            desc="Persistence Strategy"
            onCopy={onNotification}
        />
      </div>

      {/* AI Detection Section - High Visibility */}
      <div className="glass-panel rounded-xl p-6 md:p-8 animate-fade-in-up delay-100 border border-indigo-500/30 relative overflow-hidden group">
         {/* Glow Effect */}
         <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[50px] group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>
         
         <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                        <Bot className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">AI Content Probability</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Heuristic Analysis</p>
                    </div>
                </div>
                
                <p className="text-slate-300 mb-4 leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 italic text-sm">
                    "{cleanText(data.ai_content_analysis)}"
                </p>
                
                <div className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                    <p>Analysis based on sentence structure, perplexity, and repetition patterns common in LLM outputs.</p>
                </div>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col justify-center">
                <div className="relative pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        <span>Organic</span>
                        <span>Synthetic</span>
                    </div>
                    <div className="h-6 bg-slate-900/80 rounded-full overflow-hidden border border-slate-700 shadow-inner relative">
                        <div 
                            className="h-full bg-gradient-to-r from-green-500 via-amber-400 to-red-500 transition-all duration-1000 ease-out relative"
                            style={{ width: `${data.ai_content_score}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"></div>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                         <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-bold">Estimated Probability</p>
                         <span className={`font-black text-4xl tracking-tighter ${data.ai_content_score > 50 ? 'text-red-400' : 'text-green-400'}`}>
                             {data.ai_content_score}%
                         </span>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Stack Details */}
        <div className="glass-panel rounded-xl p-6 flex flex-col animate-fade-in-up delay-200 glass-card-hover">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 tracking-tight">
                <Code className="w-5 h-5 text-tech-accent" /> Stack Details
            </h3>
            <div className="space-y-6 flex-1">
                <div className="flex flex-col">
                     <div className="flex justify-between items-center mb-2">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Architecture Type</p>
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        {data.is_ecommerce ? <ShoppingBag className="w-5 h-5 text-green-400" /> : <Globe className="w-5 h-5 text-slate-400" />}
                        <div>
                            <p className="text-white text-sm font-bold">
                                {data.is_ecommerce ? `E-Commerce (${cleanText(data.ecommerce_platform)})` : 'Web Application / Content'}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">{data.is_ecommerce ? 'Transaction Capability Detected' : 'Informational / Static'}</p>
                        </div>
                     </div>
                </div>

                {data.reportType === ReportType.DEEP_DIVE && (
                    <>
                         {/* SEO SECTION FOR DEEP DIVE */}
                         <div className="pt-4 border-t border-slate-700/50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                                    <Search className="w-4 h-4 text-orange-400" /> SEO Visibility
                                </div>
                                <span className={`text-sm font-bold ${data.seo_score > 75 ? 'text-green-400' : data.seo_score > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                    Score: {data.seo_score || 0}/100
                                </span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${data.seo_score > 75 ? 'bg-green-500' : 'bg-orange-500'}`} 
                                        style={{width: `${data.seo_score || 0}%`}}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-slate-800/30 rounded-lg p-3">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Technical SEO Flags</p>
                                <div className="space-y-1">
                                    {data.seo_issues?.map((issue, i) => (
                                        <div key={i} className="flex gap-2 items-start text-xs text-slate-300 leading-normal">
                                            <span className="text-orange-400 mt-1 text-[10px]">•</span> {cleanText(issue)}
                                        </div>
                                    )) || <p className="text-xs text-slate-500 italic">No major SEO issues flagged.</p>}
                                </div>
                            </div>
                         </div>

                        <div className="pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold text-sm">
                                <Palette className="w-4 h-4 text-pink-400" /> Detected Palette
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                {data.colors?.map((color, i) => (
                                    <div key={i} className="group relative">
                                        <div 
                                            className="w-10 h-10 rounded-full border-2 border-slate-600/50 shadow-lg cursor-pointer transition-transform hover:scale-110"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                            onClick={() => {
                                                navigator.clipboard.writeText(color);
                                                onNotification(`Color code ${color} copied to buffer`, 'success');
                                            }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold text-sm">
                                <Type className="w-4 h-4 text-indigo-400" /> Typography
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.fonts?.map((font, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono text-slate-300">
                                        {cleanText(font)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Actionable Insights */}
        <div className="glass-panel rounded-xl p-6 flex flex-col animate-fade-in-up delay-300 glass-card-hover">
             <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 tracking-tight">
                <TrendingUp className="w-5 h-5 text-tech-accent" /> Technical Insights
            </h3>
            <div className="space-y-6 flex-1">
                
                <div>
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2 mb-3 uppercase tracking-wider bg-amber-900/10 p-2 rounded w-fit">
                        <AlertTriangle className="w-4 h-4" /> Red Flags
                    </h4>
                    <div className="space-y-3">
                        {data.red_flags?.map((flag, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 shadow-[0_0_5px_#f59e0b]"></span>
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">{cleanText(flag)}</p>
                            </div>
                        )) || <p className="text-slate-500 text-sm italic">No critical vulnerabilities detected.</p>}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-green-400 flex items-center gap-2 mb-3 uppercase tracking-wider bg-green-900/10 p-2 rounded w-fit">
                        <CheckCircle2 className="w-4 h-4" /> System Hardening
                    </h4>
                    <div className="space-y-3">
                        {data.improvements?.map((imp, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 shadow-[0_0_5px_#22c55e]"></span>
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">{cleanText(imp)}</p>
                            </div>
                        )) || <p className="text-slate-500 text-sm italic">System is optimized.</p>}
                    </div>
                </div>

            </div>
        </div>
      </div>
      
      <div className="flex items-start gap-3 p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
            <strong>Disclaimer:</strong> This is a passive scan based on public headers and frontend code. It is not a replacement for a full penetration test.
        </p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
    title: string, 
    value: string, 
    icon: React.ReactNode, 
    delay: string, 
    desc: string,
    onCopy: (msg: string, type: 'success') => void
}> = ({title, value, icon, delay, desc, onCopy}) => (
    <div className={`glass-panel p-5 rounded-xl flex items-start gap-4 animate-fade-in-up ${delay} glass-card-hover group relative`}>
        <button 
            onClick={() => {
                navigator.clipboard.writeText(value);
                onCopy(`DATA_BUFFERED: ${title} copied.`, 'success');
            }}
            className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-400 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:text-white hover:bg-slate-700 md:opacity-0 opacity-100" 
            title="Copy Data"
        >
            <Copy className="w-3 h-3" />
        </button>
        <div className="p-3 bg-slate-800 rounded-xl shadow-inner group-hover:scale-105 transition-transform duration-300">{icon}</div>
        <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1 truncate">{title}</p>
            <p className="text-white font-bold text-lg truncate tracking-tight mb-1 font-mono" title={value}>{value}</p>
            <p className="text-[10px] text-slate-500 leading-tight font-medium truncate">{desc}</p>
        </div>
    </div>
);

export default AnalysisDashboard;


import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Activity, Eye, AlertOctagon, AlertTriangle, Search, Cpu, Scale, X, Lock } from 'lucide-react';
import { ReportType, UrlCategory } from '../types';
import { validateUrl } from '../utils/urlValidator';

interface LandingPageProps {
  onStartAnalysis: (url: string, type: ReportType) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  const [url, setUrl] = useState('');
  const [selectedType, setSelectedType] = useState<ReportType>(ReportType.DEEP_DIVE);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [agreedToEthics, setAgreedToEthics] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Parallax Effect Calculation - Disabled on Mobile
  useEffect(() => {
    const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; 
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 10, // Reduced intensity
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setWarning('');

    if (!url.trim()) {
      setError('Target URL is required.');
      return;
    }
    
    if (!agreedToEthics) {
        setError('Acknowledgment of authorized use is required.');
        return;
    }

    const validation = validateUrl(url);

    if (!validation.isValid) {
        setError(validation.message || 'Invalid URL provided.');
        return;
    }

    if ((validation.category === UrlCategory.SHORT_URL || validation.category === UrlCategory.IP_ADDRESS) && !warning) {
        setWarning(validation.message || 'Proceed with caution.');
        return;
    }

    onStartAnalysis(validation.cleanUrl, selectedType);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#020617] text-slate-200 font-sans flex items-center justify-center p-4">
      
      {/* --- 3D BACKGROUND WORLD --- */}
      <div className="absolute inset-0 pointer-events-none perspective-[1000px] z-0">
        {/* Starfield */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-black opacity-80"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        
        {/* Moving Digital Floor */}
        <div className="absolute bottom-0 left-[-50%] right-[-50%] h-[50vh] bg-[linear-gradient(transparent_0%,_rgba(56,189,248,0.1)_1px,_transparent_1px),_linear-gradient(90deg,transparent_0%,_rgba(56,189,248,0.1)_1px,_transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_translateY(0)] animate-[scan_10s_linear_infinite] opacity-30 origin-bottom"></div>
        
        {/* Glow Horizon */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-sky-900/20 to-transparent blur-[100px]"></div>
      </div>

      <style>{`
        @keyframes rotate3d {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        .perspective-container {
          perspective: 2000px;
        }
        .rotate-card {
          transition: transform 0.1s ease-out;
          transform-style: preserve-3d;
        }
      `}</style>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-xl perspective-container flex items-center justify-center">
        
        {/* INTERACTION PANEL */}
        <div 
            className={`w-full ${!isMobile ? 'rotate-card' : ''}`}
            style={!isMobile ? { transform: `translateZ(20px) rotateX(${mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)` } : {}}
        >
            <div className="glass-panel rounded-2xl p-0.5 border-t border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/60">
                <div className="bg-[#0b1221]/90 rounded-xl p-6 md:p-10 border border-slate-800/50 relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="text-center md:text-left mb-8 md:mb-10 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/30 border border-sky-500/20 text-sky-400 text-[10px] font-mono font-bold tracking-widest mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                            SYSTEM READY // V3.0
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 font-sans text-glow leading-tight">
                            THIRD <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500">EYE</span>
                        </h1>
                        <p className="text-lg md:text-2xl font-light text-slate-300 mb-4 tracking-tight">
                            The Unseen Architecture, <span className="text-white font-medium">Revealed.</span>
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0">
                            Third Eye is the forensic intelligence layer for the modern web. We expose hidden stacks, security vectors, and shadow sessions in milliseconds.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* URL Input */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                            <div className="relative flex items-center bg-slate-950 rounded-lg border border-slate-700 p-1 shadow-inner focus-within:border-sky-500/50 transition-colors">
                                <div className="pl-4 text-slate-500 group-focus-within:text-sky-400 transition-colors">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    value={url}
                                    onChange={(e) => { setUrl(e.target.value); setError(''); setWarning(''); }}
                                    placeholder="Enter Target URL (e.g. deodap.com)"
                                    className="flex-1 bg-transparent text-white px-3 py-4 md:px-4 focus:outline-none font-mono text-xs md:text-sm placeholder:text-slate-600 w-full"
                                />
                                <div className="hidden sm:block pr-4">
                                    <span className="text-[10px] font-bold text-slate-400 px-2 py-1 rounded border border-slate-700 bg-slate-900 tracking-wider">HTTPS</span>
                                </div>
                            </div>
                        </div>

                        {/* Report Type Selection */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedType(ReportType.SUMMARY)}
                                className={`p-3 md:p-4 rounded-lg border text-left transition-all duration-300 relative overflow-hidden group ${
                                    selectedType === ReportType.SUMMARY 
                                    ? 'bg-slate-800/80 border-sky-500/50 ring-1 ring-sky-500/20' 
                                    : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800'
                                }`}
                            >
                                <div className="relative z-10">
                                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${selectedType === ReportType.SUMMARY ? 'text-sky-400' : 'text-slate-500'}`}>Executive</div>
                                    <div className="font-bold text-white text-xs md:text-sm tracking-tight">Summary</div>
                                </div>
                                {selectedType === ReportType.SUMMARY && <div className="absolute right-0 top-0 w-16 h-16 bg-sky-500/10 blur-xl rounded-full translate-x-4 -translate-y-4"></div>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedType(ReportType.DEEP_DIVE)}
                                className={`p-3 md:p-4 rounded-lg border text-left transition-all duration-300 relative overflow-hidden group ${
                                    selectedType === ReportType.DEEP_DIVE 
                                    ? 'bg-slate-800/80 border-purple-500/50 ring-1 ring-purple-500/20' 
                                    : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800'
                                }`}
                            >
                                <div className="relative z-10">
                                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${selectedType === ReportType.DEEP_DIVE ? 'text-purple-400' : 'text-slate-500'}`}>Forensic</div>
                                    <div className="font-bold text-white text-xs md:text-sm tracking-tight">Deep Dive</div>
                                </div>
                                {selectedType === ReportType.DEEP_DIVE && <div className="absolute right-0 top-0 w-16 h-16 bg-purple-500/10 blur-xl rounded-full translate-x-4 -translate-y-4"></div>}
                            </button>
                        </div>

                        {/* Ethics Checkbox */}
                        <div className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                             <div className="relative flex items-center mt-0.5">
                                <input
                                    type="checkbox"
                                    id="ethics-agree"
                                    checked={agreedToEthics}
                                    onChange={(e) => setAgreedToEthics(e.target.checked)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-800 checked:border-sky-500 checked:bg-sky-500 transition-all shrink-0"
                                />
                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                </div>
                             </div>
                             <label htmlFor="ethics-agree" className="text-xs text-slate-400 cursor-pointer select-none leading-relaxed">
                                I confirm I have authorization to audit this target and agree to the <button type="button" onClick={() => setShowPolicy(true)} className="text-sky-400 font-bold underline decoration-sky-500/30 underline-offset-2 hover:text-sky-300 transition-colors">ethical use policy</button>.
                             </label>
                        </div>

                        {/* Action Button */}
                        <button 
                            type="submit"
                            className={`group relative w-full overflow-hidden rounded-xl p-[1px] transition-all duration-300 active:scale-[0.99] ${agreedToEthics ? 'shadow-[0_0_20px_rgba(56,189,248,0.2)]' : 'opacity-70 cursor-not-allowed'}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r from-sky-500 via-purple-500 to-sky-500 bg-[length:200%_100%] transition-all duration-1000 ${agreedToEthics ? 'animate-shimmer' : ''}`}></div>
                            <div className="relative flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-white transition-all hover:bg-transparent">
                                <span className="font-bold tracking-widest text-sm uppercase">Initialize Scan</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </div>
                        </button>
                    </form>

                    {/* Messages */}
                    {error && (
                        <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-200 animate-fade-in-up">
                            <AlertOctagon className="h-5 w-5 shrink-0 text-red-500" />
                            <span className="text-xs font-bold">{error}</span>
                        </div>
                    )}
                    {warning && (
                        <div className="mt-4 flex items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-yellow-200 animate-fade-in-up">
                            <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
                            <span className="text-xs font-bold">{warning} <span className="opacity-70 ml-1 font-normal">(Click Initialize again to proceed)</span></span>
                        </div>
                    )}
                </div>
                
                {/* Footer Stats - Mobile Stack / Desktop Grid */}
                <div className="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800 bg-slate-950/50">
                    <div className="p-3 md:p-4 text-center group cursor-default hover:bg-slate-900/50 transition-colors">
                        <Activity className="mx-auto mb-2 h-4 w-4 md:h-5 md:w-5 text-sky-500/50 group-hover:text-sky-400 transition-colors" />
                        <div className="text-[8px] md:text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-1">Latency</div>
                        <div className="text-[10px] md:text-xs text-white font-mono">Real-time</div>
                    </div>
                    <div className="p-3 md:p-4 text-center group cursor-default hover:bg-slate-900/50 transition-colors">
                        <Cpu className="mx-auto mb-2 h-4 w-4 md:h-5 md:w-5 text-purple-500/50 group-hover:text-purple-400 transition-colors" />
                        <div className="text-[8px] md:text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-1">Engine</div>
                        <div className="text-[10px] md:text-xs text-white font-mono">Gemini 3 Pro</div>
                    </div>
                    <div className="p-3 md:p-4 text-center group cursor-default hover:bg-slate-900/50 transition-colors">
                        <ShieldCheck className="mx-auto mb-2 h-4 w-4 md:h-5 md:w-5 text-green-500/50 group-hover:text-green-400 transition-colors" />
                        <div className="text-[8px] md:text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-1">Protocol</div>
                        <div className="text-[10px] md:text-xs text-white font-mono">Passive</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Decorative Corner Text - Hidden on Mobile */}
      <div className="absolute bottom-6 left-6 hidden md:block text-[10px] text-slate-600 font-mono">
        SYSTEM_ID: TE-9942-X<br/>
        NODE: US-EAST-1
      </div>

      {/* --- ETHICAL POLICY MODAL --- */}
      {showPolicy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
              <div className="bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="p-4 md:p-6 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-3">
                          <Scale className="w-5 h-5 text-sky-400" />
                          <h3 className="font-bold text-sm md:text-lg text-white tracking-tight">ETHICAL USE PROTOCOL & DISCLAIMER</h3>
                      </div>
                      <button onClick={() => setShowPolicy(false)} className="text-slate-500 hover:text-white transition-colors p-2">
                          <X className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-4 md:p-6 overflow-y-auto space-y-6 text-sm text-slate-300 font-sans leading-relaxed custom-scrollbar">
                      
                      <div className="bg-sky-900/10 border border-sky-500/20 p-4 rounded-lg">
                          <p className="text-xs text-sky-300 font-bold uppercase tracking-wider mb-2">Status: Active Mandate</p>
                          <p>The Third Eye system is a professional-grade forensic analysis tool. Access is granted strictly on the condition of adherence to the following terms.</p>
                      </div>

                      <section>
                          <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                              <Lock className="w-4 h-4 text-slate-500" /> 1. Authorization & Ownership
                          </h4>
                          <p className="text-slate-400 pl-6">
                              You certify that you are the verified owner of the target URL or possess explicit, written authorization from the system administrator to perform architectural analysis. Unauthorized scanning of third-party infrastructure is a violation of the Computer Fraud and Abuse Act (CFAA) and international cyber laws.
                          </p>
                      </section>

                      <section>
                          <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                              <Eye className="w-4 h-4 text-slate-500" /> 2. Scope of Analysis
                          </h4>
                          <p className="text-slate-400 pl-6">
                              This tool performs <strong>passive reconnaissance</strong> only. It analyzes public headers, DOM structure, and client-side assets. It does <strong>not</strong> perform active penetration testing, SQL injection, XSS attacks, or denial-of-service simulations.
                          </p>
                      </section>

                      <section>
                          <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                              <ShieldCheck className="w-4 h-4 text-slate-500" /> 3. Liability & Indemnification
                          </h4>
                          <p className="text-slate-400 pl-6">
                              The creators of Third Eye assume no liability for misuse of this tool or any downtime/disruption caused to target systems. The user assumes full legal responsibility for all actions taken using this generated intelligence.
                          </p>
                      </section>

                       <section>
                          <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-slate-500" /> 4. Data Privacy
                          </h4>
                          <p className="text-slate-400 pl-6">
                              Analysis data is processed in real-time via Google Gemini API. While no data is persistently stored on our servers, sensitive architectural details are transmitted to the AI provider for processing. Do not scan URLs containing PII or classified government data.
                          </p>
                      </section>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 md:p-6 border-t border-slate-700 bg-slate-900/50 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                      <button 
                          onClick={() => setShowPolicy(false)}
                          className="px-4 py-2 text-slate-400 hover:text-white font-medium text-sm order-2 sm:order-1"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={() => {
                              setAgreedToEthics(true);
                              setShowPolicy(false);
                          }}
                          className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg shadow-lg shadow-sky-500/20 transition-all active:scale-95 text-sm uppercase tracking-wide order-1 sm:order-2 w-full sm:w-auto"
                      >
                          I Acknowledge & Agree
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LandingPage;


import React, { useState, useEffect } from 'react';
import { LayoutGrid, ShoppingCart, MessageSquare, FileText, PlusCircle, Eye } from 'lucide-react';
import { AnalysisSection } from '../types';

interface NavbarProps {
  activeSection: AnalysisSection;
  onNavigate: (section: AnalysisSection) => void;
  currentUrl?: string;
  onNewScan: () => void;
  showCommerceOption: boolean;
  isAnalysisSuccess: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, currentUrl, onNewScan, showCommerceOption, isAnalysisSuccess }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="w-72 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 hidden md:flex z-50 shadow-2xl font-sans">
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3 text-tech-accent mb-3">
            <div className="bg-tech-accent/10 p-2 rounded-lg border border-tech-accent/20">
                <Eye className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-black tracking-tight text-white leading-none mb-1">THIRD EYE</h1>
                <span className="text-[10px] text-slate-400 font-bold tracking-[0.25em] uppercase block">Forensic Vision</span>
            </div>
        </div>
        {currentUrl ? (
            <div className={`mt-4 rounded-lg p-3 border backdrop-blur-sm ${isAnalysisSuccess ? 'bg-slate-800/40 border-slate-700/50' : 'bg-red-900/20 border-red-500/30'}`}>
                <p className={`text-[10px] uppercase tracking-wider mb-1 font-bold ${isAnalysisSuccess ? 'text-slate-500' : 'text-red-400'}`}>
                    {isAnalysisSuccess ? 'Target Locked' : 'Target Unreachable'}
                </p>
                <p className="text-xs text-white font-mono truncate select-all" title={currentUrl}>
                    {currentUrl.replace('https://', '').replace('http://', '')}
                </p>
            </div>
        ) : (
             <p className="text-xs text-slate-500 mt-2 font-medium">System Ready</p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="px-4 pb-2 pt-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em]">Modules</p>
        </div>
        <NavItem 
          active={activeSection === AnalysisSection.DASHBOARD} 
          onClick={() => onNavigate(AnalysisSection.DASHBOARD)}
          icon={<LayoutGrid className="w-5 h-5" />}
          label="System Dashboard"
          desc="Stack & Security Overview"
        />
        
        {isAnalysisSuccess && showCommerceOption && (
            <NavItem 
            active={activeSection === AnalysisSection.COMMERCE_AUDIT} 
            onClick={() => onNavigate(AnalysisSection.COMMERCE_AUDIT)}
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Commerce Logic"
            desc="Ghost Session Analysis"
            />
        )}

        {isAnalysisSuccess && (
            <NavItem 
            active={activeSection === AnalysisSection.ASK_ARCHITECT} 
            onClick={() => onNavigate(AnalysisSection.ASK_ARCHITECT)}
            icon={<MessageSquare className="w-5 h-5" />}
            label="Ask Third Eye"
            desc="AI Technical Query"
            />
        )}

        <NavItem 
          active={activeSection === AnalysisSection.REPORT_GEN} 
          onClick={() => onNavigate(AnalysisSection.REPORT_GEN)}
          icon={<FileText className="w-5 h-5" />}
          label="Generate Report"
          desc="Export Findings"
        />
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4 bg-slate-900/40">
         <button 
            onClick={onNewScan}
            className="w-full flex items-center justify-center gap-2 bg-tech-accent hover:bg-sky-400 text-slate-900 text-sm font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95 group tracking-wide"
         >
            <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" /> New Analysis
         </button>

        <div className="flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-help" title={isOnline ? "System is operational" : "Network connection lost"}>
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <p className="text-slate-500 text-[10px] font-bold tracking-wide">
                {isOnline ? 'System Online v3.0' : 'Network Offline'}
            </p>
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string, desc: string}> = ({active, onClick, icon, label, desc}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group text-left ${
      active 
        ? 'bg-tech-accent/10 text-white border border-tech-accent/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
    }`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-tech-accent shadow-[0_0_10px_#38bdf8]"></div>}
    <div className={`mt-0.5 ${active ? 'text-tech-accent' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {icon}
    </div>
    <div>
        <span className={`font-bold text-sm block tracking-tight ${active ? 'text-white' : 'text-slate-300'}`}>{label}</span>
        <span className={`text-[10px] block mt-0.5 font-medium ${active ? 'text-blue-200/70' : 'text-slate-600'}`}>{desc}</span>
    </div>
  </button>
);

export default Navbar;

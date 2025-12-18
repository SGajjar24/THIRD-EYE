
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AnalysisDashboard from './components/AnalysisDashboard';
import CheckoutFlowDiagram from './components/CheckoutFlowDiagram';
import LiveCheckoutPrototype from './components/LiveCheckoutPrototype';
import AskTheArchitect from './components/AskTheArchitect';
import LandingPage from './components/LandingPage';
import ReportGenerator from './components/ReportGenerator';
import { AnalysisSection, ReportType, AnalysisData } from './types';
import { generateTechAnalysis } from './services/gemini';
import { Menu, Eye, Bell, Terminal, Cpu, X, AlertOctagon, CheckCircle2, AlertTriangle } from 'lucide-react';

// Toast Type
type NotificationType = 'success' | 'error' | 'info';
interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

const App: React.FC = () => {
    const [targetUrl, setTargetUrl] = useState<string>('');
    const [reportType, setReportType] = useState<ReportType>(ReportType.DEEP_DIVE);
    const [activeSection, setActiveSection] = useState<AnalysisSection>(AnalysisSection.DASHBOARD);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Lifted State
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(false);

    // Notification State
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = (message: string, type: NotificationType = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    };

    const handleStartAnalysis = (url: string, type: ReportType) => {
        setTargetUrl(url);
        setReportType(type);
        setActiveSection(AnalysisSection.DASHBOARD);
        setIsMobileMenuOpen(false); // Ensure menu is closed when analysis starts
    };

    const handleNewScan = () => {
        setTargetUrl('');
        setAnalysisData(null);
        setActiveSection(AnalysisSection.DASHBOARD);
        setIsMobileMenuOpen(false); // Ensure menu is closed when resetting
    };

    // Fetch data whenever URL or Report Type changes
    useEffect(() => {
        const fetchData = async () => {
            if (!targetUrl) return;
            setLoading(true);
            // Minimal artificial delay for UX feeling of "Scanning"
            await new Promise(r => setTimeout(r, 2000));
            const result = await generateTechAnalysis(targetUrl, reportType);
            setAnalysisData(result);
            setLoading(false);

            if (result.status === 'SUCCESS') {
                showNotification('Forensic Analysis Complete', 'success');
            } else {
                showNotification('Analysis Encountered Errors', 'error');
            }
        };

        fetchData();
    }, [targetUrl, reportType]);

    // Render Landing Page if no URL is selected
    if (!targetUrl) {
        return <LandingPage onStartAnalysis={handleStartAnalysis} />;
    }

    const isAnalysisSuccess = analysisData?.status === 'SUCCESS';

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-tech-accent/30 relative overflow-x-hidden">
            {/* Background Grid Layer */}
            <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0"></div>

            {/* Notifications Layer - Optimized for Mobile */}
            <div className="fixed bottom-6 right-6 left-6 md:left-auto z-[100] flex flex-col gap-3 pointer-events-none">
                {notifications.map(n => (
                    <div key={n.id} className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in-up w-full md:min-w-[300px] md:w-auto">
                        {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                        {n.type === 'error' && <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />}
                        {n.type === 'info' && <Terminal className="w-5 h-5 text-tech-accent shrink-0" />}
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5 truncate">System Notification</p>
                            <p className="text-sm font-bold text-white tracking-wide break-words">{n.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Navbar
                activeSection={activeSection}
                onNavigate={setActiveSection}
                currentUrl={targetUrl}
                onNewScan={handleNewScan}
                // Always show the option if data exists so user can see "No Commerce Detected" message if applicable
                showCommerceOption={!!analysisData}
                isAnalysisSuccess={isAnalysisSuccess}
            />

            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900/90 backdrop-blur-md border-b border-tech-border p-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-tech-accent" />
                    <span className="font-bold text-white tracking-tight">THIRD EYE</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 p-1">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-lg p-6 animate-fade-in-up flex flex-col h-[100dvh]">
                    <div className="flex justify-end mb-6">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 border border-slate-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="space-y-4 flex-1 overflow-y-auto">
                        <button onClick={() => { setActiveSection(AnalysisSection.DASHBOARD); setIsMobileMenuOpen(false) }} className="block w-full text-left p-4 bg-slate-800 rounded text-white border border-slate-700 font-bold active:bg-slate-700">Stack Overview</button>
                        {analysisData && isAnalysisSuccess && (
                            <button onClick={() => { setActiveSection(AnalysisSection.COMMERCE_AUDIT); setIsMobileMenuOpen(false) }} className="block w-full text-left p-4 bg-slate-800 rounded text-white border border-slate-700 font-bold active:bg-slate-700">Commerce Audit</button>
                        )}
                        {isAnalysisSuccess && (
                            <button onClick={() => { setActiveSection(AnalysisSection.ASK_ARCHITECT); setIsMobileMenuOpen(false) }} className="block w-full text-left p-4 bg-slate-800 rounded text-white border border-slate-700 font-bold active:bg-slate-700">Ask Third Eye</button>
                        )}
                        <button onClick={() => { setActiveSection(AnalysisSection.REPORT_GEN); setIsMobileMenuOpen(false) }} className="block w-full text-left p-4 bg-slate-800 rounded text-white border border-slate-700 font-bold active:bg-slate-700">Generate Report</button>
                        <button onClick={handleNewScan} className="block w-full text-left p-4 bg-red-900/20 border border-red-500/50 rounded text-red-400 mt-8 font-bold active:bg-red-900/30">New Scan</button>
                    </div>
                </div>
            )}

            <main className="md:ml-72 p-4 md:p-6 lg:p-10 max-w-7xl mx-auto relative z-10 transition-all duration-300">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 border-b border-slate-800/60 pb-4 gap-4">
                    <div className="animate-fade-in-up w-full md:w-auto">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-glow">
                                {activeSection === AnalysisSection.DASHBOARD && "System Analysis"}
                                {activeSection === AnalysisSection.COMMERCE_AUDIT && "Commerce Logic"}
                                {activeSection === AnalysisSection.ASK_ARCHITECT && "AI Console"}
                                {activeSection === AnalysisSection.REPORT_GEN && "Report Gen"}
                            </h2>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border backdrop-blur-sm ${reportType === ReportType.DEEP_DIVE
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                {reportType === ReportType.DEEP_DIVE ? 'Deep Dive' : 'Summary'}
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs md:text-sm font-mono flex items-center gap-2 truncate max-w-[300px] md:max-w-none">
                            <Terminal className="w-3 h-3 shrink-0" />
                            TARGET: <span className="text-white truncate">{targetUrl}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4 animate-fade-in-up delay-100 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700 backdrop-blur-sm">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isAnalysisSuccess ? 'bg-red-500' : 'bg-slate-500'}`}></div>
                            <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">Live Connection</span>
                        </div>
                        <button className="p-2 bg-slate-800/50 rounded-full text-slate-400 hover:text-white transition-colors relative border border-slate-700 hover:border-tech-accent/50">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-tech-accent rounded-full shadow-[0_0_8px_#38bdf8]"></span>
                        </button>
                    </div>
                </header>

                <div className="min-h-[calc(100vh-14rem)] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] glass-panel rounded-xl relative overflow-hidden border border-tech-accent/20 m-4 md:m-0">
                            <div className="scanline"></div>
                            <div className="relative w-24 h-24 md:w-32 md:h-32 mb-8">
                                <div className="absolute inset-0 border-t-2 border-tech-accent rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin [animation-duration:3s]"></div>
                                <div className="absolute inset-4 border-b-2 border-green-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
                                <Cpu className="absolute inset-0 m-auto w-10 h-10 text-white/80 animate-pulse" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-mono text-white animate-pulse uppercase tracking-[0.2em] font-bold text-center px-4">Initializing Third Eye</h2>
                            <div className="mt-6 space-y-2 text-center w-48 md:w-64">
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-tech-accent animate-[width_2s_ease-in-out_infinite] w-1/2"></div>
                                </div>
                                <p className="text-tech-accent font-mono text-xs pt-2">&gt;&gt; Decrypting Headers...</p>
                                <p className="text-slate-400 font-mono text-xs delay-100 opacity-70">&gt;&gt; Analyzing Tech Stack...</p>
                            </div>
                        </div>
                    ) : !isAnalysisSuccess && analysisData ? (
                        // FAILED ANALYSIS STATE
                        <div className="bg-tech-panel border border-red-900/50 rounded-lg p-6 md:p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6 border border-red-500/20 animate-pulse">
                                <AlertOctagon className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Target Unreachable</h2>
                            <p className="text-slate-400 max-w-md mb-6 leading-relaxed text-sm">
                                {analysisData.error_summary || "The URL provided could not be resolved or analyzed. It may be non-existent, a placeholder, or blocked by security protocols."}
                            </p>

                            {activeSection === AnalysisSection.REPORT_GEN ? (
                                <div className="w-full max-w-4xl">
                                    <ReportGenerator currentUrl={targetUrl} data={analysisData} onNotification={showNotification} />
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={handleNewScan}
                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-600 transition-colors font-bold text-sm tracking-wide uppercase w-full sm:w-auto"
                                    >
                                        Try Different URL
                                    </button>
                                    <button
                                        onClick={() => setActiveSection(AnalysisSection.REPORT_GEN)}
                                        className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/50 rounded transition-colors font-bold text-sm tracking-wide uppercase w-full sm:w-auto"
                                    >
                                        Generate Failure Report
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // SUCCESS STATE
                        <div className="animate-fade-in-up w-full">
                            {activeSection === AnalysisSection.DASHBOARD && analysisData && <AnalysisDashboard data={analysisData} onNotification={showNotification} />}
                            {activeSection === AnalysisSection.COMMERCE_AUDIT && analysisData && (
                                <div className="space-y-6 md:space-y-8">
                                    <CheckoutFlowDiagram strategyText={analysisData.checkout_strategy} isEcommerce={analysisData.is_ecommerce} />
                                    {/* Only show the interactive prototype if commerce is detected */}
                                    {analysisData.is_ecommerce && <LiveCheckoutPrototype targetUrl={targetUrl} />}
                                </div>
                            )}
                            {activeSection === AnalysisSection.ASK_ARCHITECT && <AskTheArchitect currentUrl={targetUrl} />}
                            {activeSection === AnalysisSection.REPORT_GEN && <ReportGenerator currentUrl={targetUrl} data={analysisData} onNotification={showNotification} />}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;


import React, { useState, useEffect } from 'react';
import { ShoppingCart, Database, Server, RefreshCw, Zap, UserCheck, Activity, Terminal, Play, Save } from 'lucide-react';
import { GhostSession } from '../types';

interface LiveCheckoutPrototypeProps {
    targetUrl: string;
}

const LiveCheckoutPrototype: React.FC<LiveCheckoutPrototypeProps> = ({ targetUrl }) => {
  // --- SIMULATED BACKEND STATE ---
  const [dbLogs, setDbLogs] = useState<string[]>([]);
  const [ghostSession, setGhostSession] = useState<GhostSession | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- FRONTEND STATE ---
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  const cleanDomain = targetUrl.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
  
  const STORAGE_KEY_DEVICE = `sim_device_id_${cleanDomain}`;
  const STORAGE_KEY_SESSION_PREFIX = `session_${cleanDomain}_`;

  const logToDb = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDbLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 20)]);
  };

  // 1. INITIALIZATION
  useEffect(() => {
    const initSession = async () => {
      logToDb(`System: Analyzing device fingerprint...`);
      
      await new Promise(r => setTimeout(r, 800));
      
      let deviceId = localStorage.getItem(STORAGE_KEY_DEVICE);
      if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substr(2, 6);
        localStorage.setItem(STORAGE_KEY_DEVICE, deviceId);
        logToDb(`New Device ID Generated: ${deviceId}`);
      } else {
        logToDb(`Existing Device Recognized: ${deviceId}`);
      }

      const existingSession = localStorage.getItem(`${STORAGE_KEY_SESSION_PREFIX}${deviceId}`);
      if (existingSession) {
        const parsed = JSON.parse(existingSession);
        setGhostSession(parsed);
        setFormData(parsed.customerData);
        logToDb("Ghost Session Found: Restoring shadow cart data.");
      } else {
        const newSession: GhostSession = {
          sessionId: 'sess_' + Math.random().toString(36).substr(2, 9),
          deviceId: deviceId,
          lastActive: new Date().toISOString(),
          cartItems: [],
          customerData: { email: '', phone: '', address: '', city: '' }
        };
        setGhostSession(newSession);
        localStorage.setItem(`${STORAGE_KEY_SESSION_PREFIX}${deviceId}`, JSON.stringify(newSession));
        logToDb("No Session Found: Initializing new ghost session.");
      }
    };

    initSession();
  }, [targetUrl]);

  // 2. REAL-TIME SYNC
  useEffect(() => {
    if (!ghostSession) return;

    const timer = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(ghostSession.customerData)) {
        setIsSyncing(true);
        logToDb(`Input Stream: Capturing PII fragments...`);
        
        setTimeout(() => {
          const updatedSession = {
            ...ghostSession,
            customerData: formData,
            lastActive: new Date().toISOString()
          };
          setGhostSession(updatedSession);
          localStorage.setItem(`${STORAGE_KEY_SESSION_PREFIX}${ghostSession.deviceId}`, JSON.stringify(updatedSession));
          logToDb("DB Write: Ghost session updated successfully.");
          setIsSyncing(false);
        }, 600);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, ghostSession]);

  const handleAddToCart = () => {
    if (!ghostSession) return;
    logToDb(`Event: Cart Payload Injected via Control Panel.`);
    const updatedSession = {
      ...ghostSession,
      cartItems: [...ghostSession.cartItems, { id: 101, name: "Third Eye Enterprise License", price: 199 }]
    };
    setGhostSession(updatedSession);
    localStorage.setItem(`${STORAGE_KEY_SESSION_PREFIX}${ghostSession.deviceId}`, JSON.stringify(updatedSession));
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY_DEVICE);
    const keys = Object.keys(localStorage);
    keys.forEach(k => { if(k.startsWith(STORAGE_KEY_SESSION_PREFIX)) localStorage.removeItem(k)});
    setGhostSession(null);
    setDbLogs([]);
    setFormData({ email: '', phone: '', address: '', city: '' });
    logToDb("System: Purging local storage and resetting simulation...");
    setTimeout(() => {
         const deviceId = 'dev_' + Math.random().toString(36).substr(2, 6);
         localStorage.setItem(STORAGE_KEY_DEVICE, deviceId);
         const newSession: GhostSession = {
            sessionId: 'sess_' + Math.random().toString(36).substr(2, 9),
            deviceId: deviceId,
            lastActive: new Date().toISOString(),
            cartItems: [],
            customerData: { email: '', phone: '', address: '', city: '' }
          };
          setGhostSession(newSession);
          localStorage.setItem(`${STORAGE_KEY_SESSION_PREFIX}${deviceId}`, JSON.stringify(newSession));
          logToDb(`New Device ID Generated: ${deviceId}`);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 animate-fade-in-up">
      
      {/* LEFT PANEL: SIMULATION CONTROLS */}
      <div className="space-y-6">
         <div className="glass-panel p-4 md:p-6 rounded-xl border border-tech-border h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                <div className="p-2 bg-tech-accent/10 rounded-lg">
                    <Activity className="w-5 h-5 text-tech-accent" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-white truncate">Simulation Controller</h3>
                    <p className="text-xs text-slate-400 truncate">Target: {cleanDomain}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 shrink-0">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-mono text-slate-300">ACTIVE</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* 1. Payload Injection */}
                <div className="bg-slate-800/40 rounded-lg p-4 md:p-5 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                             <ShoppingCart className="w-4 h-4 text-sky-400" />
                             <h4 className="text-sm font-bold text-slate-200">Session State Injection</h4>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                             <p className="text-xs text-slate-400 leading-relaxed mb-3">
                                Simulates a "Guest Add-to-Cart" event. This tests if the backend assigns a persistent shadow ID to the browser fingerprint without login.
                             </p>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                                    Payload: item_id:101
                                </span>
                                {ghostSession?.cartItems.length ? (
                                    <span className="text-[10px] font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-500/30">
                                        INJECTED ({ghostSession.cartItems.length})
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">IDLE</span>
                                )}
                             </div>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="w-full sm:w-auto shrink-0 px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-sky-900/20 active:scale-95 transition-all flex sm:flex-col flex-row justify-center items-center gap-2 sm:gap-1 min-w-[80px]"
                        >
                            <Play className="w-4 h-4 fill-white" />
                            INJECT
                        </button>
                    </div>
                </div>

                {/* 2. Data Stream */}
                <div className="bg-slate-800/40 rounded-lg p-4 md:p-5 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4">
                         <Terminal className="w-4 h-4 text-purple-400" />
                         <h4 className="text-sm font-bold text-slate-200">Live Input Stream</h4>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">
                        Enter dummy data below. The forensic engine monitors for real-time synchronization with the "Ghost Session" storage.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Simulated Email</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-900/80 border border-slate-700 rounded p-2 text-xs text-white focus:border-tech-accent outline-none font-mono"
                                placeholder="user@test.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Simulated Phone</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-900/80 border border-slate-700 rounded p-2 text-xs text-white focus:border-tech-accent outline-none font-mono"
                                placeholder="+1 555 0199"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                         </div>
                         <div className="sm:col-span-2 space-y-1">
                             <label className="text-[10px] font-bold text-slate-500 uppercase">Location / Address Fragment</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-900/80 border border-slate-700 rounded p-2 text-xs text-white focus:border-tech-accent outline-none font-mono"
                                placeholder="123 Cyber Ave..."
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                         </div>
                    </div>
                </div>

                {/* 3. Persistence Check */}
                <div className="flex items-center gap-3 p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
                    <div className="p-2 bg-green-500/10 rounded-full">
                        <Save className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-green-400">Persistence Active</p>
                        <p className="text-[10px] text-slate-400">Session data survives page refresh.</p>
                    </div>
                </div>

            </div>
         </div>
      </div>

      {/* RIGHT PANEL: FORENSIC LOGS */}
      <div className="flex flex-col gap-6">
        
        {/* Logs */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col font-mono shadow-xl relative overflow-hidden h-[300px] md:h-[400px]">
             {/* Decorative header */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-purple-400" />
                    <div>
                        <h3 className="text-slate-200 font-bold text-sm">Backend Logs</h3>
                        <p className="text-[10px] text-slate-500">Live stream: port 443</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                     {isSyncing && <span className="text-[10px] text-sky-400 font-bold animate-pulse hidden sm:inline">SYNCING</span>}
                    <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-sky-400' : 'bg-green-500'}`}></div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 relative z-10 custom-scrollbar">
                {dbLogs.map((log, i) => (
                    <div key={i} className="text-xs border-l-2 border-slate-700 pl-3 py-1 hover:bg-slate-800/50 transition-colors">
                        <span className={
                            log.includes('Input') ? 'text-sky-400 font-bold' :
                            log.includes('Action') ? 'text-green-400 font-bold' :
                            log.includes('System') ? 'text-purple-400' : 'text-slate-400'
                        }>
                            {log}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* Database Visualizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 shadow-xl">
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-white font-bold text-sm">Ghost Session Storage</h3>
                </div>
                <button 
                    onClick={handleReset}
                    className="text-xs bg-slate-800 text-slate-300 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 flex items-center gap-2 transition-colors"
                >
                    <RefreshCw className="w-3 h-3" /> Flush DB
                </button>
            </div>

            <div className="bg-[#0f172a] p-4 md:p-5 rounded-xl border border-slate-800 overflow-hidden relative group min-h-[150px]">
                {ghostSession ? (
                    <pre className="text-xs text-green-400 overflow-x-auto font-mono leading-relaxed custom-scrollbar">
{JSON.stringify(ghostSession, null, 2)}
                    </pre>
                ) : (
                    <div className="text-slate-600 text-xs italic flex items-center gap-2 mt-8 justify-center">
                        <span className="w-2 h-2 bg-slate-600 rounded-full animate-ping"></span>
                        Listening for session handshake...
                    </div>
                )}
            </div>
            
             <div className="mt-5 p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl flex gap-4 items-start">
                <UserCheck className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                    <h4 className="text-purple-100 text-sm font-bold">Persistence Detected</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        The backend links the unique device fingerprint to a temporary Redis/DB entry. This allows "Abandon Cart Recovery" without user login.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LiveCheckoutPrototype;


import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, Mic, MicOff, AlertCircle } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToArchitect } from '../services/gemini';

interface AskTheArchitectProps {
    currentUrl: string;
    // We assume if this component is rendered, the URL is presumably valid, 
    // but if it was force-mounted or something went wrong, handle gracefully.
}

const AskTheArchitect: React.FC<AskTheArchitectProps> = ({ currentUrl }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `THIRD_EYE_CONSOLE_V1.0 initialized. Target: ${currentUrl}. Ready for forensic inquiries.`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const responseText = await sendMessageToArchitect(messages, input, currentUrl);

    const aiMsg: Message = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="bg-tech-panel border border-tech-border rounded-lg h-[calc(100vh-200px)] max-h-[700px] min-h-[400px] flex flex-col overflow-hidden shadow-xl">
      <div className="p-3 md:p-4 bg-slate-900 border-b border-tech-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
            <h2 className="text-white font-mono text-xs md:text-sm truncate max-w-[150px] md:max-w-none">THIRD_EYE_CONSOLE_V1.0</h2>
        </div>
        <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] text-green-500 font-mono tracking-wider hidden md:inline">GEMINI_3_PRO_LIVE</span>
             <span className="text-[10px] text-green-500 font-mono tracking-wider md:hidden">ONLINE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6 font-mono text-xs md:text-sm custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-purple-600' : 'bg-slate-600'}`}>
              {msg.role === 'model' ? <Bot className="w-3 h-3 md:w-5 md:h-5 text-white" /> : <User className="w-3 h-3 md:w-5 md:h-5 text-white" />}
            </div>
            <div className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${msg.role === 'model' ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-indigo-900/50 text-white border border-indigo-700'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
               <Bot className="w-3 h-3 md:w-5 md:h-5 text-white" />
            </div>
            <div className="bg-slate-800 p-2 md:p-3 rounded-lg border border-slate-700">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 md:p-4 bg-slate-900 border-t border-tech-border shrink-0">
        <div className="flex gap-2">
          <button
            onClick={handleVoiceInput}
            className={`p-2 md:p-3 rounded transition-all ${isListening ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
            title="Voice Input"
          >
            {isListening ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Ask about backend or security..."}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded p-2 md:p-3 focus:outline-none focus:border-tech-accent font-mono text-xs md:text-sm placeholder:truncate"
          />
          <button
            onClick={handleSend}
            disabled={isThinking}
            className="bg-tech-accent hover:bg-sky-500 text-tech-dark font-bold p-2 md:p-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient-right">
             {['Analyze auth flow', 'Check security headers', 'Mobile responsiveness audit'].map(q => (
                 <button key={q} onClick={() => setInput(q)} className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] md:text-xs rounded border border-slate-700 transition-colors">
                     {q}
                 </button>
             ))}
        </div>
      </div>
    </div>
  );
};

export default AskTheArchitect;

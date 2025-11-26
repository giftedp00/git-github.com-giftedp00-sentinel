import React, { useState, useEffect, useRef } from 'react';
import { Alert, MonitoringConfig, View, EmailLogEntry } from './types';
import DashboardStats from './components/DashboardStats';
import AlertFeed from './components/AlertFeed';
import EmailLogs from './components/EmailLogs';
import { fetchSimulatedPosts } from './services/monitorService';
import { 
  LayoutDashboard, 
  Radio, 
  Mail, 
  Settings, 
  Play, 
  Pause, 
  Search,
  Bell
} from 'lucide-react';

const INITIAL_KEYWORDS = ['depressed', 'fat'];
const INITIAL_EMAIL = 'mvulagp@gmail.com';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);
  const [config, setConfig] = useState<MonitoringConfig>({
    keywords: INITIAL_KEYWORDS,
    targetEmail: INITIAL_EMAIL,
    platforms: ['Twitter', 'Reddit', 'Instagram', 'Facebook', 'TikTok'],
    isMonitoring: false,
  });
  
  // Ref to track latest config in intervals
  const configRef = useRef(config);
  useEffect(() => { configRef.current = config; }, [config]);

  // Simulation Interval
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (config.isMonitoring) {
      // Simulate an initial check immediately
      handleScan();
      
      // Check every 30 seconds to avoid Rate Limiting (429)
      intervalId = setInterval(() => {
        handleScan();
      }, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.isMonitoring]);

  const handleScan = async () => {
    const currentConfig = configRef.current;
    
    // Call Gemini simulation
    const newPosts = await fetchSimulatedPosts(currentConfig.keywords);
    
    if (newPosts.length > 0) {
      setAlerts(prev => [...newPosts, ...prev]);
      
      // Trigger "Email Sending" for each new post
      newPosts.forEach(post => {
        sendSimulationEmail(post, currentConfig.targetEmail);
      });
    }
  };

  const sendSimulationEmail = (alert: Alert, recipient: string) => {
    const subject = `Keyword Alert – “${alert.keywordDetected}”`;
    const body = `
Keyword detected: ${alert.keywordDetected}

Platform: ${alert.platform}
Username: ${alert.username}
Timestamp: ${new Date(alert.timestamp).toLocaleString()}

Post:
${alert.content}

Link to post:
${alert.url}

Metadata:
- Likes: ${alert.metadata.likes}
- Comments: ${alert.metadata.comments}
- Shares: ${alert.metadata.shares}
    `.trim();

    const newLog: EmailLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      recipient,
      subject,
      body,
      triggerAlertId: alert.id,
    };

    setEmailLogs(prev => [newLog, ...prev]);
    
    // Update alert to show email sent
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, emailSent: true, emailSentAt: new Date().toISOString() } : a));
  };

  const toggleMonitoring = () => {
    setConfig(prev => ({ ...prev, isMonitoring: !prev.isMonitoring }));
  };

  const addKeyword = (word: string) => {
    if (word && !config.keywords.includes(word)) {
      setConfig(prev => ({ ...prev, keywords: [...prev.keywords, word] }));
    }
  };

  const removeKeyword = (word: string) => {
    setConfig(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== word) }));
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: View, icon: any, label: string }) => (
    <button
      onClick={() => setView(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        view === id 
          ? 'bg-slate-800 text-white' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {id === View.LIVE_FEED && alerts.length > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {alerts.length}
        </span>
      )}
      {id === View.EMAIL_LOGS && emailLogs.length > 0 && (
        <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {emailLogs.length}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans selection:bg-red-500/30">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-red-500 mb-1">
            <Bell className="animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-white">SENTINEL</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono">SOCIAL MONITORING AGENT</p>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarItem id={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id={View.LIVE_FEED} icon={Radio} label="Live Feed" />
          <SidebarItem id={View.EMAIL_LOGS} icon={Mail} label="Email Logs" />
          <SidebarItem id={View.SETTINGS} icon={Settings} label="Configuration" />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Agent Status</span>
              <span className={`w-2 h-2 rounded-full ${config.isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            </div>
            <button
              onClick={toggleMonitoring}
              className={`w-full flex items-center justify-center space-x-2 py-2 rounded font-semibold text-sm transition-all ${
                config.isMonitoring 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50' 
                  : 'bg-green-500 text-white hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
              }`}
            >
              {config.isMonitoring ? (
                <>
                  <Pause size={16} />
                  <span>STOP MONITORING</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>START MONITORING</span>
                </>
              )}
            </button>
            {config.isMonitoring && (
              <p className="text-[10px] text-center mt-2 text-slate-500 animate-pulse">
                Scanning active sources...
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 relative">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {view === View.DASHBOARD && 'Mission Control'}
              {view === View.LIVE_FEED && 'Live Intercepts'}
              {view === View.EMAIL_LOGS && 'Transmission Logs'}
              {view === View.SETTINGS && 'Agent Configuration'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {view === View.DASHBOARD && 'Overview of monitoring activities and threat detection.'}
              {view === View.LIVE_FEED && 'Real-time stream of detected keywords across platforms.'}
              {view === View.EMAIL_LOGS && 'History of automated alerts sent to stakeholders.'}
              {view === View.SETTINGS && 'Manage target keywords and notification settings.'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
             {config.isMonitoring && (
                <div className="hidden md:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-mono text-slate-300">LIVE SCANNING</span>
                </div>
             )}
          </div>
        </header>

        {view === View.DASHBOARD && (
          <div className="space-y-6">
            <DashboardStats alerts={alerts} emailCount={emailLogs.length} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-semibold text-white">Recent Intercepts</h3>
                     <button onClick={() => setView(View.LIVE_FEED)} className="text-xs text-blue-400 hover:text-blue-300">View All</button>
                  </div>
                  <AlertFeed alerts={alerts.slice(0, 3)} />
               </div>
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-semibold text-white">Recent Transmissions</h3>
                     <button onClick={() => setView(View.EMAIL_LOGS)} className="text-xs text-blue-400 hover:text-blue-300">View All</button>
                  </div>
                  <EmailLogs logs={emailLogs.slice(0, 3)} />
               </div>
            </div>
          </div>
        )}

        {view === View.LIVE_FEED && (
          <div className="max-w-4xl mx-auto">
             <AlertFeed alerts={alerts} />
          </div>
        )}

        {view === View.EMAIL_LOGS && (
          <div className="max-w-4xl mx-auto">
             <EmailLogs logs={emailLogs} />
          </div>
        )}

        {view === View.SETTINGS && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6">
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">Target Keywords</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {config.keywords.map(word => (
                  <span key={word} className="flex items-center bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-sm border border-slate-700">
                    {word}
                    <button onClick={() => removeKeyword(word)} className="ml-2 text-slate-500 hover:text-white">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                   <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                   <input
                    type="text"
                    placeholder="Add new keyword..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                <button 
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  onClick={(e) => {
                     const input = e.currentTarget.previousElementSibling?.querySelector('input');
                     if(input) {
                        addKeyword(input.value);
                        input.value = '';
                     }
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="mb-8">
               <h3 className="text-lg font-medium text-white mb-4">Notification Settings</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm text-slate-400 mb-1">Alert Recipient Email</label>
                     <input 
                        type="email" 
                        value={config.targetEmail}
                        onChange={(e) => setConfig({...config, targetEmail: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
               <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                  <span className="mr-2">ℹ️</span> Live Search Active
               </h4>
               <p className="text-sm text-slate-400">
                  This application uses <strong>Google Gemini with Search Grounding</strong> to scan the public web for real posts matching your keywords.
                  <br/><br/>
                  While it cannot access private API data (which would require a backend proxy server like Google Cloud Functions), it effectively monitors public discussions on supported platforms in real-time.
               </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
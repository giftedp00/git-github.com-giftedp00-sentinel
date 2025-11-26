import React from 'react';
import { Alert, Platform } from '../types';
import { Twitter, Instagram, Facebook, Share2, MessageSquare, ThumbsUp, ExternalLink } from 'lucide-react';

interface AlertFeedProps {
  alerts: Alert[];
}

const PlatformIcon: React.FC<{ platform: Platform }> = ({ platform }) => {
  switch (platform) {
    case 'Twitter': return <Twitter className="text-blue-400" size={20} />;
    case 'Facebook': return <Facebook className="text-blue-600" size={20} />;
    case 'Instagram': return <Instagram className="text-pink-500" size={20} />;
    case 'Reddit': return <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center font-bold text-xs text-white">r</div>;
    case 'TikTok': return <div className="w-5 h-5 bg-black border border-slate-700 rounded-full flex items-center justify-center font-bold text-xs text-white">t</div>;
    default: return <Share2 className="text-gray-400" size={20} />;
  }
};

const AlertFeed: React.FC<AlertFeedProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <div className="bg-slate-900 p-4 rounded-full mb-4">
          <Share2 size={40} opacity={0.5} />
        </div>
        <p className="text-lg">No alerts detected yet.</p>
        <p className="text-sm">Start the monitor to scan for keywords.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-600 hover:scale-[1.01] hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <PlatformIcon platform={alert.platform} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{alert.username}</span>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    {alert.platform}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{new Date(alert.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
               <span className="text-xs font-mono text-red-400 bg-red-950/30 border border-red-900/50 px-2 py-1 rounded">
                MATCH: "{alert.keywordDetected}"
              </span>
              <a 
                href={alert.url} 
                target="_blank" 
                rel="noreferrer"
                title="Open Post"
                className="flex items-center space-x-1 p-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-xs font-medium"
              >
                <span>Open</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          
          <p className="text-slate-300 mb-4 leading-relaxed font-sans">
             {/* Highlight keyword */}
             {alert.content.split(new RegExp(`(${alert.keywordDetected})`, 'gi')).map((part, i) => 
                part.toLowerCase() === alert.keywordDetected.toLowerCase() ? 
                <span key={i} className="bg-red-500/20 text-red-200 px-1 rounded font-medium">{part}</span> : 
                part
             )}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-slate-500 border-t border-slate-800 pt-3">
            <div className="flex items-center space-x-1.5">
              <ThumbsUp size={14} />
              <span>{alert.metadata.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MessageSquare size={14} />
              <span>{alert.metadata.comments.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Share2 size={14} />
              <span>{alert.metadata.shares.toLocaleString()}</span>
            </div>
            {alert.emailSent && (
               <div className="ml-auto flex items-center text-green-500 text-xs">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                 Email Queued
               </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertFeed;
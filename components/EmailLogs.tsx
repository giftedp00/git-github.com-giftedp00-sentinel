import React from 'react';
import { EmailLogEntry } from '../types';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailLogsProps {
  logs: EmailLogEntry[];
}

const EmailLogs: React.FC<EmailLogsProps> = ({ logs }) => {
  if (logs.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <div className="bg-slate-900 p-4 rounded-full mb-4">
          <Mail size={40} opacity={0.5} />
        </div>
        <p className="text-lg">No emails sent yet.</p>
        <p className="text-sm">Emails will appear here when alerts are detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-lg p-0 overflow-hidden">
          <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/10 p-2 rounded-full text-green-500">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Sent to: {log.recipient}</p>
                <p className="text-slate-500 text-xs">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
              SMTP: OK (Simulated)
            </div>
          </div>
          <div className="p-5 font-mono text-sm text-slate-300 whitespace-pre-wrap bg-slate-950/30">
            <div className="mb-2 text-slate-400 pb-2 border-b border-slate-800 border-dashed">Subject: {log.subject}</div>
            {log.body}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailLogs;
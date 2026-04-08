import { useFirewall } from '@/contexts/FirewallContext';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const PanFooter = () => {
  const { hasUncommittedChanges, commitHistory } = useFirewall();
  const lastCommit = commitHistory[0];

  return (
    <div className="h-[24px] flex items-center justify-between px-3 text-[10px] border-t"
         style={{ background: 'hsl(210, 10%, 92%)', borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 10%, 40%)' }}>
      <div className="flex items-center gap-3">
        {hasUncommittedChanges ? (
          <span className="flex items-center gap-1" style={{ color: 'hsl(30, 90%, 55%)' }}>
            <AlertTriangle className="w-3 h-3" /> Uncommitted changes
          </span>
        ) : (
          <span className="flex items-center gap-1" style={{ color: 'hsl(100, 55%, 40%)' }}>
            <CheckCircle className="w-3 h-3" /> Config synchronized
          </span>
        )}
        {lastCommit && (
          <span>Last commit: {lastCommit.timestamp}</span>
        )}
      </div>
      <span>Connected to {'{'}PA-3260{'}'} | PAN-OS 10.2.3</span>
    </div>
  );
};

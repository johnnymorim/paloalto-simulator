import { useState } from 'react';
import { useFirewall } from '@/contexts/FirewallContext';
import { X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface CommitModalProps {
  onClose: () => void;
}

export const CommitModal = ({ onClose }: CommitModalProps) => {
  const { commitChanges, hasUncommittedChanges } = useFirewall();
  const [stage, setStage] = useState<'confirm' | 'validating' | 'committing' | 'done'>('confirm');
  const [progress, setProgress] = useState(0);

  const handleCommit = async () => {
    setStage('validating');
    setProgress(0);
    await new Promise(r => setTimeout(r, 800));
    setProgress(30);
    setStage('committing');
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + 15;
      });
    }, 300);
    await commitChanges();
    clearInterval(interval);
    setProgress(100);
    setStage('done');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-[420px] rounded shadow-lg" style={{ background: 'hsl(0, 0%, 100%)' }}>
        <div className="flex items-center justify-between px-4 py-2 rounded-t"
             style={{ background: 'hsl(215, 40%, 16%)', color: 'hsl(0, 0%, 100%)' }}>
          <span className="text-[12px] font-medium">Commit</span>
          <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          {stage === 'confirm' && (
            <>
              <p className="text-[12px]" style={{ color: 'hsl(215, 25%, 15%)' }}>
                {hasUncommittedChanges
                  ? 'You have uncommitted changes. Do you want to commit now?'
                  : 'No pending changes to commit.'}
              </p>
              {hasUncommittedChanges && (
                <div className="flex items-center gap-1 text-[11px] p-2 rounded"
                     style={{ background: 'hsl(45, 100%, 94%)', color: 'hsl(30, 80%, 40%)' }}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Configuration changes will be applied to the running config.
                </div>
              )}
            </>
          )}
          {(stage === 'validating' || stage === 'committing') && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px]" style={{ color: 'hsl(215, 25%, 15%)' }}>
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'hsl(207, 80%, 52%)' }} />
                {stage === 'validating' ? 'Validating configuration...' : 'Committing changes...'}
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(210, 10%, 90%)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                     style={{ width: `${progress}%`, background: 'hsl(207, 80%, 52%)' }} />
              </div>
              <p className="text-[11px]" style={{ color: 'hsl(215, 10%, 45%)' }}>{progress}% complete</p>
            </div>
          )}
          {stage === 'done' && (
            <div className="flex items-center gap-2 text-[12px] p-2 rounded"
                 style={{ background: 'hsl(120, 40%, 94%)', color: 'hsl(120, 40%, 30%)' }}>
              <CheckCircle className="w-4 h-4" />
              Commit successful. Configuration is now active.
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
          {stage === 'confirm' && hasUncommittedChanges && (
            <button onClick={handleCommit}
                    className="px-4 py-1.5 text-[11px] font-medium rounded"
                    style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
              Commit
            </button>
          )}
          <button onClick={onClose}
                  className="px-4 py-1.5 text-[11px] font-medium rounded border"
                  style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
            {stage === 'done' ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

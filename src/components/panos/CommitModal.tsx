import { useState } from 'react';
import { useFirewall } from '@/contexts/FirewallContext';
import { X, CheckCircle, AlertTriangle, Loader2, ChevronDown, FileText, Shield } from 'lucide-react';

interface CommitModalProps {
  onClose: () => void;
}

export const CommitModal = ({ onClose }: CommitModalProps) => {
  const { commitChanges, validateConfig, hasUncommittedChanges, securityRules, natRules } = useFirewall();
  const [stage, setStage] = useState<'confirm' | 'validating' | 'committing' | 'done' | 'preview' | 'validated'>('confirm');
  const [progress, setProgress] = useState(0);
  const [commitType, setCommitType] = useState<'all' | 'admin'>('all');
  const [forceCommit, setForceCommit] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleValidate = async () => {
    setStage('validating');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 90) { clearInterval(interval); return 90; } return p + 20; });
    }, 200);
    const w = await validateConfig();
    clearInterval(interval);
    setProgress(100);
    setWarnings(w);
    setStage('validated');
  };

  const handleCommit = async () => {
    setStage('committing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 90) { clearInterval(interval); return 90; } return p + 15; });
    }, 300);
    await commitChanges();
    clearInterval(interval);
    setProgress(100);
    setStage('done');
  };

  const configChanges = [
    ...(hasUncommittedChanges ? [
      { section: 'Security Rules', detail: `${securityRules.length} rules configured` },
      { section: 'NAT Rules', detail: `${natRules.length} rules configured` },
    ] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-[500px] rounded shadow-lg" style={{ background: 'hsl(0, 0%, 100%)' }}>
        <div className="flex items-center justify-between px-4 py-2 rounded-t"
             style={{ background: 'hsl(215, 40%, 16%)', color: 'hsl(0, 0%, 100%)' }}>
          <span className="text-[12px] font-medium">Commit</span>
          <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          {/* Commit Type Selector */}
          {(stage === 'confirm' || stage === 'validated') && (
            <div className="space-y-2">
              <div className="relative">
                <label className="text-[11px] font-medium block mb-1" style={{ color: 'hsl(215, 10%, 45%)' }}>Commit Type</label>
                <button onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] border rounded"
                        style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
                  {commitType === 'all' ? 'Commit All Changes' : 'Commit Changes by admin'}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 border rounded shadow-lg z-10"
                       style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
                    {[{ v: 'all', l: 'Commit All Changes' }, { v: 'admin', l: 'Commit Changes by admin' }].map(o => (
                      <button key={o.v} onClick={() => { setCommitType(o.v as 'all' | 'admin'); setShowTypeDropdown(false); }}
                              className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-[hsl(210,15%,97%)]"
                              style={{ color: 'hsl(215, 25%, 15%)' }}>{o.l}</button>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-[11px]" style={{ color: 'hsl(215, 25%, 15%)' }}>
                <input type="checkbox" checked={forceCommit} onChange={e => setForceCommit(e.target.checked)} />
                Force Commit (ignore warnings)
              </label>
            </div>
          )}

          {stage === 'confirm' && (
            <>
              <p className="text-[12px]" style={{ color: 'hsl(215, 25%, 15%)' }}>
                {hasUncommittedChanges
                  ? 'You have uncommitted changes. Validate or commit now.'
                  : 'No pending changes to commit.'}
              </p>
              {hasUncommittedChanges && (
                <div className="flex items-center gap-1 text-[11px] p-2 rounded"
                     style={{ background: 'hsl(45, 100%, 94%)', color: 'hsl(30, 80%, 40%)' }}>
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  Configuration changes will be applied to the running config.
                </div>
              )}
            </>
          )}

          {stage === 'validated' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px] p-2 rounded"
                   style={{ background: warnings.length ? 'hsl(45, 100%, 94%)' : 'hsl(120, 40%, 94%)', color: warnings.length ? 'hsl(30, 80%, 40%)' : 'hsl(120, 40%, 30%)' }}>
                {warnings.length ? <AlertTriangle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                {warnings.length ? `Validation complete with ${warnings.length} warning(s)` : 'Validation successful — no warnings'}
              </div>
              {warnings.length > 0 && (
                <div className="border rounded p-2 space-y-1 max-h-[120px] overflow-auto" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
                  {warnings.map((w, i) => (
                    <div key={i} className="text-[10px] flex items-start gap-1" style={{ color: 'hsl(30, 80%, 40%)' }}>
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {w}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {stage === 'preview' && (
            <div className="space-y-2">
              <div className="text-[12px] font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>Preview Changes</div>
              <div className="border rounded max-h-[200px] overflow-auto" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
                {configChanges.length === 0 ? (
                  <div className="p-3 text-[11px] text-center" style={{ color: 'hsl(215, 10%, 45%)' }}>No changes to preview</div>
                ) : (
                  configChanges.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 border-b text-[11px]" style={{ borderColor: 'hsl(210, 10%, 94%)' }}>
                      <FileText className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(207, 80%, 52%)' }} />
                      <span className="font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{c.section}</span>
                      <span style={{ color: 'hsl(215, 10%, 45%)' }}>— {c.detail}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
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
        <div className="flex justify-between px-4 py-3 border-t" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
          <div className="flex gap-2">
            {(stage === 'confirm' || stage === 'validated') && hasUncommittedChanges && (
              <>
                <button onClick={handleValidate}
                        className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded border"
                        style={{ borderColor: 'hsl(207, 80%, 52%)', color: 'hsl(207, 80%, 52%)' }}>
                  <Shield className="w-3 h-3" /> Validate
                </button>
                <button onClick={() => setStage('preview')}
                        className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded border"
                        style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
                  <FileText className="w-3 h-3" /> Preview Changes
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {(stage === 'confirm' || stage === 'validated' || stage === 'preview') && hasUncommittedChanges && (
              <button onClick={handleCommit}
                      className="px-4 py-1.5 text-[11px] font-medium rounded"
                      style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
                Commit
              </button>
            )}
            {stage === 'preview' && (
              <button onClick={() => setStage('confirm')}
                      className="px-4 py-1.5 text-[11px] font-medium rounded border"
                      style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
                Back
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
    </div>
  );
};

import { useState } from 'react';
import { useFirewall } from '@/contexts/FirewallContext';
import { Search, Lock, User, ChevronDown } from 'lucide-react';
import { CommitModal } from './CommitModal';

const navTabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'acc', label: 'ACC' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'policies', label: 'Policies' },
  { id: 'objects', label: 'Objects' },
  { id: 'network', label: 'Network' },
  { id: 'device', label: 'Device' },
];

interface PanHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const PanHeader = ({ activeTab, onTabChange }: PanHeaderProps) => {
  const { hasUncommittedChanges, systemInfo } = useFirewall();
  const [showCommit, setShowCommit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Top bar */}
      <div className="h-[36px] flex items-center justify-between px-3"
           style={{ background: 'hsl(215, 40%, 16%)' }}>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-bold tracking-wide" style={{ color: 'hsl(0, 0%, 100%)' }}>
            PALO ALTO NETWORKS
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded"
                style={{ background: 'hsl(215, 35%, 22%)', color: 'hsl(210, 10%, 75%)' }}>
            {systemInfo.hostname}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: 'hsl(210, 10%, 60%)' }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-7 pr-2 py-1 text-[11px] rounded w-[160px]"
              style={{ background: 'hsl(215, 35%, 22%)', color: 'hsl(0, 0%, 100%)', border: '1px solid hsl(215, 30%, 30%)' }}
            />
          </div>
          <Lock className="w-3.5 h-3.5" style={{ color: 'hsl(100, 55%, 53%)' }} />
          <button
            onClick={() => setShowCommit(true)}
            className="px-3 py-1 text-[11px] font-medium rounded flex items-center gap-1"
            style={{
              background: hasUncommittedChanges ? 'hsl(30, 90%, 55%)' : 'hsl(100, 55%, 53%)',
              color: 'hsl(0, 0%, 100%)',
            }}
          >
            Commit
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1 text-[11px]" style={{ color: 'hsl(210, 10%, 75%)' }}>
            <User className="w-3.5 h-3.5" />
            <span>admin</span>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="h-[30px] flex items-end px-1 gap-0"
           style={{ background: 'hsl(215, 35%, 22%)' }}>
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-4 py-1.5 text-[11px] font-medium rounded-t transition-colors"
            style={{
              background: activeTab === tab.id ? 'hsl(210, 10%, 94%)' : 'transparent',
              color: activeTab === tab.id ? 'hsl(215, 25%, 15%)' : 'hsl(210, 10%, 75%)',
              borderBottom: activeTab === tab.id ? '2px solid hsl(210, 10%, 94%)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {showCommit && <CommitModal onClose={() => setShowCommit(false)} />}
    </>
  );
};

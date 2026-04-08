import { useState, useRef, useEffect } from 'react';
import { useFirewall } from '@/contexts/FirewallContext';
import { Search, Lock, User, ChevronDown, FlaskConical, CheckCircle2, Clock, BookOpen, X } from 'lucide-react';
import { CommitModal } from './CommitModal';
import { labs, labCategories, Lab } from '@/data/labData';

const navTabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'acc', label: 'ACC' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'policies', label: 'Policies' },
  { id: 'objects', label: 'Objects' },
  { id: 'network', label: 'Network' },
  { id: 'device', label: 'Device' },
];

const difficultyColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'hsl(100, 50%, 90%)', text: 'hsl(100, 50%, 30%)' },
  intermediate: { bg: 'hsl(40, 80%, 90%)', text: 'hsl(30, 60%, 30%)' },
  advanced: { bg: 'hsl(0, 60%, 92%)', text: 'hsl(0, 50%, 35%)' },
};

interface PanHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onStartLab?: (lab: Lab) => void;
  completedLabs?: Set<string>;
  activeLab?: Lab | null;
}

export const PanHeader = ({ activeTab, onTabChange, onStartLab, completedLabs = new Set(), activeLab }: PanHeaderProps) => {
  const { hasUncommittedChanges, systemInfo } = useFirewall();
  const [showCommit, setShowCommit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [labCategoryFilter, setLabCategoryFilter] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowLabDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLabs = labCategoryFilter === 'all' ? labs : labs.filter(l => l.category === labCategoryFilter);
  const totalCompleted = completedLabs.size;
  const totalLabs = labs.length;

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

          {/* Labs dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowLabDropdown(!showLabDropdown)}
              className="px-2.5 py-1 text-[11px] font-medium rounded flex items-center gap-1.5 transition-colors"
              style={{
                background: activeLab ? 'hsl(210, 70%, 50%)' : 'hsl(215, 35%, 28%)',
                color: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 30%, 35%)',
              }}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Labs
              {totalCompleted > 0 && (
                <span className="text-[9px] px-1 py-0.5 rounded-full" style={{ background: 'hsl(100, 50%, 40%)', color: 'hsl(0, 0%, 100%)' }}>
                  {totalCompleted}/{totalLabs}
                </span>
              )}
              <ChevronDown className="w-3 h-3" />
            </button>

            {showLabDropdown && (
              <div
                className="absolute right-0 top-full mt-1 w-[420px] rounded-lg shadow-2xl z-50 overflow-hidden"
                style={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(210, 15%, 85%)' }}
              >
                {/* Dropdown header */}
                <div className="p-3 flex items-center justify-between" style={{ background: 'hsl(215, 40%, 16%)' }}>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: 'hsl(0, 0%, 100%)' }}>Lab Exercises</div>
                    <div className="text-[10px]" style={{ color: 'hsl(210, 10%, 65%)' }}>
                      {totalCompleted}/{totalLabs} completed • Hands-on PAN-OS training
                    </div>
                  </div>
                  <button onClick={() => setShowLabDropdown(false)} className="p-1 rounded hover:bg-white/10">
                    <X className="w-3.5 h-3.5" style={{ color: 'hsl(210, 10%, 75%)' }} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="px-3 py-2" style={{ background: 'hsl(210, 20%, 97%)' }}>
                  <div className="w-full h-[4px] rounded-full" style={{ background: 'hsl(210, 15%, 88%)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((totalCompleted / totalLabs) * 100)}%`, background: 'hsl(100, 55%, 45%)' }} />
                  </div>
                </div>

                {/* Category filter */}
                <div className="px-3 py-2 flex gap-1 flex-wrap" style={{ borderBottom: '1px solid hsl(210, 15%, 90%)' }}>
                  <button
                    onClick={() => setLabCategoryFilter('all')}
                    className="px-2 py-0.5 text-[9px] rounded font-medium"
                    style={{
                      background: labCategoryFilter === 'all' ? 'hsl(215, 40%, 16%)' : 'transparent',
                      color: labCategoryFilter === 'all' ? 'hsl(0, 0%, 100%)' : 'hsl(210, 10%, 45%)',
                    }}
                  >
                    All
                  </button>
                  {labCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setLabCategoryFilter(cat)}
                      className="px-2 py-0.5 text-[9px] rounded font-medium"
                      style={{
                        background: labCategoryFilter === cat ? 'hsl(215, 40%, 16%)' : 'transparent',
                        color: labCategoryFilter === cat ? 'hsl(0, 0%, 100%)' : 'hsl(210, 10%, 45%)',
                      }}
                    >
                      {cat.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Lab list */}
                <div className="max-h-[400px] overflow-auto">
                  {labCategories.filter(cat => labCategoryFilter === 'all' || labCategoryFilter === cat).map(cat => {
                    const catLabs = filteredLabs.filter(l => l.category === cat);
                    if (catLabs.length === 0) return null;
                    return (
                      <div key={cat}>
                        <div className="px-3 py-1.5 text-[9px] font-bold tracking-wider flex items-center gap-1.5"
                          style={{ background: 'hsl(210, 20%, 96%)', color: 'hsl(210, 10%, 45%)' }}>
                          <BookOpen className="w-3 h-3" />
                          {cat.toUpperCase()}
                          <span className="font-normal ml-auto">
                            {catLabs.filter(l => completedLabs.has(l.id)).length}/{catLabs.length}
                          </span>
                        </div>
                        {catLabs.map(lab => {
                          const done = completedLabs.has(lab.id);
                          const isActive = activeLab?.id === lab.id;
                          const dc = difficultyColors[lab.difficulty];
                          return (
                            <button
                              key={lab.id}
                              onClick={() => {
                                onStartLab?.(lab);
                                setShowLabDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 flex items-center gap-2 transition-colors"
                              style={{
                                background: isActive ? 'hsl(210, 60%, 95%)' : done ? 'hsl(100, 40%, 97%)' : 'transparent',
                                borderBottom: '1px solid hsl(210, 15%, 94%)',
                              }}
                              onMouseEnter={e => { if (!isActive && !done) (e.currentTarget.style.background = 'hsl(210, 20%, 97%)'); }}
                              onMouseLeave={e => { if (!isActive && !done) (e.currentTarget.style.background = 'transparent'); }}
                            >
                              <span className="text-[9px] font-mono w-5 shrink-0" style={{ color: 'hsl(210, 10%, 55%)' }}>
                                {lab.id.split('-')[1]}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-medium truncate" style={{ color: 'hsl(215, 25%, 15%)' }}>
                                  {lab.title}
                                </div>
                                <div className="flex items-center gap-2 text-[9px]" style={{ color: 'hsl(210, 10%, 55%)' }}>
                                  <Clock className="w-2.5 h-2.5" />
                                  {lab.estimatedMinutes}m
                                  <span>•</span>
                                  {lab.steps.length} steps
                                </div>
                              </div>
                              <span className="px-1.5 py-0.5 text-[8px] font-medium rounded capitalize shrink-0" style={{ background: dc.bg, color: dc.text }}>
                                {lab.difficulty}
                              </span>
                              {done && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(100, 55%, 40%)' }} />}
                              {isActive && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: 'hsl(210, 70%, 50%)', color: 'hsl(0, 0%, 100%)' }}>
                                  ACTIVE
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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

import { useState, useMemo } from 'react';
import { labs, labCategories, Lab } from '@/data/labData';
import { Clock, CheckCircle2, BookOpen, Filter } from 'lucide-react';

interface LabsPageProps {
  completedLabs: Set<string>;
  onStartLab: (lab: Lab) => void;
}

const difficultyColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'hsl(100, 50%, 90%)', text: 'hsl(100, 50%, 30%)' },
  intermediate: { bg: 'hsl(40, 80%, 90%)', text: 'hsl(30, 60%, 30%)' },
  advanced: { bg: 'hsl(0, 60%, 92%)', text: 'hsl(0, 50%, 35%)' },
};

export const LabsPage = ({ completedLabs, onStartLab }: LabsPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredLabs = useMemo(() => {
    return labs.filter(l => {
      if (selectedCategory !== 'all' && l.category !== selectedCategory) return false;
      if (difficultyFilter !== 'all' && l.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [selectedCategory, difficultyFilter]);

  const totalCompleted = completedLabs.size;
  const totalLabs = labs.length;
  const pct = Math.round((totalCompleted / totalLabs) * 100);

  return (
    <div className="flex-1 overflow-auto p-4" style={{ background: 'hsl(210, 15%, 97%)' }}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-bold" style={{ color: 'hsl(215, 25%, 15%)' }}>Lab Exercises</h1>
          <p className="text-[11px]" style={{ color: 'hsl(210, 10%, 50%)' }}>
            35 interactive labs for PAN-OS firewall administration training
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-medium" style={{ color: 'hsl(210, 10%, 40%)' }}>{totalCompleted}/{totalLabs} Complete</div>
            <div className="w-[120px] h-[6px] rounded-full mt-1" style={{ background: 'hsl(210, 15%, 88%)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'hsl(100, 55%, 45%)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-3.5 h-3.5" style={{ color: 'hsl(210, 10%, 50%)' }} />
        <button
          onClick={() => setSelectedCategory('all')}
          className="px-2 py-1 text-[10px] rounded font-medium"
          style={{
            background: selectedCategory === 'all' ? 'hsl(215, 40%, 16%)' : 'hsl(0, 0%, 100%)',
            color: selectedCategory === 'all' ? 'hsl(0, 0%, 100%)' : 'hsl(210, 10%, 40%)',
            border: '1px solid hsl(210, 15%, 85%)',
          }}
        >
          All
        </button>
        {labCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-2 py-1 text-[10px] rounded font-medium"
            style={{
              background: selectedCategory === cat ? 'hsl(215, 40%, 16%)' : 'hsl(0, 0%, 100%)',
              color: selectedCategory === cat ? 'hsl(0, 0%, 100%)' : 'hsl(210, 10%, 40%)',
              border: '1px solid hsl(210, 15%, 85%)',
            }}
          >
            {cat}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className="px-2 py-1 text-[10px] rounded font-medium capitalize"
              style={{
                background: difficultyFilter === d ? 'hsl(210, 15%, 80%)' : 'transparent',
                color: 'hsl(210, 10%, 40%)',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Lab grid by category */}
      {labCategories.filter(cat => selectedCategory === 'all' || selectedCategory === cat).map(cat => {
        const catLabs = filteredLabs.filter(l => l.category === cat);
        if (catLabs.length === 0) return null;
        return (
          <div key={cat} className="mb-5">
            <h2 className="text-[12px] font-bold mb-2 flex items-center gap-1.5" style={{ color: 'hsl(215, 25%, 25%)' }}>
              <BookOpen className="w-3.5 h-3.5" />
              {cat}
              <span className="text-[10px] font-normal ml-1" style={{ color: 'hsl(210, 10%, 55%)' }}>
                ({catLabs.filter(l => completedLabs.has(l.id)).length}/{catLabs.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {catLabs.map(lab => {
                const done = completedLabs.has(lab.id);
                const dc = difficultyColors[lab.difficulty];
                return (
                  <button
                    key={lab.id}
                    onClick={() => onStartLab(lab)}
                    className="text-left p-3 rounded border transition-all hover:shadow-md"
                    style={{
                      background: done ? 'hsl(100, 40%, 97%)' : 'hsl(0, 0%, 100%)',
                      borderColor: done ? 'hsl(100, 40%, 80%)' : 'hsl(210, 15%, 88%)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="text-[10px] font-mono" style={{ color: 'hsl(210, 10%, 55%)' }}>
                        #{lab.id.split('-')[1]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 text-[9px] font-medium rounded capitalize" style={{ background: dc.bg, color: dc.text }}>
                          {lab.difficulty}
                        </span>
                        {done && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'hsl(100, 55%, 40%)' }} />}
                      </div>
                    </div>
                    <div className="text-[11px] font-medium mb-1" style={{ color: 'hsl(215, 25%, 15%)' }}>
                      {lab.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: 'hsl(210, 10%, 55%)' }}>
                      <Clock className="w-3 h-3" />
                      {lab.estimatedMinutes} min
                      <span>•</span>
                      {lab.steps.length} steps
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

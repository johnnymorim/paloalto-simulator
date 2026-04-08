import { ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface PanTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const PanTabs = ({ tabs, defaultTab }: PanTabsProps) => {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  return (
    <div>
      <div className="flex border-b" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="px-4 py-1.5 text-[11px] font-medium transition-colors"
            style={{
              borderBottom: active === tab.id ? '2px solid hsl(207, 80%, 52%)' : '2px solid transparent',
              color: active === tab.id ? 'hsl(207, 80%, 52%)' : 'hsl(215, 10%, 45%)',
              background: active === tab.id ? 'hsl(207, 80%, 97%)' : 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-3">
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  );
};

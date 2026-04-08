import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  children?: SidebarItem[];
}

interface PanSidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

const SidebarNode = ({ item, activeItem, onItemClick, depth = 0 }: {
  item: SidebarItem; activeItem: string; onItemClick: (id: string) => void; depth?: number;
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeItem === item.id;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onItemClick(item.id);
        }}
        className="w-full flex items-center gap-1 px-2 py-1.5 text-[11px] text-left transition-colors"
        style={{
          paddingLeft: `${8 + depth * 14}px`,
          background: isActive ? 'hsl(207, 80%, 52%)' : 'transparent',
          color: isActive ? 'hsl(0, 0%, 100%)' : 'hsl(215, 25%, 15%)',
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {hasChildren && (
          expanded
            ? <ChevronDown className="w-3 h-3 shrink-0" />
            : <ChevronRight className="w-3 h-3 shrink-0" />
        )}
        {!hasChildren && <span className="w-3 shrink-0" />}
        <span className="truncate">{item.label}</span>
      </button>
      {hasChildren && expanded && (
        <div>
          {item.children!.map(child => (
            <SidebarNode key={child.id} item={child} activeItem={activeItem} onItemClick={onItemClick} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const PanSidebar = ({ items, activeItem, onItemClick }: PanSidebarProps) => {
  return (
    <div className="w-[200px] min-h-full border-r overflow-y-auto panos-scrollbar"
         style={{ background: 'hsl(210, 10%, 94%)', borderColor: 'hsl(214, 20%, 82%)' }}>
      {items.map(item => (
        <SidebarNode key={item.id} item={item} activeItem={activeItem} onItemClick={onItemClick} />
      ))}
    </div>
  );
};

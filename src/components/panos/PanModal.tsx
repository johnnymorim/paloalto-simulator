import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface PanModalProps {
  title: string;
  onClose: () => void;
  onSave?: () => void;
  children: ReactNode;
  width?: string;
}

export const PanModal = ({ title, onClose, onSave, children, width = '600px' }: PanModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded shadow-lg flex flex-col max-h-[85vh]" style={{ background: 'hsl(0, 0%, 100%)', width }}>
        <div className="flex items-center justify-between px-4 py-2 rounded-t shrink-0"
             style={{ background: 'hsl(215, 40%, 16%)', color: 'hsl(0, 0%, 100%)' }}>
          <span className="text-[12px] font-medium">{title}</span>
          <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 panos-scrollbar">
          {children}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t shrink-0" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
          {onSave && (
            <button onClick={onSave}
                    className="px-4 py-1.5 text-[11px] font-medium rounded"
                    style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
              OK
            </button>
          )}
          <button onClick={onClose}
                  className="px-4 py-1.5 text-[11px] font-medium rounded border"
                  style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

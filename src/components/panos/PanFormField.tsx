import { ReactNode } from 'react';

interface PanFormFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
}

export const PanFormField = ({ label, children, required }: PanFormFieldProps) => (
  <div className="flex items-start gap-2 mb-2">
    <label className="w-[140px] shrink-0 text-[11px] font-medium pt-1.5 text-right pr-2"
           style={{ color: 'hsl(215, 25%, 15%)' }}>
      {label}{required && <span style={{ color: 'hsl(0, 72%, 51%)' }}> *</span>}
    </label>
    <div className="flex-1">{children}</div>
  </div>
);

export const PanInput = ({ value, onChange, placeholder, type = 'text', disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean;
}) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full px-2 py-1.5 text-[11px] border rounded"
    style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)', background: disabled ? 'hsl(210, 10%, 94%)' : 'hsl(0, 0%, 100%)' }}
  />
);

export const PanSelect = ({ value, onChange, options, disabled }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; disabled?: boolean;
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    disabled={disabled}
    className="w-full px-2 py-1.5 text-[11px] border rounded"
    style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)', background: disabled ? 'hsl(210, 10%, 94%)' : 'hsl(0, 0%, 100%)' }}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

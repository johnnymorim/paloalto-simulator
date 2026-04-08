import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  render?: (row: T, index: number) => ReactNode;
}

interface PanTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  selectedRow?: string | null;
  rowKey: (row: T) => string;
}

export function PanTable<T>({ columns, data, onRowClick, onRowDoubleClick, selectedRow, rowKey }: PanTableProps<T>) {
  return (
    <div className="border overflow-auto panos-scrollbar" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr style={{ background: 'hsl(215, 30%, 28%)', color: 'hsl(0, 0%, 100%)' }}>
            {columns.map(col => (
              <th key={col.key} className="px-2 py-1.5 text-left font-medium whitespace-nowrap"
                  style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const key = rowKey(row);
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                onDoubleClick={() => onRowDoubleClick?.(row)}
                className="cursor-pointer transition-colors"
                style={{
                  background: selectedRow === key
                    ? 'hsl(207, 80%, 90%)'
                    : idx % 2 === 0
                    ? 'hsl(0, 0%, 100%)'
                    : 'hsl(210, 15%, 97%)',
                }}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-2 py-1.5 whitespace-nowrap" style={{ color: 'hsl(215, 25%, 15%)' }}>
                    {col.render ? col.render(row, idx) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center" style={{ color: 'hsl(215, 10%, 45%)' }}>
                No entries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

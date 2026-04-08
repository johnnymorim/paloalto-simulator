import { useState } from 'react';

const topApps = [
  { name: 'ssl', sessions: 4521, bytes: 2300000000, risk: 3, category: 'encrypted', subcategory: 'encrypted-tunnel' },
  { name: 'web-browsing', sessions: 3892, bytes: 1800000000, risk: 3, category: 'general-internet', subcategory: 'internet-utility' },
  { name: 'dns', sessions: 2341, bytes: 45000000, risk: 1, category: 'networking', subcategory: 'infrastructure' },
  { name: 'youtube-base', sessions: 1200, bytes: 890000000, risk: 4, category: 'media', subcategory: 'video' },
  { name: 'smtp', sessions: 891, bytes: 234000000, risk: 2, category: 'email', subcategory: 'email' },
  { name: 'ms-ds-smbv3', sessions: 456, bytes: 67000000, risk: 2, category: 'file-sharing', subcategory: 'smb' },
  { name: 'ssh', sessions: 234, bytes: 12000000, risk: 1, category: 'networking', subcategory: 'management' },
  { name: 'ftp', sessions: 89, bytes: 5600000, risk: 3, category: 'file-sharing', subcategory: 'file-transfer' },
];

const formatBytes = (b: number) => {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(1)} MB`;
  return `${(b / 1e3).toFixed(1)} KB`;
};

const riskColors = ['', 'hsl(100, 55%, 53%)', 'hsl(207, 80%, 52%)', 'hsl(30, 90%, 55%)', 'hsl(0, 72%, 51%)', 'hsl(0, 60%, 40%)'];

export const ACCPage = () => {
  const [view, setView] = useState<'applications' | 'threats' | 'sources'>('applications');

  const topSources = [
    { ip: '192.168.1.45', sessions: 2340, bytes: 1200000000, user: 'jsmith' },
    { ip: '192.168.1.12', sessions: 1890, bytes: 890000000, user: 'mwilson' },
    { ip: '192.168.1.100', sessions: 1456, bytes: 560000000, user: 'agarcia' },
    { ip: '192.168.2.30', sessions: 1200, bytes: 450000000, user: 'tjones' },
    { ip: '192.168.1.23', sessions: 890, bytes: 340000000, user: 'klee' },
    { ip: '192.168.1.67', sessions: 670, bytes: 230000000, user: 'bpatel' },
  ];

  return (
    <div className="p-4 space-y-4 overflow-auto panos-scrollbar" style={{ background: 'hsl(210, 15%, 97%)' }}>
      {/* View selector */}
      <div className="flex gap-1">
        {(['applications', 'threats', 'sources'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
                  className="px-3 py-1.5 text-[11px] font-medium rounded capitalize"
                  style={{
                    background: view === v ? 'hsl(215, 40%, 16%)' : 'hsl(0, 0%, 100%)',
                    color: view === v ? 'hsl(0, 0%, 100%)' : 'hsl(215, 25%, 15%)',
                    border: `1px solid ${view === v ? 'hsl(215, 40%, 16%)' : 'hsl(214, 20%, 82%)'}`,
                  }}>
            {v}
          </button>
        ))}
      </div>

      {view === 'applications' && (
        <div className="grid grid-cols-2 gap-3">
          {/* App table */}
          <div className="col-span-2 border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
            <div className="px-3 py-2 border-b" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
              <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Top Applications by Sessions</span>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr style={{ background: 'hsl(215, 30%, 28%)', color: 'hsl(0, 0%, 100%)' }}>
                  <th className="px-3 py-1.5 text-left font-medium">Application</th>
                  <th className="px-3 py-1.5 text-left font-medium">Category</th>
                  <th className="px-3 py-1.5 text-right font-medium">Sessions</th>
                  <th className="px-3 py-1.5 text-right font-medium">Bytes</th>
                  <th className="px-3 py-1.5 text-center font-medium">Risk</th>
                  <th className="px-3 py-1.5 text-left font-medium w-[200px]">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {topApps.map((app, i) => (
                  <tr key={app.name} style={{ background: i % 2 === 0 ? 'hsl(0, 0%, 100%)' : 'hsl(210, 15%, 97%)' }}>
                    <td className="px-3 py-1.5 font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{app.name}</td>
                    <td className="px-3 py-1.5" style={{ color: 'hsl(215, 10%, 45%)' }}>{app.category}</td>
                    <td className="px-3 py-1.5 text-right" style={{ color: 'hsl(215, 25%, 15%)' }}>{app.sessions.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right" style={{ color: 'hsl(215, 25%, 15%)' }}>{formatBytes(app.bytes)}</td>
                    <td className="px-3 py-1.5 text-center">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold"
                            style={{ background: riskColors[app.risk], color: 'hsl(0, 0%, 100%)' }}>{app.risk}</span>
                    </td>
                    <td className="px-3 py-1.5">
                      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'hsl(210, 10%, 90%)' }}>
                        <div className="h-full rounded-full" style={{
                          width: `${(app.sessions / topApps[0].sessions) * 100}%`,
                          background: riskColors[app.risk],
                        }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'sources' && (
        <div className="border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
          <div className="px-3 py-2 border-b" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
            <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Top Sources by Sessions</span>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ background: 'hsl(215, 30%, 28%)', color: 'hsl(0, 0%, 100%)' }}>
                <th className="px-3 py-1.5 text-left font-medium">Source IP</th>
                <th className="px-3 py-1.5 text-left font-medium">User</th>
                <th className="px-3 py-1.5 text-right font-medium">Sessions</th>
                <th className="px-3 py-1.5 text-right font-medium">Bytes</th>
                <th className="px-3 py-1.5 text-left font-medium w-[200px]">Usage</th>
              </tr>
            </thead>
            <tbody>
              {topSources.map((s, i) => (
                <tr key={s.ip} style={{ background: i % 2 === 0 ? 'hsl(0, 0%, 100%)' : 'hsl(210, 15%, 97%)' }}>
                  <td className="px-3 py-1.5 font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{s.ip}</td>
                  <td className="px-3 py-1.5" style={{ color: 'hsl(215, 10%, 45%)' }}>{s.user}</td>
                  <td className="px-3 py-1.5 text-right" style={{ color: 'hsl(215, 25%, 15%)' }}>{s.sessions.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right" style={{ color: 'hsl(215, 25%, 15%)' }}>{formatBytes(s.bytes)}</td>
                  <td className="px-3 py-1.5">
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: 'hsl(210, 10%, 90%)' }}>
                      <div className="h-full rounded-full" style={{
                        width: `${(s.sessions / topSources[0].sessions) * 100}%`,
                        background: 'hsl(207, 80%, 52%)',
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'threats' && (
        <div className="border rounded p-4" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
          <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Threat Summary</span>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[
              { label: 'Critical', count: 2, color: 'hsl(0, 72%, 51%)' },
              { label: 'High', count: 3, color: 'hsl(30, 90%, 55%)' },
              { label: 'Medium', count: 1, color: 'hsl(45, 80%, 50%)' },
              { label: 'Low/Info', count: 1, color: 'hsl(207, 80%, 52%)' },
            ].map(t => (
              <div key={t.label} className="text-center p-3 rounded border" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
                <div className="text-[24px] font-bold" style={{ color: t.color }}>{t.count}</div>
                <div className="text-[11px]" style={{ color: 'hsl(215, 10%, 45%)' }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { useFirewall } from '@/contexts/FirewallContext';
import { Clock } from 'lucide-react';

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

const DonutChart = ({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  return (
    <div className="p-3 border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
      <div className="text-[11px] font-semibold mb-2" style={{ color: 'hsl(215, 25%, 15%)' }}>{title}</div>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 42 42" className="w-24 h-24">
          <circle cx="21" cy="21" r="15.9" fill="none" stroke="hsl(210, 10%, 90%)" strokeWidth="6" />
          {data.map((d, i) => {
            const pct = (d.value / total) * 100;
            const offset = cumulative;
            cumulative += pct;
            return (
              <circle key={i} cx="21" cy="21" r="15.9" fill="none" stroke={d.color} strokeWidth="6"
                      strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={-offset}
                      className="-rotate-90 origin-center" />
            );
          })}
        </svg>
        <div className="space-y-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
              <span style={{ color: 'hsl(215, 25%, 15%)' }}>{d.label}</span>
              <span style={{ color: 'hsl(215, 10%, 45%)' }}>({d.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ACCPage = () => {
  const { threatLogs } = useFirewall();
  const [accTab, setAccTab] = useState<'network' | 'threat' | 'blocked' | 'tunnel'>('network');
  const [timeRange, setTimeRange] = useState('last-hour');

  const topSources = [
    { ip: '192.168.1.45', sessions: 2340, bytes: 1200000000, user: 'jsmith' },
    { ip: '192.168.1.12', sessions: 1890, bytes: 890000000, user: 'mwilson' },
    { ip: '192.168.1.100', sessions: 1456, bytes: 560000000, user: 'agarcia' },
    { ip: '192.168.2.30', sessions: 1200, bytes: 450000000, user: 'tjones' },
    { ip: '192.168.1.23', sessions: 890, bytes: 340000000, user: 'klee' },
  ];

  const riskData = [
    { label: 'Risk 1 (Low)', value: 3, color: 'hsl(100, 55%, 53%)' },
    { label: 'Risk 2', value: 2, color: 'hsl(207, 80%, 52%)' },
    { label: 'Risk 3', value: 4, color: 'hsl(30, 90%, 55%)' },
    { label: 'Risk 4-5 (High)', value: 1, color: 'hsl(0, 72%, 51%)' },
  ];

  const categoryData = [
    { label: 'Encrypted', value: 4521, color: 'hsl(207, 80%, 52%)' },
    { label: 'General Internet', value: 3892, color: 'hsl(100, 55%, 53%)' },
    { label: 'Networking', value: 2575, color: 'hsl(30, 90%, 55%)' },
    { label: 'Media', value: 1200, color: 'hsl(270, 60%, 55%)' },
    { label: 'Other', value: 1436, color: 'hsl(210, 10%, 70%)' },
  ];

  const threatSeverity = [
    { label: 'Critical', value: threatLogs.filter(t => t.severity === 'critical').length, color: 'hsl(0, 72%, 51%)' },
    { label: 'High', value: threatLogs.filter(t => t.severity === 'high').length, color: 'hsl(30, 90%, 55%)' },
    { label: 'Medium', value: threatLogs.filter(t => t.severity === 'medium').length, color: 'hsl(45, 80%, 50%)' },
    { label: 'Low/Info', value: threatLogs.filter(t => t.severity === 'low' || t.severity === 'informational').length, color: 'hsl(207, 80%, 52%)' },
  ];

  return (
    <div className="p-4 space-y-3 overflow-auto panos-scrollbar" style={{ background: 'hsl(210, 15%, 97%)' }}>
      {/* Sub-tabs + Time range */}
      <div className="flex items-center justify-between">
        <div className="flex gap-0">
          {(['network', 'threat', 'blocked', 'tunnel'] as const).map(t => (
            <button key={t} onClick={() => setAccTab(t)}
                    className="px-3 py-1.5 text-[11px] font-medium capitalize border"
                    style={{
                      background: accTab === t ? 'hsl(215, 40%, 16%)' : 'hsl(0, 0%, 100%)',
                      color: accTab === t ? 'hsl(0, 0%, 100%)' : 'hsl(215, 25%, 15%)',
                      borderColor: 'hsl(214, 20%, 82%)',
                      borderRight: 'none',
                    }}>
              {t === 'network' ? 'Network Activity' : t === 'threat' ? 'Threat Activity' : t === 'blocked' ? 'Blocked Activity' : 'Tunnel Activity'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" style={{ color: 'hsl(215, 10%, 45%)' }} />
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)}
                  className="text-[11px] px-2 py-1 border rounded"
                  style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
            <option value="last-15-min">Last 15 Minutes</option>
            <option value="last-hour">Last Hour</option>
            <option value="last-6-hours">Last 6 Hours</option>
            <option value="last-24-hours">Last 24 Hours</option>
            <option value="last-7-days">Last 7 Days</option>
          </select>
        </div>
      </div>

      {accTab === 'network' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <DonutChart data={riskData} title="Applications by Risk Level" />
            <DonutChart data={categoryData} title="Applications by Category" />
          </div>

          <div className="border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
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
                        <div className="h-full rounded-full" style={{ width: `${(app.sessions / topApps[0].sessions) * 100}%`, background: riskColors[app.risk] }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
            <div className="px-3 py-2 border-b" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
              <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Top Sources</span>
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
                        <div className="h-full rounded-full" style={{ width: `${(s.sessions / topSources[0].sessions) * 100}%`, background: 'hsl(207, 80%, 52%)' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {accTab === 'threat' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <DonutChart data={threatSeverity} title="Threats by Severity" />
            <div className="p-3 border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
              <div className="text-[11px] font-semibold mb-2" style={{ color: 'hsl(215, 25%, 15%)' }}>Threat Summary</div>
              <div className="grid grid-cols-2 gap-3">
                {threatSeverity.map(t => (
                  <div key={t.label} className="text-center p-2 rounded border" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
                    <div className="text-[20px] font-bold" style={{ color: t.color }}>{t.value}</div>
                    <div className="text-[10px]" style={{ color: 'hsl(215, 10%, 45%)' }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
            <div className="px-3 py-2 border-b" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
              <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Recent Threats</span>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr style={{ background: 'hsl(215, 30%, 28%)', color: 'hsl(0, 0%, 100%)' }}>
                  <th className="px-3 py-1.5 text-left font-medium">Time</th>
                  <th className="px-3 py-1.5 text-left font-medium">Threat</th>
                  <th className="px-3 py-1.5 text-left font-medium">Severity</th>
                  <th className="px-3 py-1.5 text-left font-medium">Source</th>
                  <th className="px-3 py-1.5 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {threatLogs.slice(0, 5).map((t, i) => {
                  const sevColors: Record<string, { bg: string; fg: string }> = {
                    critical: { bg: 'hsl(0, 72%, 92%)', fg: 'hsl(0, 72%, 40%)' },
                    high: { bg: 'hsl(30, 90%, 92%)', fg: 'hsl(30, 80%, 35%)' },
                    medium: { bg: 'hsl(45, 100%, 92%)', fg: 'hsl(45, 80%, 35%)' },
                    low: { bg: 'hsl(207, 80%, 92%)', fg: 'hsl(207, 80%, 35%)' },
                    informational: { bg: 'hsl(210, 10%, 94%)', fg: 'hsl(215, 10%, 45%)' },
                  };
                  const sc = sevColors[t.severity] || sevColors.informational;
                  return (
                    <tr key={t.id} style={{ background: i % 2 === 0 ? 'hsl(0, 0%, 100%)' : 'hsl(210, 15%, 97%)' }}>
                      <td className="px-3 py-1.5" style={{ color: 'hsl(215, 10%, 45%)' }}>{t.timestamp}</td>
                      <td className="px-3 py-1.5 font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{t.threatName}</td>
                      <td className="px-3 py-1.5"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium capitalize" style={{ background: sc.bg, color: sc.fg }}>{t.severity}</span></td>
                      <td className="px-3 py-1.5" style={{ color: 'hsl(215, 25%, 15%)' }}>{t.sourceIP}</td>
                      <td className="px-3 py-1.5" style={{ color: 'hsl(215, 10%, 45%)' }}>{t.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {accTab === 'blocked' && (
        <div className="border rounded p-4" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
          <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Blocked Activity Summary</span>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { label: 'Blocked Applications', count: 3, color: 'hsl(0, 72%, 51%)' },
              { label: 'Denied Sessions', count: threatLogs.filter(t => t.action !== 'alert').length, color: 'hsl(30, 90%, 55%)' },
              { label: 'URL Blocks', count: 12, color: 'hsl(207, 80%, 52%)' },
            ].map(b => (
              <div key={b.label} className="text-center p-3 rounded border" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
                <div className="text-[24px] font-bold" style={{ color: b.color }}>{b.count}</div>
                <div className="text-[11px]" style={{ color: 'hsl(215, 10%, 45%)' }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {accTab === 'tunnel' && (
        <div className="p-8 text-center text-[12px]" style={{ color: 'hsl(215, 10%, 45%)' }}>
          No tunnel activity data available for the selected time range.
        </div>
      )}
    </div>
  );
};

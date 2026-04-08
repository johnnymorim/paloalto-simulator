import { useState } from 'react';
import { PanSidebar, SidebarItem } from '@/components/panos/PanSidebar';
import { PanTable } from '@/components/panos/PanTable';
import { useFirewall } from '@/contexts/FirewallContext';
import { TrafficLog, ThreatLog } from '@/data/mockData';
import { Filter, RefreshCw } from 'lucide-react';

const sidebarItems: SidebarItem[] = [
  { id: 'logs', label: 'Logs', children: [
    { id: 'traffic', label: 'Traffic' },
    { id: 'threat', label: 'Threat' },
    { id: 'url', label: 'URL Filtering' },
    { id: 'data', label: 'Data Filtering' },
    { id: 'wildfire', label: 'WildFire Submissions' },
  ]},
  { id: 'session-browser', label: 'Session Browser' },
  { id: 'packet-capture', label: 'Packet Capture' },
  { id: 'app-scope', label: 'App Scope', children: [
    { id: 'summary', label: 'Summary' },
    { id: 'change-monitor', label: 'Change Monitor' },
    { id: 'threat-monitor', label: 'Threat Monitor' },
    { id: 'network-monitor', label: 'Network Monitor' },
  ]},
  { id: 'reports', label: 'Reports' },
  { id: 'pdf-reports', label: 'PDF Reports' },
  { id: 'custom-reports', label: 'Custom Reports' },
];

const severityStyles: Record<string, { bg: string; color: string }> = {
  critical: { bg: 'hsl(0, 72%, 92%)', color: 'hsl(0, 72%, 40%)' },
  high: { bg: 'hsl(30, 90%, 92%)', color: 'hsl(30, 80%, 35%)' },
  medium: { bg: 'hsl(45, 100%, 92%)', color: 'hsl(45, 80%, 35%)' },
  low: { bg: 'hsl(207, 80%, 92%)', color: 'hsl(207, 80%, 35%)' },
  informational: { bg: 'hsl(210, 10%, 94%)', color: 'hsl(215, 10%, 45%)' },
};

export const MonitorPage = () => {
  const { trafficLogs, threatLogs } = useFirewall();
  const [activeSidebar, setActiveSidebar] = useState('traffic');
  const [filterText, setFilterText] = useState('');

  const filteredTraffic = trafficLogs.filter(l =>
    !filterText || Object.values(l).some(v => String(v).toLowerCase().includes(filterText.toLowerCase()))
  );
  const filteredThreats = threatLogs.filter(l =>
    !filterText || Object.values(l).some(v => String(v).toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      <PanSidebar items={sidebarItems} activeItem={activeSidebar} onItemClick={setActiveSidebar} />
      <div className="flex-1 overflow-auto panos-scrollbar">
        <div className="p-3 space-y-2">
          {/* Filter bar */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" style={{ color: 'hsl(215, 10%, 45%)' }} />
            <input
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              placeholder="Filter logs... (e.g. source IP, application, action)"
              className="flex-1 px-2 py-1.5 text-[11px] border rounded"
              style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}
            />
            <button className="flex items-center gap-1 px-2 py-1.5 text-[11px] rounded border"
                    style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {activeSidebar === 'traffic' && (
            <>
              <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Traffic Logs ({filteredTraffic.length})</span>
              <PanTable<TrafficLog>
                columns={[
                  { key: 'timestamp', label: 'Time', width: '140px' },
                  { key: 'sourceIP', label: 'Source', width: '120px' },
                  { key: 'sourcePort', label: 'Src Port', width: '65px' },
                  { key: 'destinationIP', label: 'Destination', width: '120px' },
                  { key: 'destinationPort', label: 'Dst Port', width: '65px' },
                  { key: 'application', label: 'Application', width: '110px' },
                  { key: 'action', label: 'Action', width: '60px', render: r => (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{
                      background: r.action === 'allow' ? 'hsl(100, 55%, 90%)' : 'hsl(0, 72%, 92%)',
                      color: r.action === 'allow' ? 'hsl(100, 55%, 30%)' : 'hsl(0, 72%, 40%)',
                    }}>{r.action}</span>
                  )},
                  { key: 'bytes', label: 'Bytes', width: '70px', render: r => r.bytes.toLocaleString() },
                  { key: 'rule', label: 'Rule' },
                ]}
                data={filteredTraffic}
                rowKey={r => r.id}
              />
            </>
          )}

          {activeSidebar === 'threat' && (
            <>
              <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Threat Logs ({filteredThreats.length})</span>
              <PanTable<ThreatLog>
                columns={[
                  { key: 'timestamp', label: 'Time', width: '140px' },
                  { key: 'sourceIP', label: 'Source', width: '120px' },
                  { key: 'destinationIP', label: 'Destination', width: '120px' },
                  { key: 'threatName', label: 'Threat', width: '180px' },
                  { key: 'severity', label: 'Severity', width: '90px', render: r => {
                    const s = severityStyles[r.severity] || severityStyles.informational;
                    return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium capitalize" style={{ background: s.bg, color: s.color }}>{r.severity}</span>;
                  }},
                  { key: 'action', label: 'Action', width: '80px' },
                  { key: 'direction', label: 'Direction', width: '120px' },
                  { key: 'rule', label: 'Rule' },
                ]}
                data={filteredThreats}
                rowKey={r => r.id}
              />
            </>
          )}

          {!['traffic', 'threat'].includes(activeSidebar) && (
            <div className="p-8 text-center text-[12px]" style={{ color: 'hsl(215, 10%, 45%)' }}>Select Traffic or Threat logs from the sidebar.</div>
          )}
        </div>
      </div>
    </div>
  );
};

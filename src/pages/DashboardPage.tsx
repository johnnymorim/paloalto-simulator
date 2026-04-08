import { useFirewall } from '@/contexts/FirewallContext';
import { Activity, Cpu, HardDrive, Shield, Globe, Wifi } from 'lucide-react';

const GaugeWidget = ({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="p-3 border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
      <div className="text-[11px] font-medium mb-2" style={{ color: 'hsl(215, 25%, 15%)' }}>{label}</div>
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(210, 10%, 90%)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
                    strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color: 'hsl(215, 25%, 15%)' }}>
            {pct}%
          </div>
        </div>
        <div className="text-[10px]" style={{ color: 'hsl(215, 10%, 45%)' }}>
          <div>{value.toLocaleString()} {unit}</div>
          <div>/ {max.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { systemInfo, securityRules, interfaces, threatLogs, trafficLogs } = useFirewall();

  const topApps = [
    { name: 'ssl', sessions: 4521, bytes: '2.3 GB', risk: 3 },
    { name: 'web-browsing', sessions: 3892, bytes: '1.8 GB', risk: 3 },
    { name: 'dns', sessions: 2341, bytes: '45 MB', risk: 1 },
    { name: 'smtp', sessions: 891, bytes: '234 MB', risk: 2 },
    { name: 'ssh', sessions: 234, bytes: '12 MB', risk: 1 },
    { name: 'youtube-base', sessions: 189, bytes: '890 MB', risk: 3 },
    { name: 'ms-ds-smbv3', sessions: 156, bytes: '67 MB', risk: 2 },
    { name: 'ping', sessions: 89, bytes: '1.2 MB', risk: 1 },
  ];

  return (
    <div className="p-4 space-y-4 overflow-auto panos-scrollbar" style={{ background: 'hsl(210, 15%, 97%)' }}>
      {/* General Info */}
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-2 p-3 border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" style={{ color: 'hsl(207, 80%, 52%)' }} />
            <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>General Information</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
            {[
              ['Hostname', systemInfo.hostname],
              ['Model', systemInfo.model],
              ['Serial #', systemInfo.serial],
              ['PAN-OS', systemInfo.panosVersion],
              ['App Version', systemInfo.appVersion],
              ['Threat Version', systemInfo.threatVersion],
              ['WildFire', systemInfo.wildfireVersion],
              ['URL DB', systemInfo.urlFilteringVersion],
              ['Uptime', systemInfo.uptime],
              ['IP Address', systemInfo.ipAddress],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-0.5 border-b" style={{ borderColor: 'hsl(210, 10%, 94%)' }}>
                <span style={{ color: 'hsl(215, 10%, 45%)' }}>{k}:</span>
                <span className="font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <GaugeWidget label="CPU" value={systemInfo.cpuUsage} max={100} unit="%" color="hsl(207, 80%, 52%)" />
        <GaugeWidget label="Memory" value={systemInfo.memoryUsage} max={100} unit="%" color="hsl(100, 55%, 53%)" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <GaugeWidget label="Active Sessions" value={systemInfo.sessionCount} max={systemInfo.maxSessions} unit="sessions" color="hsl(30, 90%, 55%)" />

        {/* Interfaces Summary */}
        <div className="p-3 border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-4 h-4" style={{ color: 'hsl(207, 80%, 52%)' }} />
            <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Interface Status</span>
          </div>
          <div className="space-y-1">
            {interfaces.slice(0, 5).map(iface => (
              <div key={iface.name} className="flex items-center justify-between text-[11px] py-0.5">
                <span style={{ color: 'hsl(215, 25%, 15%)' }}>{iface.name}</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full"
                        style={{ background: iface.linkState === 'up' ? 'hsl(100, 55%, 53%)' : 'hsl(0, 0%, 70%)' }} />
                  <span className="text-[10px]" style={{ color: 'hsl(215, 10%, 45%)' }}>{iface.linkState}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Summary */}
        <div className="p-3 border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4" style={{ color: 'hsl(207, 80%, 52%)' }} />
            <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Policy Summary</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between py-0.5">
              <span style={{ color: 'hsl(215, 10%, 45%)' }}>Security Rules:</span>
              <span className="font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{securityRules.length}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span style={{ color: 'hsl(215, 10%, 45%)' }}>Active Rules:</span>
              <span className="font-medium" style={{ color: 'hsl(100, 55%, 40%)' }}>{securityRules.filter(r => !r.disabled).length}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span style={{ color: 'hsl(215, 10%, 45%)' }}>Disabled Rules:</span>
              <span className="font-medium" style={{ color: 'hsl(30, 90%, 55%)' }}>{securityRules.filter(r => r.disabled).length}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span style={{ color: 'hsl(215, 10%, 45%)' }}>Threats Blocked:</span>
              <span className="font-medium" style={{ color: 'hsl(0, 72%, 51%)' }}>{threatLogs.filter(t => t.action !== 'alert').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Applications */}
      <div className="p-3 border rounded" style={{ background: 'hsl(0, 0%, 100%)', borderColor: 'hsl(214, 20%, 82%)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4" style={{ color: 'hsl(207, 80%, 52%)' }} />
          <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Top Applications</span>
        </div>
        <div className="space-y-1">
          {topApps.map(app => (
            <div key={app.name} className="flex items-center gap-3 text-[11px]">
              <span className="w-[120px] font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{app.name}</span>
              <div className="flex-1 h-[14px] rounded-full overflow-hidden" style={{ background: 'hsl(210, 10%, 94%)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${(app.sessions / topApps[0].sessions) * 100}%`,
                  background: app.risk <= 1 ? 'hsl(100, 55%, 53%)' : app.risk <= 3 ? 'hsl(207, 80%, 52%)' : 'hsl(0, 72%, 51%)',
                }} />
              </div>
              <span className="w-[60px] text-right" style={{ color: 'hsl(215, 10%, 45%)' }}>{app.sessions.toLocaleString()}</span>
              <span className="w-[60px] text-right" style={{ color: 'hsl(215, 10%, 45%)' }}>{app.bytes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

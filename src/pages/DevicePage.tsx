import { PanSidebar, SidebarItem } from '@/components/panos/PanSidebar';
import { PanTable } from '@/components/panos/PanTable';
import { useState } from 'react';
import { useFirewall } from '@/contexts/FirewallContext';
import { License } from '@/data/mockData';

const sidebarItems: SidebarItem[] = [
  { id: 'setup', label: 'Setup', children: [
    { id: 'management', label: 'Management' },
    { id: 'operations', label: 'Operations' },
    { id: 'hsm', label: 'HSM' },
    { id: 'services', label: 'Services' },
    { id: 'interfaces', label: 'Interfaces' },
    { id: 'telemetry', label: 'Telemetry' },
    { id: 'content-id', label: 'Content-ID' },
    { id: 'wildfire-settings', label: 'WildFire' },
    { id: 'session', label: 'Session' },
  ]},
  { id: 'config-audit', label: 'Config Audit' },
  { id: 'administrators', label: 'Administrators' },
  { id: 'admin-roles', label: 'Admin Roles' },
  { id: 'access-domain', label: 'Access Domain' },
  { id: 'authentication', label: 'Authentication Profile' },
  { id: 'user-id', label: 'User-ID', children: [
    { id: 'uid-agent', label: 'User-ID Agent Setup' },
    { id: 'uid-group-mapping', label: 'Group Mapping Settings' },
    { id: 'uid-connection-security', label: 'Connection Security' },
    { id: 'uid-terminal-services', label: 'Terminal Services Agent' },
  ]},
  { id: 'certificate-mgmt', label: 'Certificate Management', children: [
    { id: 'certificates', label: 'Certificates' },
    { id: 'certificate-profile', label: 'Certificate Profile' },
    { id: 'ocsp-responder', label: 'OCSP Responder' },
    { id: 'ssl-tls', label: 'SSL/TLS Service Profile' },
    { id: 'scep', label: 'SCEP' },
  ]},
  { id: 'response-pages', label: 'Response Pages' },
  { id: 'log-settings', label: 'Log Settings' },
  { id: 'server-profiles', label: 'Server Profiles', children: [
    { id: 'syslog', label: 'Syslog' },
    { id: 'email-server', label: 'Email' },
    { id: 'snmp-trap', label: 'SNMP Trap' },
    { id: 'radius', label: 'RADIUS' },
    { id: 'tacplus', label: 'TACACS+' },
    { id: 'ldap', label: 'LDAP' },
    { id: 'kerberos', label: 'Kerberos' },
    { id: 'saml', label: 'SAML IdP' },
  ]},
  { id: 'local-user-db', label: 'Local User Database' },
  { id: 'ha', label: 'High Availability' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'software', label: 'Software' },
  { id: 'dynamic-updates', label: 'Dynamic Updates' },
  { id: 'support', label: 'Support' },
];

export const DevicePage = () => {
  const [activeSidebar, setActiveSidebar] = useState('management');
  const { systemInfo, licenses, systemLogs } = useFirewall();

  const renderManagement = () => (
    <div className="p-4 space-y-3">
      <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Management Settings</span>
      <div className="border rounded" style={{ borderColor: 'hsl(214, 20%, 82%)', background: 'hsl(0, 0%, 100%)' }}>
        <div className="px-3 py-2 border-b text-[11px] font-semibold" style={{ background: 'hsl(210, 15%, 97%)', borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
          General Settings
        </div>
        <div className="p-3 space-y-2 text-[11px]">
          {[
            ['Hostname', systemInfo.hostname],
            ['Domain', 'lab.local'],
            ['Login Banner', 'Authorized Access Only'],
            ['Timezone', 'US/Pacific'],
            ['Panorama Server', 'Not configured'],
            ['DNS Primary', '8.8.8.8'],
            ['DNS Secondary', '8.8.4.4'],
            ['NTP Server', 'pool.ntp.org'],
          ].map(([k, v]) => (
            <div key={k} className="flex py-0.5">
              <span className="w-[180px] font-medium" style={{ color: 'hsl(215, 10%, 45%)' }}>{k}:</span>
              <span style={{ color: 'hsl(215, 25%, 15%)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded" style={{ borderColor: 'hsl(214, 20%, 82%)', background: 'hsl(0, 0%, 100%)' }}>
        <div className="px-3 py-2 border-b text-[11px] font-semibold" style={{ background: 'hsl(210, 15%, 97%)', borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
          Software Information
        </div>
        <div className="p-3 space-y-2 text-[11px]">
          {[
            ['PAN-OS Version', systemInfo.panosVersion],
            ['App and Threat', systemInfo.appVersion],
            ['GlobalProtect Agent', systemInfo.globalProtectVersion],
            ['URL Filtering', systemInfo.urlFilteringVersion],
            ['WildFire', systemInfo.wildfireVersion],
          ].map(([k, v]) => (
            <div key={k} className="flex py-0.5">
              <span className="w-[180px] font-medium" style={{ color: 'hsl(215, 10%, 45%)' }}>{k}:</span>
              <span style={{ color: 'hsl(215, 25%, 15%)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLicenses = () => (
    <div className="p-4 space-y-3">
      <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Licenses</span>
      <PanTable<License>
        columns={[
          { key: 'feature', label: 'Feature', width: '180px' },
          { key: 'description', label: 'Description', width: '200px' },
          { key: 'issued', label: 'Issued', width: '100px' },
          { key: 'expires', label: 'Expires', width: '100px' },
          { key: 'expired', label: 'Status', width: '80px', render: r => (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{
              background: r.expired ? 'hsl(0, 72%, 92%)' : 'hsl(100, 55%, 90%)',
              color: r.expired ? 'hsl(0, 72%, 40%)' : 'hsl(100, 55%, 30%)',
            }}>{r.expired ? 'Expired' : 'Active'}</span>
          )},
          { key: 'authCode', label: 'Auth Code', width: '120px' },
        ]}
        data={licenses}
        rowKey={r => r.feature}
      />
    </div>
  );

  const renderHA = () => (
    <div className="p-4 space-y-3">
      <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>High Availability</span>
      <div className="border rounded" style={{ borderColor: 'hsl(214, 20%, 82%)', background: 'hsl(0, 0%, 100%)' }}>
        <div className="px-3 py-2 border-b text-[11px] font-semibold" style={{ background: 'hsl(210, 15%, 97%)', borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>HA Status</div>
        <div className="p-3 space-y-2 text-[11px]">
          {[
            ['Local State', systemInfo.haState],
            ['Peer State', systemInfo.haPeerState],
            ['Peer Serial', systemInfo.haPeerSerial],
            ['HA Mode', 'Active/Passive'],
            ['Config Sync', 'Synchronized'],
          ].map(([k, v]) => (
            <div key={k} className="flex py-0.5">
              <span className="w-[180px] font-medium" style={{ color: 'hsl(215, 10%, 45%)' }}>{k}:</span>
              <span style={{ color: 'hsl(215, 25%, 15%)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfigAudit = () => (
    <div className="p-4 space-y-3">
      <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Config Audit</span>
      <p className="text-[11px]" style={{ color: 'hsl(215, 10%, 45%)' }}>Compare running and candidate configurations.</p>
      <div className="border rounded" style={{ borderColor: 'hsl(214, 20%, 82%)', background: 'hsl(0, 0%, 100%)' }}>
        <div className="p-3 space-y-2">
          {systemLogs.filter(l => l.type === 'config').slice(0, 5).map(l => (
            <div key={l.id} className="flex justify-between text-[11px] py-1 border-b" style={{ borderColor: 'hsl(210, 10%, 94%)' }}>
              <span style={{ color: 'hsl(215, 10%, 45%)' }}>{l.timestamp}</span>
              <span style={{ color: 'hsl(215, 25%, 15%)' }}>{l.description}</span>
              <span className="font-medium" style={{ color: 'hsl(207, 80%, 52%)' }}>{l.admin}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserID = () => (
    <div className="p-4 space-y-3">
      <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>User-ID Agent Setup</span>
      <div className="border rounded" style={{ borderColor: 'hsl(214, 20%, 82%)', background: 'hsl(0, 0%, 100%)' }}>
        <div className="px-3 py-2 border-b text-[11px] font-semibold" style={{ background: 'hsl(210, 15%, 97%)', borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 25%, 15%)' }}>
          User-ID Agent Configuration
        </div>
        <div className="p-3 space-y-2 text-[11px]">
          {[
            ['User-ID', 'Enabled'],
            ['Server Monitor Account', 'domain\\svc-paloalto'],
            ['Syslog Listener UDP', '514'],
            ['Security Log Monitor', 'Enabled'],
            ['WMI Probing', 'Enabled'],
            ['Captive Portal', 'Disabled'],
          ].map(([k, v]) => (
            <div key={k} className="flex py-0.5">
              <span className="w-[200px] font-medium" style={{ color: 'hsl(215, 10%, 45%)' }}>{k}:</span>
              <span style={{ color: 'hsl(215, 25%, 15%)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const contentMap: Record<string, () => JSX.Element> = {
    management: renderManagement,
    licenses: renderLicenses,
    ha: renderHA,
    'config-audit': renderConfigAudit,
    'uid-agent': renderUserID,
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <PanSidebar items={sidebarItems} activeItem={activeSidebar} onItemClick={setActiveSidebar} />
      <div className="flex-1 overflow-auto panos-scrollbar">
        {contentMap[activeSidebar] ? contentMap[activeSidebar]() : (
          <div className="p-8 text-center text-[12px]" style={{ color: 'hsl(215, 10%, 45%)' }}>
            Select an item from the sidebar to view or configure.
          </div>
        )}
      </div>
    </div>
  );
};

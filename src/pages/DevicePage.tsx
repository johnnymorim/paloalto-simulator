import { PanSidebar, SidebarItem } from '@/components/panos/PanSidebar';
import { useState } from 'react';
import { useFirewall } from '@/contexts/FirewallContext';

const sidebarItems: SidebarItem[] = [
  { id: 'setup', label: 'Setup', children: [
    { id: 'management', label: 'Management' },
    { id: 'operations', label: 'Operations' },
    { id: 'services', label: 'Services' },
    { id: 'interfaces', label: 'Interfaces' },
    { id: 'telemetry', label: 'Telemetry' },
    { id: 'content-id', label: 'Content-ID' },
    { id: 'wildfire-settings', label: 'WildFire' },
    { id: 'session', label: 'Session' },
  ]},
  { id: 'administrators', label: 'Administrators' },
  { id: 'admin-roles', label: 'Admin Roles' },
  { id: 'access-domain', label: 'Access Domain' },
  { id: 'authentication', label: 'Authentication Profile' },
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
  const { systemInfo } = useFirewall();

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

  return (
    <div className="flex flex-1 overflow-hidden">
      <PanSidebar items={sidebarItems} activeItem={activeSidebar} onItemClick={setActiveSidebar} />
      <div className="flex-1 overflow-auto panos-scrollbar">
        {activeSidebar === 'management' ? renderManagement() : (
          <div className="p-8 text-center text-[12px]" style={{ color: 'hsl(215, 10%, 45%)' }}>
            Select an item from the sidebar to view or configure.
          </div>
        )}
      </div>
    </div>
  );
};

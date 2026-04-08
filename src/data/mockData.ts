export interface FirewallInterface {
  name: string;
  type: 'Layer3' | 'Layer2' | 'Virtual Wire' | 'Tap' | 'HA';
  zone: string;
  ipAddress: string;
  virtualRouter: string;
  linkState: 'up' | 'down';
  speed: string;
  mtu: number;
  managementProfile: string;
  comment: string;
}

export interface Zone {
  name: string;
  type: 'Layer3' | 'Layer2' | 'Virtual Wire' | 'Tap';
  interfaces: string[];
  zoneProtectionProfile: string;
  logSetting: string;
  enableUserIdentification: boolean;
}

export interface StaticRoute {
  name: string;
  destination: string;
  nextHop: string;
  interface: string;
  metric: number;
  virtualRouter: string;
}

export interface SecurityRule {
  id: string;
  name: string;
  ruleType: 'universal' | 'intrazone' | 'interzone';
  sourceZone: string[];
  sourceAddress: string[];
  negateSource: boolean;
  sourceUser: string[];
  destinationZone: string[];
  destinationAddress: string[];
  negateDestination: boolean;
  application: string[];
  service: string[];
  urlCategory: string[];
  action: 'allow' | 'deny' | 'drop' | 'reset-client' | 'reset-server' | 'reset-both';
  profile: string;
  profileType: 'none' | 'group' | 'profiles';
  logStart: boolean;
  logEnd: boolean;
  logForwarding: string;
  schedule: string;
  qosMarking: string;
  disableServerResponseInspection: boolean;
  disabled: boolean;
  hitCount: number;
  description: string;
  tag: string[];
}

export interface NATRule {
  id: string;
  name: string;
  description: string;
  tag: string[];
  natType: 'ipv4' | 'nat64' | 'nptv6';
  // Original Packet
  sourceZone: string[];
  destinationZone: string;
  destinationInterface: string;
  sourceAddress: string[];
  destinationAddress: string;
  service: string;
  // Translated Packet
  sourceTranslationType: 'None' | 'Dynamic IP And Port' | 'Dynamic IP' | 'Static IP';
  sourceTranslatedAddress: string;
  sourceTranslatedInterface: string;
  biDirectional: boolean;
  destinationTranslatedAddress: string;
  destinationTranslatedPort: string;
  disabled: boolean;
}

export interface AddressObject {
  name: string;
  type: 'IP Netmask' | 'IP Range' | 'FQDN';
  value: string;
  description: string;
  tag: string[];
}

export interface AddressGroup {
  name: string;
  type: 'static' | 'dynamic';
  members: string[];
  filter: string;
  description: string;
  tag: string[];
}

export interface ServiceObject {
  name: string;
  protocol: 'TCP' | 'UDP' | 'TCP/UDP';
  destinationPort: string;
  sourcePort: string;
  description: string;
}

export interface SecurityProfile {
  name: string;
  type: 'antivirus' | 'anti-spyware' | 'vulnerability' | 'url-filtering' | 'file-blocking' | 'wildfire-analysis';
  description: string;
  decoderActions?: Record<string, string>;
  severityActions?: Record<string, string>;
  categories?: Record<string, string>;
  rules?: { fileType: string; direction: string; action: string }[];
}

export interface TrafficLog {
  id: string;
  timestamp: string;
  sourceIP: string;
  sourcePort: number;
  destinationIP: string;
  destinationPort: number;
  application: string;
  action: string;
  bytes: number;
  rule: string;
  sourceZone: string;
  destinationZone: string;
}

export interface ThreatLog {
  id: string;
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  threatName: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  action: string;
  direction: 'client-to-server' | 'server-to-client';
  application: string;
  rule: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'system' | 'config';
  subtype: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  description: string;
  admin?: string;
  client?: string;
  result?: string;
}

export interface License {
  feature: string;
  description: string;
  issued: string;
  expires: string;
  expired: boolean;
  authCode: string;
}

export const defaultInterfaces: FirewallInterface[] = [
  { name: 'ethernet1/1', type: 'Layer3', zone: 'untrust', ipAddress: '203.0.113.1/24', virtualRouter: 'default', linkState: 'up', speed: '1Gbps', mtu: 1500, managementProfile: '', comment: 'Outside interface' },
  { name: 'ethernet1/2', type: 'Layer3', zone: 'trust', ipAddress: '192.168.1.1/24', virtualRouter: 'default', linkState: 'up', speed: '1Gbps', mtu: 1500, managementProfile: 'allow-ping', comment: 'Inside interface' },
  { name: 'ethernet1/3', type: 'Layer3', zone: 'dmz', ipAddress: '10.0.1.1/24', virtualRouter: 'default', linkState: 'up', speed: '1Gbps', mtu: 1500, managementProfile: '', comment: 'DMZ interface' },
  { name: 'ethernet1/4', type: 'Layer3', zone: 'trust', ipAddress: '192.168.2.1/24', virtualRouter: 'default', linkState: 'up', speed: '1Gbps', mtu: 1500, managementProfile: '', comment: 'Secondary LAN' },
  { name: 'ethernet1/5', type: 'Layer3', zone: '', ipAddress: '', virtualRouter: '', linkState: 'down', speed: '1Gbps', mtu: 1500, managementProfile: '', comment: '' },
  { name: 'ethernet1/6', type: 'Layer3', zone: '', ipAddress: '', virtualRouter: '', linkState: 'down', speed: '1Gbps', mtu: 1500, managementProfile: '', comment: '' },
  { name: 'ethernet1/7', type: 'Layer3', zone: '', ipAddress: '', virtualRouter: '', linkState: 'down', speed: '10Gbps', mtu: 1500, managementProfile: '', comment: '' },
  { name: 'ethernet1/8', type: 'Layer3', zone: '', ipAddress: '', virtualRouter: '', linkState: 'down', speed: '10Gbps', mtu: 1500, managementProfile: '', comment: '' },
];

export const defaultZones: Zone[] = [
  { name: 'trust', type: 'Layer3', interfaces: ['ethernet1/2', 'ethernet1/4'], zoneProtectionProfile: 'zone-protection-trust', logSetting: 'default', enableUserIdentification: true },
  { name: 'untrust', type: 'Layer3', interfaces: ['ethernet1/1'], zoneProtectionProfile: 'zone-protection-untrust', logSetting: 'default', enableUserIdentification: false },
  { name: 'dmz', type: 'Layer3', interfaces: ['ethernet1/3'], zoneProtectionProfile: 'zone-protection-dmz', logSetting: 'default', enableUserIdentification: false },
];

export const defaultStaticRoutes: StaticRoute[] = [
  { name: 'default-route', destination: '0.0.0.0/0', nextHop: '203.0.113.254', interface: 'ethernet1/1', metric: 10, virtualRouter: 'default' },
  { name: 'internal-route', destination: '10.10.0.0/16', nextHop: '192.168.1.254', interface: 'ethernet1/2', metric: 10, virtualRouter: 'default' },
  { name: 'dmz-servers', destination: '10.0.1.0/24', nextHop: '', interface: 'ethernet1/3', metric: 10, virtualRouter: 'default' },
];

export const defaultSecurityRules: SecurityRule[] = [
  { id: '1', name: 'Allow DNS', ruleType: 'universal', sourceZone: ['trust'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['untrust'], destinationAddress: ['any'], negateDestination: false, application: ['dns'], service: ['application-default'], urlCategory: ['any'], action: 'allow', profile: 'Outbound-Security', profileType: 'group', logStart: false, logEnd: true, logForwarding: 'default', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 15420, description: 'Allow DNS queries to internet', tag: ['dns'] },
  { id: '2', name: 'Allow Web Browsing', ruleType: 'universal', sourceZone: ['trust'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['untrust'], destinationAddress: ['any'], negateDestination: false, application: ['web-browsing', 'ssl'], service: ['application-default'], urlCategory: ['any'], action: 'allow', profile: 'Outbound-Security', profileType: 'group', logStart: false, logEnd: true, logForwarding: 'default', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 89234, description: 'Allow web traffic outbound', tag: ['web'] },
  { id: '3', name: 'Allow Email', ruleType: 'universal', sourceZone: ['trust'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['untrust'], destinationAddress: ['any'], negateDestination: false, application: ['smtp', 'imap', 'pop3'], service: ['application-default'], urlCategory: ['any'], action: 'allow', profile: 'Outbound-Security', profileType: 'group', logStart: false, logEnd: true, logForwarding: 'default', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 5621, description: 'Allow email protocols', tag: ['email'] },
  { id: '4', name: 'DMZ Web Servers', ruleType: 'universal', sourceZone: ['untrust'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['dmz'], destinationAddress: ['WebServer-1', 'WebServer-2'], negateDestination: false, application: ['web-browsing', 'ssl'], service: ['service-http', 'service-https'], urlCategory: ['any'], action: 'allow', profile: 'Inbound-Security', profileType: 'group', logStart: true, logEnd: true, logForwarding: 'default', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 45678, description: 'Allow inbound web to DMZ', tag: ['dmz', 'web'] },
  { id: '5', name: 'Trust to DMZ', ruleType: 'universal', sourceZone: ['trust'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['dmz'], destinationAddress: ['any'], negateDestination: false, application: ['any'], service: ['any'], urlCategory: ['any'], action: 'allow', profile: 'Internal-Security', profileType: 'group', logStart: false, logEnd: true, logForwarding: '', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 12340, description: 'Allow trust to dmz access', tag: [] },
  { id: '6', name: 'Allow ICMP', ruleType: 'universal', sourceZone: ['trust'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['untrust'], destinationAddress: ['any'], negateDestination: false, application: ['ping'], service: ['application-default'], urlCategory: ['any'], action: 'allow', profile: '', profileType: 'none', logStart: false, logEnd: true, logForwarding: '', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 3456, description: 'Allow ping outbound', tag: [] },
  { id: '7', name: 'VPN Access', ruleType: 'universal', sourceZone: ['untrust'], sourceAddress: ['VPN-Pool'], negateSource: false, sourceUser: ['any'], destinationZone: ['trust'], destinationAddress: ['any'], negateDestination: false, application: ['any'], service: ['any'], urlCategory: ['any'], action: 'allow', profile: 'VPN-Security', profileType: 'group', logStart: true, logEnd: true, logForwarding: 'default', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 7890, description: 'Allow VPN users to internal', tag: ['vpn'] },
  { id: '8', name: 'Block Social Media', ruleType: 'universal', sourceZone: ['trust'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['untrust'], destinationAddress: ['any'], negateDestination: false, application: ['facebook-base', 'twitter-base', 'instagram'], service: ['application-default'], urlCategory: ['any'], action: 'deny', profile: '', profileType: 'none', logStart: false, logEnd: true, logForwarding: '', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 2341, description: 'Block social media apps', tag: ['social'] },
  { id: '9', name: 'Allow FTP to DMZ', ruleType: 'universal', sourceZone: ['trust'], sourceAddress: ['Admin-Subnet'], negateSource: false, sourceUser: ['any'], destinationZone: ['dmz'], destinationAddress: ['any'], negateDestination: false, application: ['ftp'], service: ['application-default'], urlCategory: ['any'], action: 'allow', profile: 'Internal-Security', profileType: 'group', logStart: true, logEnd: true, logForwarding: '', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: true, hitCount: 123, description: 'FTP access for admins', tag: ['ftp'] },
  { id: '10', name: 'SSH Management', ruleType: 'intrazone', sourceZone: ['trust'], sourceAddress: ['Admin-Subnet'], negateSource: false, sourceUser: ['any'], destinationZone: ['trust'], destinationAddress: ['Firewall-Mgmt'], negateDestination: false, application: ['ssh'], service: ['service-ssh'], urlCategory: ['any'], action: 'allow', profile: '', profileType: 'none', logStart: true, logEnd: true, logForwarding: '', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 890, description: 'SSH to firewall management', tag: ['mgmt'] },
  { id: '11', name: 'Block Torrents', ruleType: 'universal', sourceZone: ['any'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['any'], destinationAddress: ['any'], negateDestination: false, application: ['bittorrent'], service: ['any'], urlCategory: ['any'], action: 'deny', profile: '', profileType: 'none', logStart: false, logEnd: true, logForwarding: '', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 567, description: 'Block all torrent traffic', tag: [] },
  { id: '12', name: 'Default Deny', ruleType: 'universal', sourceZone: ['any'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'], destinationZone: ['any'], destinationAddress: ['any'], negateDestination: false, application: ['any'], service: ['any'], urlCategory: ['any'], action: 'deny', profile: '', profileType: 'none', logStart: false, logEnd: true, logForwarding: 'default', schedule: '', qosMarking: '', disableServerResponseInspection: false, disabled: false, hitCount: 34521, description: 'Default deny rule', tag: [] },
];

export const defaultNATRules: NATRule[] = [
  { id: '1', name: 'Outbound NAT', description: 'Source NAT for outbound traffic', tag: [], natType: 'ipv4', sourceZone: ['trust'], destinationZone: 'untrust', destinationInterface: 'ethernet1/1', sourceAddress: ['any'], destinationAddress: 'any', service: 'any', sourceTranslationType: 'Dynamic IP And Port', sourceTranslatedAddress: '203.0.113.1', sourceTranslatedInterface: 'ethernet1/1', biDirectional: false, destinationTranslatedAddress: '', destinationTranslatedPort: '', disabled: false },
  { id: '2', name: 'DMZ Outbound NAT', description: 'Source NAT for DMZ outbound', tag: [], natType: 'ipv4', sourceZone: ['dmz'], destinationZone: 'untrust', destinationInterface: 'ethernet1/1', sourceAddress: ['any'], destinationAddress: 'any', service: 'any', sourceTranslationType: 'Dynamic IP And Port', sourceTranslatedAddress: '203.0.113.2', sourceTranslatedInterface: 'ethernet1/1', biDirectional: false, destinationTranslatedAddress: '', destinationTranslatedPort: '', disabled: false },
  { id: '3', name: 'WebServer-1 Inbound', description: 'DNAT to WebServer-1', tag: ['dmz'], natType: 'ipv4', sourceZone: ['untrust'], destinationZone: 'untrust', destinationInterface: 'ethernet1/1', sourceAddress: ['any'], destinationAddress: '203.0.113.10', service: 'service-http', sourceTranslationType: 'None', sourceTranslatedAddress: '', sourceTranslatedInterface: '', biDirectional: false, destinationTranslatedAddress: '10.0.1.10', destinationTranslatedPort: '80', disabled: false },
  { id: '4', name: 'WebServer-2 Inbound', description: 'DNAT to WebServer-2', tag: ['dmz'], natType: 'ipv4', sourceZone: ['untrust'], destinationZone: 'untrust', destinationInterface: 'ethernet1/1', sourceAddress: ['any'], destinationAddress: '203.0.113.11', service: 'service-https', sourceTranslationType: 'None', sourceTranslatedAddress: '', sourceTranslatedInterface: '', biDirectional: false, destinationTranslatedAddress: '10.0.1.11', destinationTranslatedPort: '443', disabled: false },
  { id: '5', name: 'Mail Server Inbound', description: 'DNAT to Mail Server', tag: [], natType: 'ipv4', sourceZone: ['untrust'], destinationZone: 'untrust', destinationInterface: 'ethernet1/1', sourceAddress: ['any'], destinationAddress: '203.0.113.12', service: 'service-smtp', sourceTranslationType: 'None', sourceTranslatedAddress: '', sourceTranslatedInterface: '', biDirectional: false, destinationTranslatedAddress: '10.0.1.12', destinationTranslatedPort: '25', disabled: false },
];

export const defaultAddressObjects: AddressObject[] = [
  { name: 'WebServer-1', type: 'IP Netmask', value: '10.0.1.10/32', description: 'Primary web server', tag: ['dmz', 'web'] },
  { name: 'WebServer-2', type: 'IP Netmask', value: '10.0.1.11/32', description: 'Secondary web server', tag: ['dmz', 'web'] },
  { name: 'Mail-Server', type: 'IP Netmask', value: '10.0.1.12/32', description: 'Mail server', tag: ['dmz', 'email'] },
  { name: 'Admin-Subnet', type: 'IP Netmask', value: '192.168.1.0/28', description: 'IT Admin subnet', tag: ['admin'] },
  { name: 'VPN-Pool', type: 'IP Range', value: '192.168.10.1-192.168.10.50', description: 'VPN address pool', tag: ['vpn'] },
  { name: 'Firewall-Mgmt', type: 'IP Netmask', value: '192.168.1.1/32', description: 'Firewall management IP', tag: ['mgmt'] },
  { name: 'DNS-Servers', type: 'IP Netmask', value: '8.8.8.0/24', description: 'Google DNS', tag: ['dns'] },
  { name: 'Update-Server', type: 'FQDN', value: 'updates.paloaltonetworks.com', description: 'PAN update server', tag: [] },
];

export const defaultAddressGroups: AddressGroup[] = [
  { name: 'DMZ-Servers', type: 'static', members: ['WebServer-1', 'WebServer-2', 'Mail-Server'], filter: '', description: 'All DMZ servers', tag: ['dmz'] },
  { name: 'Internal-Servers', type: 'static', members: ['Admin-Subnet', 'Firewall-Mgmt'], filter: '', description: 'Internal management hosts', tag: ['admin'] },
  { name: 'Blocked-IPs', type: 'dynamic', members: [], filter: "'malicious'", description: 'Dynamic blocked IPs', tag: ['security'] },
];

export const defaultServiceObjects: ServiceObject[] = [
  { name: 'service-http', protocol: 'TCP', destinationPort: '80', sourcePort: '', description: 'HTTP' },
  { name: 'service-https', protocol: 'TCP', destinationPort: '443', sourcePort: '', description: 'HTTPS' },
  { name: 'service-ssh', protocol: 'TCP', destinationPort: '22', sourcePort: '', description: 'SSH' },
  { name: 'service-smtp', protocol: 'TCP', destinationPort: '25', sourcePort: '', description: 'SMTP' },
  { name: 'service-dns', protocol: 'TCP/UDP', destinationPort: '53', sourcePort: '', description: 'DNS' },
  { name: 'service-ftp', protocol: 'TCP', destinationPort: '21', sourcePort: '', description: 'FTP' },
  { name: 'service-rdp', protocol: 'TCP', destinationPort: '3389', sourcePort: '', description: 'RDP' },
  { name: 'service-ntp', protocol: 'UDP', destinationPort: '123', sourcePort: '', description: 'NTP' },
];

export const defaultSecurityProfiles: SecurityProfile[] = [
  { name: 'Outbound-AV', type: 'antivirus', description: 'Antivirus for outbound traffic', decoderActions: { http: 'reset-both', smtp: 'reset-both', imap: 'reset-both', pop3: 'reset-both', ftp: 'reset-both', smb: 'reset-both' } },
  { name: 'Inbound-AV', type: 'antivirus', description: 'Antivirus for inbound traffic', decoderActions: { http: 'reset-both', smtp: 'alert', imap: 'alert', pop3: 'alert', ftp: 'reset-both', smb: 'reset-both' } },
  { name: 'Outbound-AS', type: 'anti-spyware', description: 'Anti-Spyware for outbound', severityActions: { critical: 'reset-both', high: 'reset-both', medium: 'alert', low: 'default', informational: 'allow' } },
  { name: 'Strict-AS', type: 'anti-spyware', description: 'Strict anti-spyware profile', severityActions: { critical: 'drop', high: 'drop', medium: 'reset-both', low: 'alert', informational: 'allow' } },
  { name: 'URL-Filter-Default', type: 'url-filtering', description: 'Default URL filtering profile', categories: { 'adult': 'block', 'malware': 'block', 'phishing': 'block', 'gambling': 'block', 'hacking': 'block', 'command-and-control': 'block', 'social-networking': 'alert', 'streaming-media': 'alert', 'web-advertisements': 'alert', 'business-and-economy': 'allow', 'education': 'allow', 'news': 'allow', 'search-engines': 'allow', 'government': 'allow', 'health-and-medicine': 'allow' } },
  { name: 'File-Block-Default', type: 'file-blocking', description: 'Default file blocking profile', rules: [
    { fileType: 'PE', direction: 'both', action: 'block' },
    { fileType: 'DLL', direction: 'both', action: 'block' },
    { fileType: 'EXE', direction: 'download', action: 'block' },
    { fileType: 'MSI', direction: 'download', action: 'alert' },
    { fileType: 'PDF', direction: 'both', action: 'alert' },
    { fileType: 'Flash', direction: 'both', action: 'block' },
  ]},
  { name: 'Vuln-Protect-Default', type: 'vulnerability', description: 'Default vulnerability protection', severityActions: { critical: 'reset-both', high: 'reset-both', medium: 'reset-client', low: 'default', informational: 'default' } },
  { name: 'WF-Analysis-Default', type: 'wildfire-analysis', description: 'Default WildFire analysis profile' },
];

export const defaultTrafficLogs: TrafficLog[] = [
  { id: '1', timestamp: '2026/04/08 09:15:23', sourceIP: '192.168.1.45', sourcePort: 52341, destinationIP: '142.250.80.46', destinationPort: 443, application: 'ssl', action: 'allow', bytes: 15234, rule: 'Allow Web Browsing', sourceZone: 'trust', destinationZone: 'untrust' },
  { id: '2', timestamp: '2026/04/08 09:15:22', sourceIP: '192.168.1.12', sourcePort: 49823, destinationIP: '8.8.8.8', destinationPort: 53, application: 'dns', action: 'allow', bytes: 128, rule: 'Allow DNS', sourceZone: 'trust', destinationZone: 'untrust' },
  { id: '3', timestamp: '2026/04/08 09:15:20', sourceIP: '203.0.113.55', sourcePort: 43210, destinationIP: '10.0.1.10', destinationPort: 80, application: 'web-browsing', action: 'allow', bytes: 8923, rule: 'DMZ Web Servers', sourceZone: 'untrust', destinationZone: 'dmz' },
  { id: '4', timestamp: '2026/04/08 09:15:18', sourceIP: '192.168.1.100', sourcePort: 51234, destinationIP: '31.13.72.36', destinationPort: 443, application: 'facebook-base', action: 'deny', bytes: 0, rule: 'Block Social Media', sourceZone: 'trust', destinationZone: 'untrust' },
  { id: '5', timestamp: '2026/04/08 09:15:15', sourceIP: '192.168.1.23', sourcePort: 48901, destinationIP: '151.101.1.140', destinationPort: 443, application: 'ssl', action: 'allow', bytes: 45678, rule: 'Allow Web Browsing', sourceZone: 'trust', destinationZone: 'untrust' },
  { id: '6', timestamp: '2026/04/08 09:15:10', sourceIP: '192.168.1.5', sourcePort: 22, destinationIP: '192.168.1.1', destinationPort: 22, application: 'ssh', action: 'allow', bytes: 2345, rule: 'SSH Management', sourceZone: 'trust', destinationZone: 'trust' },
  { id: '7', timestamp: '2026/04/08 09:15:08', sourceIP: '192.168.2.30', sourcePort: 55123, destinationIP: '104.244.42.65', destinationPort: 443, application: 'twitter-base', action: 'deny', bytes: 0, rule: 'Block Social Media', sourceZone: 'trust', destinationZone: 'untrust' },
  { id: '8', timestamp: '2026/04/08 09:14:55', sourceIP: '192.168.10.15', sourcePort: 60123, destinationIP: '192.168.1.50', destinationPort: 445, application: 'ms-ds-smbv3', action: 'allow', bytes: 123456, rule: 'VPN Access', sourceZone: 'untrust', destinationZone: 'trust' },
  { id: '9', timestamp: '2026/04/08 09:14:50', sourceIP: '192.168.1.67', sourcePort: 47890, destinationIP: '198.51.100.25', destinationPort: 25, application: 'smtp', action: 'allow', bytes: 5678, rule: 'Allow Email', sourceZone: 'trust', destinationZone: 'untrust' },
  { id: '10', timestamp: '2026/04/08 09:14:45', sourceIP: '10.50.0.100', sourcePort: 12345, destinationIP: '192.168.1.200', destinationPort: 6881, application: 'bittorrent', action: 'deny', bytes: 0, rule: 'Block Torrents', sourceZone: 'untrust', destinationZone: 'trust' },
];

export const defaultThreatLogs: ThreatLog[] = [
  { id: '1', timestamp: '2026/04/08 09:12:45', sourceIP: '203.0.113.99', destinationIP: '10.0.1.10', threatName: 'SQL Injection Attempt', severity: 'critical', action: 'reset-both', direction: 'client-to-server', application: 'web-browsing', rule: 'DMZ Web Servers' },
  { id: '2', timestamp: '2026/04/08 09:10:23', sourceIP: '198.51.100.50', destinationIP: '10.0.1.11', threatName: 'Cross-Site Scripting (XSS)', severity: 'high', action: 'alert', direction: 'client-to-server', application: 'web-browsing', rule: 'DMZ Web Servers' },
  { id: '3', timestamp: '2026/04/08 09:08:15', sourceIP: '192.168.1.45', destinationIP: '93.184.216.34', threatName: 'Suspicious DNS Query', severity: 'medium', action: 'alert', direction: 'client-to-server', application: 'dns', rule: 'Allow DNS' },
  { id: '4', timestamp: '2026/04/08 09:05:00', sourceIP: '203.0.113.200', destinationIP: '10.0.1.10', threatName: 'HTTP Command Injection', severity: 'high', action: 'drop', direction: 'client-to-server', application: 'web-browsing', rule: 'DMZ Web Servers' },
  { id: '5', timestamp: '2026/04/08 08:55:30', sourceIP: '192.168.1.100', destinationIP: '104.18.32.7', threatName: 'Malware Download', severity: 'critical', action: 'reset-both', direction: 'server-to-client', application: 'ssl', rule: 'Allow Web Browsing' },
  { id: '6', timestamp: '2026/04/08 08:45:12', sourceIP: '192.168.1.23', destinationIP: '45.33.32.156', threatName: 'Port Scan Detected', severity: 'informational', action: 'alert', direction: 'client-to-server', application: 'not-applicable', rule: 'Default Deny' },
  { id: '7', timestamp: '2026/04/08 08:30:05', sourceIP: '198.51.100.75', destinationIP: '10.0.1.12', threatName: 'SMTP Exploit Attempt', severity: 'high', action: 'reset-server', direction: 'client-to-server', application: 'smtp', rule: 'Mail Server Inbound' },
];

export const defaultSystemLogs: SystemLog[] = [
  { id: '1', timestamp: '2026/04/08 09:00:00', type: 'system', subtype: 'general', severity: 'informational', description: 'System started successfully' },
  { id: '2', timestamp: '2026/04/08 08:55:00', type: 'system', subtype: 'auth', severity: 'informational', description: 'Admin admin logged in via web from 192.168.1.5', admin: 'admin', client: '192.168.1.5', result: 'success' },
  { id: '3', timestamp: '2026/04/08 08:50:00', type: 'config', subtype: 'edit', severity: 'informational', description: 'Configuration changed: security rules modified', admin: 'admin', client: '192.168.1.5', result: 'submitted' },
  { id: '4', timestamp: '2026/04/08 08:45:00', type: 'config', subtype: 'commit', severity: 'informational', description: 'Configuration committed successfully', admin: 'admin', client: '192.168.1.5', result: 'success' },
  { id: '5', timestamp: '2026/04/08 08:30:00', type: 'system', subtype: 'general', severity: 'medium', description: 'Dynamic update: App and Threat version 8756-8183 installed' },
  { id: '6', timestamp: '2026/04/08 07:00:00', type: 'system', subtype: 'ha', severity: 'high', description: 'HA peer state changed to active' },
  { id: '7', timestamp: '2026/04/07 23:00:00', type: 'config', subtype: 'edit', severity: 'informational', description: 'NAT policy updated: Outbound NAT modified', admin: 'admin', client: '192.168.1.5', result: 'submitted' },
  { id: '8', timestamp: '2026/04/07 22:30:00', type: 'system', subtype: 'auth', severity: 'high', description: 'Failed admin login attempt from 10.50.0.99', admin: 'unknown', client: '10.50.0.99', result: 'failed' },
];

export const defaultLicenses: License[] = [
  { feature: 'Threat Prevention', description: 'IPS, Anti-Spyware, Antivirus', issued: '2025/01/15', expires: '2027/01/15', expired: false, authCode: 'TPR-XXXX-XXXX' },
  { feature: 'URL Filtering', description: 'PAN-DB URL Filtering', issued: '2025/01/15', expires: '2027/01/15', expired: false, authCode: 'UFL-XXXX-XXXX' },
  { feature: 'WildFire', description: 'WildFire Analysis', issued: '2025/01/15', expires: '2027/01/15', expired: false, authCode: 'WFL-XXXX-XXXX' },
  { feature: 'GlobalProtect Gateway', description: 'GlobalProtect VPN', issued: '2025/01/15', expires: '2027/01/15', expired: false, authCode: 'GPG-XXXX-XXXX' },
  { feature: 'DNS Security', description: 'DNS-based threat protection', issued: '2025/06/01', expires: '2027/06/01', expired: false, authCode: 'DNS-XXXX-XXXX' },
  { feature: 'SD-WAN', description: 'SD-WAN functionality', issued: '2025/01/15', expires: '2026/01/15', expired: true, authCode: 'SDW-XXXX-XXXX' },
  { feature: 'PA-3260', description: 'Platform license', issued: '2024/06/01', expires: 'Never', expired: false, authCode: 'PLT-XXXX-XXXX' },
];

export const systemInfo = {
  hostname: 'PA-3260',
  model: 'PA-3260',
  serial: '0123456789',
  panosVersion: '11.1.4-h1',
  appVersion: '8756-8183',
  threatVersion: '8756-8183',
  wildfireVersion: '835421-839654',
  urlFilteringVersion: '20260408.30125',
  globalProtectVersion: '6.2.1',
  uptime: '45 days, 12:34:56',
  ipAddress: '192.168.1.1',
  defaultGateway: '203.0.113.254',
  cpuUsage: 23,
  memoryUsage: 45,
  sessionCount: 12453,
  maxSessions: 250000,
  loggingRate: 1245,
  haState: 'active' as const,
  haPeerState: 'passive' as const,
  haPeerSerial: '0123456790',
};

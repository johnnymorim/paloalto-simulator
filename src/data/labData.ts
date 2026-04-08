export interface LabStep {
  instruction: string;
  hint?: string;
  navigateTo?: { tab: string; sidebar?: string };
  validation?: {
    type: 'navigate' | 'create' | 'update' | 'exists' | 'field_check' | 'count_check' | 'rule_position' | 'committed' | 'disabled';
    target: string;
    expected?: any;
  };
}

export interface Lab {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  objectives: string[];
  steps: LabStep[];
}

export const labCategories = [
  'Initial Setup & Navigation',
  'Network & Interfaces',
  'Security Policies',
  'NAT Policies',
  'Objects & Profiles',
  'Security Profiles & Threat Prevention',
  'Operations & Commit',
];

// IMPORTANT: Field names must match mockData.ts exactly:
// - interfaces: name, type, zone, ipAddress, virtualRouter, linkState
// - zones: name, type, interfaces[]
// - staticRoutes: name, destination, nextHop, interface, metric
// - securityRules: id, name, sourceZone[] (array!), destinationZone[] (array!), action, disabled (boolean)
// - natRules: id, name, sourceTranslationType, sourceZone[] (array!)
// - addressObjects: name, type, value
// - addressGroups: name, type, members[]
// - serviceObjects: name, protocol, destinationPort
// - securityProfiles: name, type
// - systemInfo: hostname='PA-3260', panosVersion='11.1.4-h1'

export const labs: Lab[] = [
  // ========== Category 1: Initial Setup & Navigation ==========
  {
    id: 'lab-01',
    title: 'Explore the Dashboard',
    category: 'Initial Setup & Navigation',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    objectives: [
      'Navigate to the Dashboard tab',
      'Identify hostname, PAN-OS version, serial number',
      'Navigate between main tabs',
    ],
    steps: [
      { instruction: 'Click on the "Dashboard" tab in the top navigation bar.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
      { instruction: 'Find the "General Information" widget. The hostname of this firewall is "PA-3260". Verify you can see it.', hint: 'The hostname appears in the General Information widget.', validation: { type: 'field_check', target: 'systemInfo', expected: { hostname: 'PA-3260' } } },
      { instruction: 'Verify the PAN-OS version is "11.1.4-h1" in the General Information widget.', hint: 'The software version field shows the PAN-OS release.', validation: { type: 'field_check', target: 'systemInfo', expected: { panosVersion: '11.1.4-h1' } } },
      { instruction: 'Navigate to the "ACC" tab to see the Application Command Center.', navigateTo: { tab: 'acc' }, validation: { type: 'navigate', target: 'acc' } },
      { instruction: 'Return to the "Dashboard" tab to complete this lab.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
    ],
  },
  {
    id: 'lab-02',
    title: 'System Configuration Basics',
    category: 'Initial Setup & Navigation',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Navigate to Device tab',
      'Explore Network tab for interface settings',
      'Visit Monitor for logging capabilities',
    ],
    steps: [
      { instruction: 'Click on the "Device" tab to view device management settings.', navigateTo: { tab: 'device' }, validation: { type: 'navigate', target: 'device' } },
      { instruction: 'Navigate to the "Network" tab to see interface configurations.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Navigate to the "Monitor" tab to see logging capabilities.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Return to the "Device" tab to finish exploring device settings.', navigateTo: { tab: 'device' }, validation: { type: 'navigate', target: 'device' } },
    ],
  },
  {
    id: 'lab-03',
    title: 'Review Licenses',
    category: 'Initial Setup & Navigation',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    objectives: [
      'Verify active licenses exist',
      'Check license count',
      'Understand license types',
    ],
    steps: [
      { instruction: 'Navigate to the Dashboard tab.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
      { instruction: 'Verify the system has active licenses. At least 7 licenses should be loaded (Threat Prevention, URL Filtering, WildFire, GlobalProtect, DNS Security, SD-WAN, Platform).', hint: 'The Licenses widget shows all subscription licenses.', validation: { type: 'count_check', target: 'licenses', expected: { min: 7 } } },
      { instruction: 'Navigate to the "Policies" tab to see how licenses enable security features.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Return to Dashboard.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
    ],
  },
  {
    id: 'lab-04',
    title: 'Understanding the ACC',
    category: 'Initial Setup & Navigation',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Navigate to the ACC tab',
      'Explore Monitor for detailed logs',
      'Switch between main tabs fluently',
    ],
    steps: [
      { instruction: 'Click on the "ACC" tab in the top navigation.', navigateTo: { tab: 'acc' }, validation: { type: 'navigate', target: 'acc' } },
      { instruction: 'Navigate to the "Monitor" tab to see detailed logs.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Navigate to the "Objects" tab to explore firewall objects.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Return to "ACC" tab.', navigateTo: { tab: 'acc' }, validation: { type: 'navigate', target: 'acc' } },
    ],
  },
  {
    id: 'lab-05',
    title: 'Navigating Monitor Logs',
    category: 'Initial Setup & Navigation',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    objectives: [
      'Open Traffic logs in the Monitor tab',
      'Verify traffic, threat, and system logs exist',
      'Navigate to Policies',
    ],
    steps: [
      { instruction: 'Click on the "Monitor" tab.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Verify traffic logs contain entries. The system should have at least 10 traffic log entries.', hint: 'Traffic logs record all sessions processed by the firewall.', validation: { type: 'count_check', target: 'trafficLogs', expected: { min: 10 } } },
      { instruction: 'Verify that 7 threat log entries exist showing detected security events.', hint: 'Threat logs include SQL injection, XSS, and malware detections.', validation: { type: 'count_check', target: 'threatLogs', expected: { min: 7 } } },
      { instruction: 'Verify system logs are recorded (at least 8 entries).', hint: 'System logs track operational events, auth, commits, and HA changes.', validation: { type: 'count_check', target: 'systemLogs', expected: { min: 8 } } },
      { instruction: 'Navigate to the "Policies" tab to see the rules that generate these logs.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
    ],
  },

  // ========== Category 2: Network & Interfaces ==========
  {
    id: 'lab-06',
    title: 'Configure an Ethernet Interface',
    category: 'Network & Interfaces',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    objectives: [
      'Navigate to Network > Interfaces',
      'Configure ethernet1/5 as Layer3 with IP 10.10.10.1/24',
      'Assign the interface to the trust zone',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Find "ethernet1/5" in the interface list. Click on it and set Interface Type to "Layer3".', hint: 'Layer3 interfaces have IP addresses and participate in routing. ethernet1/5 is currently unconfigured.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/5' }, type: 'Layer3' } } },
      { instruction: 'Set the IP address of ethernet1/5 to "10.10.10.1/24".', hint: 'CIDR notation /24 means subnet mask 255.255.255.0.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/5' }, ipAddress: '10.10.10.1/24' } } },
      { instruction: 'Set the Security Zone of ethernet1/5 to "trust".', hint: 'Each Layer3 interface must be assigned to a security zone.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/5' }, zone: 'trust' } } },
      { instruction: 'Set the link state to "up" to activate the interface.', hint: 'Interfaces must be "up" to pass traffic.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/5' }, linkState: 'up' } } },
    ],
  },
  {
    id: 'lab-07',
    title: 'Create a New Security Zone',
    category: 'Network & Interfaces',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Navigate to Network > Zones',
      'Create a new zone called "dmz-servers"',
      'Set the zone type to Layer3',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Click the "Add" button to create a new zone named "dmz-servers" with type "Layer3".', hint: 'Zone names should describe the network segment they represent.', validation: { type: 'create', target: 'zones', expected: { name: 'dmz-servers' } } },
      { instruction: 'Verify the zone type is set to "Layer3".', hint: 'Layer3 zones are used with routed interfaces.', validation: { type: 'field_check', target: 'zones', expected: { _match: { name: 'dmz-servers' }, type: 'Layer3' } } },
      { instruction: 'Confirm there are now at least 4 zones in the system (trust, untrust, dmz, dmz-servers).', validation: { type: 'count_check', target: 'zones', expected: { min: 4 } } },
    ],
  },
  {
    id: 'lab-08',
    title: 'Add a New Static Route',
    category: 'Network & Interfaces',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Add a static route for 172.16.0.0/16',
      'Set next-hop to 10.10.10.254',
      'Understand routing concepts',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Create a new static route named "lab-route-172" with destination "172.16.0.0/16".', hint: '/16 covers the entire 172.16.x.x range.', validation: { type: 'create', target: 'staticRoutes', expected: { name: 'lab-route-172', destination: '172.16.0.0/16' } } },
      { instruction: 'Set the next-hop IP to "10.10.10.254".', hint: 'The next-hop is the gateway to reach the 172.16.0.0/16 network.', validation: { type: 'field_check', target: 'staticRoutes', expected: { _match: { name: 'lab-route-172' }, nextHop: '10.10.10.254' } } },
      { instruction: 'Verify you now have at least 4 static routes in the routing table.', validation: { type: 'count_check', target: 'staticRoutes', expected: { min: 4 } } },
    ],
  },
  {
    id: 'lab-09',
    title: 'Add a Second Static Route',
    category: 'Network & Interfaces',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    objectives: [
      'Add a route for 10.20.0.0/16',
      'Point to next-hop 192.168.1.254',
      'Verify route count',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Add a new static route named "lab-route-1020" with destination "10.20.0.0/16".', hint: 'This route covers all 10.20.x.x addresses.', validation: { type: 'create', target: 'staticRoutes', expected: { name: 'lab-route-1020', destination: '10.20.0.0/16' } } },
      { instruction: 'Set the next-hop to "192.168.1.254".', validation: { type: 'field_check', target: 'staticRoutes', expected: { _match: { name: 'lab-route-1020' }, nextHop: '192.168.1.254' } } },
      { instruction: 'Verify at least 4 static routes exist now.', validation: { type: 'count_check', target: 'staticRoutes', expected: { min: 4 } } },
    ],
  },
  {
    id: 'lab-10',
    title: 'Review Interface Configurations',
    category: 'Network & Interfaces',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Verify existing interface configurations',
      'Check interface zones and IP addresses',
      'Navigate Device tab',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Verify that ethernet1/1 is in the "untrust" zone.', hint: 'The untrust interface faces the internet.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/1' }, zone: 'untrust' } } },
      { instruction: 'Verify that ethernet1/2 is in the "trust" zone with IP 192.168.1.1/24.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/2' }, zone: 'trust', ipAddress: '192.168.1.1/24' } } },
      { instruction: 'Verify that ethernet1/3 is in the "dmz" zone.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/3' }, zone: 'dmz' } } },
      { instruction: 'Navigate to "Device" tab for device management.', navigateTo: { tab: 'device' }, validation: { type: 'navigate', target: 'device' } },
    ],
  },
  {
    id: 'lab-11',
    title: 'Verify Zone Configuration',
    category: 'Network & Interfaces',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    objectives: [
      'Review existing zones',
      'Verify zone count and types',
      'Navigate to Objects tab',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Verify that the "trust" zone exists and is Layer3 type.', validation: { type: 'field_check', target: 'zones', expected: { _match: { name: 'trust' }, type: 'Layer3' } } },
      { instruction: 'Verify that the "untrust" zone exists and is Layer3 type.', validation: { type: 'field_check', target: 'zones', expected: { _match: { name: 'untrust' }, type: 'Layer3' } } },
      { instruction: 'Verify at least 3 zones exist (trust, untrust, dmz).', validation: { type: 'count_check', target: 'zones', expected: { min: 3 } } },
      { instruction: 'Navigate to "Objects" to see related configurations.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
    ],
  },

  // ========== Category 3: Security Policies ==========
  {
    id: 'lab-12',
    title: 'Create a Basic Allow Rule',
    category: 'Security Policies',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    objectives: [
      'Navigate to Policies',
      'Create a rule named "Lab-Allow-Web"',
      'Set trust-to-untrust with action allow',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Click "Add" to create a new security rule named "Lab-Allow-Web".', hint: 'Use descriptive names that clearly indicate the rule purpose.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Lab-Allow-Web' } } },
      { instruction: 'Set the Source Zone to include "trust".', hint: 'sourceZone is an array — it should contain "trust".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Allow-Web' }, sourceZone: 'trust' } } },
      { instruction: 'Set the Destination Zone to include "untrust".', hint: 'Untrust represents the internet/external network.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Allow-Web' }, destinationZone: 'untrust' } } },
      { instruction: 'Set the Action to "allow".', hint: 'Allow permits matched traffic to pass through the firewall.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Allow-Web' }, action: 'allow' } } },
    ],
  },
  {
    id: 'lab-13',
    title: 'Create a Deny Rule',
    category: 'Security Policies',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Create a rule to block specific traffic',
      'Set action to deny',
      'Understand deny vs drop',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Click "Add" and create a rule named "Lab-Block-Torrent".', hint: 'Deny rules explicitly block unwanted applications.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Lab-Block-Torrent' } } },
      { instruction: 'Set Source Zone to include "trust".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Block-Torrent' }, sourceZone: 'trust' } } },
      { instruction: 'Set the Action to "deny". Deny sends a TCP reset to the client.', hint: 'Drop silently discards packets; Deny actively rejects the connection.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Block-Torrent' }, action: 'deny' } } },
    ],
  },
  {
    id: 'lab-14',
    title: 'Application-Based Policy',
    category: 'Security Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Create a rule allowing essential apps',
      'Understand App-ID technology',
      'Configure trust-to-untrust allow rule',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Create a new rule named "Lab-Essential-Apps" with action "allow".', hint: 'Group related applications into a single rule for cleaner management.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Lab-Essential-Apps', action: 'allow' } } },
      { instruction: 'Set Source Zone to "trust" and Destination Zone to "untrust".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Essential-Apps' }, sourceZone: 'trust', destinationZone: 'untrust' } } },
      { instruction: 'Verify the rule is complete: action allow, trust→untrust.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Essential-Apps' }, action: 'allow', sourceZone: 'trust', destinationZone: 'untrust' } } },
    ],
  },
  {
    id: 'lab-15',
    title: 'User-Based Policy',
    category: 'Security Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Create a rule with user-based access control',
      'Understand User-ID integration',
      'Configure specific zone pairing',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Create a new rule named "Lab-Sales-Access".', hint: 'User-based rules allow per-group access control via Active Directory.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Lab-Sales-Access' } } },
      { instruction: 'Set Source Zone to "trust" and Action to "allow".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Sales-Access' }, sourceZone: 'trust', action: 'allow' } } },
      { instruction: 'Set Destination Zone to "untrust".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-Sales-Access' }, destinationZone: 'untrust' } } },
    ],
  },
  {
    id: 'lab-16',
    title: 'DMZ Service Rule',
    category: 'Security Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Create a rule for DMZ to trust traffic',
      'Understand service-based restrictions',
      'Configure DMZ zone pairing',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Create a new rule named "Lab-DMZ-App".', hint: 'DMZ rules control traffic between the DMZ and internal networks.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Lab-DMZ-App' } } },
      { instruction: 'Set Source Zone to "dmz".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-DMZ-App' }, sourceZone: 'dmz' } } },
      { instruction: 'Set Destination Zone to "trust" and Action to "allow".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Lab-DMZ-App' }, destinationZone: 'trust', action: 'allow' } } },
    ],
  },
  {
    id: 'lab-17',
    title: 'Create Intrazone & Interzone Rules',
    category: 'Security Policies',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    objectives: [
      'Create an intrazone allow rule',
      'Create an interzone deny rule',
      'Understand rule type differences',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Create a rule named "Lab-Intrazone-Allow" with ruleType "intrazone" and action "allow".', hint: 'Intrazone rules apply when source and destination are in the SAME zone.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Lab-Intrazone-Allow', ruleType: 'intrazone', action: 'allow' } } },
      { instruction: 'Create another rule named "Lab-Interzone-Deny" with ruleType "interzone" and action "deny".', hint: 'Interzone rules apply when source and destination are in DIFFERENT zones.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Lab-Interzone-Deny', ruleType: 'interzone', action: 'deny' } } },
      { instruction: 'Verify both rules exist. The total security rule count should be at least 14.', validation: { type: 'count_check', target: 'securityRules', expected: { min: 14 } } },
    ],
  },
  {
    id: 'lab-18',
    title: 'Rule Ordering & Shadowing',
    category: 'Security Policies',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    objectives: [
      'Understand rule evaluation order',
      'Verify existing rule ordering',
      'Ensure deny rules are before broad allows',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Verify the "Block Torrents" rule exists in the security policy.', hint: 'This is a pre-existing deny rule for bittorrent.', validation: { type: 'exists', target: 'securityRules', expected: { name: 'Block Torrents' } } },
      { instruction: 'Verify the "Default Deny" rule exists as a catch-all.', validation: { type: 'exists', target: 'securityRules', expected: { name: 'Default Deny', action: 'deny' } } },
      { instruction: 'Ensure "Block Torrents" appears ABOVE "Default Deny" in the rule order. Use Move Up/Down if needed.', hint: 'Specific deny rules should come before the catch-all deny.', validation: { type: 'rule_position', target: 'securityRules', expected: { firstRule: 'Block Torrents', secondRule: 'Default Deny', matchField: 'name' } } },
    ],
  },
  {
    id: 'lab-19',
    title: 'Policy Optimization',
    category: 'Security Policies',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    objectives: [
      'Review hit counts on rules',
      'Find and disable an unused rule',
      'Practice policy cleanup',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Review the security rules table. Note the existing "Allow FTP to DMZ" rule which has very low hits and is already disabled.', hint: 'Rule id "9" (Allow FTP to DMZ) has only 123 hits and disabled=true.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Allow FTP to DMZ' }, disabled: true } } },
      { instruction: 'Verify at least 12 security rules exist.', validation: { type: 'count_check', target: 'securityRules', expected: { min: 12 } } },
      { instruction: 'Navigate to "Objects" to review address/service objects used in these rules.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
    ],
  },

  // ========== Category 4: NAT Policies ==========
  {
    id: 'lab-20',
    title: 'Create Source NAT (DIPP)',
    category: 'NAT Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Create a Source NAT rule with Dynamic IP And Port',
      'Understand DIPP NAT for outbound access',
      'Learn Original/Translated Packet structure',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Switch to the NAT sub-tab and click "Add". Name it "Lab-Outbound-SNAT".', hint: 'Source NAT translates private IPs to public for internet access.', validation: { type: 'create', target: 'natRules', expected: { name: 'Lab-Outbound-SNAT' } } },
      { instruction: 'Set Source Translation Type to "Dynamic IP And Port".', hint: 'DIPP uses interface IP plus dynamic port allocation — most common NAT type.', validation: { type: 'field_check', target: 'natRules', expected: { _match: { name: 'Lab-Outbound-SNAT' }, sourceTranslationType: 'Dynamic IP And Port' } } },
      { instruction: 'Verify the NAT rule is complete.', validation: { type: 'exists', target: 'natRules', expected: { name: 'Lab-Outbound-SNAT', sourceTranslationType: 'Dynamic IP And Port' } } },
    ],
  },
  {
    id: 'lab-21',
    title: 'Create Static NAT',
    category: 'NAT Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Create a Static NAT for a server',
      'Understand 1:1 NAT mapping',
      'Learn Static IP translation',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'In the NAT sub-tab, click "Add". Name it "Lab-Static-NAT".', hint: 'Static NAT creates a permanent 1:1 mapping.', validation: { type: 'create', target: 'natRules', expected: { name: 'Lab-Static-NAT' } } },
      { instruction: 'Set Source Translation Type to "Static IP".', hint: 'Static IP NAT permanently maps one IP to another.', validation: { type: 'field_check', target: 'natRules', expected: { _match: { name: 'Lab-Static-NAT' }, sourceTranslationType: 'Static IP' } } },
      { instruction: 'Verify the rule exists.', validation: { type: 'exists', target: 'natRules', expected: { name: 'Lab-Static-NAT' } } },
    ],
  },
  {
    id: 'lab-22',
    title: 'Create Destination NAT',
    category: 'NAT Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Create a DNAT rule',
      'Set Source Translation to None for pure DNAT',
      'Verify NAT rule count',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Create a NAT rule named "Lab-DNAT-Server".', hint: 'Destination NAT changes the destination IP of incoming traffic.', validation: { type: 'create', target: 'natRules', expected: { name: 'Lab-DNAT-Server' } } },
      { instruction: 'Set Source Translation Type to "None" for pure DNAT.', hint: 'DNAT only modifies the destination, not the source.', validation: { type: 'field_check', target: 'natRules', expected: { _match: { name: 'Lab-DNAT-Server' }, sourceTranslationType: 'None' } } },
      { instruction: 'Verify at least 8 NAT rules exist in total.', validation: { type: 'count_check', target: 'natRules', expected: { min: 8 } } },
    ],
  },
  {
    id: 'lab-23',
    title: 'NAT Rule Ordering',
    category: 'NAT Policies',
    difficulty: 'advanced',
    estimatedMinutes: 10,
    objectives: [
      'Verify NAT rule evaluation order',
      'Ensure specific rules before general rules',
      'Understand NAT shadowing',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Verify "WebServer-1 Inbound" DNAT rule exists (pre-existing).', validation: { type: 'exists', target: 'natRules', expected: { name: 'WebServer-1 Inbound' } } },
      { instruction: 'Verify "Outbound NAT" DIPP rule exists (pre-existing).', validation: { type: 'exists', target: 'natRules', expected: { name: 'Outbound NAT', sourceTranslationType: 'Dynamic IP And Port' } } },
      { instruction: 'Ensure "WebServer-1 Inbound" (specific DNAT) appears ABOVE "Outbound NAT" (general DIPP). Use Move Up/Down if needed.', hint: 'Specific translations should be checked before the general outbound SNAT.', validation: { type: 'rule_position', target: 'natRules', expected: { firstRule: 'WebServer-1 Inbound', secondRule: 'Outbound NAT', matchField: 'name' } } },
    ],
  },

  // ========== Category 5: Objects & Profiles ==========
  {
    id: 'lab-24',
    title: 'Create Address Objects',
    category: 'Objects & Profiles',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    objectives: [
      'Create IP Netmask address objects',
      'Understand address object types',
      'Use meaningful naming',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Click "Add" to create a new address object: Name "Lab-Server-01", Type "IP Netmask", Value "10.1.2.10/32".', hint: '/32 means a single host IP address.', validation: { type: 'create', target: 'addressObjects', expected: { name: 'Lab-Server-01' } } },
      { instruction: 'Create another: Name "Lab-Server-02", Type "IP Netmask", Value "10.1.2.20/32".', validation: { type: 'create', target: 'addressObjects', expected: { name: 'Lab-Server-02' } } },
      { instruction: 'Create an FQDN object: Name "Lab-DNS", Type "FQDN", Value "dns.google.com".', hint: 'FQDN objects resolve dynamically via DNS.', validation: { type: 'create', target: 'addressObjects', expected: { name: 'Lab-DNS' } } },
      { instruction: 'Verify at least 11 address objects exist (8 default + 3 new).', validation: { type: 'count_check', target: 'addressObjects', expected: { min: 11 } } },
    ],
  },
  {
    id: 'lab-25',
    title: 'Create Address Groups',
    category: 'Objects & Profiles',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Build a static address group',
      'Add address objects to the group',
      'Understand group benefits',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Click "Address Groups" then "Add". Name it "Lab-Web-Servers" with type "static".', hint: 'Address groups simplify policy — update the group, all rules using it auto-update.', validation: { type: 'create', target: 'addressGroups', expected: { name: 'Lab-Web-Servers' } } },
      { instruction: 'Verify the group type is "static".', validation: { type: 'field_check', target: 'addressGroups', expected: { _match: { name: 'Lab-Web-Servers' }, type: 'static' } } },
      { instruction: 'Verify at least 4 address groups now exist (3 default + 1 new).', validation: { type: 'count_check', target: 'addressGroups', expected: { min: 4 } } },
    ],
  },
  {
    id: 'lab-26',
    title: 'Create Custom Service Objects',
    category: 'Objects & Profiles',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Create TCP and UDP service objects',
      'Understand protocol/port pairs',
      'Create services for custom ports',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Click "Services" then "Add". Name: "Lab-TCP-8080", Protocol: "TCP", Port: "8080".', hint: 'Custom services are for applications on non-standard ports.', validation: { type: 'create', target: 'serviceObjects', expected: { name: 'Lab-TCP-8080' } } },
      { instruction: 'Create another: "Lab-TCP-8443", Protocol "TCP", Port "8443".', hint: '8443 is commonly used for alternative HTTPS.', validation: { type: 'create', target: 'serviceObjects', expected: { name: 'Lab-TCP-8443' } } },
      { instruction: 'Create: "Lab-UDP-5060", Protocol "UDP", Port "5060".', hint: 'UDP 5060 is the SIP port for VoIP.', validation: { type: 'create', target: 'serviceObjects', expected: { name: 'Lab-UDP-5060' } } },
      { instruction: 'Verify at least 11 service objects exist (8 default + 3 new).', validation: { type: 'count_check', target: 'serviceObjects', expected: { min: 11 } } },
    ],
  },
  {
    id: 'lab-27',
    title: 'Verify Service Objects',
    category: 'Objects & Profiles',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Verify default service objects',
      'Check protocol and port values',
      'Navigate to Policies',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify "service-http" exists with protocol TCP and port 80.', validation: { type: 'field_check', target: 'serviceObjects', expected: { _match: { name: 'service-http' }, protocol: 'TCP', destinationPort: '80' } } },
      { instruction: 'Verify "service-https" exists with protocol TCP and port 443.', validation: { type: 'field_check', target: 'serviceObjects', expected: { _match: { name: 'service-https' }, protocol: 'TCP', destinationPort: '443' } } },
      { instruction: 'Navigate to Policies to see where these services are referenced.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
    ],
  },
  {
    id: 'lab-28',
    title: 'Verify Address Objects',
    category: 'Objects & Profiles',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Verify default address objects',
      'Check object types and values',
      'Navigate to Policies',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify "WebServer-1" exists with type "IP Netmask" and value "10.0.1.10/32".', validation: { type: 'field_check', target: 'addressObjects', expected: { _match: { name: 'WebServer-1' }, type: 'IP Netmask', value: '10.0.1.10/32' } } },
      { instruction: 'Verify "VPN-Pool" exists with type "IP Range".', validation: { type: 'field_check', target: 'addressObjects', expected: { _match: { name: 'VPN-Pool' }, type: 'IP Range' } } },
      { instruction: 'Verify "Update-Server" exists with type "FQDN".', validation: { type: 'field_check', target: 'addressObjects', expected: { _match: { name: 'Update-Server' }, type: 'FQDN' } } },
      { instruction: 'Navigate to Policies to see where these objects are used.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
    ],
  },

  // ========== Category 6: Security Profiles & Threat Prevention ==========
  {
    id: 'lab-29',
    title: 'Review Antivirus Profiles',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Navigate to Objects for security profiles',
      'Verify antivirus profiles exist',
      'Check decoder actions',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify the "Outbound-AV" antivirus profile exists.', validation: { type: 'field_check', target: 'securityProfiles', expected: { _match: { name: 'Outbound-AV' }, type: 'antivirus' } } },
      { instruction: 'Verify the "Inbound-AV" antivirus profile exists.', validation: { type: 'field_check', target: 'securityProfiles', expected: { _match: { name: 'Inbound-AV' }, type: 'antivirus' } } },
      { instruction: 'Navigate to Monitor to see threats detected by these profiles.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Verify threat logs show detected threats.', validation: { type: 'count_check', target: 'threatLogs', expected: { min: 7 } } },
    ],
  },
  {
    id: 'lab-30',
    title: 'Review Anti-Spyware Profiles',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Verify anti-spyware profiles',
      'Understand severity-based actions',
      'Review related threat logs',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify "Outbound-AS" anti-spyware profile exists.', validation: { type: 'field_check', target: 'securityProfiles', expected: { _match: { name: 'Outbound-AS' }, type: 'anti-spyware' } } },
      { instruction: 'Verify "Strict-AS" anti-spyware profile exists.', validation: { type: 'field_check', target: 'securityProfiles', expected: { _match: { name: 'Strict-AS' }, type: 'anti-spyware' } } },
      { instruction: 'Navigate to Monitor to review spyware-related threats.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
    ],
  },
  {
    id: 'lab-31',
    title: 'Review URL Filtering',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Verify URL filtering profile exists',
      'Understand URL categories',
      'Navigate to Dashboard for overview',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify "URL-Filter-Default" URL filtering profile exists.', validation: { type: 'field_check', target: 'securityProfiles', expected: { _match: { name: 'URL-Filter-Default' }, type: 'url-filtering' } } },
      { instruction: 'Verify at least 8 security profiles exist in total.', validation: { type: 'count_check', target: 'securityProfiles', expected: { min: 8 } } },
      { instruction: 'Navigate to Dashboard for security posture overview.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
    ],
  },
  {
    id: 'lab-32',
    title: 'Review Security Profile Groups',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    objectives: [
      'Understand profile groups',
      'Verify profiles can attach to rules',
      'Review defense-in-depth approach',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify multiple security profile types exist (AV, AS, URL, File Blocking, Vuln, WildFire).', validation: { type: 'count_check', target: 'securityProfiles', expected: { min: 7 } } },
      { instruction: 'Navigate to "Policies" — profiles attach to security rules on the Actions tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Verify that allow rules exist that can have profiles attached. Only "allow" action rules can use profiles.', validation: { type: 'field_check', target: 'securityRules', expected: { action: 'allow' } } },
      { instruction: 'Navigate to Monitor to see how profiles generate threat logs.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
    ],
  },
  {
    id: 'lab-33',
    title: 'Review File Blocking',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'advanced',
    estimatedMinutes: 10,
    objectives: [
      'Verify file blocking profile exists',
      'Understand file type restrictions',
      'Review threat detection',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify "File-Block-Default" file blocking profile exists.', validation: { type: 'field_check', target: 'securityProfiles', expected: { _match: { name: 'File-Block-Default' }, type: 'file-blocking' } } },
      { instruction: 'Verify "Vuln-Protect-Default" vulnerability protection profile exists.', validation: { type: 'field_check', target: 'securityProfiles', expected: { _match: { name: 'Vuln-Protect-Default' }, type: 'vulnerability' } } },
      { instruction: 'Navigate to Monitor for threat verification.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Verify threat logs show file and vulnerability detections.', validation: { type: 'count_check', target: 'threatLogs', expected: { min: 5 } } },
    ],
  },

  // ========== Category 7: Operations & Commit ==========
  {
    id: 'lab-34',
    title: 'Validate and Commit Configuration',
    category: 'Operations & Commit',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    objectives: [
      'Perform a configuration commit',
      'Verify commit in history',
      'Understand candidate vs running config',
    ],
    steps: [
      { instruction: 'First, verify the system has security rules configured.', navigateTo: { tab: 'policies' }, validation: { type: 'count_check', target: 'securityRules', expected: { min: 1 } } },
      { instruction: 'Click the "Commit" button in the top-right header. In the modal, click "Commit" to apply all changes.', hint: 'In production, commit makes candidate config the running config.', validation: { type: 'committed', target: 'commitHistory', expected: { minCount: 1 } } },
      { instruction: 'After commit, navigate to Monitor to verify commit log entry.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Navigate to Dashboard to verify system status.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
    ],
  },
  {
    id: 'lab-35',
    title: 'Review System and Config Logs',
    category: 'Operations & Commit',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Navigate to Monitor > System logs',
      'Find commit-related log entries',
      'Verify audit trail',
    ],
    steps: [
      { instruction: 'Navigate to the "Monitor" tab.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Verify system logs contain at least 8 entries with operational events.', hint: 'System logs record commits, logins, HA events, and updates.', validation: { type: 'count_check', target: 'systemLogs', expected: { min: 8 } } },
      { instruction: 'Navigate to "Dashboard" to confirm system is operational.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
      { instruction: 'Navigate to "Device" for device management.', navigateTo: { tab: 'device' }, validation: { type: 'navigate', target: 'device' } },
      { instruction: 'Return to Monitor for final log review.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
    ],
  },
];

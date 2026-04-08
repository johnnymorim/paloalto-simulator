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
      'Locate system uptime and resource gauges',
    ],
    steps: [
      { instruction: 'Click on the "Dashboard" tab in the top navigation bar.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
      { instruction: 'Find the "General Information" widget. Verify the hostname is displayed as "PA-VM-Lab".', hint: 'The hostname appears in the first row of the General Information widget.', validation: { type: 'field_check', target: 'systemInfo', expected: { hostname: 'PA-VM-Lab' } } },
      { instruction: 'Verify the PAN-OS version shown is "11.1.2-h3".', hint: 'The software version field shows the PAN-OS release number.', validation: { type: 'field_check', target: 'systemInfo', expected: { panosVersion: '11.1.2-h3' } } },
      { instruction: 'Now navigate to the "ACC" tab to confirm you can switch between main tabs.', navigateTo: { tab: 'acc' }, validation: { type: 'navigate', target: 'acc' } },
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
      'Review management interface settings',
      'Understand DNS and NTP configuration',
    ],
    steps: [
      { instruction: 'Click on the "Device" tab in the top navigation.', navigateTo: { tab: 'device' }, validation: { type: 'navigate', target: 'device' } },
      { instruction: 'Navigate to the "Network" tab to see interface configurations.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Navigate to the "Monitor" tab to see logging capabilities.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Return to the "Device" tab for device management settings.', navigateTo: { tab: 'device' }, validation: { type: 'navigate', target: 'device' } },
    ],
  },
  {
    id: 'lab-03',
    title: 'Review Licenses',
    category: 'Initial Setup & Navigation',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    objectives: [
      'Navigate to the Dashboard',
      'Verify active licenses exist in the system',
      'Understand license types',
    ],
    steps: [
      { instruction: 'Navigate to the Dashboard tab.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
      { instruction: 'Verify the system has active licenses loaded. Check that at least 4 licenses exist.', hint: 'Licenses include Threat Prevention, URL Filtering, WildFire, and GlobalProtect.', validation: { type: 'count_check', target: 'licenses', expected: { min: 4 } } },
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
      'Navigate to Monitor to compare views',
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
      'Verify traffic log entries exist',
      'Switch to Threat logs',
    ],
    steps: [
      { instruction: 'Click on the "Monitor" tab.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Verify that traffic logs contain entries. The system should have at least 1 traffic log.', hint: 'Traffic logs record all sessions processed by the firewall.', validation: { type: 'count_check', target: 'trafficLogs', expected: { min: 1 } } },
      { instruction: 'Verify that threat logs exist in the system.', hint: 'Threat logs show detected security events.', validation: { type: 'count_check', target: 'threatLogs', expected: { min: 1 } } },
      { instruction: 'Verify system logs are being recorded.', hint: 'System logs track operational events and admin actions.', validation: { type: 'count_check', target: 'systemLogs', expected: { min: 1 } } },
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
      'Configure ethernet1/3 as Layer3 with IP 10.10.10.1/24',
      'Assign the interface to the trust zone',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Click on ethernet1/3 in the interface list. Set Interface Type to "Layer3".', hint: 'Layer3 interfaces have IP addresses and participate in routing.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/3' }, type: 'Layer3' } } },
      { instruction: 'Set the IP address of ethernet1/3 to 10.10.10.1/24.', hint: 'CIDR notation /24 means subnet mask 255.255.255.0.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/3' }, ip: '10.10.10.1/24' } } },
      { instruction: 'Set the Security Zone of ethernet1/3 to "trust".', hint: 'Each Layer3 interface must be assigned to a security zone.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/3' }, zone: 'trust' } } },
      { instruction: 'Verify the complete configuration: ethernet1/3 should be Layer3, IP 10.10.10.1/24, zone trust.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/3' }, type: 'Layer3', ip: '10.10.10.1/24', zone: 'trust' } } },
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
      { instruction: 'Click the "Add" button to create a new zone. Enter zone name: "dmz-servers".', hint: 'Zone names should describe the network segment they represent.', validation: { type: 'create', target: 'zones', expected: { name: 'dmz-servers' } } },
      { instruction: 'Verify the zone type is set to "Layer3".', hint: 'Layer3 zones are used with routed interfaces.', validation: { type: 'field_check', target: 'zones', expected: { _match: { name: 'dmz-servers' }, type: 'Layer3' } } },
      { instruction: 'Confirm the zone appears in the zones table by checking we now have more zones than before.', validation: { type: 'count_check', target: 'zones', expected: { min: 4 } } },
    ],
  },
  {
    id: 'lab-08',
    title: 'Configure a Virtual Router',
    category: 'Network & Interfaces',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Add a default static route (0.0.0.0/0)',
      'Set next-hop to 203.0.113.1',
      'Understand routing concepts',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Click "Add" in the Static Routes section. Name it "default-route", set destination to 0.0.0.0/0.', hint: 'A default route catches all traffic not matching more specific routes.', validation: { type: 'create', target: 'staticRoutes', expected: { name: 'default-route', destination: '0.0.0.0/0' } } },
      { instruction: 'Set the next-hop IP to 203.0.113.1.', hint: 'The next-hop is typically your ISP gateway or upstream router.', validation: { type: 'field_check', target: 'staticRoutes', expected: { _match: { name: 'default-route' }, nextHop: '203.0.113.1' } } },
      { instruction: 'Verify the complete route: default-route → 0.0.0.0/0 → 203.0.113.1.', validation: { type: 'field_check', target: 'staticRoutes', expected: { _match: { name: 'default-route' }, destination: '0.0.0.0/0', nextHop: '203.0.113.1' } } },
    ],
  },
  {
    id: 'lab-09',
    title: 'Add a Static Route',
    category: 'Network & Interfaces',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    objectives: [
      'Add a route for 172.16.0.0/16',
      'Point to next-hop 10.10.10.254',
      'Understand longest-prefix matching',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Add a new static route named "internal-172" with destination 172.16.0.0/16.', hint: '/16 covers the entire 172.16.x.x range.', validation: { type: 'create', target: 'staticRoutes', expected: { name: 'internal-172', destination: '172.16.0.0/16' } } },
      { instruction: 'Set the next-hop to 10.10.10.254.', hint: 'This next-hop router must be reachable from the firewall.', validation: { type: 'field_check', target: 'staticRoutes', expected: { _match: { name: 'internal-172' }, nextHop: '10.10.10.254' } } },
      { instruction: 'Verify: You should now have at least 2 static routes in the routing table.', validation: { type: 'count_check', target: 'staticRoutes', expected: { min: 2 } } },
    ],
  },
  {
    id: 'lab-10',
    title: 'Configure Interface Management Profile',
    category: 'Network & Interfaces',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Navigate to Network to review interfaces',
      'Understand management profile concepts',
      'Verify interface configurations',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Verify that the system has at least 4 configured interfaces.', hint: 'Interfaces include ethernet1/1 through ethernet1/4 and management.', validation: { type: 'count_check', target: 'interfaces', expected: { min: 4 } } },
      { instruction: 'Verify that ethernet1/1 is configured as a Layer3 interface.', hint: 'The untrust/WAN interface should be Layer3 for routing.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/1' }, type: 'Layer3' } } },
      { instruction: 'Navigate to "Device" to review device management settings.', navigateTo: { tab: 'device' }, validation: { type: 'navigate', target: 'device' } },
    ],
  },
  {
    id: 'lab-11',
    title: 'Configure DHCP Server',
    category: 'Network & Interfaces',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    objectives: [
      'Navigate to Network tab',
      'Understand DHCP concepts',
      'Review interface assignments',
    ],
    steps: [
      { instruction: 'Navigate to the "Network" tab.', navigateTo: { tab: 'network' }, validation: { type: 'navigate', target: 'network' } },
      { instruction: 'Verify ethernet1/2 exists and is configured.', hint: 'DHCP services are typically bound to internal-facing interfaces.', validation: { type: 'field_check', target: 'interfaces', expected: { _match: { name: 'ethernet1/2' } } } },
      { instruction: 'Verify that zones are properly configured for DHCP. At least 3 zones should exist.', hint: 'DHCP serves clients within a specific zone/subnet.', validation: { type: 'count_check', target: 'zones', expected: { min: 3 } } },
      { instruction: 'Navigate to "Objects" to review address objects that DHCP clients might reference.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
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
      'Navigate to Policies > Security',
      'Create a rule named "Allow-Web-Browsing"',
      'Set trust-to-untrust with action allow',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Click "Add" to create a new security rule. Name it "Allow-Web-Browsing".', hint: 'Use descriptive names that clearly indicate the rule purpose.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Allow-Web-Browsing' } } },
      { instruction: 'Set the Source Zone to "trust" on the created rule.', hint: 'This means traffic originates from the trust (internal) network.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Allow-Web-Browsing' }, sourceZone: 'trust' } } },
      { instruction: 'Set the Destination Zone to "untrust".', hint: 'Untrust represents the internet/external network.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Allow-Web-Browsing' }, destinationZone: 'untrust' } } },
      { instruction: 'Set the Action to "allow".', hint: 'Allow permits the matched traffic to pass through the firewall.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Allow-Web-Browsing' }, action: 'allow' } } },
    ],
  },
  {
    id: 'lab-13',
    title: 'Create a Deny Rule',
    category: 'Security Policies',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Create a rule to block BitTorrent',
      'Set action to deny',
      'Understand deny vs drop',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Click "Add" and create a rule named "Block-BitTorrent".', hint: 'Deny rules explicitly block unwanted applications.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Block-BitTorrent' } } },
      { instruction: 'Set Source Zone to "trust".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Block-BitTorrent' }, sourceZone: 'trust' } } },
      { instruction: 'Set the Action to "deny". Deny sends a TCP reset to the client.', hint: 'Drop silently discards packets; Deny actively rejects the connection.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Block-BitTorrent' }, action: 'deny' } } },
    ],
  },
  {
    id: 'lab-14',
    title: 'Application-Based Policy',
    category: 'Security Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Create a rule allowing multiple essential apps',
      'Understand App-ID technology',
      'Configure trust-to-untrust allow rule',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Create a new rule named "Allow-Essential-Apps" with action "allow".', hint: 'Group related applications into a single rule for cleaner management.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Allow-Essential-Apps', action: 'allow' } } },
      { instruction: 'Set Source Zone to "trust" and Destination Zone to "untrust".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Allow-Essential-Apps' }, sourceZone: 'trust', destinationZone: 'untrust' } } },
      { instruction: 'Verify the rule exists with all correct settings.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Allow-Essential-Apps' }, action: 'allow', sourceZone: 'trust', destinationZone: 'untrust' } } },
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
      'Understand User-ID integration concepts',
      'Configure source user constraint',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Create a new rule named "Sales-Salesforce-Access".', hint: 'User-based rules allow per-group access control via Active Directory.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Sales-Salesforce-Access' } } },
      { instruction: 'Set Source Zone to "trust" and Action to "allow".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Sales-Salesforce-Access' }, sourceZone: 'trust', action: 'allow' } } },
      { instruction: 'Set Destination Zone to "untrust" for internet-bound traffic.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'Sales-Salesforce-Access' }, destinationZone: 'untrust' } } },
    ],
  },
  {
    id: 'lab-16',
    title: 'Service-Specific Rule',
    category: 'Security Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Create a rule for DMZ to trust traffic',
      'Understand service-based restrictions',
      'Configure specific zone pairing',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Create a new rule named "DMZ-Custom-App".', hint: 'Service-specific rules restrict traffic to specific port/protocol combinations.', validation: { type: 'create', target: 'securityRules', expected: { name: 'DMZ-Custom-App' } } },
      { instruction: 'Set Source Zone to "dmz" — traffic originates from the DMZ.', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'DMZ-Custom-App' }, sourceZone: 'dmz' } } },
      { instruction: 'Set Destination Zone to "trust" and Action to "allow".', validation: { type: 'field_check', target: 'securityRules', expected: { _match: { name: 'DMZ-Custom-App' }, destinationZone: 'trust', action: 'allow' } } },
    ],
  },
  {
    id: 'lab-17',
    title: 'Intrazone vs Interzone Rules',
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
      { instruction: 'Create a rule named "Trust-Intrazone-Allow" with action "allow".', hint: 'Intrazone rules apply when source and destination are in the SAME zone.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Trust-Intrazone-Allow', action: 'allow' } } },
      { instruction: 'Now create another rule named "Interzone-Deny-All" with action "deny".', hint: 'Interzone rules apply when source and destination are in DIFFERENT zones.', validation: { type: 'create', target: 'securityRules', expected: { name: 'Interzone-Deny-All', action: 'deny' } } },
      { instruction: 'Verify both rules exist: the allow intrazone and the deny interzone.', validation: { type: 'count_check', target: 'securityRules', expected: { min: 5 } } },
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
      'Identify and fix shadowed rules',
      'Use Move Up/Down to reorder rules',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Verify that "Block-BitTorrent" rule exists (from Lab 13).', hint: 'If not, create it first.', validation: { type: 'exists', target: 'securityRules', expected: { name: 'Block-BitTorrent' } } },
      { instruction: 'Verify that "Allow-Web-Browsing" rule exists (from Lab 12).', validation: { type: 'exists', target: 'securityRules', expected: { name: 'Allow-Web-Browsing' } } },
      { instruction: 'Use Move Up/Down to ensure "Block-BitTorrent" appears ABOVE "Allow-Web-Browsing". Specific deny rules should come before general allow rules.', hint: 'First match wins — if allow is above deny, BitTorrent would be allowed.', validation: { type: 'rule_position', target: 'securityRules', expected: { firstRule: 'Block-BitTorrent', secondRule: 'Allow-Web-Browsing', matchField: 'name' } } },
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
      'Identify and disable unused rules',
      'Practice policy cleanup',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Review the security rules table. Check the "Hits" column for each rule.', hint: 'Zero-hit rules may be candidates for removal.', validation: { type: 'count_check', target: 'securityRules', expected: { min: 1 } } },
      { instruction: 'Find a rule with low or zero hit count. Edit it and set Enabled to false (disable it).', hint: 'Disabling is safer than deleting — you can re-enable if needed.', validation: { type: 'field_check', target: 'securityRules', expected: { enabled: false } } },
      { instruction: 'Navigate to "Objects" to review if address/service objects are used efficiently.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
    ],
  },

  // ========== Category 4: NAT Policies ==========
  {
    id: 'lab-20',
    title: 'Configure Source NAT (DIPP)',
    category: 'NAT Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Create a Source NAT rule using Dynamic IP And Port',
      'Understand DIPP NAT for outbound access',
      'Learn Original/Translated Packet structure',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Switch to the NAT sub-tab and click "Add". Name it "Outbound-SNAT".', hint: 'Source NAT translates private IPs to public for internet access.', validation: { type: 'create', target: 'natRules', expected: { name: 'Outbound-SNAT' } } },
      { instruction: 'Set Source Translation Type to "Dynamic IP And Port".', hint: 'DIPP uses interface IP plus dynamic port allocation — most common NAT type.', validation: { type: 'field_check', target: 'natRules', expected: { _match: { name: 'Outbound-SNAT' }, sourceTranslationType: 'Dynamic IP And Port' } } },
      { instruction: 'Verify the complete NAT rule configuration.', validation: { type: 'field_check', target: 'natRules', expected: { _match: { name: 'Outbound-SNAT' }, sourceTranslationType: 'Dynamic IP And Port' } } },
    ],
  },
  {
    id: 'lab-21',
    title: 'Configure Static NAT',
    category: 'NAT Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Create a Static NAT for a DMZ web server',
      'Understand 1:1 NAT mapping',
      'Learn bi-directional NAT',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'In the NAT sub-tab, click "Add". Name it "WebServer-Static-NAT".', hint: 'Static NAT creates a permanent 1:1 mapping between public and private IP.', validation: { type: 'create', target: 'natRules', expected: { name: 'WebServer-Static-NAT' } } },
      { instruction: 'Set Source Translation Type to "Static IP" for 1:1 mapping.', hint: 'Static IP NAT permanently maps one IP to another.', validation: { type: 'field_check', target: 'natRules', expected: { _match: { name: 'WebServer-Static-NAT' }, sourceTranslationType: 'Static IP' } } },
      { instruction: 'Verify the static NAT rule is configured correctly.', validation: { type: 'exists', target: 'natRules', expected: { name: 'WebServer-Static-NAT' } } },
    ],
  },
  {
    id: 'lab-22',
    title: 'Destination NAT',
    category: 'NAT Policies',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Create a DNAT rule for port forwarding',
      'Translate public IP to private server',
      'Understand destination NAT with port translation',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'In the NAT sub-tab, click "Add". Name it "DNAT-HTTPS-Server".', hint: 'Destination NAT changes the destination IP of incoming traffic.', validation: { type: 'create', target: 'natRules', expected: { name: 'DNAT-HTTPS-Server' } } },
      { instruction: 'Configure the NAT rule. Leave Source Translation as "None" for pure DNAT.', hint: 'DNAT only modifies the destination, not the source.', validation: { type: 'field_check', target: 'natRules', expected: { _match: { name: 'DNAT-HTTPS-Server' }, sourceTranslationType: 'None' } } },
      { instruction: 'Verify you now have at least 3 NAT rules configured.', validation: { type: 'count_check', target: 'natRules', expected: { min: 3 } } },
    ],
  },
  {
    id: 'lab-23',
    title: 'NAT Policy Ordering',
    category: 'NAT Policies',
    difficulty: 'advanced',
    estimatedMinutes: 10,
    objectives: [
      'Understand NAT rule evaluation order',
      'Place specific rules before general rules',
      'Verify correct ordering',
    ],
    steps: [
      { instruction: 'Navigate to the "Policies" tab.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Verify "WebServer-Static-NAT" exists (from Lab 21).', validation: { type: 'exists', target: 'natRules', expected: { name: 'WebServer-Static-NAT' } } },
      { instruction: 'Verify "Outbound-SNAT" exists (from Lab 20).', validation: { type: 'exists', target: 'natRules', expected: { name: 'Outbound-SNAT' } } },
      { instruction: 'Ensure Static NAT rules appear ABOVE Dynamic NAT. Move "WebServer-Static-NAT" above "Outbound-SNAT".', hint: 'Specific translations should be checked before the general outbound SNAT.', validation: { type: 'rule_position', target: 'natRules', expected: { firstRule: 'WebServer-Static-NAT', secondRule: 'Outbound-SNAT', matchField: 'name' } } },
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
      'Understand different address object types',
      'Use meaningful naming conventions',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Click "Add" to create a new address object. Name: "WebServer-01", Type: "IP Netmask", Value: "10.1.2.10/32".', hint: '/32 means a single host IP address.', validation: { type: 'create', target: 'addressObjects', expected: { name: 'WebServer-01' } } },
      { instruction: 'Create another address object: Name: "DB-Server-01", Type: "IP Netmask", Value: "10.1.3.10/32".', hint: 'Consistent naming helps with policy management.', validation: { type: 'create', target: 'addressObjects', expected: { name: 'DB-Server-01' } } },
      { instruction: 'Create one more: Name: "App-Server-01", Type: "IP Netmask", Value: "10.1.2.20/32".', validation: { type: 'create', target: 'addressObjects', expected: { name: 'App-Server-01' } } },
      { instruction: 'Verify you now have at least 3 new address objects created.', validation: { type: 'count_check', target: 'addressObjects', expected: { min: 5 } } },
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
      'Understand group benefits for policy management',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Click on "Address Groups" and then "Add". Name it "Web-Servers".', hint: 'Address groups simplify policy — update the group, all rules using it update automatically.', validation: { type: 'create', target: 'addressGroups', expected: { name: 'Web-Servers' } } },
      { instruction: 'Verify the address group was created and exists in the table.', validation: { type: 'exists', target: 'addressGroups', expected: { name: 'Web-Servers' } } },
      { instruction: 'Verify the total count of address groups has increased.', validation: { type: 'count_check', target: 'addressGroups', expected: { min: 2 } } },
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
      { instruction: 'Click on "Services" and "Add". Name: "TCP-8080", Protocol: "TCP", Port: "8080".', hint: 'Custom services are used when applications run on non-standard ports.', validation: { type: 'create', target: 'serviceObjects', expected: { name: 'TCP-8080' } } },
      { instruction: 'Create another: Name: "TCP-8443", Protocol: "TCP", Port: "8443".', hint: '8443 is commonly used for alternative HTTPS services.', validation: { type: 'create', target: 'serviceObjects', expected: { name: 'TCP-8443' } } },
      { instruction: 'Create one more: Name: "UDP-5060", Protocol: "UDP", Port: "5060".', hint: 'UDP 5060 is the standard SIP port for VoIP signaling.', validation: { type: 'create', target: 'serviceObjects', expected: { name: 'UDP-5060' } } },
      { instruction: 'Verify at least 3 custom services exist.', validation: { type: 'count_check', target: 'serviceObjects', expected: { min: 3 } } },
    ],
  },
  {
    id: 'lab-27',
    title: 'Create Service Groups',
    category: 'Objects & Profiles',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Group custom services together',
      'Understand service group benefits',
      'Use groups in security policies',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify that "TCP-8080" service object exists (from Lab 26).', validation: { type: 'exists', target: 'serviceObjects', expected: { name: 'TCP-8080' } } },
      { instruction: 'Verify that "TCP-8443" service object exists.', validation: { type: 'exists', target: 'serviceObjects', expected: { name: 'TCP-8443' } } },
      { instruction: 'Navigate to Policies to see where service groups can be applied.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
    ],
  },
  {
    id: 'lab-28',
    title: 'Create Tags',
    category: 'Objects & Profiles',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Navigate to Objects tab',
      'Understand tag usage for organization',
      'Review existing objects that could be tagged',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Review the existing address objects in the table.', hint: 'Tags provide organizational labels applied to objects, rules, and zones.', validation: { type: 'count_check', target: 'addressObjects', expected: { min: 1 } } },
      { instruction: 'Review existing service objects.', validation: { type: 'count_check', target: 'serviceObjects', expected: { min: 1 } } },
      { instruction: 'Navigate to Policies to see how objects are referenced in rules.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
    ],
  },

  // ========== Category 6: Security Profiles & Threat Prevention ==========
  {
    id: 'lab-29',
    title: 'Configure Antivirus Profile',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Navigate to Objects > Security Profiles',
      'Review default antivirus profile settings',
      'Understand decoder-based inspection',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify that security profiles exist in the system.', hint: 'Security profiles add threat inspection to security rules.', validation: { type: 'count_check', target: 'securityProfiles', expected: { min: 1 } } },
      { instruction: 'Navigate to the "Policies" tab to see where profiles are applied.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Navigate to "Monitor" to see threats detected by antivirus profiles.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Verify threat logs exist showing detected threats.', validation: { type: 'count_check', target: 'threatLogs', expected: { min: 1 } } },
    ],
  },
  {
    id: 'lab-30',
    title: 'Configure Anti-Spyware Profile',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Understand severity-based threat actions',
      'Review security profiles',
      'Verify threat detection is active',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Review security profiles. Verify at least 2 profiles exist.', hint: 'Anti-spyware detects C2 traffic, spyware callbacks, and data exfiltration.', validation: { type: 'count_check', target: 'securityProfiles', expected: { min: 2 } } },
      { instruction: 'Navigate to Monitor to check for spyware-related threat logs.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Navigate to Policies to see which rules have security profiles attached.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
    ],
  },
  {
    id: 'lab-31',
    title: 'Configure URL Filtering',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Understand URL filtering concepts',
      'Review URL category actions',
      'Verify URL filtering profile exists',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify that security profiles include URL filtering capabilities.', hint: 'URL filtering controls web access based on content categories.', validation: { type: 'count_check', target: 'securityProfiles', expected: { min: 1 } } },
      { instruction: 'Navigate to "Monitor" to see URL filtering log events.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Navigate to "Dashboard" to see the overall security posture.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
    ],
  },
  {
    id: 'lab-32',
    title: 'Apply Security Profile Group',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    objectives: [
      'Understand security profile groups',
      'Verify profiles can be attached to rules',
      'Review defense-in-depth approach',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab to review available security profiles.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Verify multiple security profiles exist for grouping.', validation: { type: 'count_check', target: 'securityProfiles', expected: { min: 2 } } },
      { instruction: 'Navigate to "Policies" tab — profiles are attached on the Actions tab of security rules.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Verify that allow rules exist that can have profiles attached.', hint: 'Only "allow" rules can have security profiles — deny rules don\'t inspect content.', validation: { type: 'field_check', target: 'securityRules', expected: { action: 'allow' } } },
      { instruction: 'Navigate to Monitor to see how profiles generate threat logs.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
    ],
  },
  {
    id: 'lab-33',
    title: 'Configure File Blocking',
    category: 'Security Profiles & Threat Prevention',
    difficulty: 'advanced',
    estimatedMinutes: 10,
    objectives: [
      'Understand file blocking concepts',
      'Review file type identification',
      'Verify security profile configuration',
    ],
    steps: [
      { instruction: 'Navigate to the "Objects" tab.', navigateTo: { tab: 'objects' }, validation: { type: 'navigate', target: 'objects' } },
      { instruction: 'Review security profiles that include file blocking capabilities.', hint: 'File blocking prevents specific file types from crossing security boundaries.', validation: { type: 'count_check', target: 'securityProfiles', expected: { min: 1 } } },
      { instruction: 'Navigate to Policies to see where file blocking profiles are applied.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Navigate to Monitor to verify threat detection is active.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Verify threat logs show file-related detections.', validation: { type: 'count_check', target: 'threatLogs', expected: { min: 1 } } },
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
      'Verify commit appears in history',
      'Understand candidate vs running config',
    ],
    steps: [
      { instruction: 'Make any configuration change first — for example, navigate to Policies and verify rules exist.', navigateTo: { tab: 'policies' }, validation: { type: 'navigate', target: 'policies' } },
      { instruction: 'Verify there are security rules in the configuration.', validation: { type: 'count_check', target: 'securityRules', expected: { min: 1 } } },
      { instruction: 'Click the "Commit" button in the top-right header. In the modal, click "Commit" to apply changes.', hint: 'In production, a commit makes candidate config the running config.', validation: { type: 'committed', target: 'commitHistory', expected: { minCount: 1 } } },
      { instruction: 'After commit, verify the commit history has at least one successful entry.', validation: { type: 'committed', target: 'commitHistory', expected: { minCount: 1 } } },
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
      'Verify audit trail exists',
    ],
    steps: [
      { instruction: 'Navigate to the "Monitor" tab.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
      { instruction: 'Verify system logs contain entries. Look for commit-related log events.', hint: 'System logs record operational events including commits.', validation: { type: 'count_check', target: 'systemLogs', expected: { min: 1 } } },
      { instruction: 'Navigate to "Dashboard" to confirm the system is operational.', navigateTo: { tab: 'dashboard' }, validation: { type: 'navigate', target: 'dashboard' } },
      { instruction: 'Navigate to "Device" for device management and verification.', navigateTo: { tab: 'device' }, validation: { type: 'navigate', target: 'device' } },
      { instruction: 'Return to Monitor for final log review.', navigateTo: { tab: 'monitor' }, validation: { type: 'navigate', target: 'monitor' } },
    ],
  },
];



# PAN-OS Simulator Accuracy Audit & Enhancement Plan

## Research Sources Used
- Official PAN-OS 11.1 Web Interface Help documentation (docs.paloaltonetworks.com)
- PAN-OS Building Blocks in Security Policy Rule reference
- Objects, Network, Device, Monitor tab official documentation
- Referenced YouTube training video (8-hour comprehensive course)

## Identified Factual Inaccuracies & Gaps

### 1. Security Policy Rule Modal — Missing Tabs & Fields
**Current**: 5 tabs (General, Source, Destination, Application, Actions)
**Actual PAN-OS**: 7 tabs — General, Source, Destination, Application, **Service/URL Category**, Actions, **Target**
- Missing **Service/URL Category** tab (separate from Application tab — Service and URL Category are distinct fields)
- Missing **Target** tab (for Panorama pushed rules — can be a placeholder)
- Actions tab missing: **Log Forwarding** profile dropdown, **Schedule** dropdown, **QoS Marking** fields, **Disable Server Response Inspection** checkbox
- Source/Destination tabs missing: **User** field, **Negate** checkbox for source/dest address
- Missing **Rule Type** dropdown on General tab (universal, intrazone, interzone)

### 2. Security Rule Table — Missing Columns
**Current**: #, Name, Source Zone, Source Addr, Dest Zone, Dest Addr, Application, Action, Hits
**Missing**: Service column, Profile (Security Profile Group) column with profile icons, Options column (log forwarding icon), Source User column

### 3. NAT Rule Model — Incorrect Structure
**Actual PAN-OS NAT modal**: Tabs are **General**, **Original Packet**, **Translated Packet**
- General tab should have: Name, Description, Tag, NAT Type (ipv4, nat64, nptv6)
- Original Packet: Source Zone, Destination Zone, Destination Interface, Source Address, Destination Address, Service
- Translated Packet: Source Translation Type (None, Dynamic IP And Port, Dynamic IP, Static IP), Translated Address/Interface, Bi-directional checkbox; Destination Translation Address and Port

### 4. Objects Tab — Missing Sub-sections from Official Docs
**Current sidebar**: Addresses, Address Groups, Services, Service Groups, Applications, Application Groups, Security Profiles (6 sub), Security Profile Groups, Log Forwarding, Schedules, Tags
**Missing per official docs**:
- **Regions** (between Address Groups and Applications)
- **Application Filters** (after Application Groups)
- **Devices** 
- **GlobalProtect > HIP Objects** and **HIP Profiles**
- **External Dynamic Lists**
- **Custom Objects** (Spyware, Vulnerability, URL Category)
- **Authentication** profiles
- **Decryption Profile**
- **SD-WAN Link Management**

### 5. Network Tab — Missing/Inaccurate Sidebar Items
**Current**: Interfaces (Ethernet, Loopback, Tunnel, VLAN), Zones, VLANs, Virtual Routers, IPSec Tunnels, IKE Gateways, IKE/IPSec Crypto, GRE, DHCP, DNS Proxy, Network Profiles (Interface Mgmt, Zone Protection)
**Missing per official docs**:
- **Virtual Wires** (separate from interfaces)
- **QoS** (under Network)
- **LLDP** 
- **GlobalProtect** (Portals, Gateways, MDM)
- Network Profiles should also include: **Monitor**, **Decryption Profile**

### 6. Device Tab — Missing Key Sections
**Current sidebar**: Mostly correct structure
**Missing**:
- **User-ID** (critical for training — User-ID agent config, group mapping)
- **VM-Series** (if modeling VM)
- **Config Audit** (under Setup)
- Setup should have separate sub-items: **Management**, **Operations**, **HSM**, **Services** (DNS, NTP, Proxy), **Interfaces** (management interface)

### 7. Monitor Tab — Incomplete Log Types
**Current**: Traffic, Threat, URL Filtering, Data Filtering, WildFire
**Missing per official docs**:
- **Authentication** logs
- **HIP Match** logs  
- **IP-Tag** logs
- **User-ID** logs
- **GTP** logs
- **Tunnel Inspection** logs
- **Configuration** logs (audit trail)
- **System** logs (critical for training)
- **Unified** logs

### 8. Dashboard — Missing Widgets
**Current**: General Info, System Resources gauges, Top Apps table, Top Sources, Traffic summary, Threats summary
**Missing/Inaccurate**:
- **Licenses** widget showing subscription status
- **High Availability** widget showing HA status/peer
- **Interface Status** widget with link state indicators
- **Logging Rate** widget
- Widget titles should match PAN-OS exactly

### 9. ACC Page — Structural Issue
**Actual PAN-OS ACC**: Uses sub-tabs — **Network Activity**, **Threat Activity**, **Blocked Activity**, **Tunnel Activity**
- Each sub-tab has multiple widget rings/charts (not just lists)
- Has time-range selector and **Global Filters** panel
- Should show donut/ring charts for Applications by Risk, Application Categories

### 10. Mock Data Corrections
- `panosVersion: '10.2.3'` — should be a modern version like `'11.1.4-h1'` to match PAN-OS 11.1 docs being referenced
- Interface type `'Virtual Wire'` should be `'Virtual Wire'` (correct) but modal shows it as option alongside the actual PAN-OS naming
- Security profiles should have proper sub-types: WildFire Analysis is missing from the profile type enum
- Missing `'wildfire-analysis'` in SecurityProfile type union

### 11. Commit Modal — Missing Features
**Current**: Simple progress bar
**Actual PAN-OS Commit**:
- **Commit Type** dropdown: Commit All, Commit Changes Made by specific admin
- **Preview Changes** button showing config diff
- **Validate Commit** button (separate from actual commit)
- Commit log showing validation warnings (e.g., "Rule 'X' shadows Rule 'Y'")
- **Force Commit** option

---

## Implementation Plan

### Phase 1: Fix Critical Factual Inaccuracies (High Priority)

**Step 1**: Update Security Rule modal to match PAN-OS exactly
- Add Service/URL Category tab
- Add Rule Type field (universal/intrazone/interzone)  
- Add User field to Source tab
- Add Negate checkboxes
- Add Log Forwarding, Schedule, QoS to Actions tab
- Add Service column to rule table

**Step 2**: Fix NAT Rule structure
- Restructure to General / Original Packet / Translated Packet tabs
- Add Source Translation Type dropdown (Dynamic IP And Port, Static IP, etc.)
- Add NAT Type field (ipv4, nat64, nptv6)

**Step 3**: Update mock data
- PAN-OS version to 11.1.x
- Add wildfire-analysis to profile types
- Add more realistic security profile details (per-decoder actions for AV, per-severity actions for anti-spyware)

**Step 4**: Fix Commit modal
- Add Validate button
- Add Preview Changes
- Add commit type selector
- Show realistic validation warnings

### Phase 2: Complete Missing Sidebar Sections

**Step 5**: Objects tab — add missing sidebar items
- Regions, Application Filters, External Dynamic Lists, Custom Objects, Decryption Profile, Authentication, HIP Objects/Profiles

**Step 6**: Network tab — add missing items
- Virtual Wires, QoS, GlobalProtect placeholders

**Step 7**: Monitor tab — add missing log types
- System, Config, Authentication, HIP Match logs with mock data

**Step 8**: Device tab — add User-ID, Config Audit sections

### Phase 3: ACC & Dashboard Accuracy

**Step 9**: Restructure ACC to use proper sub-tabs (Network Activity, Threat Activity, Blocked Activity)
- Add ring/donut charts
- Add time range selector and global filters

**Step 10**: Dashboard widget accuracy
- Add Licenses, HA Status, Interface Status widgets
- Match exact PAN-OS widget titles and layout

### Phase 4: Enhanced Interactivity for Training

**Step 11**: Security Profile detail modals
- Antivirus: per-decoder action dropdowns (HTTP, SMTP, IMAP, POP3, FTP, SMB)
- Anti-Spyware: severity-based actions (critical/high/medium/low/informational)
- URL Filtering: category list with action dropdowns (allow/block/alert/continue/override)
- File Blocking: file type / direction / action table

**Step 12**: Interface edit modal — add Management Profile dropdown, MTU field, IPv6 tab content

---

## Technical Approach
- All changes are frontend-only using existing React Context pattern
- Expand `mockData.ts` types and default data
- Update existing page components with corrected sidebar structures
- Add new sub-components for detailed profile modals
- No backend changes needed

## File Impact Summary
- `src/data/mockData.ts` — expand types, fix version data, add profiles detail
- `src/pages/PoliciesPage.tsx` — fix rule modal tabs, NAT structure, table columns
- `src/pages/ObjectsPage.tsx` — add missing sidebar items
- `src/pages/NetworkPage.tsx` — add missing sidebar items
- `src/pages/MonitorPage.tsx` — add missing log types
- `src/pages/DevicePage.tsx` — add User-ID, Config Audit
- `src/pages/ACCPage.tsx` — restructure with proper sub-tabs
- `src/pages/DashboardPage.tsx` — add missing widgets
- `src/components/panos/CommitModal.tsx` — add validate/preview features
- `src/contexts/FirewallContext.tsx` — expand state for new data types


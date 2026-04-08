

# Palo Alto PAN-OS Firewall Training Simulator

A fully interactive, pixel-accurate replica of the Palo Alto Networks PAN-OS web management interface for student training purposes. Students can navigate, configure, and practice firewall administration without a real device.

## Overall Layout
- **Top header bar**: PAN-OS style — Palo Alto Networks logo (left), hostname/model display (PA-3260 mock), admin user info, commit button, lock icon, search bar
- **Top navigation tabs**: Dashboard, ACC, Monitor, Policies, Objects, Network, Device — matching PAN-OS tab styling (dark blue bar with white text)
- **Secondary navigation**: Left sidebar tree menu that changes per top-level tab (e.g., under Network → Interfaces, Zones, VLANs, Virtual Routers, IPSec Tunnels)
- **Content area**: Data tables, forms, and modals matching PAN-OS styling
- **Footer bar**: Task manager area showing commit status, warnings count

---

## 1. Dashboard & System Info
- **Dashboard widgets**: General Information (hostname, model, PAN-OS version, serial, uptime), Top Applications, Top Sources, System Resources (CPU, memory, session count with gauges), Traffic trend charts, Threat activity summary
- **Widget customization**: Add/remove widgets modal
- **ACC (Application Command Center)**: Tab with mock traffic analysis, top applications by sessions/bytes, risk levels, network activity graphs

## 2. Network & Interfaces
- **Interfaces tab**: Table listing ethernet1/1 through ethernet1/8 with columns: Interface Name, Type (Layer3/Layer2/VWire), Zone, IP Address, Virtual Router, Link State (up/down icons)
- **Interface edit modal**: Tabs for Config, Advanced, IPv4, IPv6 — Layer3 config with IP address, netmask, management profile dropdown
- **Zones**: Table of zones (trust, untrust, dmz), create/edit modal with zone type, zone protection profile, interfaces list
- **Virtual Routers**: Static routes table, route add modal with destination, next hop, interface, metric
- **IPSec Tunnels**: Tunnel list with status indicators, IKE gateway config modal, IPSec crypto profile modal

## 3. Security Policies & NAT
- **Security policy rule base**: Table with columns — #, Name, Source Zone, Source Address, Destination Zone, Destination Address, Application, Service, Action (allow/deny/drop), Profile, Options, Hit Count
- **Rule edit modal**: Multi-tab form (General, Source, Destination, Application, Service/URL Category, Actions) with searchable dropdowns, drag-to-reorder
- **NAT policies**: Source NAT and Destination NAT rules table, edit modal with original/translated packet tabs
- **Policy actions**: Clone rule, disable/enable, move up/down, delete with confirmation
- **Commit flow**: Commit button opens modal showing validation, warnings, commit progress bar, success/fail result

## 4. Objects & Security Profiles
- **Address objects**: Table with Name, Type (IP Netmask/Range/FQDN), Value; create/edit/delete modals
- **Address Groups**: Static and dynamic groups with member selection
- **Service objects**: Protocol/port definitions table and modal
- **Security Profiles**:
  - Antivirus profile modal with decoder actions (smtp, imap, pop3, ftp, http, smb)
  - Anti-Spyware profile with severity-based actions
  - URL Filtering profile with category allow/block/alert/continue toggles
  - File Blocking profile with file type / direction / action table
  - Vulnerability Protection profile
- **Security Profile Groups**: Group profiles together, assign to rules

## 5. Monitor Tab (Bonus)
- **Traffic logs**: Filterable table with mock log entries (source, dest, app, action, bytes, timestamp)
- **Threat logs**: Mock threat entries with severity icons
- **Log filtering**: Toolbar with filter builder (field = value)

## Design & Styling
- Match PAN-OS color scheme: dark navy top bar (#1a2332), medium gray sidebar, white content area, Palo Alto green accents (#6cc04a)
- Table styling: Alternating row colors, blue header rows, compact row height
- Form styling: PAN-OS-style tabs within modals, grouped fieldsets, dropdown selectors
- All mock data pre-populated with realistic firewall config (10+ security rules, 5+ NAT rules, address objects, zones, interfaces)

## Technical Approach
- React with React Router for tab/section navigation
- State management via React context for mock firewall config data
- Reusable PanOS-styled components (PanTable, PanModal, PanForm, PanTabs)
- All data stored in-memory (JSON) — no backend needed


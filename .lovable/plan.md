

# In-App Lab Exercises for PAN-OS Training Simulator

## Overview
Add a **Labs** tab to the simulator with 35 guided, interactive lab exercises. Each lab has step-by-step instructions, objectives, hints, and a validation system that checks whether the student correctly completed the task by inspecting the firewall context state.

## Architecture

### New Files
- **`src/data/labData.ts`** — All 35 lab definitions (title, category, difficulty, objectives, steps with validation checks, hints)
- **`src/pages/LabsPage.tsx`** — Main labs page with category filtering, progress tracking, and a step-by-step guided panel
- **`src/components/panos/LabPanel.tsx`** — Slide-out panel that overlays the right side while a lab is active, showing current step instructions, hints, and completion status
- **`src/components/panos/LabStepValidator.tsx`** — Validation logic component that checks firewall context state against expected outcomes

### Modified Files
- **`src/pages/Index.tsx`** — Add `labs` tab rendering
- **`src/components/panos/PanHeader.tsx`** — Add "Labs" to nav tabs
- **`src/contexts/FirewallContext.tsx`** — Add lab progress state (completed labs, current lab, current step)

## Lab Categories & Exercises (35 Total)

### Category 1: Initial Setup & Navigation (5 labs)
1. **Explore the Dashboard** — Navigate to Dashboard, identify hostname, PAN-OS version, serial number, and system uptime
2. **System Configuration Basics** — Go to Device > Setup, review management interface IP, DNS, and NTP settings
3. **Review Licenses** — Navigate to Dashboard, identify active subscription licenses and their expiry dates
4. **Understanding the ACC** — Switch between Network Activity, Threat Activity, and Blocked Activity sub-tabs
5. **Navigating Monitor Logs** — Open Traffic logs, apply a filter for a specific source IP, then switch to Threat logs

### Category 2: Network & Interfaces (6 labs)
6. **Configure an Ethernet Interface** — Set ethernet1/3 to Layer3, assign IP 10.10.10.1/24, assign to "trust" zone
7. **Create a New Security Zone** — Create a "dmz-servers" zone of type Layer3, assign ethernet1/4
8. **Configure a Virtual Router** — Add a default static route (0.0.0.0/0) with next-hop 203.0.113.1 via ethernet1/1
9. **Add a Static Route** — Add a route for 172.16.0.0/16 pointing to next-hop 10.10.10.254
10. **Configure Interface Management Profile** — Review and understand management profiles (HTTP, HTTPS, SSH, Ping)
11. **Configure DHCP Server** — Navigate to Network > DHCP, understand DHCP relay and server configuration options

### Category 3: Security Policies (8 labs)
12. **Create a Basic Allow Rule** — Create a rule allowing trust-to-untrust traffic for "web-browsing" application
13. **Create a Deny Rule** — Block "bittorrent" application from trust zone to any destination
14. **Application-Based Policy** — Create a rule that allows "ssl", "web-browsing", and "dns" from trust to untrust
15. **User-Based Policy** — Create a rule with source user "domain\sales-team" allowing "salesforce"
16. **Service-Specific Rule** — Create a rule allowing tcp/8443 from dmz to trust for a custom application
17. **Intrazone vs Interzone Rules** — Create an intrazone allow rule for trust zone, then an interzone deny rule
18. **Rule Ordering & Shadowing** — Identify a shadowed rule by placing a broad rule above a specific one, then fix it
19. **Policy Optimization** — Review hit counts, identify unused rules, disable a zero-hit rule

### Category 4: NAT Policies (4 labs)
20. **Configure Source NAT (DIPP)** — Create a source NAT rule using Dynamic IP And Port for trust-to-untrust traffic
21. **Configure Static NAT** — Create a static NAT rule for a DMZ web server (1:1 NAT) with bi-directional enabled
22. **Destination NAT** — Create a DNAT rule translating public IP to private server IP on port 443
23. **NAT Policy Ordering** — Understand NAT rule evaluation order, place specific rules before general

### Category 5: Objects & Profiles (5 labs)
24. **Create Address Objects** — Create IP Netmask, IP Range, and FQDN address objects for common servers
25. **Create Address Groups** — Build a static address group "Web-Servers" containing multiple address objects
26. **Create Custom Service Objects** — Create TCP/8080, TCP/8443, and UDP/5060 service objects
27. **Create Service Groups** — Group custom services into a "Custom-Web-Ports" service group
28. **Create Tags** — Create color-coded tags (e.g., "Production-Red", "Dev-Blue") and apply to objects

### Category 6: Security Profiles & Threat Prevention (5 labs)
29. **Configure Antivirus Profile** — Create an AV profile, set decoder actions for HTTP, SMTP, FTP to "reset-both"
30. **Configure Anti-Spyware Profile** — Set severity-based actions: critical=reset-both, high=reset-server, medium=alert
31. **Configure URL Filtering** — Create a URL filtering profile blocking "gambling", "malware", and "phishing" categories
32. **Apply Security Profile Group** — Create a profile group combining AV, Anti-Spyware, and URL Filtering, then attach to a security rule
33. **Configure File Blocking** — Create a file blocking profile to block PE, DLL uploads/downloads

### Category 7: Operations & Commit (2 labs)
34. **Validate and Commit Configuration** — Use the Validate button first, review warnings, then perform a full commit
35. **Review System and Config Logs** — After a commit, navigate to Monitor > System and Config logs to find the commit entry

## Lab Data Structure
```typescript
interface Lab {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  objectives: string[];
  steps: LabStep[];
}
interface LabStep {
  instruction: string;
  hint?: string;
  navigateTo?: { tab: string; sidebar?: string };
  validation?: {
    type: 'navigate' | 'create' | 'update' | 'exists';
    target: string; // context path to check
    expected: any;
  };
}
```

## UI Design
- **Labs Page**: Grid of lab cards grouped by category, with difficulty badges (green/yellow/red), estimated time, and completion checkmarks
- **Active Lab Panel**: Right-side slide-out panel (350px wide) showing step number, instruction text, hint toggle, "Check" button, and progress dots — stays visible while student navigates other tabs
- **Progress Tracking**: Stored in localStorage — completed labs, current step per lab
- **Navigation Hints**: Steps can auto-highlight which tab to navigate to, with a "Go There" button

## Technical Notes
- Lab validation reads from FirewallContext state (e.g., check if a security rule with specific name/properties exists)
- No backend needed — progress persisted in localStorage
- Labs panel coexists with existing sidebar by floating on the right side
- Adding "Labs" as the 8th nav tab in the header


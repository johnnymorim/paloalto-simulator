

# Redesign Labs: Real-Time Hands-On Simulation

## Problem
Current labs are mostly passive — 70%+ steps use `type: 'manual'` (always pass) or `type: 'navigate'` (just checks which tab you're on). Students click "Mark Complete" without doing real work. No actual firewall configuration is validated.

## Solution
Replace all 35 labs with truly interactive exercises where **every step validates real state changes** in the FirewallContext. Students must actually click Add, fill forms, save objects, and the validator confirms the exact configuration exists.

## Key Changes

### 1. Enhanced Validator (`LabStepValidator.tsx`)
Add new validation types beyond the current basic ones:
- **`field_check`** — verify a specific field value on a specific object (e.g., interface ethernet1/3 has zone = "trust")
- **`count_check`** — verify collection has N items (e.g., "at least 3 address objects exist")
- **`rule_position`** — verify a rule appears before/after another rule
- **`committed`** — verify a commit was performed (check commitHistory)
- **`disabled`** — verify a rule is disabled
- Remove `manual` type entirely — every step must be objectively verifiable or use `navigate`

### 2. Redesigned Lab Data (`labData.ts`)
All 35 labs rewritten with concrete, verifiable steps. Examples:

**Lab 6 — Configure Ethernet Interface** (current has 1 real validation at end):
- Step 1: Navigate to Network tab → `navigate` check
- Step 2: Click ethernet1/3, set type to Layer3 → `field_check` on interfaces, name=ethernet1/3, field=type, value=Layer3
- Step 3: Set IP to 10.10.10.1/24 → `field_check` on interfaces, name=ethernet1/3, field=ip, value=10.10.10.1/24
- Step 4: Set zone to trust → `field_check` on interfaces, name=ethernet1/3, field=zone, value=trust
- Every step blocks until the student actually makes the change

**Lab 12 — Create Basic Allow Rule** (current is mostly manual):
- Step 1: Navigate to Policies → `navigate`
- Step 2: Click Add to open rule form → `navigate` (policies tab)
- Step 3: Create rule named "Allow-Web-Trust" → `create` check on securityRules, name="Allow-Web-Trust"
- Step 4: Verify source zone is "trust" → `field_check` securityRules, name=Allow-Web-Trust, sourceZone contains "trust"
- Step 5: Verify dest zone is "untrust" → `field_check`
- Step 6: Verify application is "web-browsing" → `field_check`
- Step 7: Verify action is "allow" → `field_check`

**Lab 18 — Rule Ordering** (currently impossible to validate):
- Step 1: Create a broad "Allow-All" rule → `create`
- Step 2: Create a specific "Block-BitTorrent" rule → `create`
- Step 3: Move "Block-BitTorrent" above "Allow-All" → `rule_position` check

**Lab 34 — Validate and Commit**:
- Step 1: Navigate to any config page → `navigate`
- Step 2: Click Commit button → `committed` check on commitHistory length

### 3. Lab Panel UX Improvements (`LabPanel.tsx`)
- Remove "Mark Complete" button for non-manual steps — steps auto-complete when validation passes
- Add **live polling**: re-run validation every 2 seconds while lab is active so completion is instant when student saves a change
- Add **red/green indicator** showing current validation status in real-time
- Keep "Go There" navigation button for steps with `navigateTo`

### 4. Category Restructuring
Keep same 7 categories but ensure every lab has 4-7 steps, all with real validation:

| Category | Labs | All Steps Validated |
|---|---|---|
| Initial Setup & Navigation | 5 labs | Navigate + field_check on systemInfo |
| Network & Interfaces | 6 labs | create/update interfaces, zones, routes |
| Security Policies | 8 labs | create/update/move/disable rules |
| NAT Policies | 4 labs | create NAT rules with specific translation types |
| Objects & Profiles | 5 labs | create address/service objects and groups |
| Security Profiles | 5 labs | create/update security profiles |
| Operations & Commit | 2 labs | committed check, navigate to logs |

### 5. Auto-Reset for Repeatable Labs
Add a `resetState` property to labs that defines what context state should be reset when starting a lab, so students can redo labs cleanly without leftover objects from previous attempts.

## Files Changed
- **`src/components/panos/LabStepValidator.tsx`** — Add `field_check`, `count_check`, `rule_position`, `committed`, `disabled` validation types; remove `manual`
- **`src/data/labData.ts`** — Rewrite all 35 labs with concrete validated steps
- **`src/components/panos/LabPanel.tsx`** — Add live polling, remove manual complete for validated steps, add real-time status indicator
- **`src/pages/Index.tsx`** — Add lab reset state handler


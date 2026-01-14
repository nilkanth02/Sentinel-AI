# SentinelAI UI – Design Specification

## 1. Pages / Screens

- Landing Page
- Dashboard
- Risk Logs List
- Risk Log Detail
- Baselines Management
- Settings

---

## 2. Global Layout

- Top navigation bar
- Left sidebar (collapsible)
- Main content area
- Footer (landing page only)

---

## 3. Navigation

Top Nav Items:
- Dashboard
- Risk Logs
- Baselines
- Settings

Navigation Behavior:
- Highlight active page
- Responsive collapse on smaller screens

---

## 4. Components

### Layout Components
- AppLayout
- Sidebar
- TopNavbar
- PageContainer

### UI Components
- Button (primary, secondary)
- Card
- Badge (risk level)
- Table
- Modal
- Tabs
- Dropdown
- Tooltip

### Data Components
- KPI Card
- Risk Score Badge
- Flag Tags
- Charts (line, bar)

---

## 5. Dashboard Page

- KPI cards row (4–5 cards)
- Risk trend chart
- Flag frequency chart
- Recent logs table (last 5 entries)

---

## 6. Risk Logs Page

Filters:
- Search input
- Date range picker
- Risk score range slider
- Flags multi-select

Table Columns:
- Timestamp
- Prompt snippet
- Risk score
- Flags
- Confidence
- Decision

Row click → Detail page

---

## 7. Risk Log Detail Page

Sections:
- Prompt (full text)
- Response (full text)
- Risk summary
- Decision + explanation
- Signals breakdown

Actions:
- Back to logs
- Export

---

## 8. Baselines Page

- Table of baseline prompts
- Add / Edit / Delete modal
- Active toggle

---

## 9. Visual Style (from Visily)

- Clean SaaS dashboard style
- Neutral background
- Emphasis on risk score colors
- Card-based layout

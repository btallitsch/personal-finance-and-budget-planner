# 💎 Finesse — Personal Finance & Budget Planner

Privacy-first budgeting app. No accounts, no Plaid, no cloud — all data stays in your browser.

---

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

---

## Project Structure

```
finesse/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Root: state, routing between tabs
    │
    ├── styles/
    │   └── globals.css                 # CSS variables, base styles, utility classes
    │
    ├── data/
    │   └── defaults.js                 # DEFAULT_CATEGORIES, icon/color palettes, MONTHS
    │
    ├── utils/
    │   └── helpers.js                  # genId, fmtMoney, today, getCurrentMonth, daysLeft, seedDemo
    │
    ├── hooks/
    │   └── useStorage.js               # localStorage-backed useState
    │
    └── components/
        ├── Layout/
        │   ├── Header.jsx              # Sticky header with logo + tab nav
        │   └── Footer.jsx              # Privacy note + reset button
        │
        ├── UI/                         # Reusable primitives
        │   ├── StatCard.jsx            # KPI card (label / value / icon / sub)
        │   ├── Modal.jsx               # Backdrop + dialog, Esc to close
        │   ├── ChartTooltip.jsx        # Recharts custom tooltip
        │   ├── ProgressBar.jsx         # Animated bar, auto-colors near limit
        │   └── Alert.jsx               # Success / error inline message
        │
        ├── Dashboard/
        │   └── Dashboard.jsx           # Overview: KPIs, trend chart, pie, recent txs, goal summary
        │
        ├── Transactions/
        │   ├── Transactions.jsx        # Filterable table + CSV import
        │   └── TxForm.jsx              # Add / edit transaction form
        │
        ├── Budget/
        │   ├── Budget.jsx              # Category cards + bar chart
        │   └── CatForm.jsx             # Add / edit category form
        │
        └── Goals/
            ├── Goals.jsx               # Goal cards + deposit modal + summary stats
            └── GoalForm.jsx            # Add / edit goal form
```

---

## Features

| Feature              | Details                                              |
|----------------------|------------------------------------------------------|
| 📊 Dashboard         | 6-month trend, pie chart, KPI strip, recent txs      |
| 📋 Transactions      | Add/edit/delete, search, filter by type & category   |
| ⬆ CSV Import         | Parses `date, description, amount` columns           |
| 💰 Budget            | Per-category limits with live progress + bar chart   |
| 🎯 Goals             | Savings goals with deposit tracking & countdowns     |
| 💾 Persistence       | Everything auto-saved to `localStorage`             |
| 🔒 Privacy-first     | Zero external requests, no accounts needed           |

---

## Tech Stack

- **React 18** with hooks
- **Recharts** for data visualization
- **Vite** for dev & build
- **localStorage** for persistence (via `useStorage` hook)
- No UI library — all styles hand-crafted with CSS variables

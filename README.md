# WattWatch

**A web platform for managing prepaid electricity meters.** Admins monitor and control a fleet of meters and verify customer payments. Customers get a private dashboard to track their meter and buy electricity.

> **This is a frontend-only demo.** All data is mock data held in memory. No real meters, payments or tokens are involved, and state resets on refresh.

**Live demo:** https://wattwatch-pink.vercel.app

---

## Why it exists

WattWatch started as an idea for an app where people can see their meter data, pay for electricity and review their consumption history. It was then narrowed to a web app built around one meter: the **Calin CA368 three-phase STS prepaid meter**. The demo proves the screens and workflows before any hardware or backend work begins.

| Who | Problem |
|---|---|
| Customers | Hard to see balance and usage, no reliable purchase history, no warning when a meter is offline or running low. |
| Admins | No single view of the fleet, no remote actions, no clear process for verifying payments and issuing credit. |

---

## Features

### Admin
- **Fleet overview:** KPI cards, consumption chart (7, 30 and 90 day views), meter-health summary, recent transactions and activity.
- **Meter management:** search, status filters, details dialog, CSV export.
- **Meter commands:** diagnose, refresh, reset (with confirmation) and simulate outage.
- **Command log:** a filterable audit trail of every action, including credit disbursement.
- **Payment confirmation:** review pending payments, then confirm to disburse credit or reject.
- **Customer records:** accounts with linked meters and transaction history.
- **Notification bell:** unread counts, a notification panel, mark as read.

### Customer
- **Personal dashboard:** balance, 7-day usage, meter status, total purchased, and meter details.
- **Buy electricity:** choose an amount and payment method, see an order summary, and submit a simulated payment.
- **Transactions:** history with receipts and a copyable token once a payment is confirmed.
- **Alerts:** offline or warning meter, zero or low balance, pending, rejected and confirmed payments.

### Demo tools
- **Role switch** in the account menu (top right), with a "viewing as" picker to choose which customer to preview.
- **Take offline** on any meter to show how an outage affects the whole system.

---

## How a payment works

1. A customer submits a payment. It stays **Pending**, and no credit is added.
2. An admin reviews it in **Transactions**.
3. **Confirm:** the meter balance increases by the amount paid, units are calculated (amount ÷ demo rate), a token is issued, the payment becomes **Successful**, and a "Disburse credit" entry is logged.
4. **Reject:** the payment becomes **Rejected**, no credit is added, and the customer sees an alert.
5. If the meter is **offline**, the customer can't buy and the admin can't disburse until the meter is reset.

---

## Try the demo (2 minutes)

1. Open **Customer → Amara Okafor → Buy electricity**, pay ₦5,000. It's now pending.
2. Switch to **Admin → Transactions** and click **Confirm** on the pending payment.
3. Switch back to Amara. Her balance is up, and the transaction has a token.
4. As Admin, open **Meters** and click **Take offline** on her meter. Then check her **Alerts** and **Buy electricity** pages, and try to confirm another payment for that meter.
5. **Reset** the meter and everything unlocks. Look at the **Command log** to see each step.

---

## Tech stack

- [React](https://react.dev) and [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [lucide-react](https://lucide.dev) icons
- Deployed on [Vercel](https://vercel.com)

---

## Getting started

```bash
git clone https://github.com/whoisfbj/Wattwatch-Meter-Management-System-Demo.git
cd Wattwatch-Meter-Management-System-Demo
npm install
npm run dev
```

The app runs at http://localhost:5173.

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

---

## Project structure

```
src/
├── App.tsx                 # shared state and page switching
├── types/                  # Meter, Transaction, Role, Page types
├── data/                   # mock data and navigation config
├── lib/                    # formatting, stats, purchase, alerts, notifications
├── components/
│   ├── layout/             # Sidebar, Header, NotificationBell, CustomerSwitcher
│   ├── shared/             # StatusBadge, MetricCard, HealthRow, ActivityItem
│   ├── meters/             # MeterTable
│   ├── dialogs/            # reset, transaction, customer and payment-review dialogs
│   └── ui/                 # shadcn/ui components
└── pages/
    ├── OverviewPage.tsx    # admin pages
    ├── MetersPage.tsx
    ├── CustomersPage.tsx
    ├── TransactionsPage.tsx
    ├── CommandLogPage.tsx
    └── customer/           # customer pages
```

---

## Scope and limitations

**In scope (this demo):** the admin and customer dashboards, the payment confirmation workflow, alerts and notifications, and simulated meter commands.

**Not included yet:**
- Backend, database and real authentication
- Real payments or refunds
- Live meter communication and real readings
- Real STS tokens (demo tokens are random numbers)
- Selling electricity, customer self-registration of meters, and staff roles and permissions

---

## Roadmap

| Phase | Goal | Status |
|---|---|---|
| 1 | Frontend-only demo with mock data | Done |
| 2 | Backend API, database, real auth and roles, persistent notifications and audit logs | Planned |
| 3 | Calin CA368 integration: live readings kept separate from purchase history, real STS token handling | Planned |
| 4 | Real payment provider, refunds on rejected payments, receipts | Planned |
| 5 | Meter self-registration, staff permissions, possibly selling electricity | Planned |

**Open questions:** which distribution company (DisCo) to integrate with, which SDK or protocol the CA368 exposes, who produces real STS tokens in production, and what licensing or payment requirements apply.
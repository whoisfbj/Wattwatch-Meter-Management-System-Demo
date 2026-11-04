import type { Meter, Period, Transaction } from "@/types";

export const initialMeters: Meter[] = [
  {
    id: "MTR-001",
    customer: "Amara Okafor",
    location: "Lekki, Lagos",
    serial: "CA368-00821",
    consumption: 284.6,
    balance: 8450,
    status: "Online",
  },
  {
    id: "MTR-002",
    customer: "David Adeyemi",
    location: "Ikeja, Lagos",
    serial: "CA368-00822",
    consumption: 196.2,
    balance: 3200,
    status: "Online",
  },
  {
    id: "MTR-003",
    customer: "Fatima Bello",
    location: "Yaba, Lagos",
    serial: "CA368-00823",
    consumption: 0,
    balance: 0,
    status: "Offline",
  },
  {
  id: "MTR-004",
  customer: "Tunde Bakare",
  location: "Surulere, Lagos",
  serial: "CA368-00824",
  consumption: 341.8,
  balance: 12750,
  status: "Offline",   // was "Warning"
},
  {
    id: "MTR-005",
    customer: "Chioma Eze",
    location: "Ajah, Lagos",
    serial: "CA368-00825",
    consumption: 158.4,
    balance: 5620,
    status: "Online",
  },
];

export const consumptionByPeriod: Record<
  Period,
  { label: string; usage: number }[]
> = {
  "7 days": [
    { label: "Mon", usage: 420 },
    { label: "Tue", usage: 510 },
    { label: "Wed", usage: 465 },
    { label: "Thu", usage: 620 },
    { label: "Fri", usage: 550 },
    { label: "Sat", usage: 710 },
    { label: "Sun", usage: 645 },
  ],
  "30 days": [
    { label: "Wk 1", usage: 3120 },
    { label: "Wk 2", usage: 3480 },
    { label: "Wk 3", usage: 3350 },
    { label: "Wk 4", usage: 3920 },
  ],
  "90 days": [
    { label: "Aug", usage: 13200 },
    { label: "Sep", usage: 14150 },
    { label: "Oct", usage: 15040 },
  ],
};

export const transactions: Transaction[] = [
  {
    id: "TXN-8041",
    customer: "Amara Okafor",
    meter: "MTR-001",
    amount: 10000,
    date: "27 Oct, 10:42 AM",
    status: "Successful",
  },
  {
    id: "TXN-8040",
    customer: "David Adeyemi",
    meter: "MTR-002",
    amount: 5000,
    date: "27 Oct, 09:18 AM",
    status: "Successful",
  },
  {
    id: "TXN-8039",
    customer: "Tunde Bakare",
    meter: "MTR-004",
    amount: 2500,
    date: "26 Oct, 04:35 PM",
    status: "Pending",
  },
  {
    id: "TXN-8038",
    customer: "Chioma Eze",
    meter: "MTR-005",
    amount: 7500,
    date: "26 Oct, 02:12 PM",
    status: "Successful",
  },
];
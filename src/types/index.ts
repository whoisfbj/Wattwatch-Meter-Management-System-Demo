export type MeterStatus = "Online" | "Offline" | "Warning";
export type PaymentStatus = "Successful" | "Pending" | "Rejected";

export type Meter = {
  id: string;
  customer: string;
  location: string;
  serial: string;
  consumption: number;
  balance: number;
  status: MeterStatus;
  lastChecked?: string;
  lastReset?: string;
};

export type DemoCommand = {
  id: string;
  meterId: string;
  action: string;
  status: "Completed";
  time: string;
};

export type Transaction = {
  id: string;
  customer: string;
  meter: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  units?: number;
  token?: string;
  method?: string;
  confirmedAt?: string;
};

export type Page =
  | "Overview"
  | "Meters"
  | "Customers"
  | "Transactions"
  | "Command log";

  export type Period = "7 days" | "30 days" | "90 days";
 
  export type Role = "Admin" | "Customer";

export type CustomerPage =
  | "Dashboard"
  | "Buy electricity"
  | "Transactions"
  | "Alerts";
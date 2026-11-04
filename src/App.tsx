import { useEffect, useState } from "react";

import { CustomerSwitcher } from "@/components/layout/CustomerSwitcher";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ResetMeterDialog } from "@/components/dialogs/ResetMeterDialog";
import { Toast } from "@/components/Toast";
import {
  initialMeters,
  transactions as initialTransactions,
} from "@/data/mockData";
import {
  customerNavigation,
  customerPageTitles,
  navigation,
  pageTitles,
} from "@/data/navigation";
import { getCustomerAlerts } from "@/lib/alerts";
import { exportMetersCsv } from "@/lib/exportMeters";
import { money } from "@/lib/format";
import {
  calculateUnits,
  formatTransactionDate,
  generateToken,
  type PaymentMethod,
} from "@/lib/purchase";
import { CommandLogPage } from "@/pages/CommandLogPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { MetersPage } from "@/pages/MetersPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { CustomerAlertsPage } from "@/pages/customer/CustomerAlertsPage";
import { CustomerBuyPage } from "@/pages/customer/CustomerBuyPage";
import { CustomerDashboardPage } from "@/pages/customer/CustomerDashboardPage";
import { CustomerTransactionsPage } from "@/pages/customer/CustomerTransactionsPage";
import type {
  CustomerPage,
  DemoCommand,
  Meter,
  MeterStatus,
  Page,
  Role,
  Transaction,
} from "@/types";

function App() {
  const [role, setRole] = useState<Role>("Admin");
  const [activePage, setActivePage] = useState<Page>("Overview");
  const [customerPage, setCustomerPage] = useState<CustomerPage>("Dashboard");
  const [customerId, setCustomerId] = useState(initialMeters[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [meters, setMeters] = useState<Meter[]>(initialMeters);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [commandLogs, setCommandLogs] = useState<DemoCommand[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [meterToReset, setMeterToReset] = useState<Meter | null>(null);

  const isCustomer = role === "Customer";
  const customer = meters.find((meter) => meter.id === customerId) ?? meters[0];

  const customerAlerts = getCustomerAlerts(customer, transactions);
  const actionableAlertCount = customerAlerts.filter(
    (alert) => alert.severity !== "success",
  ).length;
  const adminAlertCount = meters.filter(
    (meter) => meter.status !== "Online",
  ).length;
  const pendingPaymentCount = transactions.filter(
    (transaction) => transaction.status === "Pending",
  ).length;

  const user = isCustomer
    ? {
        name: customer.customer,
        subtitle: "Customer",
        initials: customer.customer
          .split(" ")
          .map((name) => name[0])
          .join(""),
      }
    : { name: "Admin Demo", subtitle: "Administrator", initials: "AD" };

  useEffect(() => {
    if (!toastMessage) return;

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [role, activePage, customerPage]);

 const runDemoCommand = (meter: Meter, action: string) => {
  const now = new Date();

  const newCommand: DemoCommand = {
    id: `CMD-${Date.now()}`,
    meterId: meter.id,
    action,
    status: "Completed",
    time: now.toLocaleString(),
  };

  setCommandLogs((previousLogs) => [newCommand, ...previousLogs]);

  if (
    action === "Refresh meter" ||
    action === "Reset meter" ||
    action === "Simulate outage"
  ) {
    setMeters((previousMeters) =>
      previousMeters.map((item) =>
        item.id === meter.id
          ? {
              ...item,
              lastChecked: now.toLocaleString(),
              ...(action === "Reset meter" && {
                lastReset: now.toLocaleString(),
                status: "Online" as MeterStatus,
              }),
              ...(action === "Simulate outage" && {
                status: "Offline" as MeterStatus,
              }),
            }
          : item,
      ),
    );
  }

  const message =
    action === "Run diagnostics"
      ? `Simulated diagnostics completed for ${meter.id}. Status: ${meter.status}.`
      : action === "Reset meter"
        ? `Simulated reset completed for ${meter.id}.`
        : action === "Simulate outage"
          ? `Simulated outage: ${meter.id} is now offline.`
          : `Simulated refresh completed for ${meter.id}.`;

  setToastMessage(message);
};

  const confirmReset = () => {
    if (meterToReset) {
      runDemoCommand(meterToReset, "Reset meter");
      setMeterToReset(null);
    }
  };

  // Customer side: a purchase is only submitted. Credit is disbursed
  // when an admin confirms the payment.
  const handlePurchase = (
    meter: Meter,
    amount: number,
    method: PaymentMethod,
  ): Transaction => {
    const nextNumber =
      Math.max(
        ...transactions.map((item) => Number(item.id.replace("TXN-", ""))),
      ) + 1;

    const transaction: Transaction = {
      id: `TXN-${nextNumber}`,
      customer: meter.customer,
      meter: meter.id,
      amount,
      date: formatTransactionDate(new Date()),
      status: "Pending",
      method,
    };

    setTransactions((previous) => [transaction, ...previous]);

    return transaction;
  };

  // Admin side: confirm a pending payment and disburse the credit.
  const handleConfirmPayment = (transaction: Transaction) => {
    const current = transactions.find((item) => item.id === transaction.id);
    const meter = meters.find((item) => item.id === transaction.meter);

    if (!current || current.status !== "Pending" || !meter) return;

    const now = new Date();

    setTransactions((previous) =>
      previous.map((item) =>
        item.id === current.id
          ? {
              ...item,
              status: "Successful",
              units: calculateUnits(item.amount),
              token: generateToken(),
              confirmedAt: formatTransactionDate(now),
            }
          : item,
      ),
    );

    setMeters((previous) =>
      previous.map((item) =>
        item.id === meter.id
          ? { ...item, balance: item.balance + current.amount }
          : item,
      ),
    );

    setCommandLogs((previous) => [
      {
        id: `CMD-${Date.now()}`,
        meterId: meter.id,
        action: "Disburse credit",
        status: "Completed",
        time: now.toLocaleString(),
      },
      ...previous,
    ]);

    setToastMessage(
      `${money(current.amount)} credited to ${meter.id}. Token issued.`,
    );
  };

  const handleRejectPayment = (transaction: Transaction) => {
    const current = transactions.find((item) => item.id === transaction.id);

    if (!current || current.status !== "Pending") return;

    setTransactions((previous) =>
      previous.map((item) =>
        item.id === current.id ? { ...item, status: "Rejected" } : item,
      ),
    );

    setToastMessage(`Payment ${current.id} rejected. No credit was added.`);
  };

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {isCustomer ? (
        <Sidebar
          items={customerNavigation}
          activePage={customerPage}
          onNavigate={setCustomerPage}
          badges={
            actionableAlertCount > 0
              ? { Alerts: actionableAlertCount }
              : undefined
          }
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      ) : (
        <Sidebar
          items={navigation}
          activePage={activePage}
          onNavigate={setActivePage}
          badges={{
            Meters: meters.length,
            ...(pendingPaymentCount > 0 && {
              Transactions: pendingPaymentCount,
            }),
          }}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="lg:pl-62.5">
        <Header
          activePage={isCustomer ? customerPage : activePage}
          title={
            isCustomer
              ? customerPageTitles[customerPage]
              : pageTitles[activePage]
          }
          role={role}
          onRoleChange={handleRoleChange}
          user={user}
          notificationCount={
            isCustomer ? actionableAlertCount : adminAlertCount
          }
          onNotificationsClick={() =>
            isCustomer ? setCustomerPage("Alerts") : setActivePage("Meters")
          }
          onOpenMenu={() => setMobileMenuOpen(true)}
        />

        <main className="mx-auto max-w-400 space-y-7 p-4 md:p-8">
          {isCustomer && (
            <>
              <CustomerSwitcher
                meters={meters}
                customerId={customer.id}
                onChange={setCustomerId}
              />

              {customerPage === "Dashboard" && (
                <CustomerDashboardPage
                  customer={customer}
                  transactions={transactions}
                  onNavigate={setCustomerPage}
                />
              )}

              {customerPage === "Buy electricity" && (
                <CustomerBuyPage
                  customer={customer}
                  onPurchase={handlePurchase}
                />
              )}

              {customerPage === "Transactions" && (
                <CustomerTransactionsPage
                  customer={customer}
                  transactions={transactions}
                />
              )}

              {customerPage === "Alerts" && (
                <CustomerAlertsPage customer={customer} alerts={customerAlerts} />
              )}
            </>
          )}

          {!isCustomer && (
            <>
              {activePage === "Overview" && (
                <OverviewPage
                  meters={meters}
                  commandLogs={commandLogs}
                  transactions={transactions}
                  onNavigate={setActivePage}
                  onExport={() => exportMetersCsv(meters)}
                  onRunCommand={runDemoCommand}
                  onRequestReset={setMeterToReset}
                />
              )}

              {activePage === "Meters" && (
                <MetersPage
                  meters={meters}
                  onRunCommand={runDemoCommand}
                  onRequestReset={setMeterToReset}
                />
              )}

              {activePage === "Customers" && (
                <CustomersPage meters={meters} transactions={transactions} />
              )}

              {activePage === "Transactions" && (
                <TransactionsPage
                  transactions={transactions}
                  meters={meters}
                  onConfirmPayment={handleConfirmPayment}
                  onRejectPayment={handleRejectPayment}
                />
              )}

              {activePage === "Command log" && (
                <CommandLogPage meters={meters} commandLogs={commandLogs} />
              )}
            </>
          )}

          <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 WattWatch. Meter management demo.</p>
            <p>Demo environment · Sample data only</p>
          </footer>
        </main>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}

      <ResetMeterDialog
        meter={meterToReset}
        onCancel={() => setMeterToReset(null)}
        onConfirm={confirmReset}
      />
    </div>
  );
}

export default App;
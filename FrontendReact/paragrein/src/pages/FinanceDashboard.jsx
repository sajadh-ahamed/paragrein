import WorkerDashboardLayout from "../components/dashboard/WorkerDashboardLayout";

const financeMenu = [
  { label: "Finance Overview", icon: "fa-solid fa-chart-line" },
  { label: "Invoices", icon: "fa-solid fa-file-invoice-dollar" },
  { label: "Payments", icon: "fa-solid fa-money-bill-wave" },
  { label: "Expense Tracking", icon: "fa-solid fa-receipt" },
];

const financeCards = [
  {
    title: "Revenue (MTD)",
    value: "$142,800",
    icon: "fa-solid fa-dollar-sign",
    hint: "+9% vs previous month",
  },
  {
    title: "Open Invoices",
    value: "27",
    icon: "fa-solid fa-file-invoice",
    hint: "Awaiting settlement",
  },
  {
    title: "Due This Week",
    value: "$24,250",
    icon: "fa-solid fa-calendar-days",
    hint: "Outstanding receivables",
  },
  {
    title: "Expense Ratio",
    value: "38%",
    icon: "fa-solid fa-scale-balanced",
    hint: "Operational cost share",
  },
];

export default function FinanceDashboard() {
  return (
    <WorkerDashboardLayout
      roleLabel="Finance"
      greeting="Finance summary"
      subtitle="Track cash flow, invoices, and settlement progress."
      menuItems={financeMenu}
      cards={financeCards}
      checklist={[
        "Review overdue invoices and send reminders",
        "Reconcile daily payment gateway transactions",
        "Approve expense claims pending manager review",
      ]}
      updates={[
        {
          title: "Invoice INV-331 paid",
          detail: "Client settlement completed via bank transfer.",
        },
        {
          title: "Cost alert",
          detail: "Fuel expense category is 12% above target.",
        },
        {
          title: "Weekly report generated",
          detail: "P&L dashboard refreshed for leadership review.",
        },
      ]}
    />
  );
}

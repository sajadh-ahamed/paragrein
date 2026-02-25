import WorkerDashboardLayout from "../components/dashboard/WorkerDashboardLayout";

const operationsMenu = [
  { label: "Operations Overview", icon: "fa-solid fa-gauge-high" },
  { label: "Shipment Planning", icon: "fa-solid fa-diagram-project" },
  { label: "Resource Allocation", icon: "fa-solid fa-people-group" },
  { label: "Issue Escalations", icon: "fa-solid fa-bell" },
];

const operationsCards = [
  {
    title: "Active Orders",
    value: "213",
    icon: "fa-solid fa-clipboard-list",
    hint: "Across all active hubs",
  },
  {
    title: "SLA Compliance",
    value: "92%",
    icon: "fa-solid fa-stopwatch",
    hint: "On-time operational completion",
  },
  {
    title: "Open Incidents",
    value: "6",
    icon: "fa-solid fa-circle-exclamation",
    hint: "Needs follow-up today",
  },
  {
    title: "Team Utilization",
    value: "84%",
    icon: "fa-solid fa-users-gear",
    hint: "Current shift load",
  },
];

export default function OperationsDashboard() {
  return (
    <WorkerDashboardLayout
      roleLabel="Operations"
      greeting="Operations control"
      subtitle="Coordinate schedules, resources, and service-level targets."
      menuItems={operationsMenu}
      cards={operationsCards}
      checklist={[
        "Review delayed shipment escalations and assign owners",
        "Balance route load between available drivers",
        "Confirm warehouse handoff completion by 5 PM",
      ]}
      updates={[
        {
          title: "Peak-hour surge detected",
          detail: "Central hub demand up by 18% this afternoon.",
        },
        {
          title: "SLA risk alert",
          detail: "5 shipments approaching deadline threshold.",
        },
        {
          title: "Staff reassigned",
          detail: "Two coordinators moved to outbound control desk.",
        },
      ]}
    />
  );
}

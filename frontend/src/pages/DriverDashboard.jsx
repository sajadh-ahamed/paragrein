import WorkerDashboardLayout from "../components/dashboard/WorkerDashboardLayout";

const driverMenu = [
  { label: "Trip Overview", icon: "fa-solid fa-route" },
  { label: "Assigned Deliveries", icon: "fa-solid fa-box" },
  { label: "Vehicle Status", icon: "fa-solid fa-truck" },
  { label: "Incident Reports", icon: "fa-solid fa-triangle-exclamation" },
];

const driverCards = [
  {
    title: "Today's Trips",
    value: "4",
    icon: "fa-solid fa-route",
    hint: "1 completed · 3 remaining",
  },
  {
    title: "Pending Stops",
    value: "9",
    icon: "fa-solid fa-location-dot",
    hint: "Across 3 delivery zones",
  },
  {
    title: "Fuel Level",
    value: "68%",
    icon: "fa-solid fa-gas-pump",
    hint: "Sufficient for current route",
  },
  {
    title: "On-time Rate",
    value: "96%",
    icon: "fa-solid fa-clock",
    hint: "Last 30 days performance",
  },
];

export default function DriverDashboard() {
  return (
    <WorkerDashboardLayout
      roleLabel="Driver"
      greeting="Ready to drive"
      subtitle="Track your assigned deliveries and keep trips on schedule."
      menuItems={driverMenu}
      cards={driverCards}
      checklist={[
        "Start vehicle safety checklist before departure",
        "Confirm package handover signatures for all stops",
        "Update delivery status immediately after each drop",
      ]}
      updates={[
        {
          title: "Route D-104 optimized",
          detail: "Traffic alert avoided. ETA improved by 24 minutes.",
        },
        {
          title: "Vehicle TRK-22 service reminder",
          detail: "Scheduled maintenance is due in 2 days.",
        },
        {
          title: "New stop assigned",
          detail: "Pickup added at City Warehouse B.",
        },
      ]}
    />
  );
}

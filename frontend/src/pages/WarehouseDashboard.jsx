import WorkerDashboardLayout from "../components/dashboard/WorkerDashboardLayout";

const warehouseMenu = [
  { label: "Warehouse Overview", icon: "fa-solid fa-warehouse" },
  { label: "Incoming Stock", icon: "fa-solid fa-truck-ramp-box" },
  { label: "Dispatch Queue", icon: "fa-solid fa-dolly" },
  { label: "Stock Alerts", icon: "fa-solid fa-boxes-stacked" },
];

const warehouseCards = [
  {
    title: "Items Received",
    value: "1,280",
    icon: "fa-solid fa-box-open",
    hint: "Updated in last shift",
  },
  {
    title: "Pending Dispatch",
    value: "62",
    icon: "fa-solid fa-truck-loading",
    hint: "Orders waiting for loading",
  },
  {
    title: "Low Stock SKUs",
    value: "11",
    icon: "fa-solid fa-triangle-exclamation",
    hint: "Need replenishment",
  },
  {
    title: "Capacity Used",
    value: "74%",
    icon: "fa-solid fa-chart-pie",
    hint: "Bin utilization level",
  },
];

export default function WarehouseDashboard() {
  return (
    <WorkerDashboardLayout
      roleLabel="Warehouse"
      greeting="Warehouse control"
      subtitle="Monitor inventory movement and prepare outbound shipments."
      menuItems={warehouseMenu}
      cards={warehouseCards}
      checklist={[
        "Verify all inbound packages against purchase orders",
        "Prioritize dispatch queue by delivery SLA",
        "Flag damaged inventory with incident labels",
      ]}
      updates={[
        {
          title: "Inbound truck arrived",
          detail: "Dock 3 is processing 148 cartons.",
        },
        {
          title: "Stock threshold reached",
          detail: "SKU-PG-441 is below minimum quantity.",
        },
        {
          title: "Dispatch delayed",
          detail: "Order batch #B-94 pending pallet wrap check.",
        },
      ]}
    />
  );
}

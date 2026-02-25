import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/images/logo_circle.png";

const roleOptions = [
  { label: "DRIVER", value: "DRIVER" },
  { label: "WAREHOUSE", value: "WAREHOUSE" },
  { label: "FINANCE", value: "FINANCE" },
  { label: "OPERATIONS", value: "OPERATIONS" },
];

const initialWorkerForm = {
  fullName: "",
  nic: "",
  email: "",
  phone: "",
  address: "",
  role: roleOptions[0].value,
  status: "ACTIVE",
  password: "",
  confirmPassword: "",
};

function AddWorkerModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  formError,
  isSubmitting,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="relative w-full max-w-3xl glass-strong rounded-2xl border border-green-500/30 p-6 md:p-8 shadow-2xl transition-all duration-300">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg glass text-gray-300 hover:text-red-400 transition"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">Create Worker</h2>
        <p className="text-sm text-gray-400 mb-6">
          Add a new worker account and assign operational access.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                NIC
              </label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={onChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter NIC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="worker@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-green-400 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={onChange}
                rows="3"
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Enter worker address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={onChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {roleOptions.map((roleOption) => (
                  <option key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-green-500/40 bg-slate-900/30 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gray-600/70 text-white font-semibold hover:bg-gray-600 transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition shadow-md hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
            >
              {isSubmitting ? "Creating..." : "Create Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [workerForm, setWorkerForm] = useState(initialWorkerForm);
  const [isSubmittingWorker, setIsSubmittingWorker] = useState(false);
  const [workerFormError, setWorkerFormError] = useState("");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("name") || "User";
  const loginMessage = localStorage.getItem("loginMessage") || "";
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    if (!toast.show) {
      return;
    }

    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  const closeAddWorkerModal = () => {
    if (isSubmittingWorker) {
      return;
    }

    setIsAddWorkerOpen(false);
    setWorkerForm(initialWorkerForm);
    setWorkerFormError("");
  };

  const handleWorkerInputChange = (event) => {
    const { name, value } = event.target;
    setWorkerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateWorker = async (event) => {
    event.preventDefault();
    setWorkerFormError("");

    if (workerForm.password !== workerForm.confirmPassword) {
      setWorkerFormError("Password and confirm password do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setWorkerFormError("Authentication token not found. Please login again.");
      return;
    }

    setIsSubmittingWorker(true);

    try {
      await axios.post(
        "/api/admin/create-worker",
        {
          username: workerForm.fullName,
          nic: workerForm.nic,
          email: workerForm.email,
          phone: workerForm.phone,
          address: workerForm.address,
          role: workerForm.role,
          status: workerForm.status,
          password: workerForm.password,
          confirmPassword: workerForm.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToast({
        show: true,
        type: "success",
        message: "Worker created successfully.",
      });
      closeAddWorkerModal();
    } catch (error) {
      setWorkerFormError(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to create worker. Please try again."
      );
      setToast({
        show: true,
        type: "error",
        message: "Worker creation failed.",
      });
    } finally {
      setIsSubmittingWorker(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sidebar-glass w-64 h-screen fixed left-0 top-0 overflow-y-auto custom-scrollbar p-6 z-20">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Paragrein" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-green-500">Paragrein</h1>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            Dashboard
          </p>
          <div className="menu-item-active flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer hover:bg-green-500/10 transition">
            <i className="fa-solid fa-border-all w-5 text-center"></i>
            <span>Overview</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-map w-5 text-center"></i>
            <span>Live Shipment Map</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-gauge w-5 text-center"></i>
            <span>Fleet Status</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            Shipments
          </p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-truck w-5 text-center"></i>
            <span>All Shipments</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-route w-5 text-center"></i>
            <span>Track Shipment</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-plus w-5 text-center"></i>
            <span>Create Shipment</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-clock w-5 text-center"></i>
            <span>Delayed Shipments</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            Fleet Management
          </p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-list w-5 text-center"></i>
            <span>Vehicle List</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-screwdriver-wrench w-5 text-center"></i>
            <span>Maintenance Logs</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-id-card w-5 text-center"></i>
            <span>Driver Assignments</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            Warehouses
          </p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-warehouse w-5 text-center"></i>
            <span>Warehouse Locations</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-boxes-stacked w-5 text-center"></i>
            <span>Inventory Levels</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            Vendors & Clients
          </p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-address-book w-5 text-center"></i>
            <span>Vendor Directory</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-user-plus w-5 text-center"></i>
            <span>Add Vendor</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-users w-5 text-center"></i>
            <span>Clients List</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-comments w-5 text-center"></i>
            <span>Client Feedback</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            Orders
          </p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-list-check w-5 text-center"></i>
            <span>All Orders</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-calendar-alt w-5 text-center"></i>
            <span>Scheduled Deliveries</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-rotate-left w-5 text-center"></i>
            <span>Returns</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-xmark w-5 text-center"></i>
            <span>Cancellations</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            Reports
          </p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-chart-line w-5 text-center"></i>
            <span>Delivery Performance</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-coins w-5 text-center"></i>
            <span>Revenue Analysis</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-gas-pump w-5 text-center"></i>
            <span>Fleet Efficiency</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            System Tools
          </p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-gear w-5 text-center"></i>
            <span>Settings</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-user-shield w-5 text-center"></i>
            <span>Roles & Permissions</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-bell w-5 text-center"></i>
            <span>Notifications Setup</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4 py-2">
            Help & Logs
          </p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-circle-question w-5 text-center"></i>
            <span>Help Center</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-headset w-5 text-center"></i>
            <span>Contact</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-envelope w-5 text-center"></i>
            <span>Email</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-comments-dollar w-5 text-center"></i>
            <span>Chat</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-ticket w-5 text-center"></i>
            <span>Support Tickets</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-clipboard-list w-5 text-center"></i>
            <span>Audit Logs</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer text-gray-300 hover:bg-white/5 hover:text-green-500 transition">
            <i className="fa-solid fa-layer-group w-5 text-center"></i>
            <span>Widgets</span>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex-1 flex items-center gap-3 glass rounded-full px-5 py-3 max-w-xl">
            <i className="fa-solid fa-magnifying-glass text-green-500"></i>
            <input
              type="text"
              placeholder="Search shipments, clients, orders..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="glass-strong rounded-lg px-4 py-2 text-gray-300 hover:text-green-500 hover:border-green-500 transition">
              <i className="fa-regular fa-moon"></i>
            </button>
            <button className="glass-strong rounded-lg px-4 py-2 text-gray-300 hover:text-green-500 hover:border-green-500 transition relative">
              <i className="fa-regular fa-bell"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <button className="glass-strong rounded-lg px-4 py-2 text-gray-300 hover:text-green-500 hover:border-green-500 transition">
              <i className="fa-solid fa-globe"></i>
            </button>
            {isAdmin && (
              <button
                onClick={() => setIsAddWorkerOpen(true)}
                className="glass-strong rounded-xl px-5 py-2 text-white font-semibold border border-green-500/30 hover:border-green-400 transition shadow-md hover:scale-105 bg-gradient-to-r from-green-500/80 to-emerald-500/80"
              >
                + Add Worker
              </button>
            )}
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg transition shadow-md hover:scale-105">
              + Add Vehicle
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg transition shadow-md hover:scale-105">
              + New Shipment
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Hello {username}
        </h1>
        <p className="text-gray-400 mb-8">
          {loginMessage || "Welcome back! Here's what's happening with your logistics operations."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Active Shipments</span>
              <i className="fa-solid fa-truck text-green-500"></i>
            </div>
            <div className="text-3xl font-bold text-white mb-2">42</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Currently in transit</span>
              <span className="trend-badge trend-positive">
                <i className="fa-solid fa-arrow-up text-xs"></i> +12%
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Delivered Today</span>
              <i className="fa-solid fa-box text-green-500"></i>
            </div>
            <div className="text-3xl font-bold text-white mb-2">28</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Successful deliveries</span>
              <span className="trend-badge trend-positive">
                <i className="fa-solid fa-arrow-up text-xs"></i> +8%
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Pending Orders</span>
              <i className="fa-solid fa-clock text-red-500"></i>
            </div>
            <div className="text-3xl font-bold text-white mb-2">156</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Awaiting processing</span>
              <span className="trend-badge trend-negative">
                <i className="fa-solid fa-arrow-down text-xs"></i> -5%
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Revenue (MTD)</span>
              <i className="fa-solid fa-dollar-sign text-green-500"></i>
            </div>
            <div className="text-3xl font-bold text-white mb-2">$284,590</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Month to date</span>
              <span className="trend-badge trend-positive">
                <i className="fa-solid fa-arrow-up text-xs"></i> +15%
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Fleet Utilization</span>
              <i className="fa-solid fa-gauge-high text-green-500"></i>
            </div>
            <div className="text-3xl font-bold text-white mb-2">87%</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Vehicle efficiency</span>
              <span className="trend-badge trend-positive">
                <i className="fa-solid fa-arrow-up text-xs"></i> +3%
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Active Clients</span>
              <i className="fa-solid fa-user-group text-green-500"></i>
            </div>
            <div className="text-3xl font-bold text-white mb-2">1,247</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Total active clients</span>
              <span className="trend-badge trend-positive">
                <i className="fa-solid fa-arrow-up text-xs"></i> +23%
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Warehouse Capacity</span>
              <i className="fa-solid fa-warehouse text-orange-500"></i>
            </div>
            <div className="text-3xl font-bold text-white mb-2">73%</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Average utilization</span>
              <span className="trend-badge trend-negative">
                <i className="fa-solid fa-arrow-down text-xs"></i> -2%
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Delayed Shipments</span>
              <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
            </div>
            <div className="text-3xl font-bold text-white mb-2">7</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Requiring attention</span>
              <span className="trend-badge trend-negative">
                <i className="fa-solid fa-arrow-down text-xs"></i> -12%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Shipment Trends
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Monthly shipment and delivery performance over the past year
            </p>
            <div className="chart-gradient rounded-xl h-60 border border-green-500/30"></div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Fleet Status Overview
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              45 Total Vehicles · 87% Efficiency
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-green-500"></i>
                <span className="text-sm text-gray-400 flex-1">Active</span>
                <div className="flex-1 h-2 fleet-bar-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "71%" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-300">32 (71%)</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-wrench text-yellow-500"></i>
                <span className="text-sm text-gray-400 flex-1">
                  Maintenance
                </span>
                <div className="flex-1 h-2 fleet-bar-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: "18%" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-300">8 (18%)</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-truck-arrow-right text-blue-400"></i>
                <span className="text-sm text-gray-400 flex-1">
                  Available
                </span>
                <div className="flex-1 h-2 fleet-bar-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: "11%" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-300">5 (11%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="fa-solid fa-check text-green-500"></i> Recent
              Activity
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    New shipment created
                  </h4>
                  <p className="text-xs text-gray-400 mb-1">
                    2 minutes ago · John Doe
                  </p>
                  <p className="text-sm text-gray-300">
                    Shipment #SH-2024-001 from New York to Los Angeles.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <i className="fa-solid fa-box-check"></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    Delivery completed
                  </h4>
                  <p className="text-xs text-gray-400 mb-1">
                    15 minutes ago · Sarah Wilson
                  </p>
                  <p className="text-sm text-gray-300">
                    Package #PKG-789 delivered successfully to client.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    Vehicle maintenance due
                  </h4>
                  <p className="text-xs text-gray-400 mb-1">
                    1 hour ago · Mike Johnson
                  </p>
                  <p className="text-sm text-gray-300">
                    Truck TRK-042 requires scheduled maintenance.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  <i className="fa-solid fa-exclamation"></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Shipment delayed</h4>
                  <p className="text-xs text-gray-400 mb-1">
                    2 hours ago · Emily Chen
                  </p>
                  <p className="text-sm text-gray-300">
                    SH-2024-002 delayed due to weather conditions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <i className="fa-solid fa-route"></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Route optimized</h4>
                  <p className="text-xs text-gray-400 mb-1">
                    3 hours ago · David Brown
                  </p>
                  <p className="text-sm text-gray-300">
                    Delivery route updated for better efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-green-500"></i> Active
              Deliveries
            </h2>
            <div className="space-y-3">
              <div className="glass-strong rounded-xl p-4">
                <div className="font-semibold text-white mb-1">New York, NY</div>
                <p className="text-xs text-gray-400 mb-2">
                  12 active shipments · 2h 30m
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">
                  on time
                </span>
              </div>
              <div className="glass-strong rounded-xl p-4">
                <div className="font-semibold text-white mb-1">
                  Los Angeles, CA
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  8 active shipments · 4h 15m
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-semibold">
                  delayed
                </span>
              </div>
              <div className="glass-strong rounded-xl p-4">
                <div className="font-semibold text-white mb-1">Chicago, IL</div>
                <p className="text-xs text-gray-400 mb-2">
                  15 active shipments · 1h 45m
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">
                  on time
                </span>
              </div>
              <div className="glass-strong rounded-xl p-4">
                <div className="font-semibold text-white mb-1">Houston, TX</div>
                <p className="text-xs text-gray-400 mb-2">
                  6 active shipments · Delivered
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                  completed
                </span>
              </div>
              <div className="glass-strong rounded-xl p-4">
                <div className="font-semibold text-white mb-1">Phoenix, AZ</div>
                <p className="text-xs text-gray-400 mb-2">
                  9 active shipments · 3h 20m
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">
                  on time
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-strong rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-plus"></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">
                  Create Shipment
                </h4>
                <p className="text-xs text-gray-400">Add a new shipment</p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-location-arrow"></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Track Package</h4>
                <p className="text-xs text-gray-400">
                  Track existing shipments
                </p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-truck"></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Add Vehicle</h4>
                <p className="text-xs text-gray-400">Register a new vehicle</p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Add Vendor</h4>
                <p className="text-xs text-gray-400">Register a new vendor</p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-cubes"></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">
                  Inventory Check
                </h4>
                <p className="text-xs text-gray-400">Check warehouse inventory</p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-chart-column"></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Generate Report</h4>
                <p className="text-xs text-gray-400">
                  Create performance reports
                </p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-gray-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-gear"></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">System Settings</h4>
                <p className="text-xs text-gray-400">Configure preferences</p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-pink-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-file-lines"></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Documentation</h4>
                <p className="text-xs text-gray-400">Access help and guides</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Performance Highlights
            </h3>
            <p className="text-sm text-gray-400 mb-1">On-time Delivery Rate</p>
            <div className="text-3xl font-bold text-green-500 mb-4">94.2%</div>
            <p className="text-sm text-gray-300 mb-1">
              Customer Satisfaction · 4.8 / 5
            </p>
            <p className="text-sm text-gray-300 mb-1">
              Average Delivery Time · 2.3 days
            </p>
            <p className="text-sm text-gray-300">Cost per Mile · $1.85</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Top Routes</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-sm text-gray-300">
                <span>NY -&gt; LA</span>
                <span className="text-gray-400">24 shipments</span>
              </li>
              <li className="flex justify-between text-sm text-gray-300">
                <span>Chicago -&gt; Houston</span>
                <span className="text-gray-400">18 shipments</span>
              </li>
              <li className="flex justify-between text-sm text-gray-300">
                <span>Miami -&gt; Atlanta</span>
                <span className="text-gray-400">15 shipments</span>
              </li>
              <li className="flex justify-between text-sm text-gray-300">
                <span>Seattle -&gt; Portland</span>
                <span className="text-gray-400">12 shipments</span>
              </li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Alerts & Notifications
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-300">
                  <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>
                  Maintenance Due
                </span>
                <span className="text-gray-400">3 vehicles</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-300">
                  <i className="fa-solid fa-circle-xmark text-red-500"></i>
                  Delayed Shipments
                </span>
                <span className="text-gray-400">7 shipments</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-300">
                  <i className="fa-solid fa-box-open text-blue-400"></i>
                  Low Inventory
                </span>
                <span className="text-gray-400">2 warehouses</span>
              </li>
            </ul>
          </div>
        </div>

        <AddWorkerModal
          isOpen={isAddWorkerOpen}
          onClose={closeAddWorkerModal}
          onSubmit={handleCreateWorker}
          formData={workerForm}
          onChange={handleWorkerInputChange}
          formError={workerFormError}
          isSubmitting={isSubmittingWorker}
        />

        {toast.show && (
          <div
            className={`fixed top-6 right-6 z-[60] px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold ${
              toast.type === "success"
                ? "bg-green-500/20 border-green-500/40 text-green-300"
                : "bg-red-500/20 border-red-500/40 text-red-300"
            }`}
          >
            {toast.message}
          </div>
        )}
      </main>
    </div>
  );
}

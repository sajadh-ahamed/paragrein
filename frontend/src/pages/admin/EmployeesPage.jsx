import { useEffect, useState } from "react";
import {
  activateEmployee,
  createEmployee,
  deactivateEmployee,
  getEmployees,
  updateEmployee,
  // deleteEmployee, //delete employee
} from "../../api/adminEmployeeApi.js";
import DataTable from "../../components/DataTable.jsx";
import FormInput from "../../components/FormInput.jsx";
import Modal from "../../components/Modal.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import SecondaryButton from "../../components/SecondaryButton.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import {
  formatDateTime,
  formatStatus,
  statusVariant,
} from "../../utils/formatters.js";
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS,
} from "../../utils/passwordPolicy.js";

const rolesForFilter = [
  "FINANCE_OFFICER",
  "PICKUP_AGENT",
  "WAREHOUSE_STAFF",
  "DRIVER",
];
const rolesForCreate = [
  "FINANCE_OFFICER",
  "PICKUP_AGENT",
  "WAREHOUSE_STAFF",
  "DRIVER",
];
const accountStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];
const availabilityStatuses = ["AVAILABLE", "BUSY", "OFFLINE"];

const createInitial = {
  fullName: "",
  username: "",
  email: "",
  phoneNumber: "",
  employeeNumber: "",
  designation: "",
  joinedDate: new Date().toISOString().slice(0, 10),
  roleCode: "PICKUP_AGENT",
  password: "",
  confirmPassword: "",
};

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    query: "",
    roleCode: "",
    accountStatus: "",
    availabilityStatus: "",
  });
  const [createForm, setCreateForm] = useState(createInitial);
  const [editForm, setEditForm] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  // const [deleteEmployeeData, setDeleteEmployeeData] = useState(null); //delete employee
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees(nextFilters = filters) {
    try {
      setLoading(true);
      setError("");
      const data = await getEmployees(nextFilters);
      setEmployees(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(field, value) {
    const next = { ...filters, [field]: value };
    setFilters(next);
    loadEmployees(next);
  }

  function openEdit(employee) {
    setError("");
    setSuccess("");
    setEditForm({
      userId: employee.userId,
      fullName: employee.fullName,
      phoneNumber: employee.phoneNumber || "",
      designation: employee.designation || "",
      accountStatus: employee.accountStatus || "ACTIVE",
      availabilityStatus: employee.availabilityStatus || "AVAILABLE",
    });
    setModalMode("edit");
  }

  async function submitCreate(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !createForm.fullName.trim() ||
      !createForm.username.trim() ||
      !createForm.email.trim() ||
      !createForm.password
    ) {
      setError("Full name, username, email, and password are required.");
      return;
    }

    if (!/^0\d{9}$/.test(createForm.phoneNumber.trim())) {
      setError("Phone number must be 10 digits long and start with 0.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    const dateVal = createForm.joinedDate;
    if (!dateVal || isNaN(Date.parse(dateVal))) {
      setError("Please enter a valid joined date.");
      return;
    }
    const year = new Date(dateVal).getFullYear();
    if (year < 1900 || year > 2100) {
      setError(
        "Joined date must be a valid year clean format between 1900 and 2100.",
      );
      return;
    }

    if (!isStrongPassword(createForm.password)) {
      setError(PASSWORD_REQUIREMENTS);
      return;
    }

    setSubmitting(true);
    try {
      await createEmployee(createForm);
      setSuccess("Employee account created successfully.");
      setCreateForm(createInitial);
      setModalMode(null);
      await loadEmployees();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitEdit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await updateEmployee(editForm.userId, editForm);
      setSuccess("Employee account updated successfully.");
      setModalMode(null);
      await loadEmployees();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleEmployee(employee) {
    const action =
      employee.accountStatus === "ACTIVE"
        ? deactivateEmployee
        : activateEmployee;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await action(employee.userId);
      setSuccess(
        employee.accountStatus === "ACTIVE"
          ? "Employee deactivated."
          : "Employee activated.",
      );
      await loadEmployees();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  /*delete employee
 async function handleDelete() {
  if (!deleteEmployeeData) {
    return;
   }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await deleteEmployee(deleteEmployeeData.userId);

      setSuccess("Employee deleted successfully.");

      setDeleteEmployeeData(null);

      await loadEmployees();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }
    */

  const columns = [
    {
      key: "fullName",
      header: "Employee",
      render: (row) => (
        <span className="font-bold text-[#F8FAFC]">{row.fullName}</span>
      ),
    },
    { key: "username", header: "Username" },
    { key: "employeeNumber", header: "Employee No." },
    {
      key: "roleCode",
      header: "Role",
      render: (row) => formatStatus(row.roleCode),
    },
    {
      key: "accountStatus",
      header: "Account",
      render: (row) => (
        <StatusBadge variant={statusVariant(row.accountStatus)}>
          {formatStatus(row.accountStatus)}
        </StatusBadge>
      ),
    },
    {
      key: "availabilityStatus",
      header: "Availability",
      render: (row) => (
        <StatusBadge variant={statusVariant(row.availabilityStatus)}>
          {formatStatus(row.availabilityStatus)}
        </StatusBadge>
      ),
    },
    {
      key: "joinedDate",
      header: "Joined",
      render: (row) => formatDateTime(row.joinedDate).split(",")[0],
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <SecondaryButton
            onClick={() => openEdit(row)}
            className="px-3 py-1.5 text-xs"
          >
            Edit
          </SecondaryButton>

          <SecondaryButton
            onClick={() => toggleEmployee(row)}
            disabled={submitting}
            className="px-3 py-1.5 text-xs"
          >
            {row.accountStatus === "ACTIVE" ? "Deactivate" : "Activate"}
          </SecondaryButton>

          {/* delete emplyee  start part
           {row.accountStatus === "INACTIVE" && (
            <SecondaryButton
              onClick={() => setDeleteEmployeeData(row)}
              className="px-3 py-1.5 text-xs"
            >
              Delete
            </SecondaryButton>
          )} */}

        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin"
        title="Employee Management"
        description="Create and maintain employee accounts for admin, finance, pickup, warehouse, and driver roles."
        actions={
          <PrimaryButton
            onClick={() => {
              setModalMode("create");
              setError("");
              setSuccess("");
            }}
          >
            Create Employee
          </PrimaryButton>
        }
      />

      {error && (
        <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
          {success}
        </div>
      )}

      <section className="pg-panel mt-6 p-5">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <FormInput
            label="Search"
            value={filters.query}
            onChange={(event) => updateFilter("query", event.target.value)}
            placeholder="Name, username, email, employee no."
          />
          <Select
            label="Role"
            value={filters.roleCode}
            onChange={(value) => updateFilter("roleCode", value)}
            options={rolesForFilter}
            emptyLabel="All roles"
          />
          <Select
            label="Account"
            value={filters.accountStatus}
            onChange={(value) => updateFilter("accountStatus", value)}
            options={accountStatuses}
            emptyLabel="All accounts"
          />
          <Select
            label="Availability"
            value={filters.availabilityStatus}
            onChange={(value) => updateFilter("availabilityStatus", value)}
            options={availabilityStatuses}
            emptyLabel="All availability"
          />
        </div>
      </section>

      <section className="pg-panel mt-6 p-5">
        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
          emptyMessage="No employees found."
        />
      </section>

      <Modal
        open={modalMode === "create"}
        title="Create Employee Profile"
        description="Admin-created employee accounts are separate from public customer registration."
        onClose={() => {
          setModalMode(null);
          setError("");
        }}
      >
        <form onSubmit={submitCreate} className="grid gap-4 md:grid-cols-2">
          {error && (
            <div className="md:col-span-2 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
              {error}
            </div>
          )}
          <FormInput
            label="Full Name"
            value={createForm.fullName}
            onChange={(event) =>
              setCreateForm({ ...createForm, fullName: event.target.value })
            }
            required
          />
          <FormInput
            label="Username"
            value={createForm.username}
            onChange={(event) =>
              setCreateForm({ ...createForm, username: event.target.value })
            }
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={createForm.email}
            onChange={(event) =>
              setCreateForm({ ...createForm, email: event.target.value })
            }
            required
          />
          <FormInput
            label="Phone Number"
            value={createForm.phoneNumber}
            onChange={(event) =>
              setCreateForm({ ...createForm, phoneNumber: event.target.value })
            }
            required
          />
          <FormInput
            label="Employee Number"
            value="Generated Automatically"
            disabled
          />
          <FormInput
            label="Designation"
            value={createForm.designation}
            onChange={(event) =>
              setCreateForm({ ...createForm, designation: event.target.value })
            }
            required
          />
          <FormInput
            label="Date of Join"
            type="date"
            value={createForm.joinedDate}
            onChange={(event) =>
              setCreateForm({ ...createForm, joinedDate: event.target.value })
            }
            required
          />
          <Select
            label="Role"
            value={createForm.roleCode}
            onChange={(value) =>
              setCreateForm({ ...createForm, roleCode: value })
            }
            options={rolesForCreate}
          />
          <FormInput
            label="Password"
            type="password"
            autoComplete="new-password"
            value={createForm.password}
            onChange={(event) =>
              setCreateForm({ ...createForm, password: event.target.value })
            }
            required
          />
          <FormInput
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={createForm.confirmPassword}
            onChange={(event) =>
              setCreateForm({
                ...createForm,
                confirmPassword: event.target.value,
              })
            }
            required
          />
          <p className="text-xs leading-5 text-[#64748B] md:col-span-2">
            {PASSWORD_REQUIREMENTS}
          </p>
          <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end">
            <SecondaryButton onClick={() => setModalMode(null)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Create Employee"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal
        open={modalMode === "edit"}
        title="Edit Employee"
        description="Only safe employee profile and status fields are editable here."
        onClose={() => {
          setModalMode(null);
          setError("");
        }}
      >
        {editForm && (
          <form onSubmit={submitEdit} className="grid gap-4 md:grid-cols-2">
            {error && (
              <div className="md:col-span-2 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
                {error}
              </div>
            )}
            <FormInput
              label="Full Name"
              value={editForm.fullName}
              onChange={(event) =>
                setEditForm({ ...editForm, fullName: event.target.value })
              }
              required
            />
            <FormInput
              label="Phone Number"
              value={editForm.phoneNumber}
              onChange={(event) =>
                setEditForm({ ...editForm, phoneNumber: event.target.value })
              }
              required
            />
            <FormInput
              label="Designation"
              value={editForm.designation}
              onChange={(event) =>
                setEditForm({ ...editForm, designation: event.target.value })
              }
              required
            />
            <Select
              label="Account Status"
              value={editForm.accountStatus}
              onChange={(value) =>
                setEditForm({ ...editForm, accountStatus: value })
              }
              options={accountStatuses}
            />
            <Select
              label="Availability Status"
              value={editForm.availabilityStatus}
              onChange={(value) =>
                setEditForm({ ...editForm, availabilityStatus: value })
              }
              options={availabilityStatuses}
            />
            <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end">
              <SecondaryButton onClick={() => setModalMode(null)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </PrimaryButton>
            </div>
          </form>
        )}
      </Modal>

      {/* delete employee modal */}
      
      {/* <Modal
        open={deleteEmployeeData !== null}
        title="Delete Employee"
        description="Are you sure you want to permanently remove this employee? This action cannot be undone."
        onClose={() => setDeleteEmployeeData(null)}
      >
        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={() => setDeleteEmployeeData(null)}>
            No
          </SecondaryButton>

          <PrimaryButton onClick={handleDelete} disabled={submitting}>
            Yes, Delete
          </PrimaryButton>
        </div>
      </Modal> */}
    </DashboardLayout>
  );
}

function Select({ label, value, onChange, options, emptyLabel }) {
  return (
    <label className="block">
      <span className="pg-label">{label}</span>
      <select
        className="pg-field mt-2"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {emptyLabel && <option value="">{emptyLabel}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {formatStatus(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

export default EmployeesPage;

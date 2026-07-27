import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  cancelCustomerOrder,
  getCustomerOrderDetail,
} from "../../api/customerOrderApi.js";
import PageHeader from "../../components/PageHeader.jsx";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import SecondaryButton from "../../components/SecondaryButton.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import {
  formatDateTime,
  formatMoney,
  formatProductMessage,
  formatStatus,
  statusVariant,
} from "../../utils/formatters.js";

function InfoRow({ label, value }) {
  return (
    <div className="rounded-lg border border-[#263247] bg-[#111827] p-3">
      <p className="text-xs uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">
        {formatProductMessage(value) || "-"}
      </p>
    </div>
  );
}

function CustomerOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      setLoading(true);
      const data = await getCustomerOrderDetail(id);
      setOrder(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelOrder() {
    setError("");
    setMessage("");
    try {
      setCancelling(true);
      const data = await cancelCustomerOrder(id);
      setOrder(data);
      setMessage("Order cancelled.");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setCancelling(false);
    }
  }

  const canCancel = order?.orderStatus === "PENDING_ADVANCE_VERIFICATION";

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Customer"
        title={order ? order.trackingNumber : "Order Detail"}
        description="Full order details are visible only to the authenticated customer who owns this order."
        actions={
          <Link to="/customer/orders">
            <SecondaryButton>Back to My Orders</SecondaryButton>
          </Link>
        }
      />

      {message && (
        <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
          {error}
        </div>
      )}
      {loading && (
        <p className="mt-8 text-sm text-[#94A3B8]">Loading order detail...</p>
      )}

      {order && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="grid gap-6">
            <div className="pg-panel p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Current Status</h2>
                  <p className="mt-1 text-sm text-[#94A3B8]">
                    Last updated {formatDateTime(order.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge variant={statusVariant(order.orderStatus)}>
                    {formatStatus(order.orderStatus)}
                  </StatusBadge>
                  <StatusBadge variant={statusVariant(order.financialStatus)}>
                    {formatStatus(order.financialStatus)}
                  </StatusBadge>
                </div>
              </div>
              {canCancel && (
                <PrimaryButton
                  onClick={cancelOrder}
                  disabled={cancelling}
                  className="mt-5"
                >
                  {cancelling ? "Cancelling..." : "Cancel Pending Order"}
                </PrimaryButton>
              )}
            </div>

            <div className="pg-panel p-5">
              <h2 className="text-xl font-bold">Sender and Receiver</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoRow label="Sender" value={order.senderName} />
                <InfoRow label="Sender Phone" value={order.senderPhone} />
                <InfoRow label="Sender Address" value={order.senderAddress} />
                <InfoRow label="Receiver" value={order.receiverName} />
                <InfoRow label="Receiver Phone" value={order.receiverPhone} />
                <InfoRow
                  label="Receiver Address"
                  value={order.receiverAddress}
                />
              </div>
            </div>

            <div className="pg-panel p-5">
              <h2 className="text-xl font-bold">Parcel and Route</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoRow label="Pickup Address" value={order.pickupAddress} />
                <InfoRow
                  label="Drop-off Address"
                  value={order.dropoffAddress}
                />
                <InfoRow
                  label="Parcel Weight"
                  value={`${Number(order.parcelWeightKg).toFixed(2)} kg`}
                />
                <InfoRow
                  label="Route Distance"
                  value={`${Number(order.routeDistanceKm).toFixed(2)} km`}
                />
                <InfoRow
                  label="Parcel Description"
                  value={order.parcelDescription}
                />
                <InfoRow
                  label="Created At"
                  value={formatDateTime(order.createdAt)}
                />
              </div>
            </div>
          </section>

          <aside className="grid gap-6 self-start">
            <div className="pg-panel p-5">
              <h2 className="text-xl font-bold">Payment and Cost</h2>
              <div className="mt-4 grid gap-3">
                <InfoRow
                  label="Base Rate"
                  value={formatMoney(order.baseRate)}
                />
                <InfoRow
                  label="Per KM Rate"
                  value={formatMoney(order.perKmRate)}
                />
                <InfoRow
                  label="Total Amount"
                  value={formatMoney(order.totalAmount)}
                />
                <InfoRow
                  label="Advance Amount"
                  value={formatMoney(order.advanceAmount)}
                />
                <InfoRow
                  label="Balance Amount"
                  value={formatMoney(order.balanceAmount)}
                />
                <InfoRow
                  label="Payment Reference"
                  value={order.paymentReference}
                />
                <InfoRow
                  label="Receipt Path"
                  value={order.receiptPath || "No receipt uploaded"}
                />
              </div>
            </div>

            <div className="pg-panel p-5">
              <h2 className="text-xl font-bold">Status Timeline</h2>
              <div className="mt-5 grid gap-4">
                {order.timeline?.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-2 border-[#22C55E] pl-4"
                  >
                    <StatusBadge variant={statusVariant(item.newStatus)}>
                      {formatStatus(item.newStatus)}
                    </StatusBadge>
                    <p className="mt-2 text-sm text-[#CBD5E1]">{item.note}</p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {formatDateTime(item.createdAt)} by {item.changedBy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CustomerOrderDetailsPage;

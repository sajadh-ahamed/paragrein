import { useEffect, useState } from "react";
import {
  getActiveServiceSettings,
  updateActiveServiceSettings,
} from "../../api/serviceSettingsApi.js";
import FormInput from "../../components/FormInput.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import StatCard from "../../components/StatCard.jsx";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";

function PricingSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    baseRate: "",
    perKmRate: "",
    // perKgRate: "",
    advancePercentage: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      setLoading(true);
      const settingsData = await getActiveServiceSettings();
      setSettings(settingsData);
      setSettingsForm({
        baseRate: settingsData.baseRate,
        perKmRate: settingsData.perKmRate,
        //  perKgRate: settingsData.perKgRate,
        advancePercentage: settingsData.advancePercentage,
      });
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function updateSettingsField(event) {
    setSettingsForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function saveSettings(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      baseRate: Number(settingsForm.baseRate),
      perKmRate: Number(settingsForm.perKmRate),
      // perKgRate: Number(settingsForm.perKgRate),
      advancePercentage: Number(settingsForm.advancePercentage),
    };

    if (
      payload.baseRate < 0 ||
      payload.perKmRate < 0 ||
      payload.advancePercentage <= 0 ||
      // payload.perKgRate < 0
      payload.advancePercentage > 100
    ) {
      setError(
        "Base/per-km rates must be at least 0, and advance percentage must be 1 to 100.", //add per-kg rates
      );
      return;
    }

    try {
      const updated = await updateActiveServiceSettings(payload);
      setSettings(updated);
      setMessage("Pricing settings updated.");
    } catch (apiError) {
      setError(apiError.message);
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin"
        title="Pricing Settings"
        description="Manage the pricing values used to calculate delivery charges."
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

      {loading ? (
        <p className="mt-8 text-sm text-[#94A3B8]">
          Loading pricing settings...
        </p>
      ) : (
        <>
        {/*use sm:grid-cols-4 */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3"> 
            <StatCard
              label="Base Rate"
              value={`Rs. ${Number(settings?.baseRate || 0).toFixed(2)}`}
              hint={`Active setting ID: ${settings?.id}`}
            />
            <StatCard
              label="Per KM Rate"
              value={`Rs. ${Number(settings?.perKmRate || 0).toFixed(2)}`}
              hint="Applied to route distance"
              tone="blue"
            />
            {/* <StatCard
    label="Per KG Rate"
    value={`Rs. ${Number(settings?.perKgRate || 0).toFixed(2)}`}
    hint="Applied to parcel weight"
    tone="purple"
/> */}
            <StatCard
              label="Advance"
              value={`${Number(settings?.advancePercentage || 0).toFixed(2)}%`}
              hint="Customer advance requirement"
              tone="amber"
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <form onSubmit={saveSettings} className="pg-panel p-5">
              <h2 className="text-xl font-bold">Edit Active Settings</h2>
              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                Updates are audited by the backend and settings history records
                changed values.
              </p>

              <div className="mt-5 grid gap-4">
                <FormInput
                  label="Base Rate"
                  id="baseRate"
                  name="baseRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settingsForm.baseRate}
                  onChange={updateSettingsField}
                />
                <FormInput
                  label="Per KM Rate"
                  id="perKmRate"
                  name="perKmRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settingsForm.perKmRate}
                  onChange={updateSettingsField}
                />
                {/* <FormInput
                    label="Per KG Rate"
                    id="perKgRate"
                    name="perKgRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settingsForm.perKgRate}
                    onChange={updateSettingsField}
/> */}
                <FormInput
                  label="Advance Percentage"
                  id="advancePercentage"
                  name="advancePercentage"
                  type="number"
                  min="1"
                  max="100"
                  step="0.01"
                  value={settingsForm.advancePercentage}
                  onChange={updateSettingsField}
                />
              </div>

              <PrimaryButton type="submit" className="mt-6">
                Save Settings
              </PrimaryButton>
            </form>
          </section>
        </>
      )}
    </DashboardLayout>
  );
}

export default PricingSettingsPage;

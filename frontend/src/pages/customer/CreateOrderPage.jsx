//Create Order Page

//its doing mainly 3 things
//1. Collecting sender and receiver details
//2. Collecting parcel details and calculating cost preview
//3. Submitting the order with advance payment reference

//sends pickup, dropoff, weight to Spring Boot API → backend returns price.


//When page opens → form is empty → this object is used to reset the form to empty.
//All form fields start with empty values
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createCustomerOrder } from '../../api/customerOrderApi.js'; //sends final order to Spring Boot backend
import { calculateCostPreview } from '../../api/pricingApi.js'; //gets price calculation from backend
import FormInput from '../../components/FormInput.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx'; //used for calculate cost button
import DashboardLayout from '../../layouts/DashboardLayout.jsx'; //used to wrap the page with dashboard layout
import { formatMoney } from '../../utils/formatters.js'; //formats numbers into currency

const initialForm = {
  senderName: '',
  senderPhone: '',
  senderAddress: '',
  pickupAddress: '', // New field for exact pickup address
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  dropoffAddress: '', // New field for exact drop-off address
  routeDistanceKm: '', // New field for manual distance input
  parcelDescription: '',
  parcelWeightKg: '1.00',  //1.00 kg = default safe starting value
  paymentReference: '',
};

//React remembers data in a page
//Nothing is known yet so we use "empty states"
function CreateOrderPage() {
  const [formData, setFormData] = useState(initialForm); //tores all form inputs
  const [preview, setPreview] = useState(null); //Stores calculated delivery cost
  const [receiptFile, setReceiptFile] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [calculating, setCalculating] = useState(false);

  // Constants for file size validation
  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const [submitting, setSubmitting] = useState(false);

  // This is used to update form inputs in React
  //when user types it stores the value in React state (formData)
  //so that we can use it later when calculating cost or submitting order
  function updateField(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  }

  // Handler for receipt file input with size validation
  function handleReceiptFileChange(event) {
    const file = event.target.files?.[0] || null;
    setError(''); // Clear general errors when a new file is selected

    if (!file) {
      setReceiptFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`);
      // Clear the file input so the user can't submit the oversized file
      event.target.value = null;
      setReceiptFile(null);
      return;
    }

    // If the file is valid, clear any previous error messages and update the state
    setError(''); // Clear any previous file-specific errors
    setReceiptFile(file);
  }

  // It prepares clean data before sending to Spring Boot backend
  function buildPayload() {
    return {
      ...formData, //Takes all form values as they are example senderName, receiverName, address, etc.
      pickupAddress: formData.pickupAddress,
      dropoffAddress: formData.dropoffAddress,
      routeDistanceKm: Number(formData.routeDistanceKm), // New: Manual distance
      parcelWeightKg: Number(formData.parcelWeightKg), //Converted before sending to backend
    };
  }

  // This is a list of validation rules
  //if each form ipt field empty show error
  function validateForm(requirePayment = false) {
    const required = [
      ['senderName', 'Sender name is required.'],
      ['senderPhone', 'Sender phone is required.'],
      ['senderAddress', 'Sender address is required.'],
      ['receiverName', 'Receiver name is required.'],
      ['receiverPhone', 'Receiver phone is required.'],
      ['receiverAddress', 'Receiver address is required.'], // Existing
      ['pickupAddress', 'Pickup address is required.'], // New
      ['dropoffAddress', 'Drop-off address is required.'], // New
      ['routeDistanceKm', 'Route distance is required.'], // New
      ['parcelDescription', 'Parcel description is required.'],
    ];

    //It checks each required field one by one
    // If any field is empty → show error and stop
    for (const [field, validationMessage] of required) {
      if (!String(formData[field] || '').trim()) {
        setError(validationMessage); //Displays message in UI
        return false;
      }
    }

    // Validate sender phone number format
    if (!/^0\d{9}$/.test(formData.senderPhone.trim())) {
      setError('Sender phone number must be 10 digits long and start with 0.');
      return false;
    }
    // Validate receiver phone number format
    if (!/^0\d{9}$/.test(formData.receiverPhone.trim())) {
      setError('Receiver phone number must be 10 digits long and start with 0.');
      return false;
    }
    if (Number(formData.routeDistanceKm) <= 0) { // Route distance must be greater than 0
      setError('Route distance must be greater than 0.');
      return false;
    }
    if (Number(formData.parcelWeightKg) <= 0) { //Weight must be greater than 0
      setError('Parcel weight must be greater than 0.');
      return false;
    }
    //Only validate payment if condition = true
    //Price check No payment needed and Final booking payment slip required
    if (requirePayment && !formData.paymentReference.trim()) {
      setError('Payment reference is required.');
      return false;
    }
    return true;
  }

  async function calculatePreview(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!validateForm(false)) {
      return;
    }

    //This code has 2 main actions:

    // 1. calculatePreview → get price from backend
    // 2. submitOrder → create final order in backend
    // 3.Spring Boot calculates pric
    try {
      setCalculating(true);
      const data = await calculateCostPreview({
        routeDistanceKm: Number(formData.routeDistanceKm), // Use manual distance
        parcelWeightKg: Number(formData.parcelWeightKg),
      });
      setPreview(data);
      setMessage('Cost preview calculated. Submit advance payment reference to create the order.');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setCalculating(false);
    }
  }

  //It sends final data to Spring Boot backend
  async function submitOrder(event) {
    event.preventDefault(); //Stop page reload
    setError(''); //clear old messages
    setMessage(''); //clear old messages
    if (!preview) {     //You MUST calculate cost first before submitting order
      setError('Calculate cost before submitting the order.');
      return;
    }
    if (!validateForm(true)) { //“Check all required fields + payment details
      return;
    }
    //validateForm(true) means we are checking all required fields + payment details
    // + paymentReference is REQUIRED


    //This is the SUCCESS FLOW (when everything works correctly)
    //1. calculatePreview → get price from backend
    //2. submitOrder → create final order in backend
    try {
      setSubmitting(true); //Start loading indicator
      const data = await createCustomerOrder(buildPayload(), receiptFile);//Send data to backend
      setCreatedOrder(data);   //Store created order
      setMessage(`Order created successfully. Tracking number: ${data.trackingNumber}`);
      setFormData(initialForm);  //Reset form to empty
      setPreview(null); //Clear preview
      setReceiptFile(null);//Clear receipt file
    } catch (apiError) { //If backend returns error, show it to user
      setError(apiError.message);//Show error message from backend
    } finally { //Finally, stop loading indicator
      setSubmitting(false); // Stop loading indicator
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Customer"
        title="Create Parcel Order"
        description="Enter delivery details, calculate cost from local service-area distances, and submit your advance payment reference."
      />

      {/*       /“Show message box ONLY if message exists Show error box ONLY if error exists” */}
      {message && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{message}</div>}
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      {/*This shows ONLY AFTER order is successfully created*/}
      {/*This section uses conditional rendering to display order confirmation only after successful API response. */}
      {createdOrder && (
        <div className="pg-panel mt-6 p-5">
          <h2 className="text-xl font-bold">Order Submitted</h2>
          <p className="mt-2 text-sm text-[#94A3B8]">Finance will review the submitted advance payment. Keep this tracking number for public tracking.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-2xl font-black text-[#22C55E]">{createdOrder.trackingNumber}</span> {/*Shows tracking number from backend*/}
            <Link to={`/customer/orders/${createdOrder.id}`}><PrimaryButton>View Details</PrimaryButton></Link>
          </div>
        </div>
      )}

      {/*This is the main form for user input. It collects sender and receiver details, parcel information, and handles cost calculation and order submission. */}
      {/* this is the user form typing place */}
      {/*sender details*/}
      <form onSubmit={submitOrder} className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="grid gap-6">
          <div className="pg-panel p-5">
            <h2 className="text-xl font-bold">Sender Details</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormInput label="Sender Name" name="senderName" value={formData.senderName} onChange={updateField} />
              <FormInput label="Sender Phone" name="senderPhone" value={formData.senderPhone} onChange={updateField} />
              <label className="block md:col-span-2">
                <span className="pg-label">Sender Address</span>
                <textarea name="senderAddress" value={formData.senderAddress} onChange={updateField} className="pg-field mt-2 min-h-24" />
              </label>
            </div>
          </div>

          {/*receiver details*/}
          <div className="pg-panel p-5">
            <h2 className="text-xl font-bold">Receiver Details</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormInput label="Receiver Name" name="receiverName" value={formData.receiverName} onChange={updateField} />
              <FormInput label="Receiver Phone" name="receiverPhone" value={formData.receiverPhone} onChange={updateField} />
              <label className="block md:col-span-2">
                <span className="pg-label">Receiver Address</span>
                <textarea name="receiverAddress" value={formData.receiverAddress} onChange={updateField} className="pg-field mt-2 min-h-24" />
              </label>
            </div>
          </div>

          {/*parcel and route details*/}
          <div className="pg-panel p-5">
            <h2 className="text-xl font-bold">Parcel and Route</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="pg-label">Pickup Address</span>
                <textarea name="pickupAddress" value={formData.pickupAddress} onChange={updateField} className="pg-field mt-2 min-h-24" />
              </label>
              <label className="block md:col-span-2">
                <span className="pg-label">Drop-off Address</span>
                <textarea name="dropoffAddress" value={formData.dropoffAddress} onChange={updateField} className="pg-field mt-2 min-h-24" />
              </label>
              <FormInput label="Route Distance (km)" name="routeDistanceKm" type="number" min="0.1" step="0.1" value={formData.routeDistanceKm} onChange={updateField} />
              <FormInput
                label="Parcel Weight (kg)"
                name="parcelWeightKg"
                type="number" min="0.01" step="0.01" value={formData.parcelWeightKg} onChange={updateField}
              />
              <label className="block md:col-span-2"> {/* This was already md:col-span-2, keeping it */}
                <span className="pg-label">Parcel Description</span>
                <textarea name="parcelDescription" value={formData.parcelDescription} onChange={updateField} className="pg-field mt-2 min-h-24" />
              </label>
            </div>
          </div>
        </section>

        {/*right side panel*/}
        {/*cost preview When clicked  calls Spring Boot API*/}
        {/*This section shows dynamic pricing calculated from backend before order submission */}
        <aside className="grid gap-6 self-start">
          <div className="pg-panel p-5">
            <h2 className="text-xl font-bold">Cost Preview</h2>
            <p className="mt-2 text-sm text-[#94A3B8]">Preview uses the existing backend pricing API. The server recalculates before saving.</p>
            <SecondaryButton onClick={calculatePreview} disabled={calculating} className="mt-5 w-full">
              {calculating ? 'Calculating...' : 'Calculate Cost'}
            </SecondaryButton>

            {/*preview*/}
            {preview && (
              <div className="mt-5 grid gap-3 rounded-lg border border-[#263247] bg-[#111827] p-4">
                <div className="flex justify-between gap-3"><span className="text-[#94A3B8]">Route Distance</span><strong>{Number(preview.routeDistanceKm).toFixed(2)} km</strong></div>
                <div className="flex justify-between gap-3"><span className="text-[#94A3B8]">Base Rate</span><strong>{formatMoney(preview.baseRate)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-[#94A3B8]">Per KM Rate</span><strong>{formatMoney(preview.perKmRate)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-[#94A3B8]">Total Amount</span><strong className="text-[#86EFAC]">{formatMoney(preview.totalAmount)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-[#94A3B8]">Advance Amount</span><strong className="text-[#FCD34D]">{formatMoney(preview.advanceAmount)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-[#94A3B8]">Balance Amount</span><strong>{formatMoney(preview.balanceAmount)}</strong></div>
              </div>
            )}
          </div>

          <div className="pg-panel p-5">
            <h2 className="text-xl font-bold">Bank Account Details</h2>
            <p className="mt-2 text-sm text-[#94A3B8]">Use these details to make your advance payment.</p>
            <div className="mt-4 grid gap-2 rounded-lg border border-[#263247] bg-[#111827] p-4 text-sm">
              <div className="flex justify-between"><span className="text-[#94A3B8]">Bank Name:</span><strong>Bank of Ceylon (BOC)</strong></div>
              <div className="flex justify-between"><span className="text-[#94A3B8]">Account Name:</span><strong>Paragrein Logistics (Pvt) Ltd</strong></div>
              <div className="flex justify-between"><span className="text-[#94A3B8]">Account Number:</span><strong>1234567890</strong></div>
              <div className="flex justify-between"><span className="text-[#94A3B8]">Branch:</span><strong>Kegalle Branch</strong></div>
            </div>
          </div>

          <div className="pg-panel p-5">
            <h2 className="text-xl font-bold">Advance Payment</h2>
            <p className="mt-2 text-sm text-[#94A3B8]">Submit bank slip/reference details for finance verification.</p>
            <div className="mt-4 grid gap-4">
              <FormInput label="Payment Reference" name="paymentReference" value={formData.paymentReference} onChange={updateField} />
              <label className="block"> {/* This label now includes the file input and potential error message */}
                <span className="pg-label">Receipt Upload (optional)</span>
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleReceiptFileChange} className="pg-field mt-2 file:mr-3 file:rounded-md file:border-0 file:bg-[#22C55E] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#07110B]" />
                <span className="mt-1 block text-xs text-[#64748B]">Allowed: jpg, jpeg, png, pdf. Max 5 MB.</span>
              </label>
              <PrimaryButton type="submit" disabled={submitting || !preview} className="w-full">
                {submitting ? 'Submitting...' : 'Submit Order'}
              </PrimaryButton>
            </div>
          </div>
        </aside>
      </form>
    </DashboardLayout>
  );
}

export default CreateOrderPage;

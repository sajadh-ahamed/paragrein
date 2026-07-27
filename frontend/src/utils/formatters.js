/*why formatters needed ?
Backend → messy data
Frontend → clean display (₹, dates, colors, readable text)
*/

// Converts number → money format
// Adds currency + 2 decimal places
export function formatMoney(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`; //If value is null  prevent crash
}

export function formatDateTime(value) {
  if (!value) {
    return '-';
  }
  return new Date(value).toLocaleString(); // Converts backend date → readable format
}

//Makes backend status readable
// Example:
// IN_PROGRESS → IN PROGRESS
export function formatStatus(value) {
  return value ? value.replaceAll('_', ' ') : '-'; 
}

export function formatProductMessage(value) {
  if (!value) {
    return '';
  }
//   Removes technical system text like:
// Stage 1 Processing → Processing
  // UI note: legacy local records may retain development-era numbering; final screens show product wording only.
  return String(value).replace(/\bStage\s*\d+[A-Za-z]?\s*/gi, '').replace(/\s{2,}/g, ' ').trim();
}

//It is a function that decides COLOR type based on status
export function statusVariant(value) {
  if (!value) {
    return 'neutral';
  }
  if (['ACTIVE', 'AVAILABLE', 'DELIVERED', 'FULLY_SETTLED', 'ADVANCE_VERIFIED', 'VERIFIED', 'ACCEPTED', 'COMPLETED', 'ARRIVED_AT_WAREHOUSE', 'READY_FOR_DISPATCH', 'READ', 'RESOLVED', 'CLOSED'].includes(value)) {
    return 'active';
  }
  if (['INACTIVE', 'SUSPENDED', 'OFFLINE', 'REJECTED', 'CANCELLED', 'ADVANCE_REJECTED'].includes(value)) {
    return 'error';
  }
  if (['ASSIGNED_TO_PICKUP', 'PICKUP_ACCEPTED', 'IN_TRANSIT_TO_WAREHOUSE', 'WAREHOUSE_PROCESSING', 'ASSIGNED_TO_DELIVERY', 'DELIVERY_ACCEPTED', 'REACHED_DESTINATION', 'BUSY', 'PENDING_ADVANCE_VERIFICATION', 'ADVANCE_SUBMITTED', 'BALANCE_DUE', 'SUBMITTED', 'ASSIGNED', 'UNREAD', 'OPEN', 'IN_PROGRESS', 'MEDIUM', 'HIGH'].includes(value)) {
    return 'warning';
  }
  return 'neutral';
}


//.active { color: green; }
// .error { color: red; }
// .warning { color: orange; }
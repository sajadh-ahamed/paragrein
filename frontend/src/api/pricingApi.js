//Send parcel details to Spring Boot and get calculated price back

import { apiRequest } from './apiClient.js';

export function calculateCostPreview(payload) { //calls Spring Boot endpoint:
  return apiRequest('/pricing/preview', { 
    method: 'POST',
    body: JSON.stringify(payload),//Convert JS object → JSON format
  });
}


/*Example for json payload to send to Spring Boot endpoint:

{
  pickupAreaId: 1,
  dropoffAreaId: 5,
  parcelWeightKg: 2
}

Becomes:

{
  "pickupAreaId": 1,
  "dropoffAreaId": 5,
  "parcelWeightKg": 2
}
  */

/*

pring Boot calculates:

distance
base price
weight charge
total cost

Then returns:

{
  "routeDistanceKm": 12,
  "baseRate": 200,
  "perKmRate": 50,
  "totalAmount": 800,
  "advanceAmount": 200,
  "balanceAmount": 600
}

*/
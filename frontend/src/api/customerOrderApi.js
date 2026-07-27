import { apiRequest } from './apiClient.js';

// It contains functions that talk to backend (Spring Boot)
export function createCustomerOrder(payload, receiptFile) { //Sends new order to backend
  if (receiptFile) {
    const formData = new FormData(); //Because file upload needs special format and FormData is used when sending both JSON data and files together to the backend.
    formData.append('order', JSON.stringify(payload)); //Append the order data as JSON string
    formData.append('receipt', receiptFile); //Append the receipt file to the form data
    return apiRequest('/customer/orders', {   //Send the form data
      method: 'POST',
      body: formData,
    });
  }

  //Send order data to Spring Boot backend as JSON
  return apiRequest('/customer/orders', {  //If no receipt file, send JSON payload
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

//Spring Boot Controller:
// @PostMapping("/customer/orders")
// public ResponseEntity<?> createOrder(@RequestBody CustomerOrderRequest request, @RequestParam("receipt") MultipartFile receipt) 

export function getCustomerOrders() { //Fetches all orders for the customer
  return apiRequest('/customer/orders');
}

export function getCustomerOrderDetail(id) { //Fetches details of a specific order by ID
  return apiRequest(`/customer/orders/${id}`);
}

export function getCustomerOrderTimeline(id) {   //Fetches the timeline of a specific order by ID
  return apiRequest(`/customer/orders/${id}/timeline`);
}

export function cancelCustomerOrder(id) { //Cancels a specific order by ID
  return apiRequest(`/customer/orders/${id}/cancel`, {
    method: 'PATCH',
  });
}


//FormData is only required when uploading files. Since this request has no file, JSON is simpler and more efficient.
package com.paragrein.logistics.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paragrein.logistics.dto.CreateOrderRequest;
import com.paragrein.logistics.dto.OrderDetailResponse;
import com.paragrein.logistics.dto.OrderResponse;
import com.paragrein.logistics.dto.OrderSummaryResponse;
import com.paragrein.logistics.dto.OrderTimelineResponse;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.service.CustomerOrderService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/customer/orders")
// This class handles ALL customer order related HTTP requests
// Example: create order, view orders, cancel order, etc.
public class CustomerOrderController {

    private final CustomerOrderService customerOrderService;
    private final ObjectMapper objectMapper;

    // Constructor injection (Spring automatically gives these objects)
    public CustomerOrderController(CustomerOrderService customerOrderService, ObjectMapper objectMapper) {
        this.customerOrderService = customerOrderService;
        this.objectMapper = objectMapper;
    }


    // 1. CREATE ORDER (JSON REQUEST)

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public OrderResponse createOrder(
            @RequestBody CreateOrderRequest request,
            Authentication authentication
    ) {
        // Used when frontend sends simple JSON (no file upload)

        // authentication → gives logged-in user details

        return customerOrderService.createOrderForCustomer(request, null, authentication);
        // Sends request to Service layer (business logic)
    }


    // ==========================================
    // 2. CREATE ORDER WITH RECEIPT (FILE UPLOAD)
    // ==========================================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public OrderResponse createOrderWithReceipt(
            @RequestPart("order") String orderJson,
            @RequestPart(value = "receipt", required = false) MultipartFile receipt,
            Authentication authentication
    ) {
        // Used when user uploads:
        // 1. Order details (as JSON string)
        // 2. Payment receipt file (image/pdf)

        try {
            // Convert JSON string → Java object
            CreateOrderRequest request = objectMapper.readValue(orderJson, CreateOrderRequest.class);

            return customerOrderService.createOrderForCustomer(request, receipt, authentication);

        } catch (JsonProcessingException exception) {
            // If JSON is invalid → return error to frontend
            throw new AppException("Order form data is invalid.", HttpStatus.BAD_REQUEST);
        }
    }


    // ==============================
    // 3. GET ALL ORDERS OF USER
    // ==============================
    @GetMapping
    public List<OrderSummaryResponse> getMyOrders(Authentication authentication) {
        // Returns all orders of logged-in customer (summary view)
        return customerOrderService.getMyOrders(authentication);
    }


    // ==============================
    // 4. GET SINGLE ORDER DETAILS
    // ==============================
    @GetMapping("/{id}")
    public OrderDetailResponse getMyOrderDetail(
            @PathVariable Long id,
            Authentication authentication
    ) {
        // Returns full details of one order (by ID)
        return customerOrderService.getMyOrderDetail(id, authentication);
    }


    // ==============================
    // 5. GET ORDER TIMELINE
    // ==============================
    @GetMapping("/{id}/timeline")
    public List<OrderTimelineResponse> getMyOrderTimeline(
            @PathVariable Long id,
            Authentication authentication
    ) {
        // Shows step-by-step tracking history (pickup → delivery → etc.)
        return customerOrderService.getMyOrderTimeline(id, authentication);
    }


    // ==============================
    // 6. CANCEL ORDER
    // ==============================
    @PatchMapping("/{id}/cancel")
    public OrderDetailResponse cancelMyPendingOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {
        // Allows customer to cancel order (only if still pending)
        return customerOrderService.cancelMyPendingOrder(id, authentication);
    }
}
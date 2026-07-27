package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.CostPreviewRequest;
import com.paragrein.logistics.dto.CostPreviewResponse;
import com.paragrein.logistics.dto.CreateOrderRequest;
import com.paragrein.logistics.dto.OrderDetailResponse;
import com.paragrein.logistics.dto.OrderResponse;
import com.paragrein.logistics.dto.OrderSummaryResponse;
import com.paragrein.logistics.dto.OrderTimelineResponse;
import com.paragrein.logistics.dto.PublicTrackingResponse;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.OrderStatusHistory;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.NotificationType;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.PaymentStatus;
import com.paragrein.logistics.enums.PaymentType;
import com.paragrein.logistics.enums.ReadStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.NotificationRepository;
import com.paragrein.logistics.repository.OrderRepository;
import com.paragrein.logistics.repository.OrderStatusHistoryRepository;
import com.paragrein.logistics.repository.PaymentRepository;
import com.paragrein.logistics.repository.UserRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Year;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CustomerOrderService {

    private static final long MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_RECEIPT_EXTENSIONS = Set.of("jpg", "jpeg", "png", "pdf");

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PricingService pricingService;

    public CustomerOrderService(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            AuditLogRepository auditLogRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            PricingService pricingService) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.pricingService = pricingService;
    }

    @Transactional
    public OrderResponse createOrderForCustomer(CreateOrderRequest request, MultipartFile receiptFile,
            Authentication authentication) {
        User customer = SecurityUserUtil.requireCurrentUser(authentication);
        validateCreateRequest(request);


        CostPreviewRequest previewRequest = new CostPreviewRequest();
        previewRequest.setRouteDistanceKm(request.getRouteDistanceKm());
        previewRequest.setParcelWeightKg(request.getParcelWeightKg());
        // Business rule: order totals are recalculated on the server and are never
        // trusted from the browser.
        CostPreviewResponse cost = pricingService.calculatePreview(previewRequest);

        String receiptPath = storeReceiptIfPresent(receiptFile);
        if (receiptPath == null && !isBlank(request.getReceiptPath())) {
            receiptPath = clean(request.getReceiptPath());
        }

        Order order = new Order();
        order.setTrackingNumber(generateTrackingNumber());
        order.setCustomer(customer);
        order.setSenderName(clean(request.getSenderName()));
        order.setSenderPhone(clean(request.getSenderPhone()));
        order.setSenderAddress(clean(request.getSenderAddress()));
        order.setPickupAddress(clean(request.getPickupAddress()));
        order.setReceiverName(clean(request.getReceiverName()));
        order.setReceiverPhone(clean(request.getReceiverPhone()));
        order.setReceiverAddress(clean(request.getReceiverAddress()));
        order.setDropoffAddress(clean(request.getDropoffAddress()));
        order.setParcelDescription(clean(request.getParcelDescription()));
        order.setParcelWeightKg(moneyScale(request.getParcelWeightKg()));
        order.setRouteDistanceKm(cost.getRouteDistanceKm());
        order.setBaseRate(cost.getBaseRate());
        order.setPerKmRate(cost.getPerKmRate());
        order.setTotalAmount(cost.getTotalAmount());
        order.setAdvanceAmount(cost.getAdvanceAmount());
        order.setBalanceAmount(cost.getBalanceAmount());
        order.setOrderStatus(OrderStatus.PENDING_ADVANCE_VERIFICATION);
        order.setFinancialStatus(FinancialStatus.ADVANCE_SUBMITTED);
        Order savedOrder = orderRepository.save(order);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setPaymentType(PaymentType.ADVANCE);
        payment.setAmount(savedOrder.getAdvanceAmount());
        payment.setPaymentReference(clean(request.getPaymentReference()));
        payment.setReceiptPath(receiptPath);
        payment.setPaymentStatus(PaymentStatus.SUBMITTED);
        Payment savedPayment = paymentRepository.save(payment);

        saveStatusHistory(savedOrder, null, OrderStatus.PENDING_ADVANCE_VERIFICATION, customer,
                "Order created and advance payment submitted.");
        saveAudit(customer, "CUSTOMER_ORDER_CREATED", "Order", savedOrder.getId(),
                "Customer created order " + savedOrder.getTrackingNumber());
        saveAudit(customer, "ADVANCE_PAYMENT_SUBMITTED", "Payment", savedPayment.getId(),
                "Advance payment submitted for order " + savedOrder.getTrackingNumber());
        createNotification(customer, "Order submitted",
                "Order " + savedOrder.getTrackingNumber() + " is pending advance verification.",
                NotificationType.ORDER_STATUS);
        notifyFinanceUsers(savedOrder.getTrackingNumber());

        return buildOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> getMyOrders(Authentication authentication) {
        User customer = SecurityUserUtil.requireCurrentUser(authentication);
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId()).stream()
                .map(OrderSummaryResponse::new)
                .toList();
    }

    @Transactional
    public OrderDetailResponse getMyOrderDetail(Long id, Authentication authentication) {
        User customer = SecurityUserUtil.requireCurrentUser(authentication);
        Order order = findCustomerOrder(id, customer);
        saveAudit(customer, "CUSTOMER_VIEWED_ORDER_DETAIL", "Order", order.getId(),
                "Customer viewed order detail " + order.getTrackingNumber());
        return buildOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderTimelineResponse> getMyOrderTimeline(Long id, Authentication authentication) {
        User customer = SecurityUserUtil.requireCurrentUser(authentication);
        Order order = findCustomerOrder(id, customer);
        return getTimeline(order);
    }

    @Transactional
    public OrderDetailResponse cancelMyPendingOrder(Long id, Authentication authentication) {
        User customer = SecurityUserUtil.requireCurrentUser(authentication);
        Order order = findCustomerOrder(id, customer);
        if (order.getOrderStatus() != OrderStatus.PENDING_ADVANCE_VERIFICATION) {
            throw new AppException("Only orders pending advance verification can be cancelled at this stage.",
                    HttpStatus.BAD_REQUEST);
        }

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);
        saveStatusHistory(saved, previousStatus, OrderStatus.CANCELLED, customer,
                "Customer cancelled order before finance verification.");
        saveAudit(customer, "CUSTOMER_ORDER_CANCELLED", "Order", saved.getId(),
                "Customer cancelled order " + saved.getTrackingNumber());
        createNotification(customer, "Order cancelled", "Order " + saved.getTrackingNumber() + " was cancelled.",
                NotificationType.ORDER_STATUS);
        return buildOrderResponse(saved);
    }

    @Transactional(readOnly = true)
    public PublicTrackingResponse trackOrderPublic(String trackingNumber) {
        String normalizedTrackingNumber = clean(trackingNumber);
        if (!isValidTrackingNumber(normalizedTrackingNumber)) {
            throw new AppException("Please enter a valid tracking number.", HttpStatus.BAD_REQUEST);
        }

        Order order = orderRepository.findByTrackingNumberIgnoreCase(normalizedTrackingNumber)
                .orElseThrow(() -> new AppException("Tracking number not found.", HttpStatus.NOT_FOUND));

        // Security note: public tracking maps only workflow fields and never serializes
        // the Order entity or private relationships.
        return new PublicTrackingResponse(
                isBlank(order.getTrackingNumber()) ? normalizedTrackingNumber : order.getTrackingNumber(),
                order.getOrderStatus(),
                order.getFinancialStatus(),
                order.getUpdatedAt() == null ? order.getCreatedAt() : order.getUpdatedAt(),
                publicMessageFor(order.getOrderStatus()));
    }

    private Order findCustomerOrder(Long id, User customer) {
        // Security note: customers can only access orders created under their own
        // account.
        return orderRepository.findByIdAndCustomerId(id, customer.getId())
                .orElseThrow(() -> new AppException("Order not found for current customer.", HttpStatus.NOT_FOUND));
    }

    private OrderResponse buildOrderResponse(Order order) {
        Payment payment = paymentRepository.findByOrderIdOrderByCreatedAtDesc(order.getId()).stream()
                .findFirst()
                .orElse(null);
        return new OrderResponse(order, payment, getTimeline(order));
    }

    private List<OrderTimelineResponse> getTimeline(Order order) {
        return orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(order.getId()).stream()
                .map(OrderTimelineResponse::new)
                .toList();
    }

    private void validateCreateRequest(CreateOrderRequest request) {
        if (request == null) {
            throw new AppException("Order details are required.", HttpStatus.BAD_REQUEST);
        }
        requireText(request.getSenderName(), "Sender name is required.");
        requireText(request.getSenderPhone(), "Sender phone is required.");
        requireText(request.getSenderAddress(), "Sender address is required.");
        requireText(request.getReceiverName(), "Receiver name is required.");
        requireText(request.getReceiverPhone(), "Receiver phone is required.");
        requireText(request.getReceiverAddress(), "Receiver address is required.");
        requireText(request.getPickupAddress(), "Pickup address is required.");
        requireText(request.getDropoffAddress(), "Drop-off address is required.");
        if (request.getRouteDistanceKm() == null || request.getRouteDistanceKm().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException("Route distance must be greater than 0.", HttpStatus.BAD_REQUEST);
        }
        requireText(request.getParcelDescription(), "Parcel description is required.");
        if (request.getParcelWeightKg() == null || request.getParcelWeightKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException("Parcel weight must be greater than 0.", HttpStatus.BAD_REQUEST);
        }
        requireText(request.getPaymentReference(), "Payment reference is required.");
    }


    private String generateTrackingNumber() {
        long nextNumber = orderRepository.count() + 1;
        String trackingNumber = formatTrackingNumber(nextNumber);
        while (orderRepository.existsByTrackingNumber(trackingNumber)) {
            nextNumber++;
            trackingNumber = formatTrackingNumber(nextNumber);
        }
        return trackingNumber;
    }

    private String formatTrackingNumber(long number) {
        return "PGR-" + Year.now().getValue() + "-" + String.format("%06d", number);
    }

    private String storeReceiptIfPresent(MultipartFile receiptFile) {
        if (receiptFile == null || receiptFile.isEmpty()) {
            return null;
        }
        if (receiptFile.getSize() > MAX_RECEIPT_BYTES) {
            throw new AppException("Receipt file must be 5 MB or smaller.", HttpStatus.BAD_REQUEST);
        }

        String originalName = receiptFile.getOriginalFilename() == null ? "" : receiptFile.getOriginalFilename();
        String extension = fileExtension(originalName);
        if (!ALLOWED_RECEIPT_EXTENSIONS.contains(extension)) {
            throw new AppException("Receipt file must be jpg, jpeg, png, or pdf.", HttpStatus.BAD_REQUEST);
        }

        try {
            Path uploadDir = Path.of("uploads", "payment-receipts");
            Files.createDirectories(uploadDir);
            String storedName = UUID.randomUUID() + "." + extension;
            Path target = uploadDir.resolve(storedName).normalize();
            receiptFile.transferTo(target);
            return uploadDir.resolve(storedName).toString().replace("\\", "/");
        } catch (IOException exception) {
            throw new AppException("Could not store receipt file locally.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String fileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(dotIndex + 1).toLowerCase(Locale.ROOT);
    }

    private void saveStatusHistory(Order order, OrderStatus previousStatus, OrderStatus newStatus, User changedBy,
            String note) {
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setChangedByUser(changedBy);
        history.setNote(note);
        orderStatusHistoryRepository.save(history);
    }

    private void saveAudit(User user, String action, String entityType, Long entityId, String description) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDescription(description);
        auditLogRepository.save(auditLog);
    }

    private void createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(type);
        notification.setReadStatus(ReadStatus.UNREAD);
        notificationRepository.save(notification);
    }

    private void notifyFinanceUsers(String trackingNumber) {
        userRepository.findByRole_Code(RoleCode.FINANCE_OFFICER)
                .forEach(financeUser -> createNotification(
                        financeUser,
                        "Advance payment pending",
                        "Order " + trackingNumber + " has an advance payment awaiting verification.",
                        NotificationType.PAYMENT));
    }

    private String publicMessageFor(OrderStatus status) {
        if (status == null) {
            return "Parcel status is being updated. Please check again shortly.";
        }
        return switch (status) {
            case PENDING_ADVANCE_VERIFICATION -> "Order submitted. Advance payment is awaiting verification.";
            case CANCELLED -> "This order has been cancelled.";
            case DELIVERED -> "Parcel has been delivered.";
            default -> "Parcel is moving through the Paragrein logistics workflow.";
        };
    }

    private boolean isValidTrackingNumber(String trackingNumber) {
        return trackingNumber != null
                && trackingNumber.length() >= 3
                && trackingNumber.length() <= 80
                && trackingNumber.matches("[A-Za-z0-9-]+");
    }

    private void requireText(String value, String message) {
        if (isBlank(value)) {
            throw new AppException(message, HttpStatus.BAD_REQUEST);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }

    private BigDecimal moneyScale(BigDecimal value) {
        return value.setScale(2, java.math.RoundingMode.HALF_UP);
    }
}

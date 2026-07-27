package com.paragrein.logistics.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.paragrein.logistics.dto.PublicTrackingResponse;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.NotificationRepository;
import com.paragrein.logistics.repository.OrderRepository;
import com.paragrein.logistics.repository.OrderStatusHistoryRepository;
import com.paragrein.logistics.repository.PaymentRepository;
import com.paragrein.logistics.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class CustomerOrderServiceTest {

    private OrderRepository orderRepository;
    private CustomerOrderService service;

    @BeforeEach
    void setUp() {
        orderRepository = mock(OrderRepository.class);
        service = new CustomerOrderService(
                orderRepository,
                mock(PaymentRepository.class),
                mock(OrderStatusHistoryRepository.class),
                mock(AuditLogRepository.class),
                mock(NotificationRepository.class),
                mock(UserRepository.class),
                null,
                null
        );
    }

    @Test
    void publicTrackingUsesSafeMessageWhenLegacyOrderStatusIsNull() {
        Order order = new Order();
        order.setTrackingNumber("PGR-2026-NULL");
        order.setFinancialStatus(FinancialStatus.ADVANCE_SUBMITTED);
        when(orderRepository.findByTrackingNumberIgnoreCase(anyString())).thenReturn(Optional.of(order));

        PublicTrackingResponse response = service.trackOrderPublic("PGR-2026-NULL");

        assertEquals("PGR-2026-NULL", response.getTrackingNumber());
        assertEquals("Parcel status is being updated. Please check again shortly.", response.getPublicMessage());
    }

    @Test
    void publicTrackingReturnsNotFoundForUnknownNumber() {
        when(orderRepository.findByTrackingNumberIgnoreCase(anyString())).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> service.trackOrderPublic("PGR-2026-999999"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
        assertEquals("Tracking number not found.", exception.getMessage());
    }

    @Test
    void publicTrackingRejectsInvalidInputBeforeRepositoryLookup() {
        AppException exception = assertThrows(AppException.class, () -> service.trackOrderPublic("bad input"));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals("Please enter a valid tracking number.", exception.getMessage());
    }
}

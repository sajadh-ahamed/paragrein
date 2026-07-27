package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.OrderStatusHistory;
import com.paragrein.logistics.enums.OrderStatus;
import java.time.LocalDateTime;

public class OrderTimelineResponse {

    private Long id;
    private OrderStatus previousStatus;
    private OrderStatus newStatus;
    private String changedBy;
    private String note;
    private LocalDateTime createdAt;

    public OrderTimelineResponse(OrderStatusHistory history) {
        this.id = history.getId();
        this.previousStatus = history.getPreviousStatus();
        this.newStatus = history.getNewStatus();
        this.changedBy = history.getChangedByUser() == null ? "System" : history.getChangedByUser().getUsername();
        this.note = history.getNote();
        this.createdAt = history.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public OrderStatus getPreviousStatus() {
        return previousStatus;
    }

    public OrderStatus getNewStatus() {
        return newStatus;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public String getNote() {
        return note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

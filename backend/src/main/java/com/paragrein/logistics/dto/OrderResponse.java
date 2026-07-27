package com.paragrein.logistics.dto;

public class OrderResponse extends OrderDetailResponse {

    public OrderResponse(com.paragrein.logistics.entity.Order order, com.paragrein.logistics.entity.Payment payment, java.util.List<OrderTimelineResponse> timeline) {
        super(order, payment, timeline);
    }
}

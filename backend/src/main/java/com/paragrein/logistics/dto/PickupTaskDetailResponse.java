package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import java.util.List;

public class PickupTaskDetailResponse extends PickupTaskSummaryResponse {

    private String senderAddress;
    private String receiverPhone;
    private String receiverAddress;
    private String customerName;
    private String customerPhone;
    private List<OrderTimelineResponse> timeline;

    public PickupTaskDetailResponse(Assignment assignment, List<OrderTimelineResponse> timeline) {
        super(assignment);
        this.senderAddress = assignment.getOrder().getSenderAddress();
        this.receiverPhone = assignment.getOrder().getReceiverPhone();
        this.receiverAddress = assignment.getOrder().getReceiverAddress();
        this.customerName = assignment.getOrder().getCustomer().getFullName();
        this.customerPhone = assignment.getOrder().getCustomer().getPhoneNumber();
        this.timeline = timeline;
    }

    public String getSenderAddress() {
        return senderAddress;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public String getReceiverAddress() {
        return receiverAddress;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public List<OrderTimelineResponse> getTimeline() {
        return timeline;
    }
}

package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.FinanceDashboardSummaryResponse;
import com.paragrein.logistics.dto.FinancePaymentDetailResponse;
import com.paragrein.logistics.dto.FinancePaymentSummaryResponse;
import com.paragrein.logistics.dto.RejectAdvancePaymentRequest;
import com.paragrein.logistics.dto.VerifyAdvancePaymentRequest;
import com.paragrein.logistics.service.FinancePaymentService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/finance")
public class FinancePaymentController {

    private final FinancePaymentService financePaymentService;

    public FinancePaymentController(FinancePaymentService financePaymentService) {
        this.financePaymentService = financePaymentService;
    }

    @GetMapping("/dashboard-summary")
    public FinanceDashboardSummaryResponse getDashboardSummary() {
        return financePaymentService.getFinanceDashboardSummary();
    }

    @GetMapping("/payments/pending-advance")
    public List<FinancePaymentSummaryResponse> getPendingAdvancePayments() {
        return financePaymentService.getPendingAdvancePayments();
    }

    @GetMapping("/payments/verified-advance")
    public List<FinancePaymentSummaryResponse> getVerifiedAdvancePayments() {
        return financePaymentService.getVerifiedAdvancePayments();
    }

    @GetMapping("/payments/rejected-advance")
    public List<FinancePaymentSummaryResponse> getRejectedAdvancePayments() {
        return financePaymentService.getRejectedAdvancePayments();
    }

    @GetMapping("/payments/completed")
    public List<FinancePaymentSummaryResponse> getCompletedPayments() {
        return financePaymentService.getCompletedPayments();
    }

    @GetMapping("/payments/outstanding-balances")
    public List<FinancePaymentSummaryResponse> getOutstandingBalances() {
        return financePaymentService.getOutstandingBalances();
    }

    @GetMapping("/payments/{paymentId}")
    public FinancePaymentDetailResponse getPaymentDetail(@PathVariable Long paymentId) {
        return financePaymentService.getPaymentDetail(paymentId);
    }

    @PatchMapping("/payments/{paymentId}/verify")
    public FinancePaymentDetailResponse verifyAdvancePayment(
            @PathVariable Long paymentId,
            @RequestBody(required = false) VerifyAdvancePaymentRequest request,
            Authentication authentication
    ) {
        return financePaymentService.verifyAdvancePayment(paymentId, request, authentication);
    }

    @PatchMapping("/payments/{paymentId}/reject")
    public FinancePaymentDetailResponse rejectAdvancePayment(
            @PathVariable Long paymentId,
            @RequestBody RejectAdvancePaymentRequest request,
            Authentication authentication
    ) {
        return financePaymentService.rejectAdvancePayment(paymentId, request, authentication);
    }
}

package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.CostPreviewRequest;
import com.paragrein.logistics.dto.CostPreviewResponse;
import com.paragrein.logistics.entity.ServiceSetting;
import com.paragrein.logistics.exception.AppException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PricingService {

    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");

    private final ServiceSettingsService serviceSettingsService;

    public PricingService(ServiceSettingsService serviceSettingsService) {
        this.serviceSettingsService = serviceSettingsService;
    }

    @Transactional(readOnly = true)
    public CostPreviewResponse calculatePreview(CostPreviewRequest request) {
        validateRequest(request);

        ServiceSetting settings = serviceSettingsService.findActiveSettings();

        // Business rule: route distance uses local service-area hub distances so
        // pricing remains fully offline.
        // Extension point: this calculation can later be replaced by a route service
        // without changing order storage fields.
        BigDecimal routeDistanceKm = moneyScale(request.getRouteDistanceKm());
        //exact formula which is calculated by this (base rate + (distance x perkm price))
        BigDecimal totalAmount = moneyScale(
                settings.getBaseRate().add(routeDistanceKm.multiply(settings.getPerKmRate())));
//        completely change total amount
//        BigDecimal totalAmount = moneyScale(
//                settings.getBaseRate()
//                        .add(routeDistanceKm.multiply(settings.getPerKmRate()))
//                        .add(request.getParcelWeightKg().multiply(settings.getPerKgRate())));


        BigDecimal advanceAmount = moneyScale(
                totalAmount.multiply(settings.getAdvancePercentage()).divide(ONE_HUNDRED, 2, RoundingMode.HALF_UP));
        BigDecimal balanceAmount = moneyScale(totalAmount.subtract(advanceAmount));

        return new CostPreviewResponse(
                null, // No longer derived from service areas
                null, // No longer derived from service areas
                routeDistanceKm,
                moneyScale(settings.getBaseRate()),
                moneyScale(settings.getPerKmRate()),
//                moneyScale(settings.getPerKgRate())
                moneyScale(settings.getAdvancePercentage()),
                totalAmount,
                advanceAmount,
                balanceAmount);
    }

    private void validateRequest(CostPreviewRequest request) {
        if (request == null || request.getRouteDistanceKm() == null
                || request.getRouteDistanceKm().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException("Route distance must be greater than 0.", HttpStatus.BAD_REQUEST);
        }
        if (request.getParcelWeightKg() == null || request.getParcelWeightKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException("Parcel weight must be greater than 0.", HttpStatus.BAD_REQUEST);
        }
    }

    private BigDecimal moneyScale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}

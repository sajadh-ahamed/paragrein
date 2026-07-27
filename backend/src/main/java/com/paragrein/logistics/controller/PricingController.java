package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.CostPreviewRequest;
import com.paragrein.logistics.dto.CostPreviewResponse;
import com.paragrein.logistics.service.PricingService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {

    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @PostMapping("/preview")
    public CostPreviewResponse preview(@RequestBody CostPreviewRequest request) {
        return pricingService.calculatePreview(request);
    }
}

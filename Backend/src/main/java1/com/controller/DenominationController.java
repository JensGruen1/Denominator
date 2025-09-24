package com.controller;


import com.entity.Denomination;
import com.entity.DenominationInt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.service.DenominationService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class DenominationController {

    private final DenominationService denominationService;


    public DenominationController(DenominationService denominationService) {
        this.denominationService = denominationService;
    }

    public record DenominationResponse(double amount, TreeMap<Double, Integer> denomination) {}

    @GetMapping("/calculateDenomination/{amount}")
    public ResponseEntity<?> getQuantityDenominationList(@PathVariable double amount) {

        var response = new DenominationResponse(
                amount,
                denominationService.quantityDenominationMap(amount)
        );

        return ResponseEntity.ok(response);
    }

    public record ComparisonRequest( DenominationResponse current, DenominationResponse previous) {}

    @PostMapping("/calculateComparison")
    public ResponseEntity<?> getComparisonDenominationList(@RequestBody ComparisonRequest request)
    {
        var response = new DenominationResponse(
                request.previous().amount(),
                denominationService.compareQuantityBeforeAfterMap(
                        request.current.denomination(),
                        request.previous().denomination())
        );

        System.out.println("comparison: " + response);

        return ResponseEntity.ok(response);
    }


}

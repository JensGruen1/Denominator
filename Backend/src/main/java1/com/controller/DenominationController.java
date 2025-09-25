package com.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.service.DenominationService;
import java.util.TreeMap;
import org.springframework.http.converter.HttpMessageNotReadableException;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class DenominationController {

    private final DenominationService denominationService;

    public DenominationController(DenominationService denominationService) {
        this.denominationService = denominationService;
    }

    public record DenominationResponse(String amount, TreeMap<Double, Integer> denomination) {}

    @GetMapping("/calculateDenomination/{amount}")
    public ResponseEntity<?> getQuantityDenominationList(@PathVariable String amount) {

        try {
            var response = new DenominationResponse(
                    amount,
                    denominationService.quantityDenominationMap(amount)
            );

            return ResponseEntity.ok(response);
        }

        catch (NumberFormatException e) {
            System.out.println("String values are not allowed");
            return ResponseEntity.badRequest().body("String values are not allowed! " + amount);
        }
    }

    public record ComparisonRequest( DenominationResponse current, DenominationResponse previous) {}

    @PostMapping("/calculateComparison")
    public ResponseEntity<?> getComparisonDenominationList(@RequestBody ComparisonRequest request) {

        try {
        DenominationResponse previous = request.previous();
        DenominationResponse current = request.current();

            var response = new DenominationResponse(
                    previous.amount(),
                    denominationService.compareQuantityBeforeAfterMap(
                            current.denomination(),
                            previous.denomination())
            );
            return ResponseEntity.ok(response);

        } catch (NullPointerException e) {
            System.out.println("One of the Denomination responses or both are null");
            return  ResponseEntity.badRequest().body("One of the Denomination responses or both are null " + e.getMessage());
        } catch (HttpMessageNotReadableException e) {
            System.out.println("Request has wrong format");
            return  ResponseEntity.badRequest().body("Request has wrong format: " +e.getMessage());

        }




    }


}

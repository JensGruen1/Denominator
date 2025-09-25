package com.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.service.DenominationService;
import java.util.TreeMap;
import org.springframework.http.converter.HttpMessageNotReadableException;


/**
 * A controller with the two endpoints  getQuantityDenominationList and getComparisonDenominationList
 * These endpoints calculate the denomination and the changes from one denomination to another
 */


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class DenominationController {

    private final DenominationService denominationService;

    public DenominationController(DenominationService denominationService) {
        this.denominationService = denominationService;
    }

    /**
     *  A record to pass DTO's
     * @param amount   of the denomination
     * @param denomination  is the actual denomination
     */
    public record DenominationResponse(String amount, TreeMap<Double, Integer> denomination) {}

    /**
     *  Aa GET endpoint to calculate the denomination in the backend
     * @param amount
     * @return  it returns a ResponseEntity which is status ok when there are no errors and
     * it returns bad Request if there is somehow passed a string which cannot be parsed to double
     */


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

    /**
     *  A record to pass DTO's
     * @param current   is the current denomination including the amount of the denomination
     * @param previous  is the previous denomination including the amount of the denomination
     */

    public record ComparisonRequest( DenominationResponse current, DenominationResponse previous) {}


    /**
     * An POST endpoint to calculate the changes from one denomination to another
     * @param request  contains the current and previous denomination with the amount
     * @return ResponseEntity.ok if there are no errors, ResponseEntity.badRequest if
     * one of the denominations is accidentally null or the request has wrong format
     */


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

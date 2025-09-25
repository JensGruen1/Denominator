package com.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * A service class to calculate denomination of a given amount and
 * the changes from one denomination to another
 */



@Service
public class DenominationService {

    /**
     * A service method to calculate the denomination of a given amount
     * @param amount  this is the amount to calculate the denomination.
     *                The input is String to prevent errors which cannot be caught
     * @return  denomination as a TreeMap<Double,Integer>
     */


    public TreeMap<Double, Integer> quantityDenominationMap (String amount) {

    double parsedAmount = Double.parseDouble(amount);   //parse String to double, because amount should actually be a double
    Integer[] currencyArrayInCent = {20000,10000,5000,2000,1000,500,200,100,50,20,10,5,2,1};  //given currency to determine the denomination
    List<Integer> currency = List.of(currencyArrayInCent);
    long roundedAmount;
        roundedAmount = (long) Math.floor(parsedAmount  * 100.0);   //round off, e.g 23.445 euros becomes 2344 Cents
        TreeMap<Double, Integer> map = new TreeMap<>();

        if (parsedAmount  == 0) {            //prevent errors where the amount is 0, which cannot be denominated
            return new TreeMap<>();
        }

        int quantity;

        for (int d : currency) {       //loop the calculate the denomination
            if (roundedAmount % d != roundedAmount && roundedAmount % d != 0) {
                quantity = (int) (roundedAmount / d);
                roundedAmount = roundedAmount % d;
                map.put(d / 100.0, quantity);
            } else if (roundedAmount % d == 0) {
                quantity = (int) (roundedAmount / d);
                map.put(d / 100.0, quantity);
                break;
            }
        }

        return map;


    }

    /**
     * Service method to calculate the changes from the current denomination to the previous one
     * It combines the notes/coins from the currency and gives the changed quantities
     * @param previous   is the Treemap from the previous denomination
     * @param current    is the Treemap from the current denomination
     * @return  it returns the Treemap with the changes from previous to current denomination
     */


    public TreeMap<Double, Integer> compareQuantityBeforeAfterMap (TreeMap<Double,Integer> previous, TreeMap<Double, Integer> current) {
        TreeMap<Double, Integer> comparison = new TreeMap<>();

        if (current.isEmpty() || previous.isEmpty()) {    //if one of the maps in empty there should be no comparison
            return new TreeMap<>();
        } else {

            for (Map.Entry<Double, Integer> entry : current.entrySet()) {    // just changes the sign of the value of the current denomination
                comparison.put(entry.getKey(), -entry.getValue());
            }

            for (Map.Entry<Double, Integer> entry : previous.entrySet()) {     // merges the entries of the previous and current denomination, just add all the values
                comparison.merge(entry.getKey(), entry.getValue(), Integer::sum);
            }

            return comparison;
        }
    }

}

package com.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DenominationService {

private final Integer[] currencyArrayInCent = {20000,10000,5000,2000,1000,500,200,100,50,20,10,5,2,1};
private final List<Integer> currency = List.of(currencyArrayInCent);

    public TreeMap<Double, Integer> quantityDenominationMap (double amount) {
    long roundedAmount = Math.round(amount * 100.0);
    TreeMap<Double,Integer> map = new TreeMap<>();
    int quantity;

        for (int d : currency) {
            if (roundedAmount % d != roundedAmount && roundedAmount % d != 0) {
                quantity = (int) (roundedAmount/ d);
                roundedAmount = roundedAmount % d;
                map.put(d /100.0 , quantity);
            } else if (roundedAmount % d == 0) {
                quantity = (int) (roundedAmount / d);
                map.put(d / 100.0,quantity);
                break;
            }
        }
        return  map;
    }

    public TreeMap<Double, Integer> compareQuantityBeforeAfterMap (TreeMap<Double,Integer> previous, TreeMap<Double, Integer> current) {
        TreeMap<Double, Integer> comparison = new TreeMap<>();

        for (Map.Entry<Double, Integer> entry : current.entrySet()) {
            comparison.put(entry.getKey(), -entry.getValue());
        }

        for(Map.Entry<Double,Integer> entry: previous.entrySet()) {
           comparison.merge(entry.getKey(), entry.getValue(), Integer::sum);
        }

        return comparison;
    }

}

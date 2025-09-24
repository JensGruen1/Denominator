package com.entity;

import jakarta.persistence.Entity;

import java.util.Map;
import java.util.TreeMap;


public class DenominationInt {
    private double amount;

    private TreeMap<Double,Integer> denomination;

    public double getAmount() {
        return amount;
    }

    public TreeMap<Double, Integer> getDenomination() {
        return denomination;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setDenomination(TreeMap<Double, Integer> denomination) {
        this.denomination = denomination;
    }
}

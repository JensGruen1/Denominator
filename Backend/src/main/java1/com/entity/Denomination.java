package com.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.Map;


public class Denomination {

private double amount;


private Map<String,Double> denomination;

    public double getAmount() {
        return amount;
    }

    public Map<String, Double> getDenomination() {
        return denomination;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setDenomination(Map<String, Double> denomination) {
        this.denomination = denomination;
    }
}

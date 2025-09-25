package com.example.demo;

import com.service.DenominationService;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;
import java.util.TreeMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ServiceTest {

    @Autowired
    DenominationService denominationService;

  @Test
  void quantityDenominationMap_shouldReturnCorrectDenomination () {
      //given
      String amount = String.valueOf(234.32);
      String amountWithToManyDecimalPlaces = String.valueOf(23.3454);
      TreeMap<Double,Integer> result = new TreeMap<>();
      result.put(0.02, 1);
      result.put(0.1, 1);
      result.put(0.2, 1);
      result.put(2.0, 2);
      result.put(10.0, 1);
      result.put(20.0, 1);
      result.put(200.0, 1);

      //when
      TreeMap<Double,Integer> actual = denominationService.quantityDenominationMap(amount);
      double actualSum = 0.0;
      for (Map.Entry<Double,Integer> entry:actual.entrySet()) {
          actualSum = actualSum + entry.getValue()* entry.getKey();
      }
      TreeMap<Double,Integer> actualEmpty = denominationService.quantityDenominationMap(String.valueOf(0));
      TreeMap<Double, Integer> actualTooManyDecimalPlaces = denominationService.quantityDenominationMap(amountWithToManyDecimalPlaces);
      double actualSumTooManyDecimalPlaces = 0.0;
      for (Map.Entry<Double,Integer> entry:actualTooManyDecimalPlaces.entrySet()) {
         actualSumTooManyDecimalPlaces = actualSumTooManyDecimalPlaces + entry.getValue()* entry.getKey();
      }


      //then
      assertEquals(result, actual);
      assertEquals(amount, String.valueOf(actualSum));
      assertEquals(23.34, actualSumTooManyDecimalPlaces);
      assertThat(actualEmpty.isEmpty());

  }

  @Test
    void quantityDenominationMap_shouldRThrowNumberFormatExceptionWhenAmountIsString () {
      //given
      String amount = "efsdf1";
      //when,then
      assertThrows(NumberFormatException.class, () -> denominationService.quantityDenominationMap(amount));
  }


  @Test
    void compareQuantityBeforeAfterMap_shouldReturnCorrectResult () {

      //given
      //234.32
      TreeMap<Double,Integer> current = new TreeMap<>();
      current.put(0.02, 1);
      current.put(0.1, 1);
      current.put(0.2, 1);
      current.put(2.0, 2);
      current.put(10.0, 1);
      current.put(20.0, 1);
      current.put(200.0, 1);

      //456.12
      TreeMap<Double,Integer> previous = new TreeMap<>();
      previous.put(0.02, 1);
      previous.put(0.1, 1);
      previous.put(1.0, 1);
      previous.put(5.0, 1);
      previous.put(50.0, 1);
      previous.put(200.0, 2);

      TreeMap<Double,Integer> result = new TreeMap<>();
      result.put(0.02, 0);
      result.put(0.1, 0);
      result.put(0.2, 1);
      result.put(1.0, -1);
      result.put(2.0, 2);
      result.put(5.0, -1);
      result.put(10.0, 1);
      result.put(20.0, 1);
      result.put(50.0, -1);
      result.put(200.0, -1);

      TreeMap<Double,Integer> emptyCurrent = new TreeMap<>();
      TreeMap<Double,Integer> emptyPrevious = new TreeMap<>();


      //when
      TreeMap<Double,Integer> actual = denominationService.compareQuantityBeforeAfterMap(current,previous);
      //then
      assertEquals(result,actual);
      assertEquals(new TreeMap<>(),denominationService.compareQuantityBeforeAfterMap(emptyCurrent,emptyPrevious));
      assertEquals(new TreeMap<>(),denominationService.compareQuantityBeforeAfterMap(current,emptyPrevious));
      assertEquals(new TreeMap<>(),denominationService.compareQuantityBeforeAfterMap(emptyCurrent,previous));

  }


}

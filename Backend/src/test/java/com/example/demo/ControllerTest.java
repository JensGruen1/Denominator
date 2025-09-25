package com.example.demo;

import com.controller.DenominationController;
import com.service.DenominationService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import java.util.TreeMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
public class ControllerTest {

    @Autowired
   private MockMvc mockMvc;

 @Mock
    private DenominationService denominationService;

 @InjectMocks
    private DenominationController denominationController;



 @Test
    public void getQuantityDenominationList_shouldReturnOkWhenInputIsCorrect () {
     // given
     String amount = "110.23";

     TreeMap<Double,Integer> map = new TreeMap<>();
     map.put(0.01,1);
     map.put(0.02, 1);
     map.put(0.2, 1);
     map.put(10.0, 1);
     map.put(100.0, 1);

     //when
     when(denominationService.quantityDenominationMap(amount)).thenReturn(map);
     ResponseEntity<?> result = denominationController.getQuantityDenominationList(amount);
     //then
     assertEquals(HttpStatus.OK, result.getStatusCode());

 }

 @Test
    public void getQuantityDenominationList_ShouldReturnBadRequestWhenAmountIsString () {
     String amount = "efsd.3:";

     when(denominationService.quantityDenominationMap(amount)).thenThrow(new NumberFormatException());
     ResponseEntity<?> result = denominationController.getQuantityDenominationList(amount);
     assertEquals(HttpStatus.BAD_REQUEST,result.getStatusCode());

 }

 @Test
    public void getComparisonDenominationList_ShouldReturnBadRequestWhenOneOfTheInputsIsNull () {
    //given
     TreeMap<Double,Integer> map = new TreeMap<>();
     map.put(0.01,1);
     map.put(0.02, 1);
     map.put(0.2, 1);
     map.put(10.0, 1);
     map.put(100.0, 1);

     DenominationController.DenominationResponse denominationResponse
             = new DenominationController.DenominationResponse("110.23", map);

     DenominationController.ComparisonRequest comparisonRequest
             = new DenominationController.ComparisonRequest(null, denominationResponse);

     DenominationController.DenominationResponse previous = comparisonRequest.previous();
     DenominationController.DenominationResponse current = null;


     //when
     when(denominationService.compareQuantityBeforeAfterMap
             (null,previous.denomination()))
             .thenThrow(new NullPointerException());
     ResponseEntity<?> result = denominationController.getComparisonDenominationList(comparisonRequest);


     //then
     assertEquals(HttpStatus.BAD_REQUEST,result.getStatusCode());
 }

 @Test
    public void getComparisonDenominationList_ShouldReturnBadRequestWhenFormatIsWrong () throws Exception {
String wrongJson = """
    {
        "current": {
            "amount": "12.34",
            "denomination": [10,1]
        },
        "previous": {
            "amount": "10.00",
            "denomination": {"10.0": 1}
        }
    }
    """;

String wrongJson2= "\"this is totally wrong\"";

mockMvc.perform(post("/api/calculateComparison")
        .contentType(MediaType.APPLICATION_JSON)
        .content(wrongJson))
        .andExpect(status().isBadRequest());



 }

 @Test
    public void getComparisonDenominationList_ShouldReturnBadRequestWhenFormatTotallyWrong () throws Exception {
        String wrongJson2= "\"this is totally wrong\"";

     mockMvc.perform(post("/api/calculateComparison")
        .contentType(MediaType.APPLICATION_JSON)
        .content(wrongJson2))
        .andExpect(status().isBadRequest());

    }


 @Test
 public void    getComparisonDenominationList_ShouldReturnOkWhenInputIsCorrect () {
    //given
     String currentAmount = "234.32";
     TreeMap<Double,Integer> current = new TreeMap<>();
     current.put(0.02, 1);
     current.put(0.1, 1);
     current.put(0.2, 1);
     current.put(2.0, 2);
     current.put(10.0, 1);
     current.put(20.0, 1);
     current.put(200.0, 1);

     DenominationController.DenominationResponse denominationResponseCurrent = new DenominationController.DenominationResponse(
             currentAmount, current
     );

     String previousAmount = "456.12";
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

     DenominationController.DenominationResponse denominationResponsePrevious = new DenominationController.DenominationResponse(
             previousAmount,previous
     );

     DenominationController.ComparisonRequest request =
             new DenominationController.ComparisonRequest(
                     denominationResponseCurrent,denominationResponsePrevious
             );

     //when
     when(denominationService.compareQuantityBeforeAfterMap(current,previous))
             .thenReturn(result);

     ResponseEntity<?> controllerResponse = denominationController.getComparisonDenominationList(request);

     assertEquals(HttpStatus.OK, controllerResponse.getStatusCode());


 }

}

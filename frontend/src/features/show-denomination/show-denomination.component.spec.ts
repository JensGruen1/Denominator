import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ShowDenominationComponent } from './show-denomination.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DenominationResponse } from './show-denomination.component';

describe('ShowDenominationComponent', () => {
  let component: ShowDenominationComponent;
  let fixture: ComponentFixture<ShowDenominationComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDenominationComponent],
                providers: [
        provideHttpClient(),
        provideHttpClientTesting()
                ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDenominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



 

it('getDenominationMapFromDenomationResponseObject should sort in ascending orders by its keys', () => {
    
  const denominationObj: { [key: number]: number } = {
    0.02: 1,
    2: 1,
    200: 1,
    100: 1,
    20: 1,
    10: 1,
    0.5: 1,
    0.2: 1
  };

  const denominationWithAmount: DenominationResponse = {
    amount: 12.45,
    denomination: denominationObj
  };


const expected: [string, number][] = [
    ['200', 1],
    ['100', 1],
    ['20', 1],
    ['10', 1],
    ['2', 1],
    ['0.5', 1],
    ['0.2', 1],
    ['0.02', 1]
  ];

const actual = component.getDenominationMapFromDenomationResponseObject(denominationWithAmount);


expect(actual).toEqual(expected);

});




it(' should call backend when language is Java and set denominationWithAmount to the response that comes from the backend', () => {
  component.language = 'Java';
  component.amount = 123.45;

  component.onSubmit();
  console.log('Sprache im Test:', component.language);


  expect(component.errorMessage).toBe('');
  const request = httpMock.expectOne(`http://localhost:8080/api/calculateDenomination/${component.amount}`);
  expect(request.request.method).toBe('GET');
  

  const fakeResponse: DenominationResponse = {
      amount: 123.45,
      denomination: { '100': 1, '20': 1, '2': 1, '1': 1, '0.2': 2, '0.05': 1 }
    };

    request.flush(fakeResponse);


    expect(component.denominationWithAmount).toEqual(fakeResponse);
    expect(component.showDenomination).toBeTrue();

});




});

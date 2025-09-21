import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDenominationComponent } from './show-denomination.component';

describe('ShowDenominationComponent', () => {
  let component: ShowDenominationComponent;
  let fixture: ComponentFixture<ShowDenominationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDenominationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDenominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

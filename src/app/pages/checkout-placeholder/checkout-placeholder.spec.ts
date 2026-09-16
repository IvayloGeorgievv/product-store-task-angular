import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutPlaceholder } from './checkout-placeholder';

describe('CheckoutPlaceholder', () => {
  let component: CheckoutPlaceholder;
  let fixture: ComponentFixture<CheckoutPlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPlaceholder],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPlaceholder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

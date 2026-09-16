import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSpecsComponent } from './product-specs.component';

describe('ProductSpecsComponent', () => {
  let component: ProductSpecsComponent;
  let fixture: ComponentFixture<ProductSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSpecsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSpecsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

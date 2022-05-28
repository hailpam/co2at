import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTransactionComponent } from './credit-transaction.component';

describe('CreditTransactionComponent', () => {
  let component: CreditTransactionComponent;
  let fixture: ComponentFixture<CreditTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

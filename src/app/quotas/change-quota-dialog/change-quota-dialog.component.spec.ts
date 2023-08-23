import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeQuotaDialogComponent } from './change-quota-dialog.component';

describe('ChangeQuotaDialogComponent', () => {
  let component: ChangeQuotaDialogComponent;
  let fixture: ComponentFixture<ChangeQuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeQuotaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeQuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

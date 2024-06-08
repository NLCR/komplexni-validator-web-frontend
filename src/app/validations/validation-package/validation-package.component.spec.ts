import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationPackageComponent } from './validation-package.component';

describe('ValidationComponent', () => {
  let component: ValidationPackageComponent;
  let fixture: ComponentFixture<ValidationPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationPackageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

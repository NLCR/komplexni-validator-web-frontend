import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationPackageNewComponent } from './validation-package-new.component';

describe('NewValidationComponent', () => {
  let component: ValidationPackageNewComponent;
  let fixture: ComponentFixture<ValidationPackageNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationPackageNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationPackageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

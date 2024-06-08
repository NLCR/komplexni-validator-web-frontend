import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationXmlComponent } from './validation-xml.component';

describe('ValidationXmlComponent', () => {
  let component: ValidationXmlComponent;
  let fixture: ComponentFixture<ValidationXmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationXmlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationXmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

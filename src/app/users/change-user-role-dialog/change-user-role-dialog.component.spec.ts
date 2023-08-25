import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserRoleDialogComponent } from './change-user-role-dialog.component';

describe('ChangeUserRoleDialogComponent', () => {
  let component: ChangeUserRoleDialogComponent;
  let fixture: ComponentFixture<ChangeUserRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUserRoleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeUserRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

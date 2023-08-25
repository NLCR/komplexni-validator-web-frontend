import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-change-user-role-dialog',
  templateUrl: './change-user-role-dialog.component.html',
  styleUrls: ['./change-user-role-dialog.component.scss']
})
export class ChangeUserRoleDialogComponent {

  constructor(public dialogRef: MatDialogRef<ChangeUserRoleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private backend: BackendService) { }

  translateRole(role: string) {
    switch (role) {
      case 'admin':
        return "administrátor"
      case 'verifiedUser':
        return "ověřený uživatel"
      case 'unverifiedUser':
        return "neověřený uživatel"
      default:
        return role;
    }
  }

  changeRole() {
    const data = {
      admin: this.data.role == 'admin',
      verified: this.data.role == 'verifiedUser' || this.data.role == 'admin'
    }
    this.backend.updateUser(this.data.user.id, data).subscribe(result => {
      //this.loadUsers();
    });
  }

}

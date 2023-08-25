import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ChangeUserRoleDialogComponent } from './change-user-role-dialog/change-user-role-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users = [];
  displayedColumns: string[] = ['avatar', 'name', 'email', 'admin', 'verified']; //poradi sloupcu v tabulce

  constructor(private backend: BackendService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.backend.getUsers().subscribe(result => {
      this.users = result;
      //console.log(result);
    })
  }

  routeToUserDetail(id: string) {
    this.router.navigate(['/', 'users', id]);
  }

  // setAdmin(user: any, admin: boolean) {
  //   const data = {
  //     admin: admin
  //   }
  //   this.backend.updateUser(user.id, data).subscribe(result => {
  //     this.loadUsers();
  //   });
  // }

  // setVerified(user: any, verified: boolean) {
  //   const data = {
  //     verified: verified
  //   }
  //   this.backend.updateUser(user.id, data).subscribe(result => {
  //     this.loadUsers();
  //   });
  // }


  isAdmin(user: any) {
    return user.admin;

  }

  isVerifiedNotAdmin(user: any) {
    return user.verified && !user.admin;
  }

  onUserRoleChipSelection(event: MatChipSelectionChange, user: any) {
    const selected = event.selected;
    switch (event.source.value) {
      case 'adminUser':
        if (selected) {
          if (!user.admin) {
            this.setRoleDialog(user, 'admin', '0.2s', '0.2s');
          }
        } else {
          if (user.admin) {
            this.setRoleDialog(user, 'unverifiedUser', '0.2s', '0.2s');
          }
        }
        break;
      case 'verifiedUser':
        if (selected) {
          if (!user.verified || user.admin) {
            this.setRoleDialog(user, 'verifiedUser', '0.2s', '0.2s');
          }
        } else {
          if (user.verified) {
            this.setRoleDialog(user, 'unverifiedUser', '0.2s', '0.2s');
          }
        }
    }
  }

  setRoleDialog(user: any, role: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ChangeUserRoleDialogComponent, {
      width: '650px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        user: user,
        role: role
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadUsers();
    });
  }


}

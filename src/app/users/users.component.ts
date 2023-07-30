import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users = [];

  constructor(private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.backend.getUsers().subscribe(result => {
      this.users = result;
      console.log(result);
    })
  }

  reloadUsers() {
    this.loadUsers();
  }

  routeToUserDetail(id: string) {
    this.router.navigate(['/', 'users', id]);
  }

  setAdmin(user: any, admin: boolean) {
    const data = {
      admin: admin
    }
    this.backend.updateUser(user.id, data).subscribe(result => {
      this.loadUsers();
    });
  }

  verifyUser(user: any) {
    const data = {
      verified: true
    }
    this.backend.updateUser(user.id, data).subscribe(result => {
      this.loadUsers();
    });
  }



}

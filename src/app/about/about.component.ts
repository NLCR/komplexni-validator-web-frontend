import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.backend.test().subscribe(result => {
      console.log(result);
    })
  }

}

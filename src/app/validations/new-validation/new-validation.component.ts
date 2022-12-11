import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-new-validation',
  templateUrl: './new-validation.component.html',
  styleUrls: ['./new-validation.component.scss']
})
export class NewValidationComponent implements OnInit {

  constructor(private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
  }

  test() {
    this.backend.createValidation('666', 1, 'test').subscribe(result => {
      console.log(result);
      this.router.navigate(['/', 'validations']);
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['./validations.component.scss']
})
export class ValidationsComponent implements OnInit {

  validations = [];

  constructor(private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.loadValidations();
  }

  loadValidations() {
    this.backend.getValidations().subscribe(result => {
      this.validations = result;
      console.log(result);
    })
  }

  reloadValidations() {
    this.loadValidations();
  }

  routeToNewValidationForm() {
    this.router.navigate(['/', 'validations', 'new']);
  }

}

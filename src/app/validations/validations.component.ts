import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['./validations.component.scss']
})
export class ValidationsComponent implements OnInit {

  validations = [];

  constructor(private backend: BackendService) { }

  ngOnInit(): void {
    this.loadValidations();
  }

  loadValidations() {
    this.backend.getValidations().subscribe(result => {
      this.validations = result;
      console.log(result);
    })
  }

  test() {
    this.loadValidations();
  }

}

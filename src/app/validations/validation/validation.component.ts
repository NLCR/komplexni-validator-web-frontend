import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {


  validation = undefined;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadValidation(id);
    });
  }

  loadValidation(id: string) {
    this.backend.getValidation(id).subscribe(result => {
      this.validation = result;
      //console.log(result);
    })
  }

}

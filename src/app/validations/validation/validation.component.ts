import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  id = "";
  validation = undefined;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private appSettings: AppSettingsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadValidation(this.id);
    });
  }

  loadValidation(id: string) {
    this.backend.getValidation(id).subscribe(result => {
      this.validation = result;
      console.log(result);
    })
  }

  cancelValidation() {
    this.backend.cancelValidation(this.id).subscribe(result => {
      this.loadValidation(this.id);
    })
  }

  extractionLogAvailable() {
    if (!this.validation) return false;
    switch (this.validation['state']) {
      case 'READY_FOR_EXECUTION':
      case 'TO_BE_EXECUTED':
      case 'EXECUTING':
      case 'FINISHED':
      case 'ERROR': //nekdy muze byt prazdny, pokud error nastal treba pri rozbalovani
      case 'TO_BE_ARCHIVED':
      case 'ARCHIVING':
      case 'ARCHIVED':
        return true;
      default:
        return false;
    }
  }

  extractionLogUrl() {
    return this.backend.getExtractionLogUrl(this.validation!['id']);
  }

}

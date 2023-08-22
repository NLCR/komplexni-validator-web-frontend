import { HttpClient } from '@angular/common/http';
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

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private appSettings: AppSettingsService, private http: HttpClient) { }

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

  canBeCanceled() {
    return false; //TODO
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

  executionLogAvailable() {
    if (!this.validation) return false;
    switch (this.validation['state']) {
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

  validationLogTxtAvailable() {
    if (!this.validation) return false;
    switch (this.validation['state']) {
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

  validationLogXmlAvailable() {
    if (!this.validation) return false;
    switch (this.validation['state']) {
      case 'FINISHED':
      case 'TO_BE_ARCHIVED':
      case 'ARCHIVING':
      case 'ARCHIVED':
        return true;
      default:
        return false;
    }
  }

  downloadExtractionLogTxt() {
    //console.log(this.validation);
    const packageName = this.validation!['packageName'];
    const validationId = this.validation!['id'];
    const url = this.backend.getExtractionLogUrl(validationId)
    this.downloadFile(url).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'text/plain' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `extraction_${packageName}_${validationId}_log.txt`
      link.click();
      URL.revokeObjectURL(downloadUrl);
    });
  }

  downloadValidationLogTxt() {
    //console.log(this.validation);
    const packageName = this.validation!['packageName'];
    const validationId = this.validation!['id'];
    const url = this.backend.getValidationLogTxtUrl(validationId)
    this.downloadFile(url).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'text/plain' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `validation_${packageName}_${validationId}_log.txt`
      link.click();
      URL.revokeObjectURL(downloadUrl);
    });
  }

  downloadValidationLogXml() {
    //console.log(this.validation);
    const packageName = this.validation!['packageName'];
    const validationId = this.validation!['id'];
    const url = this.backend.getValidationLogXmlUrl(validationId)
    this.downloadFile(url).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/xml' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `validation_${packageName}_${validationId}_log.xml`
      link.click();
      URL.revokeObjectURL(downloadUrl);
    });
  }

  downloadFile(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }
}

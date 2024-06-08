import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { BackendService } from 'src/app/services/backend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation-package.component.html',
  styleUrls: ['./validation-package.component.scss']
})
export class ValidationPackageComponent implements OnInit {

  id = "";
  validation = undefined;

  extractionLogExists = false;
  clamavLogExists = false;
  executionLogExists = false;
  validationLogTxtExists = false;
  validationLogXmlExists = false;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private appSettings: AppSettingsService, private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadValidation(this.id);
    });
  }

  loadValidation(id: string) {
    this.backend.getValidation(id).subscribe(result => {
      this.validation = result;
      //console.log(result);
    })
    this.backend.checkExtractionLogExists(id).subscribe(() => this.extractionLogExists = true);
    this.backend.checkClamavLogExists(id).subscribe(() => this.clamavLogExists = true);
    this.backend.checkExecutionLogExists(id).subscribe(() => this.executionLogExists = true);
    this.backend.checkValidationLogTxtExists(id).subscribe(() => this.validationLogTxtExists = true);
    this.backend.checkValidationLogXmlExists(id).subscribe(() => this.validationLogXmlExists = true);
  }

  extractionLogAvailable() {
    if (!this.validation || !this.extractionLogExists) return false;
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

  clamavLogAvailable() {
    if (!this.validation || !this.clamavLogExists) return false;
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

  executionLogAvailable() {
    if (!this.validation || this.executionLogExists) return false;
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
    if (!this.validation || !this.validationLogTxtExists) return false;
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
    if (!this.validation || !this.validationLogXmlExists) return false;
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

  downloadClamavLogTxt() {
    //console.log(this.validation);
    const packageName = this.validation!['packageName'];
    const validationId = this.validation!['id'];
    const url = this.backend.getClamavLogUrl(validationId)
    this.downloadFile(url).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'text/plain' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `clamav_${packageName}_${validationId}_log.txt`
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

  canChangePriority() {
    if (!this.userService.isAdmin() || !this.validation) return false;
    switch (this.validation!['state']) {
      case 'DELETED':
        return false;
      default:
        return true;
    }
  }

  increasePriority() {
    const newPriority = this.validation!['priority'] - 1;
    this.backend.setValidationPriority(this.validation!['id'], newPriority).subscribe(result => {
      const validation = this.validation;
      this.loadValidation(this.validation!['id']);
    });
  }

  decreasePriority() {
    const newPriority = this.validation!['priority'] + 1;
    this.backend.setValidationPriority(this.validation!['id'], newPriority).subscribe(result => {
      const validation = this.validation;
      this.loadValidation(this.validation!['id']);
    });
  }

  canBeCanceled() {
    if (!this.validation) return false;
    if (this.userService.isAdmin() || this.userService.getBackendUser()?.id == this.validation['ownerId']) {
      switch (this.validation!['state']) {
        case 'READY_FOR_EXTRACTION':
        case 'READY_FOR_EXECUTION':
          return true;
        default:
          return false;
      }
    } else {
      return false;
    }
  }

  cancelValidation() {
    this.backend.cancelValidation(this.id).subscribe(result => {
      this.loadValidation(this.id);
    })
  }

}

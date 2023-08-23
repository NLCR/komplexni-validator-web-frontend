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

  maxPackageSizeMB = 13; //MB //TODO: z kvot
  fileSelected: File | undefined;
  note = '';

  schedule(formData: any) {
    console.log("schedule()");
    console.log(formData)

    if (this.formIsValid()) {

      const newFormData = new FormData();
      newFormData.append("file", this.fileSelected!);
      newFormData.append("note", this.note);

      //TODO: dalsi pole z formulare
      newFormData.append("dmf-type", 'mon')
      newFormData.append("preferred-dmf-version", 'mon_1.0')
      newFormData.append("forced-dmf-version", 'mon_1.2')

      this.backend.createValidation(newFormData).subscribe(response => {
        console.log(response);
      })
    }
  }

  packageTooBig() {
    return this.fileSelected && this.getPackageSizeMB()! > this.maxPackageSizeMB;
  }

  getPackageSizeMB() {
    if (this.fileSelected) {
      return Math.round(this.fileSelected.size / 1024 / 1024);
    } else {
      return undefined;
    }
  }

  formIsValid() {
    return this.fileSelected && !this.packageTooBig();
    //TODO: musi byt vyplneny typ DMF
  }

  onFileSelected(event: any) {
    console.log("onFileSelected()");
    const file: File = event.target.files[0];
    this.fileSelected = file;
  }

}

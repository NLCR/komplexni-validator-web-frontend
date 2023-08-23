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

  //file:File = {};
  fileName = '';
  fileSize = 0;
  fileTooBig = false;

  inProgress = false;
  //formData = new FormData();
  //formData : any;


  //fileSelected: File | null = null;
  fileSelected: File | undefined;

  //filesSelected: any;
  note = "blablablba"

  schedule(formData: any) {
    console.log("schedule()");
    console.log(formData)

    const newFormData = new FormData();
    //newFormData.append("file", this.filesSelected[0]);
    newFormData.append("file", this.fileSelected!);
    newFormData.append("note", this.note);
    console.log(newFormData);

    //console.log(this.formData)

    this.backend.createValidation(newFormData).subscribe(response => {
      console.log(response);
    })
  }


  formIsValid() {
    return !this.fileTooBig;
  }

  onFileSelected(event: any) {
    console.log("onFileSelected()");
    const file: File = event.target.files[0];

    this.fileSelected = file;
    //this.filesSelected = event.target.files;

    if (file) {
      console.log(file)
      //this.file = file;
      this.fileSize = file.size;
      this.fileName = file.name;
      this.fileTooBig = file.size > 100 * 1024; //TODO: configurable
    } else {
      this.fileName = '';
      this.fileSize = 0;
      this.fileTooBig = false;
    }
  }

}

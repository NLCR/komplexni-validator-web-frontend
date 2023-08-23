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
    // this.backend.createValidation('666', 1, 'test').subscribe(result => {
    //   console.log(result);
    //   this.router.navigate(['/', 'validations']);
    // })

    this.backend.uploadPackage('666', 'test').subscribe(result => {
      console.log(result);
      this.router.navigate(['/', 'validations']);
    })
  }

  getProgress() {
    //return Math.floor(this.scheduledCounter / this.pidsCounter * 100);
    return 5;
  }

  schedule(formData: any) {
    console.log("schedule()");
    console.log(formData)

    const newFormData = new FormData();
    newFormData.append("file", this.filesSelected[0]);
    newFormData.append("note", this.note);
    console.log(newFormData);

    //console.log(this.formData)

    //this.backend.createValidation(this.formData).subscribe(response => {
      this.backend.createValidation(newFormData).subscribe(response => {
      console.log(response);
    })

    //console.log(this.formData);


    // this.inProgress = true;

    // const pids = this.splitPids(this.pids);
    // this.pidsCounter = pids.length;
    // this.scheduledCounter = 0;

    // const scope = formData.scope;
    // const policy = this.policy;//formData.policy;

    // let requests = [];
    // pids.forEach(pid => {
    //   requests.push(
    //     this.adminApi.scheduleProcess({
    //       defid: 'set_policy',
    //       params: {
    //         scope: scope,
    //         policy: policy,
    //         pid: pid,
    //       }
    //     }, () => this.scheduledCounter++)
    //   );
    // })
    // this.progressBarMode = 'determinate';

    // forkJoin(requests).subscribe(result => {
    //   this.dialogRef.close(this.scheduledCounter);
    // }, error => {
    //   console.log(error);
    //   this.dialogRef.close('error');
    // });
  }

  //file:File = {};
  fileName = '';
  fileTooBig = false;


  inProgress = false;
  //formData = new FormData();
  formData : any;


  fileSelected : File | null = null;

  filesSelected: any;
  note="blablablba"

  onFileSelected(event: any) {
    console.log("onFileSelected()");
    const file: File = event.target.files[0];
    this.filesSelected = event.target.files;

    if (file) {
      console.log(file)
      //this.file = file;
      this.fileName = file.name;
      this.fileTooBig = file.size > 100 * 1024; //TODO: configurable


      //const formData = new FormData();
      this.formData = new FormData();
      //formData.append("file", file);
      this.formData.append("dmf-type", 'mon')
      this.formData.append("preferred-dmf-version", 'mon_1.0')
      this.formData.append("forced-dmf-version", 'mon_1.2')
      this.formData.append("note", 'blabla')
      this.formData.append("file", file);

      this.fileSelected = file;


      console.log(this.formData);

      //this.formData.append("file", file);
      //this.formData.append("prefered-dmf", 'mon_1.2')

      //console.log(this.formData);
      //console.log(formData);

      //const upload$ = this.http.post("/api/thumbnail-upload", formData);
      //upload$.subscribe();


      //TODO: ready pro nahrani

      console.log("onFileSelected() KONEC")
      console.log(this.formData);
      //this.formData = formData;


      // this.backend.createValidation(formData).subscribe(response => {
      //   console.log(response);
      // })

    }

    //TODO
  }

  formIsValid() {
    return !this.fileTooBig;
  }


  // //NEW

  // selectedFile: File | null = null;

  // uploadFile() {
  //   if (this.selectedFile) {
  //     console.log("uploadFile");
  //     const formData2 = new FormData();
  //     formData2.append('file', this.selectedFile);
  //     console.log(formData2)

  //     // this.http.post('your-upload-url', formData)
  //     //   .subscribe(
  //     //     response => {
  //     //       console.log('File uploaded successfully', response);
  //     //       // Handle success
  //     //     },
  //     //     error => {
  //     //       console.error('Error uploading file', error);
  //     //       // Handle error
  //     //     }
  //     //   );
  //   }
  // }

}

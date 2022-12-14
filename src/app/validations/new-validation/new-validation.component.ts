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
  formData = new FormData();

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      console.log(file)
      //this.file = file;
      this.fileName = file.name;
      this.fileTooBig = file.size > 100 * 1024; //TODO: configurable


      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefered-dmf", 'mon_1.2')
      console.log(formData);

      this.formData.append("file", file);
      this.formData.append("prefered-dmf", 'mon_1.2')

      console.log(this.formData);

      //const upload$ = this.http.post("/api/thumbnail-upload", formData);
      //upload$.subscribe();

      this.backend.createValidationTest(formData).subscribe(response => {
        console.log(response);
      })

    }

    //TODO
  }

  formIsValid() {
    return !this.fileTooBig;
  }


}

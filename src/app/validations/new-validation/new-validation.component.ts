import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-validation',
  templateUrl: './new-validation.component.html',
  styleUrls: ['./new-validation.component.scss']
})
export class NewValidationComponent implements OnInit {

  constructor(private backend: BackendService, private router: Router, private snackBar: MatSnackBar, private userService: UserService) { }

  waitingForBackend = false;

  maxPackageSizeMB = 0;

  fileSelected: File | undefined;
  note = '';
  dmfType: string | undefined = undefined
  dmfPreferedVersion: string | undefined = undefined;
  dmfForcedVersion: string | undefined = undefined;

  dmfMonVersions = ['monograph_1.0', 'monograph_1.2', 'monograph_1.3', 'monograph_1.3.1', 'monograph_1.3.2', 'monograph_1.4', 'monograph_2.0'];
  dmfPerVersions = ['periodical_1.4', 'periodical_1.6', 'periodical_1.7', 'periodical_1.7.1', 'periodical_1.8', 'periodical_1.9'];
  dmfAudioFonoVersions = ['audio_fono_0.3'];
  dmfAudioGramVersions = ['audio_gram_0.4', 'audio_gram_0.5'];

  myValidationsActive = 0;
  myValidationsInactive = 0;
  myValidationsDeleted = 0;

  userQuotasReached = false;
  userUnverifiedMaxActiveJobs = 0;
  userUnverifiedMaxInactiveJobs = 0;
  userVerifiedMaxActiveJobs = 0;
  userVerifiedMaxInactiveJobs = 0;

  iAmAdmin = false;
  iAmVerified = false;

  ngOnInit(): void {
    this.waitingForBackend = true;
    this.backend.getQuotas().subscribe(result => {
      console.log(result);
      this.maxPackageSizeMB = result.maxUploadSizeMB;
      this.userUnverifiedMaxActiveJobs = result.userUnverifiedMaxActiveJobs;
      this.userUnverifiedMaxInactiveJobs = result.userUnverifiedMaxInactiveJobs;
      this.userVerifiedMaxActiveJobs = result.userVerifiedMaxActiveJobs;
      this.userVerifiedMaxInactiveJobs = result.userVerifiedMaxInactiveJobs;
      this.backend.getValidationCounters().subscribe(result => {
        console.log(result);
        this.processCounters(result);
        this.waitingForBackend = false;
      });
    });
  }

  schedule() {
    if (this.formIsValid()) {
      const newFormData = new FormData();
      newFormData.append("file", this.fileSelected!);
      if (this.note) {
        newFormData.append("note", this.note!);
      }
      if (this.dmfType) {
        newFormData.append("dmf-type", this.dmfType!)
      }
      if (this.dmfPreferedVersion) {
        newFormData.append("preferred-dmf-version", this.dmfPreferedVersion!);
      }
      if (this.dmfForcedVersion) {
        newFormData.append("forced-dmf-version", this.dmfForcedVersion!);
      }
      this.waitingForBackend = true;
      this.backend.createValidation(newFormData).subscribe(response => {
        //console.log(response);
        this.waitingForBackend = false;
        this.cleanForm();
        const validationId = response['validation-id'];
        this.snackBar.open("Balíček byl nahrán a nova validace naplánována", "Zobrazit", { duration: 15000 }).onAction().subscribe(() => {
          this.router.navigate(['validations', validationId]);
        });
      }, error => {
        console.log(error);
        this.snackBar.open("Chyba při nahrávání balíčku", "Zavřít")
        this.waitingForBackend = false;
      })
    }
  }

  test() {
    this.backend.getValidationCounters().subscribe(result => {
      console.log(result);
    });
  }

  cleanForm() {
    this.fileSelected = undefined;
    this.note = '';
    this.dmfType = undefined;
    this.dmfPreferedVersion = undefined;
    this.dmfForcedVersion = undefined;
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
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileSelected = file;
  }

  onDmfTypeSelected(event: any) {
    this.dmfType = event.value;
    this.dmfPreferedVersion = undefined;
    this.dmfForcedVersion = undefined;
    this.logDmfParams();
  }

  onDmfPreferredVersionSelected(event: any) {
    this.dmfPreferedVersion = event.value;
    this.logDmfParams();
  }

  onDmfForcedVersionSelected(event: any) {
    this.dmfForcedVersion = event.value;
    this.dmfPreferedVersion = undefined;
    this.logDmfParams();
  }

  logDmfParams() {
    console.log(this.dmfType);
    console.log(this.dmfForcedVersion);
    console.log(this.dmfPreferedVersion);
  }

  getAvailableDmfVersions() {
    switch (this.dmfType) {
      case 'mon':
        return this.dmfMonVersions;
      case 'per':
        return this.dmfPerVersions;
      case 'audio_fono':
        return this.dmfAudioFonoVersions;
      case 'audio_gram':
        return this.dmfAudioGramVersions;
      default: return [];
    }
  }

  processCounters(counters: any) {
    //console.log(counters);
    this.myValidationsActive = counters.byActivity.active;
    this.myValidationsInactive = counters.byActivity.inactive;

    //console.log(this.myValidationsActive);
    //console.log(this.myValidationsInactive);
    //console.log(this.myValidationsDeleted);

    const user = this.userService.getBackendUser();
    if (user.admin) {
      this.iAmAdmin = true;
      //nothing, can run as many quotas as possible
    } else if (user.verified) {
      this.iAmVerified = true;
      if (this.myValidationsActive >= this.userVerifiedMaxActiveJobs) {
        this.userQuotasReached = true;
      }
      if (this.myValidationsInactive >= this.userVerifiedMaxInactiveJobs) {
        this.userQuotasReached = true;
      }
    } else {
      if (this.myValidationsActive >= this.userUnverifiedMaxActiveJobs) {
        this.userQuotasReached = true;
      }
      if (this.myValidationsInactive >= this.userUnverifiedMaxInactiveJobs) {
        this.userQuotasReached = true;
      }
    }
  }

}

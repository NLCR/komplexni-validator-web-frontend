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
  maxActivaValidationsForUnverifiedUser = 1;
  maxInactivaValidationsForUnverifiedUser = 10;

  maxActivaValidationsForVerifiedUser = 3;
  maxInactivaValidationsForVerifiedUser = 30;
  iAmAdmin = false;
  iAmVerified = false;

  ngOnInit(): void {
    this.waitingForBackend = true;
    this.backend.getQuotas().subscribe(result => {
      this.maxPackageSizeMB = result.maxUploadSizeMB;
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
    if (counters['READY_FOR_EXTRACTION']) {
      this.myValidationsActive += counters['READY_FOR_EXTRACTION'];
    }
    if (counters['TO_BE_EXTRACTED']) {
      this.myValidationsActive += counters['TO_BE_EXTRACTED'];
    }
    if (counters['EXTRACTING']) {
      this.myValidationsActive += counters['EXTRACTING'];
    }
    if (counters['READY_FOR_EXECUTION']) {
      this.myValidationsActive += counters['READY_FOR_EXECUTION'];
    }
    if (counters['TO_BE_EXECUTED']) {
      this.myValidationsActive += counters['TO_BE_EXECUTED'];
    }
    if (counters['EXECUTING']) {
      this.myValidationsActive += counters['EXECUTING'];
    }


    if (counters['FINISHED']) {
      this.myValidationsInactive += counters['FINISHED'];
    }
    if (counters['ERROR']) {
      this.myValidationsInactive += counters['ERROR'];
    }
    if (counters['CANCELED']) {
      this.myValidationsInactive += counters['CANCELED'];
    }
    if (counters['TO_BE_ARCHIVED']) {
      this.myValidationsInactive += counters['TO_BE_ARCHIVED'];
    }
    if (counters['ARCHIVING']) {
      this.myValidationsInactive += counters['ARCHIVING'];
    }
    if (counters['ARCHIVED']) {
      this.myValidationsInactive += counters['ARCHIVED'];
    }
    if (counters['TO_BE_DELETED']) {
      this.myValidationsInactive += counters['TO_BE_DELETED'];
    }
    if (counters['DELETING']) {
      this.myValidationsInactive += counters['DELETING'];
    }

    if (counters['DELETED']) {
      this.myValidationsDeleted += counters['DELETED'];
    }

    console.log(this.myValidationsActive);
    console.log(this.myValidationsInactive);
    console.log(this.myValidationsDeleted);

    const user = this.userService.getBackendUser();
    if (user.admin) {
      this.iAmAdmin = true;
      //nothing, can run as many quotas as possible
    } else if (user.verified) {
      this.iAmVerified = true;
      if (this.myValidationsActive >= this.maxActivaValidationsForVerifiedUser) {
        this.userQuotasReached = true;
      }
      if (this.myValidationsInactive >= this.maxInactivaValidationsForVerifiedUser) {
        this.userQuotasReached = true;
      }
    } else {
      if (this.myValidationsActive >= this.maxActivaValidationsForUnverifiedUser) {
        this.userQuotasReached = true;
      }
      if (this.myValidationsInactive >= this.maxInactivaValidationsForUnverifiedUser) {
        this.userQuotasReached = true;
      }
    }
  }

}

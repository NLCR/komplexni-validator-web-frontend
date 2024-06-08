import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-validation',
  templateUrl: './validation-package-new.component.html',
  styleUrls: ['./validation-package-new.component.scss']
})
export class ValidationPackageNewComponent implements OnInit {

  constructor(private backend: BackendService, private router: Router, private snackBar: MatSnackBar, private userService: UserService) { }

  waitingForBackend = false;

  maxPackageSizeMB = 0;

  fileSelected: File | undefined;
  note = '';
  dmfType: string | undefined = undefined
  dmfPreferedVersion: string | undefined = undefined;
  dmfForcedVersion: string | undefined = undefined;

  file2Selected: File | undefined;
  
  dmfMonVersions = ['monograph_1.0', 'monograph_1.2', 'monograph_1.3', 'monograph_1.3.1', 'monograph_1.3.2', 'monograph_1.4', 'monograph_2.0', 'monograph_2.1'];
  dmfPerVersions = ['periodical_1.4', 'periodical_1.6', 'periodical_1.7', 'periodical_1.7.1', 'periodical_1.8', 'periodical_1.9', 'periodical_2.0'];
  dmfAudioFonoVersions = ['audio_fono_0.3'];
  dmfAudioGramVersions = ['audio_gram_0.3', 'audio_gram_0.4', 'audio_gram_0.5'];

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

  dmfPartialType: string | undefined = undefined
  dmfPartialVersion: string | undefined = undefined;
  dmfPartialProfileType: string | undefined = undefined;

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
        newFormData.append("preferred-dmf-version", this.dmfPreferedVersion!.split('_')[1]);
      }
      if (this.dmfForcedVersion) {
        newFormData.append("forced-dmf-version", this.dmfForcedVersion!.split('_')[1]);
      }
      this.waitingForBackend = true;
      this.backend.createValidation(newFormData).subscribe(response => {
        this.waitingForBackend = false;
        this.cleanForm();
        const validationId = response['validation-id'];
        this.snackBar.open("Balíček byl nahrán a nova validace naplánována", "Zobrazit", { duration: 15000 }).onAction().subscribe(() => {
          this.router.navigate(['validations', 'package', validationId]);
        });
      }, error => {
        console.log(error);
        this.snackBar.open("Chyba při nahrávání balíčku", "Zavřít")
        this.waitingForBackend = false;
      })
    }
  }

  schedule2() {
    if (this.form2IsValid()) {
      const newFormData = new FormData();
      newFormData.append("file", this.file2Selected!);
      
      console.log(this.dmfPartialType);
      console.log(this.dmfPartialVersion);
      console.log(this.dmfPartialProfileType);

      newFormData.append("metadata-profile-id", this.dmfPartialVersion + ":" + this.dmfPartialProfileType);
      console.log(newFormData);

      this.waitingForBackend = true;
      this.backend.createPartialValidation(newFormData).subscribe(response => {
        this.waitingForBackend = false;
        // this.cleanForm2();
        // const validationId = response['validation-id'];
        // this.snackBar.open("Balíček byl nahrán a nova validace naplánována", "Zobrazit", { duration: 15000 }).onAction().subscribe(() => {
        //   this.router.navigate(['validations', validationId]);
        // });
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

  cleanForm2() {
    this.file2Selected = undefined;
    this.dmfPartialType = undefined;
    this.dmfPartialVersion = undefined;
    this.dmfPartialProfileType = undefined;
  }

  packageTooBig() {
    return this.fileSelected && this.getPackageSizeMB()! > this.maxPackageSizeMB;
  }

  package2TooBig() {
    return this.file2Selected && this.getPackageSizeMB()! > this.maxPackageSizeMB;
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

  form2IsValid() {
    return this.file2Selected && this.dmfPartialType && this.dmfPartialVersion && this.dmfPartialProfileType && !this.package2TooBig();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileSelected = file;
  }

  onFile2Selected(event: any) {
    const file: File = event.target.files[0];
    this.file2Selected = file;
  }

  onDmfTypeSelected(event: any) {
    this.dmfType = event.value;
    this.dmfPreferedVersion = undefined;
    this.dmfForcedVersion = undefined;
    //this.logDmfParams();
  }

  onPartialDmfTypeSelected(event: any) {
    this.dmfPartialType = event.value;
    this.dmfPartialVersion = undefined;
    this.dmfPartialProfileType = undefined;
    //this.logDmfParams();
  }

  onDmfPreferredVersionSelected(event: any) {
    this.dmfPreferedVersion = event.value;
    //this.logDmfParams();
  }

  onDmfForcedVersionSelected(event: any) {
    this.dmfForcedVersion = event.value;
    this.dmfPreferedVersion = undefined;
    //this.logDmfParams();
  }

  onPartialDmfVersionSelected(event: any) {
    this.dmfPartialVersion = event.value;
    this.dmfPartialProfileType = undefined;
    //this.logDmfParams();
  }

  onPartialDmfProfileTypeSelected(event: any) {
    this.dmfPartialProfileType = event.value;
    //this.logDmfParams();
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
      case 'adf':
        return this.dmfAudioFonoVersions;
      case 'adg':
        return this.dmfAudioGramVersions;
      default: return [];
    }
  }

  getAvailableDmfPartialVersions() {
    switch (this.dmfPartialType) {
      case 'mon':
        return this.dmfMonVersions;
      case 'per':
        return this.dmfPerVersions;
      case 'adf':
        return this.dmfAudioFonoVersions;
      case 'adg':
        return this.dmfAudioGramVersions;
      default: return [];
    }
  }

  getAvailableDmfPartialProfileTypes() {
    switch (this.dmfPartialVersion) {
      case 'monograph_1.0':
        return [...this.generateBiblioProfiles(
          ['internalpart_chapter', 'internalpart_picture', 'supplement', 'volume']),
        ...['mix_mc', 'mix_ps', 'premis_agent', 'premis_event', 'premis_object_alto', 'premis_object_mc', 'premis_object_ps',].map(item => "tech:" + item)].sort();
      case 'monograph_1.2':
        return [...this.generateBiblioProfiles(
          ['internalpart_chapter', 'internalpart_picture', 'supplement', 'title', 'volume_cartographic', 'volume_graphic', 'volume_multivolume', 'volume_sheetmusic', 'volume_singlevolume']),
        ...['copyrightmd', 'mix_mc', 'mix_ps', 'premis_agent', 'premis_event', 'premis_object_alto', 'premis_object_mc', 'premis_object_ps',].map(item => "tech:" + item)].sort();
      case 'monograph_1.3':
      case 'monograph_1.3.1':
      case 'monograph_1.3.2':
      case 'monograph_1.4':
      case 'monograph_2.0':
      case 'monograph_2.1':
        return [...this.generateBiblioProfiles(
          ['internalpart_chapter', 'internalpart_picture', 'page', 'supplement', 'title', 'volume_cartographic', 'volume_graphic', 'volume_multivolume', 'volume_sheetmusic', 'volume_singlevolume']),
        ...['copyrightmd', 'mix_mc', 'mix_ps', 'premis_agent', 'premis_event', 'premis_object_alto', 'premis_object_mc', 'premis_object_ps',].map(item => "tech:" + item)].sort();
      case 'periodical_1.4':
        return [...this.generateBiblioProfiles(
          ['internalpart_article', 'internalpart_picture', 'issue', 'supplement', 'title', 'volume']),
        ...['mix_mc', 'mix_ps', 'premis_agent', 'premis_event', 'premis_object_alto', 'premis_object_mc', 'premis_object_ps',].map(item => "tech:" + item)].sort();
      case 'periodical_1.6':
        return [...this.generateBiblioProfiles(
          ['internalpart_article', 'internalpart_picture', 'issue', 'supplement', 'title', 'volume']),
        ...['copyrightmd', 'mix_mc', 'mix_ps', 'premis_agent', 'premis_event', 'premis_object_alto', 'premis_object_mc', 'premis_object_ps',].map(item => "tech:" + item)].sort();
      case 'periodical_1.7':
      case 'periodical_1.7.1':
      case 'periodical_1.8':
      case 'periodical_1.9':
      case 'periodical_2.0':
        return [...this.generateBiblioProfiles(
          ['internalpart_article', 'internalpart_picture', 'issue', 'page', 'supplement', 'title', 'volume']),
        ...['copyrightmd', 'mix_mc', 'mix_ps', 'premis_agent', 'premis_event', 'premis_object_alto', 'premis_object_mc', 'premis_object_ps',].map(item => "tech:" + item)].sort();
      case 'audio_fono_0.3':
        return [...this.generateBiblioProfiles(
          ['soundcollection', 'soundpart', 'soundrecording', 'supplement']),
        ...['copyrightmd', 'mix_mc', 'mix_ps', 'premis_agent', 'premis_event', 'premis_object_alto', 'premis_object_mc', 'premis_object_ps',].map(item => "tech:" + item)].sort();
      case 'audio_gram_0.3':
      case 'audio_gram_0.4':
      case 'audio_gram_0.5':
        return [...this.generateBiblioProfiles(
          ['soundcollection', 'soundpart', 'soundrecording', 'supplement']),
        ...['copyrightmd', 'mix_mc', 'mix_ps', 'premis_agent', 'premis_event', 'premis_object_alto', 'premis_object_mc', 'premis_object_ps',].map(item => "tech:" + item)].sort();
      default: return [];
    }
  }

  generateBiblioProfiles(biblioBasic: string[]): string[] {
    let prefixes = ['biblio:mods', 'biblio:dc'];
    let suffixes = ['rda', 'aacr2'];
    let values: string[] = [];

    biblioBasic.forEach(item => {
      prefixes.forEach(prefix => {
        suffixes.forEach(suffix => {
          values.push(`${prefix}:${item}_${suffix}`);
        });
      });
    });
    return values;
  }

  processCounters(counters: any) {
    //console.log(counters);
    this.myValidationsActive = counters.byActivity.active;
    this.myValidationsInactive = counters.byActivity.inactive;

    //console.log(this.myValidationsActive);
    //console.log(this.myValidationsInactive);
    //console.log(this.myValidationsDeleted);

    if (this.userService.isAdmin()) {
      this.iAmAdmin = true;
      //nothing, can run as many quotas as possible
    } else if (this.userService.isVerified()) {
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

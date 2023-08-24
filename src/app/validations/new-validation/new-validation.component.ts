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


  ngOnInit(): void {
    this.waitingForBackend = true;
    this.backend.getQuotas().subscribe(result => {
      console.log(result);
      this.maxPackageSizeMB = result.max_package_size_mb;
      this.waitingForBackend = false;
      //TODO: zjistit pocet mojich aktivnich validaci a podle toho omezit
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
      this.backend.createValidation(newFormData).subscribe(response => {
        console.log(response);
        //TODO: route
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

}

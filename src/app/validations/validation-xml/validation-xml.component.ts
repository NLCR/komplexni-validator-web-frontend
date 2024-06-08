import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-validation-xml',
  templateUrl: './validation-xml.component.html',
  styleUrls: ['./validation-xml.component.scss']
})
export class ValidationXmlComponent {

  constructor(private backend: BackendService, private router: Router, private snackBar: MatSnackBar, private userService: UserService) { }

  waitingForBackend = false;

  maxPackageSizeMB = 10;//HARDCODED

  fileSelected: File | undefined;

  dmfMonVersions = ['monograph_1.0', 'monograph_1.2', 'monograph_1.3', 'monograph_1.3.1', 'monograph_1.3.2', 'monograph_1.4', 'monograph_2.0', 'monograph_2.1'];
  dmfPerVersions = ['periodical_1.4', 'periodical_1.6', 'periodical_1.7', 'periodical_1.7.1', 'periodical_1.8', 'periodical_1.9', 'periodical_2.0'];
  dmfAudioFonoVersions = ['audio_fono_0.3'];
  dmfAudioGramVersions = ['audio_gram_0.3', 'audio_gram_0.4', 'audio_gram_0.5'];

  dmfPartialType: string | undefined = undefined
  dmfPartialVersion: string | undefined = undefined;
  dmfPartialProfileType: string | undefined = undefined;

  validationResult: string[] | undefined = undefined;

  ngOnInit(): void {
    // this.validationResult = [
    //   "Validating against profile periodical_1.7:biblio:dc:internalpart_picture_aacr2 file /tmp/4bf1636e-1590-4ffe-8d1e-337815242274-input.xml",
    //   "ERROR: /oai_dc:dc: nenalezen očekávaný povinný element 'dc:title': Očekáván povinný element dc:title obsahující název, podnázev, nebo číslo obrazu.",
    //   "ERROR: /oai_dc:dc: nenalezen očekávaný povinný element 'dc:type[text() = 'model:internalpart']': Očekáván povinný element dc:type obsahující text 'model:internalpart'.",
    //   "WARNING: /oai_dc:dc: nalezen neočekávaný element 'dc:source' ",
    //   "WARNING: /oai_dc:dc: nalezen neočekávaný element 'dc:source' ",
    //   "WARNING: /oai_dc:dc: nalezen neočekávaný element 'dc:language' ",
    //   "WARNING: /oai_dc:dc: nalezen neočekávaný element 'dc:date' ",
    //   "WARNING: /oai_dc:dc: nalezen neočekávaný element 'dc:publisher' ",
    //   "WARNING: /oai_dc:dc: nalezen neočekávaný element 'dc:type' ",
    //   "INFO: /oai_dc:dc: toto je info zpráva",
    //   "INFO: /oai_dc:dc:další info zpráva",
    // ];
  }

  validate() {
    if (this.formIsValid()) {
      const newFormData = new FormData();
      newFormData.append("file", this.fileSelected!);
      newFormData.append("metadata-profile-id", this.dmfPartialVersion + ":" + this.dmfPartialProfileType);
      //console.log(newFormData);
      this.waitingForBackend = true;
      this.validationResult = undefined;
      this.backend.createPartialValidation(newFormData).subscribe(response => {
        this.waitingForBackend = false;
        this.validationResult = response.messages;
        // this.cleanForm();
        this.snackBar.open("Validace byla dokončena", "Zavřít", { duration: 3000 });
      }, error => {
        console.log(error);
        this.snackBar.open("Chyba při validování XML", "Zavřít", { duration: 10000 })
        this.waitingForBackend = false;
      })
    }
  }

  cleanForm() {
    this.fileSelected = undefined;
    this.dmfPartialType = undefined;
    this.dmfPartialVersion = undefined;
    this.dmfPartialProfileType = undefined;
  }

  formIsValid() {
    return this.fileSelected && this.dmfPartialType && this.dmfPartialVersion && this.dmfPartialProfileType && !this.packageTooBig();
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

  onPartialDmfTypeSelected(event: any) {
    this.dmfPartialType = event.value;
    this.dmfPartialVersion = undefined;
    this.dmfPartialProfileType = undefined;
  }

  onPartialDmfVersionSelected(event: any) {
    this.dmfPartialVersion = event.value;
    this.dmfPartialProfileType = undefined;
  }

  //TODO: remove
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

  onPartialDmfProfileTypeSelected(event: any) {
    this.dmfPartialProfileType = event.value;
    //this.logDmfParams();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileSelected = file;
  }

  getResultLinceClass(line: string): string {
    if (line.startsWith('ERROR')) {
      return 'app-page-validation-xml-new-result-line-error';
    } else if (line.startsWith('WARNING')) {
      return 'app-page-validation-xml-new-result-line-warning';
    } else if (line.startsWith('INFO')) {
      return 'app-page-validation-xml-new-result-line-info';
    }
    return '';
  }

}

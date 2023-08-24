import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-quota-dialog',
  templateUrl: './change-quota-dialog.component.html',
  styleUrls: ['./change-quota-dialog.component.scss']
})
export class ChangeQuotaDialogComponent {

  constructor(public dialogRef: MatDialogRef<ChangeQuotaDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  newValue: number = this.data?.quotaValue;

  getQuotaId() {
    return this.data?.quotaId;
  }

  getQuotaValue() {
    return this.data?.quotaValue;
  }

  valueChanged() {
    return this.newValue != this.getQuotaValue();
  }

  save() {
    this.data.quotaValue = this.newValue;
    this.dialogRef.close(this.data);
  }

  getQuotaName() {
    const quotaId = this.getQuotaId();
    switch (quotaId) {
      case 'maxUploadSizeMB':
        return 'Maximální velikost nahrávaného balíčku (v MB)';
      case 'timeToArchiveValidationH':
        return 'Čas do archivace validace (v hodinách)';
      case 'timeToDeleteValidationH':
        return 'Čas do smazání validace (v hodinách)';
      case 'maxParallelJobs':
        return 'Maximální počet současně běžících procesů'
      case 'maxParallelValidationJobs':
        return 'Maximální počet současně běžících procesů VALIDACE'
      case 'maxParallelExtractionJobs':
        return 'Maximální počet současně běžících procesů EXTRAKCE'
      case 'maxParallelDeletionJobs':
        return 'Maximální počet současně běžících procesů MAZÁNÍ'
      case 'maxParallelArchivationJobs':
        return 'Maximální počet současně běžících procesů ARCHIVACE'
      default:
        return quotaId;
    }
  }

  getNote() {
    const quotaId = this.getQuotaId();
    switch (quotaId) {
      case 'maxUploadSizeMB':
        return 'Balíček přesahující tuto velikost nebude možné nahrát.';
      case 'timeToArchiveValidationH':
        return 'Jakmile uběhne tato doba od ukončení Validace (stavy FINISHED, ERROR, CANCELED) bude spuštěn proces archivace této Validace, za předpokladu volného slotu pro nový proces ARCHIVACE.';
      case 'timeToDeleteValidationH':
        return 'Jakmile uběhne tato doba od dokončení archivace Validace, bude spuštěn proces archivace této Validace, za předpokladu volného slotu pro nový proces MAZÁNÍ.';
      case 'maxParallelJobs':
        return 'Nový proces bude spouštěn, pokud počet aktuálně běžících procesů je menší než hodnota tohoto parametru. Neboli je volný slot pro nový proces.'
      case 'maxParallelValidationJobs':
        return 'Nový proces VALIDACE bude spouštěn, pokud počet aktuálně běžících procesů typu VALIDACE je menší než hodnota tohoto parametru. A zároveň je volný slot pro nový proces.'
      case 'maxParallelExtractionJobs':
        return 'Nový proces EXTRAKCE bude spouštěn, pokud počet aktuálně běžících procesů typu EXTRAKCE je menší než hodnota tohoto parametru. A zároveň je volný slot pro nový proces.'
      case 'maxParallelDeletionJobs':
        return 'Nový proces MAZÁNÍ bude spouštěn, pokud počet aktuálně běžících procesů typu MAZÁNÍ je menší než hodnota tohoto parametru. A zároveň je volný slot pro nový proces.'
      case 'maxParallelArchivationJobs':
        return 'Nový proces ARCHIVACE bude spouštěn, pokud počet aktuálně běžících procesů typu ARCHIVACE je menší než hodnota tohoto parametru. A zároveň je volný slot pro nový proces.'
      default:
        return quotaId;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeQuotaDialogComponent } from './change-quota-dialog/change-quota-dialog.component';

export interface Quota {
  name: string;
  value: number;
}

@Component({
  selector: 'app-quotas',
  templateUrl: './quotas.component.html',
  styleUrls: ['./quotas.component.scss']
})
export class QuotasComponent implements OnInit {

  quotas = {};

  quotasArray: any[] = []

  displayedColumns: string[] = ['key', 'value', 'editButton']; //poradi sloupcu v tabulce

  constructor(private backend: BackendService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadQuotas();
  }

  openUpdateQuotaDialog(quota: any) {
    this.openDialog('0.2s', '0.2s', quota);
  }


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, quota: any): void {
    const dialogRef = this.dialog.open(ChangeQuotaDialogComponent, {
      maxWidth: '25vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        quotaId: quota['key'],
        quotaValue: quota['value']
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.backend.setQuota(result.quotaId, result.quotaValue).subscribe(result => {
          this.loadQuotas();
        });
      }
    });
  }

  loadQuotas() {
    this.backend.getQuotas().subscribe(result => {
      this.quotas = result;
      //console.log(result);
      this.quotasArray = Object.keys(result).map(key => ({ key, value: result[key] })).sort((a, b) => a.key.localeCompare(b.key));
      //console.log(this.quotasArray);
    })
  }

  getQuotas() {
    let result = [];
    for (const [key, value] of Object.entries(this.quotas)) {
      result.push([key, value]);
    }
    return result;
  }

  incrementQuota(quota: any, value: any) {
    const newValue = parseInt(value) + 1;
    this.backend.setQuota(quota, newValue).subscribe(result => {
      this.loadQuotas();
    });
  }

  decrementQuota(quota: any, value: any) {
    const newValue = parseInt(value) - 1;
    if (newValue >= 0) {
      this.backend.setQuota(quota, newValue).subscribe(result => {
        this.loadQuotas();
      });
    }
  }

  formatValue(quota: any) {
    switch (quota.key) {
      case 'maxUploadSizeMB':
        return quota.value + ' MB';
      case 'timeToArchiveValidationH':
      case 'timeToDeleteValidationH':
        return quota.value + '  hodin';
      default:
        return quota.value;
    }
  }

  translateQuotaName(id: string) {
    // switch (id) {
    //   case 'maxUploadSizeMB':
    //     return 'Maximální velikost nahrávaného balíčku';
    //   case 'timeToArchiveValidationH':
    //     return 'Čas do archivace validace';
    //   case 'timeToDeleteValidationH':
    //     return 'Čas do smazání validace';
    //   case 'maxParallelJobs':
    //     return 'Maximální počet současně běžících procesů (celkem)'
    //   case 'maxParallelValidationJobs':
    //     return 'Maximální počet současně běžících procesů (validace)'
    //   case 'maxParallelExtractionJobs':
    //     return 'Maximální počet současně běžících procesů (rozbalování ZIPů)'
    //   case 'maxParallelDeletionJobs':
    //     return 'Maximální počet současně běžících procesů (mazání archivovaných validací)'
    //   case 'maxParallelArchivationJobs':
    //     return 'Maximální počet současně běžících procesů (archivace validací)'
    //   default:
    //     return id;
    // }
    switch (id) {
      case 'maxUploadSizeMB':
        return 'Maximální velikost nahrávaného balíčku';
      case 'timeToArchiveValidationH':
        return 'Čas do archivace validace';
      case 'timeToDeleteValidationH':
        return 'Čas do smazání validace';
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

      case 'userUnverifiedMaxActiveJobs':
        return 'Neověřený uživatel: Maximální počet aktivních procesů'
      case 'userUnverifiedMaxInactiveJobs':
        return 'Neověřený uživatel: Maximální počet neaktivních procesů'
      case 'userVerifiedMaxActiveJobs':
        return 'Ověřený uživatel: Maximální počet aktivních procesů'
      case 'userVerifiedMaxInactiveJobs':
        return 'Ověřený uživatel: Maximální počet neaktivních procesů'

      default:
        return id;
    }
  }

}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-quota-dialog',
  templateUrl: './change-quota-dialog.component.html',
  styleUrls: ['./change-quota-dialog.component.scss']
})
export class ChangeQuotaDialogComponent {

  constructor(public dialogRef: MatDialogRef<ChangeQuotaDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  //TODO: dialog

  onNoClick(): void {
    console.log("onNoClick()");
    this.dialogRef.close();
  }

  getQuotaId() {
    return this.data?.quotaId;
  }

  getQuotaValue() {
    return this.data?.quotaValue;
  }

  incrementAndSave() {
    console.log("save()");
    console.log(this.data.quotaId, this.data.quotaValue + 1);
    this.data.quotaValue++;
    this.dialogRef.close(this.data);
  }

  decrementAndSave() {
    console.log("save()");
    console.log(this.data.quotaId, this.data.quotaValue - 1);
    this.data.quotaValue--;
    this.dialogRef.close(this.data);
  }

}

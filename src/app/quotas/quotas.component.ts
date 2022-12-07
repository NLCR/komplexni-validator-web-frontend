import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-quotas',
  templateUrl: './quotas.component.html',
  styleUrls: ['./quotas.component.scss']
})
export class QuotasComponent implements OnInit {

  quotas = {};

  constructor(private backend: BackendService) { }

  ngOnInit(): void {
    this.loadQuotas();
  }

  loadQuotas() {
    this.backend.getQuotas().subscribe(result => {
      this.quotas = result;
    })
  }

  getQuotas() {
    let result = [];
    for (const [key, value] of Object.entries(this.quotas)) {
      result.push([key, value]);
    }
    return result;
  }

  changeQuota(quota: any, value: any) {
    console.log('TODO: update ' + quota + ", current value: " + value);
  }

}

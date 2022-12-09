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

}

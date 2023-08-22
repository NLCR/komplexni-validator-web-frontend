import { Component, Injectable, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = `První stránka`;
  itemsPerPageLabel = `Validací na stránku:`;
  lastPageLabel = `Poslední stránka`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Další stránka';
  previousPageLabel = 'Predchozí stránka';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Stránka 1 z 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Stránka ${page + 1} z ${amountPages}`;
  }
}

@Component({
  selector: 'app-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['./validations.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class ValidationsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'packageName', 'dmfType', 'owner', 'state', 'packageSize', 'priority', 'tsCreated', 'tsEnded']; //poradi sloupcu v tabulce

  validations: [] = [];
  validationsInTable = []

  paginatorLength = 50;
  paginatorPageSize = 20;
  paginatorPageIndex = 0;

  handlePageEvent(event: any) {
    console.log(event);
    const paginator = event;
    this.validationsInTable = this.extractSubarray(this.validations, event.pageIndex, event.pageSize);
  }

  extractSubarray(dataArray: [], pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return dataArray.slice(startIndex, endIndex);
  }

  constructor(private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.loadValidations();
  }

  loadValidations() {
    this.backend.getValidations().subscribe(result => {
      this.validations = result;
      this.validationsInTable = this.extractSubarray(result, this.paginatorPageIndex, this.paginatorPageSize);
      console.log(result);
    })
  }

  reloadValidations() {
    this.loadValidations();
  }

  routeToNewValidationForm() {
    this.router.navigate(['/', 'validations', 'new']);
  }

  routeToValidation(id: string) {
    //this.router.navigate(['/', 'validations', id]);
    this.router.navigate(['/', 'validations', id]);
  }

  cancelValidation(validation: any) {
    this.backend.cancelValidation(validation.id).subscribe(result => {
      this.loadValidations();
    })
  }


}

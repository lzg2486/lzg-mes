import { Component } from '@angular/core';

interface ReviewRecord {
  id: number;
  dispatchNo: string;
  reportQty: number;
  processNo1: string;
  reviewNo: string;
  actualPercent: number | string;
  needQc: boolean;
  qcDone: boolean;
  productionOrder: string;
  checked?: boolean;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  searchOrderNo = '';
  searchMaterial = '';

  listOfData: ReviewRecord[] = [
    { id: 1, dispatchNo: '0000001889', reportQty: 10, processNo1: '0000002265', reviewNo: '0000004367', actualPercent: 4, needQc: false, qcDone: false, productionOrder: '20000130' },
    { id: 2, dispatchNo: '0000001890', reportQty: 10, processNo1: '0000002264', reviewNo: '0000004366', actualPercent: 4, needQc: false, qcDone: false, productionOrder: '20000130' },
    { id: 3, dispatchNo: '0000001890', reportQty: 0, processNo1: '0000002263', reviewNo: '0000004365', actualPercent: 4, needQc: false, qcDone: false, productionOrder: '20000130' },
    { id: 4, dispatchNo: '0000001887', reportQty: 7, processNo1: '0000002262', reviewNo: '0000004364', actualPercent: 0, needQc: true, qcDone: true, productionOrder: '25000341' },
    { id: 5, dispatchNo: '0000001886', reportQty: 8, processNo1: '0000002261', reviewNo: '0000004363', actualPercent: 0, needQc: true, qcDone: true, productionOrder: '25000341' },
    { id: 6, dispatchNo: '0000001885', reportQty: 10, processNo1: '0000002260', reviewNo: '0000004362', actualPercent: 0, needQc: true, qcDone: true, productionOrder: '25000341' },
    { id: 7, dispatchNo: '0000001884', reportQty: 10, processNo1: '0000002259', reviewNo: '0000004361', actualPercent: 0, needQc: true, qcDone: true, productionOrder: '25000341' },
    { id: 8, dispatchNo: '0000001883', reportQty: 10, processNo1: '0000002258', reviewNo: '0000004360', actualPercent: 0, needQc: true, qcDone: true, productionOrder: '25000341' },
    { id: 9, dispatchNo: '0000001882', reportQty: 2, processNo1: '0000002257', reviewNo: '0000004359', actualPercent: 0, needQc: true, qcDone: true, productionOrder: '2500' },
    { id: 10, dispatchNo: '0000001881', reportQty: 1, processNo1: '0000002256', reviewNo: '0000004358', actualPercent: 0, needQc: true, qcDone: true, productionOrder: '25000129' }
  ];

  checked = false;
  indeterminate = false;

  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(item => (item.checked = checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(_id: number, _checked: boolean): void {
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const allChecked = this.listOfData.every(item => item.checked);
    const someChecked = this.listOfData.some(item => item.checked);
    this.checked = allChecked;
    this.indeterminate = !allChecked && someChecked;
  }
}

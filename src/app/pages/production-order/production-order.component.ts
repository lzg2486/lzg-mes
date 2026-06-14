import { Component } from '@angular/core';

interface ProductionOrder {
  id: number;
  orderNo: string;
  materialNo: string;
  drawingNo: string;
  materialDesc: string;
  qcFlag: number;
  inspectBatch: string;
  quantity: number;
  planner: number;
  dispatcher: number | null;
  factory: number;
  orderType: string;
  checked?: boolean;
}

@Component({
  selector: 'app-production-order',
  templateUrl: './production-order.component.html',
  styleUrls: ['./production-order.component.css']
})
export class ProductionOrderComponent {
  // Tab 切换
  activeTab = 'MES';

  // 搜索条件
  searchOrderNo = '';
  searchMaterialNo = '';

  // 表格数据
  listOfData: ProductionOrder[] = [
    { id: 1, orderNo: '20000129810', materialNo: '21BCH5400000', drawingNo: '', materialDesc: '两端预热加热装置', qcFlag: 0, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 2, orderNo: '20000129804', materialNo: '21BBG4320000', drawingNo: '', materialDesc: '内框纸输送轮装置', qcFlag: 0, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 3, orderNo: '20000129799', materialNo: '21BBG4320000', drawingNo: '', materialDesc: '内框纸输送轮装置', qcFlag: 0, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 4, orderNo: '00000115414', materialNo: '21BBH5700000', drawingNo: '700.43.002', materialDesc: '商标纸折前角撑开装置', qcFlag: 31000010333, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 5, orderNo: '00000107670', materialNo: '21BBH5700000', drawingNo: '700.43.002', materialDesc: '商标纸折前角撑开装置', qcFlag: 31000006943, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 6, orderNo: '00000000484', materialNo: '21BBH5700000', drawingNo: '700.43.002', materialDesc: '商标纸折前角撑开装置', qcFlag: 31000002977, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 7, orderNo: '10000010281', materialNo: '21BBG4320000', drawingNo: '', materialDesc: '内框纸输送轮装置', qcFlag: 0, inspectBatch: '', quantity: 5, planner: 200, dispatcher: 400, factory: 2000, orderType: 'ZP10' }
  ];

  // 选中的数据
  selectedData: Set<number> = new Set();
  checked = false;
  indeterminate = false;

  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(item => (item.checked = checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      this.selectedData.add(id);
    } else {
      this.selectedData.delete(id);
    }
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const allChecked = this.listOfData.every(item => item.checked !== false && item.checked);
    const someChecked = this.listOfData.some(item => item.checked);
    this.checked = allChecked;
    this.indeterminate = !allChecked && someChecked;
  }
}

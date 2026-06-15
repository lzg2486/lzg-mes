import { Component } from '@angular/core';

interface WorkOrder {
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
  productionMode: string;  // 生产模式
  checked?: boolean;
}

@Component({
  selector: 'app-work-order-dispatch',
  templateUrl: './work-order-dispatch.component.html',
  styleUrls: ['./work-order-dispatch.component.css']
})
export class WorkOrderDispatchComponent {
  // Tab 切换
  activeTab = 'MES';

  // 搜索栏展开/收起
  searchExpanded = false;

  // 搜索条件
  searchOrderNo = '';
  searchMaterialNo = '';
  searchProcessNo = '';
  searchWorkCenter = '';
  searchSortString = '';
  searchDeliveryDate = '';

  toggleSearch(): void {
    this.searchExpanded = !this.searchExpanded;
  }

  resetSearch(): void {
    this.searchOrderNo = '';
    this.searchMaterialNo = '';
    this.searchProcessNo = '';
    this.searchWorkCenter = '';
    this.searchSortString = '';
    this.searchDeliveryDate = '';
  }

  // 表格滚动高度：展开/收起自适应
  get scrollY(): string {
    return this.searchExpanded ? 'calc(100vh - 320px)' : 'calc(100vh - 270px)';
  }

  // 表格数据
  listOfData: WorkOrder[] = [
    { id: 1, orderNo: '0000001981', materialNo: '21BAH2660000', drawingNo: '', materialDesc: '两端预热加热装置', qcFlag: 0, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '' },
    { id: 2, orderNo: '0000001980', materialNo: '21BAH2660000', drawingNo: '', materialDesc: '内框纸输送轮装置', qcFlag: 0, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '约料' },
    { id: 3, orderNo: '0000001979', materialNo: '21BAH2660000', drawingNo: '', materialDesc: '内框纸输送轮装置', qcFlag: 0, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '' },
    { id: 4, orderNo: '0000001978', materialNo: '21BAH2660000', drawingNo: '700.43.002', materialDesc: '商标纸折前角撑开装置', qcFlag: 31000010333, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '约料' },
    { id: 5, orderNo: '0000001977', materialNo: '21BAH2660000', drawingNo: '700.43.002', materialDesc: '商标纸折前角撑开装置', qcFlag: 31000006943, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '' },
    { id: 6, orderNo: '0000001976', materialNo: '21BAH2660000', drawingNo: '700.43.002', materialDesc: '商标纸折前角撑开装置', qcFlag: 31000002977, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '约料' },
    { id: 7, orderNo: '0000001975', materialNo: '21BAH2660000', drawingNo: '', materialDesc: '内框纸输送轮装置', qcFlag: 0, inspectBatch: '', quantity: 5, planner: 200, dispatcher: 400, factory: 2000, orderType: 'ZP10', productionMode: '' },
    { id: 8, orderNo: '0000001974', materialNo: '21BCH5400001', drawingNo: '', materialDesc: '烟支切割装置', qcFlag: 0, inspectBatch: '31000011234', quantity: 2, planner: 201, dispatcher: 401, factory: 2000, orderType: 'ZP12', productionMode: '约料' },
    { id: 9, orderNo: '0000001973', materialNo: '21BCH5400002', drawingNo: '800.12.001', materialDesc: '滤嘴接装装置', qcFlag: 31000011235, inspectBatch: '', quantity: 3, planner: 202, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '' },
    { id: 10, orderNo: '0000001972', materialNo: '21BBH5700001', drawingNo: '700.43.003', materialDesc: '小盒包装机模块', qcFlag: 0, inspectBatch: '31000011236', quantity: 1, planner: 200, dispatcher: 402, factory: 2000, orderType: 'ZP10', productionMode: '约料' },
    { id: 11, orderNo: '0000001971', materialNo: '21BBH5700002', drawingNo: '', materialDesc: '条盒透明纸包装装置', qcFlag: 31000011237, inspectBatch: '', quantity: 4, planner: 203, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '' },
    { id: 12, orderNo: '0000001970', materialNo: '21BBG4320001', drawingNo: '800.15.001', materialDesc: '铝箔纸输送装置', qcFlag: 0, inspectBatch: '', quantity: 2, planner: 201, dispatcher: 401, factory: 2000, orderType: 'ZP12', productionMode: '约料' },
    { id: 13, orderNo: '0000001969', materialNo: '21BBG4320002', drawingNo: '', materialDesc: '烟支储存输送系统', qcFlag: 0, inspectBatch: '31000011238', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP10', productionMode: '' },
    { id: 14, orderNo: '0000001964', materialNo: '21BCH5400003', drawingNo: '700.43.004', materialDesc: '商标纸涂胶装置', qcFlag: 31000011239, inspectBatch: '', quantity: 3, planner: 204, dispatcher: 403, factory: 2000, orderType: 'ZP12', productionMode: '约料' },
    { id: 15, orderNo: '0000001958', materialNo: '21BCH5400004', drawingNo: '', materialDesc: '干燥鼓轮装置', qcFlag: 0, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12', productionMode: '' },
    { id: 16, orderNo: '0000001957', materialNo: '21BBH5700003', drawingNo: '800.15.002', materialDesc: '烟包输出通道', qcFlag: 31000011240, inspectBatch: '31000011240', quantity: 2, planner: 202, dispatcher: 404, factory: 2000, orderType: 'ZP12', productionMode: '约料' },
  ];

  // 选中的勾选状态
  checked = false;
  indeterminate = false;

  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(item => {
      // 约料数据不允许勾选
      if (item.productionMode !== '约料') {
        item.checked = checked;
      }
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(_id: number, _checked: boolean): void {
    this.refreshCheckedStatus();
  }

  // 判断是否允许勾选
  canCheck(item: WorkOrder): boolean {
    return item.productionMode !== '约料';
  }

  refreshCheckedStatus(): void {
    const allChecked = this.listOfData.every(item => item.checked);
    const someChecked = this.listOfData.some(item => item.checked);
    this.checked = allChecked;
    this.indeterminate = !allChecked && someChecked;
  }
}

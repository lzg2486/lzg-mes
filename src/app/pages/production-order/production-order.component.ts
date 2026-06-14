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
    { id: 7, orderNo: '10000010281', materialNo: '21BBG4320000', drawingNo: '', materialDesc: '内框纸输送轮装置', qcFlag: 0, inspectBatch: '', quantity: 5, planner: 200, dispatcher: 400, factory: 2000, orderType: 'ZP10' },
    { id: 8, orderNo: '20000129811', materialNo: '21BCH5400001', drawingNo: '', materialDesc: '烟支切割装置', qcFlag: 0, inspectBatch: '31000011234', quantity: 2, planner: 201, dispatcher: 401, factory: 2000, orderType: 'ZP12' },
    { id: 9, orderNo: '20000129812', materialNo: '21BCH5400002', drawingNo: '800.12.001', materialDesc: '滤嘴接装装置', qcFlag: 31000011235, inspectBatch: '', quantity: 3, planner: 202, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 10, orderNo: '20000129813', materialNo: '21BBH5700001', drawingNo: '700.43.003', materialDesc: '小盒包装机模块', qcFlag: 0, inspectBatch: '31000011236', quantity: 1, planner: 200, dispatcher: 402, factory: 2000, orderType: 'ZP10' },
    { id: 11, orderNo: '20000129814', materialNo: '21BBH5700002', drawingNo: '', materialDesc: '条盒透明纸包装装置', qcFlag: 31000011237, inspectBatch: '', quantity: 4, planner: 203, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 12, orderNo: '00000115415', materialNo: '21BBG4320001', drawingNo: '800.15.001', materialDesc: '铝箔纸输送装置', qcFlag: 0, inspectBatch: '', quantity: 2, planner: 201, dispatcher: 401, factory: 2000, orderType: 'ZP12' },
    { id: 13, orderNo: '00000115416', materialNo: '21BBG4320002', drawingNo: '', materialDesc: '烟支储存输送系统', qcFlag: 0, inspectBatch: '31000011238', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP10' },
    { id: 14, orderNo: '10000010282', materialNo: '21BCH5400003', drawingNo: '700.43.004', materialDesc: '商标纸涂胶装置', qcFlag: 31000011239, inspectBatch: '', quantity: 3, planner: 204, dispatcher: 403, factory: 2000, orderType: 'ZP12' },
    { id: 15, orderNo: '10000010283', materialNo: '21BCH5400004', drawingNo: '', materialDesc: '干燥鼓轮装置', qcFlag: 0, inspectBatch: '', quantity: 1, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 16, orderNo: '20000129815', materialNo: '21BBH5700003', drawingNo: '800.15.002', materialDesc: '烟包输出通道', qcFlag: 31000011240, inspectBatch: '31000011240', quantity: 2, planner: 202, dispatcher: 404, factory: 2000, orderType: 'ZP12' },
    { id: 17, orderNo: '20000129816', materialNo: '21BBH5700004', drawingNo: '', materialDesc: '缺支检测装置', qcFlag: 0, inspectBatch: '', quantity: 6, planner: 203, dispatcher: null, factory: 2000, orderType: 'ZP10' },
    { id: 18, orderNo: '00000115417', materialNo: '21BBG4320003', drawingNo: '700.43.005', materialDesc: '水松纸切纸鼓轮', qcFlag: 31000011241, inspectBatch: '', quantity: 1, planner: 200, dispatcher: 401, factory: 2000, orderType: 'ZP12' },
    { id: 19, orderNo: '00000115418', materialNo: '21BCH5400005', drawingNo: '', materialDesc: '搓接成型装置', qcFlag: 0, inspectBatch: '31000011242', quantity: 2, planner: 204, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 20, orderNo: '10000010284', materialNo: '21BCH5400006', drawingNo: '800.15.003', materialDesc: '烟支分离传送装置', qcFlag: 31000011243, inspectBatch: '', quantity: 1, planner: 201, dispatcher: 402, factory: 2000, orderType: 'ZP12' },
    { id: 21, orderNo: '10000010285', materialNo: '21BBH5700005', drawingNo: '', materialDesc: '商标纸折后角撑开装置', qcFlag: 0, inspectBatch: '', quantity: 3, planner: 200, dispatcher: 403, factory: 2000, orderType: 'ZP10' },
    { id: 22, orderNo: '20000129817', materialNo: '21BBH5700006', drawingNo: '700.43.006', materialDesc: '烟包提升装置', qcFlag: 31000011244, inspectBatch: '31000011244', quantity: 1, planner: 203, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 23, orderNo: '20000129818', materialNo: '21BBG4320004', drawingNo: '', materialDesc: '空头检测剔除装置', qcFlag: 0, inspectBatch: '', quantity: 4, planner: 202, dispatcher: 404, factory: 2000, orderType: 'ZP12' },
    { id: 24, orderNo: '00000115419', materialNo: '21BCH5400007', drawingNo: '800.15.004', materialDesc: '条盒成型通道', qcFlag: 31000011245, inspectBatch: '', quantity: 2, planner: 200, dispatcher: null, factory: 2000, orderType: 'ZP12' },
    { id: 25, orderNo: '10000010286', materialNo: '21BCH5400008', drawingNo: '', materialDesc: '封签粘贴装置', qcFlag: 0, inspectBatch: '31000011246', quantity: 1, planner: 204, dispatcher: 401, factory: 2000, orderType: 'ZP10' },
  ];

  // 选中的勾选状态
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

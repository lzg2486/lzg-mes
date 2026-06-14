import { Component } from '@angular/core';

interface WorkOrder {
  id: number;
  workNo: string;
  materialNo: string;
  drawingNo: string;
  materialDesc: string;
  quantity: number;
  planner: number;
  dispatcher: number | null;
  factory: number;
  wbsElement: string;
  productionMode: string;      // 生产模式：约料 / -
  isMaterialReserved: boolean;  // 是否约料（checkbox置灰）
  checked?: boolean;
  switchOn?: boolean;
}

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.css']
})
export class WorkOrderComponent {
  activeView = 'order';
  searchOrderNo = '';
  searchMaterialNo = '';

  /** 约料订单号集合（通过约料管理流程发料的订单） */
  private readonly RESERVED_ORDERS = new Set([
    '20000130748', '20000130749', '20000130750', '20000130751', '20000130752'
  ]);

  listOfData: WorkOrder[] = [
    { id: 1, workNo: '20000130423', materialNo: '21BAH2660000', drawingNo: '', materialDesc: '一号轮箱杆支座', quantity: 1, planner: 200, dispatcher: null, factory: 2000, wbsElement: 'Z-2000_20336ZJ02', productionMode: '-', isMaterialReserved: false },
    { id: 2, workNo: '20000130730', materialNo: '72BAH220001016', drawingNo: '', materialDesc: '第一推进器', quantity: 1, planner: 200, dispatcher: null, factory: 2000, wbsElement: 'Z-2000_20311ZJ01', productionMode: '-', isMaterialReserved: false },
    { id: 3, workNo: '20000130736', materialNo: '72BAH220001016', drawingNo: '', materialDesc: '第一推进器', quantity: 1, planner: 200, dispatcher: null, factory: 2000, wbsElement: 'Z-2000_20311ZJ01', productionMode: '-', isMaterialReserved: false },
    { id: 4, workNo: '20000130743', materialNo: '72BAH220001016', drawingNo: '', materialDesc: '第一推进器', quantity: 1, planner: 200, dispatcher: null, factory: 2000, wbsElement: 'Z-2000_20311ZJ01', productionMode: '-', isMaterialReserved: false },
    { id: 5, workNo: '20000130744', materialNo: '72BAH220001016', drawingNo: '', materialDesc: '第一推进器', quantity: 1, planner: 200, dispatcher: null, factory: 2000, wbsElement: 'Z-2000_20311ZJ01', productionMode: '-', isMaterialReserved: false },
    { id: 6, workNo: '20000130749', materialNo: '21BAH2660000', drawingNo: '', materialDesc: '一号轮箱杆支座', quantity: 2, planner: 200, dispatcher: null, factory: 2000, wbsElement: '', productionMode: '约料', isMaterialReserved: true },
    { id: 7, workNo: '20000130750', materialNo: '21BAH2660000', drawingNo: '', materialDesc: '一号轮箱杆支座', quantity: 3, planner: 200, dispatcher: null, factory: 2000, wbsElement: '', productionMode: '约料', isMaterialReserved: true },
    { id: 8, workNo: '2500034143', materialNo: '1EED21007800', drawingNo: '741.10.0006', materialDesc: '连杆（智能制造）', quantity: 15, planner: 100, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false },
    { id: 9, workNo: '2500034168', materialNo: '1BBH55501100', drawingNo: '700.40.1974_C', materialDesc: '块（智能制造）', quantity: 10, planner: 100, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false },
    { id: 10, workNo: '2500034171', materialNo: '1BCS12006700', drawingNo: '750.05.0081_D', materialDesc: '连杆（智能制造）', quantity: 10, planner: 100, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false },
    { id: 11, workNo: '2500034182', materialNo: '11BGG3340300', drawingNo: '', materialDesc: '中向摩擦（智能制造）', quantity: 10, planner: 400, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false },
    { id: 12, workNo: '2500034183', materialNo: '1BBG31500100', drawingNo: '', materialDesc: '固定架（智能制造）', quantity: 10, planner: 400, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false },
    { id: 13, workNo: '2500034184', materialNo: '1CBG22001400', drawingNo: '', materialDesc: '连杆（智能制造）', quantity: 10, planner: 400, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false },
    { id: 14, workNo: '2500034185', materialNo: '1BGG58000900', drawingNo: '', materialDesc: '连杆（智能制造）', quantity: 10, planner: 400, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false },
    { id: 15, workNo: '2500034186', materialNo: '1BCH62001400', drawingNo: '', materialDesc: '支架（智能制造）', quantity: 10, planner: 400, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false },
    { id: 16, workNo: '2500034187', materialNo: '3CBG33420900', drawingNo: '', materialDesc: '支架（智能制造）', quantity: 10, planner: 400, dispatcher: 300, factory: 2000, wbsElement: 'Z-2000_2014_001', productionMode: '-', isMaterialReserved: false }
  ];

  checked = false;
  indeterminate = false;

  onAllChecked(checked: boolean): void {
    // 约料订单不可勾选，跳过
    this.listOfData.forEach(item => {
      if (!item.isMaterialReserved) {
        item.checked = checked;
      }
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(_id: number, _checked: boolean): void {
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const selectable = this.listOfData.filter(item => !item.isMaterialReserved);
    const allChecked = selectable.every(item => item.checked);
    const someChecked = this.listOfData.some(item => item.checked);
    this.checked = allChecked;
    this.indeterminate = !allChecked && someChecked;
  }
}

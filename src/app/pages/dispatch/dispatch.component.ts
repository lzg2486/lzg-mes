import { Component } from '@angular/core';

interface DispatchRecord {
  id: number;
  dispatchNo: string;
  directDispatchNo: string;
  productionOrder: string;
  worker: string;
  quantity: number;
  scrapPending: boolean;
  status: string;
  statusColor: string;
  checked?: boolean;
}

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})
export class DispatchComponent {
  // 搜索条件
  searchOrderNo = '';
  searchMaterialNo = '';

  // 表格数据
  listOfData: DispatchRecord[] = [
    { id: 1, dispatchNo: '0000001985', directDispatchNo: '0000001898', productionOrder: '20000130758', worker: '4730-俞国生 ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '暂存', statusColor: '#faad14' },
    { id: 2, dispatchNo: '0000001982', directDispatchNo: '0000001897', productionOrder: '20000130757', worker: '4730-俞国生 ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '初始', statusColor: '#ff4d4f' },
    { id: 3, dispatchNo: '0000001983', directDispatchNo: '0000001896', productionOrder: '20000130757', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '暂存', statusColor: '#faad14' },
    { id: 4, dispatchNo: '0000001986', directDispatchNo: '0000001896', productionOrder: '20000130758', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '暂存', statusColor: '#faad14' },
    { id: 5, dispatchNo: '0000001987', directDispatchNo: '0000001895', productionOrder: '20000130758', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '初始', statusColor: '#ff4d4f' },
    { id: 6, dispatchNo: '0000001984', directDispatchNo: '0000001894', productionOrder: '20000130757', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '初始', statusColor: '#ff4d4f' },
    { id: 7, dispatchNo: '0000001968', directDispatchNo: '0000001893', productionOrder: '20000130758', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '暂存', statusColor: '#faad14' },
    { id: 8, dispatchNo: '0000001967', directDispatchNo: '0000001892', productionOrder: '20000130758', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '完成', statusColor: '#52c41a' },
    { id: 9, dispatchNo: '0000001966', directDispatchNo: '0000001891', productionOrder: '20000130757', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '初始', statusColor: '#ff4d4f' },
    { id: 10, dispatchNo: '0000001965', directDispatchNo: '0000001890', productionOrder: '20000130757', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '完成', statusColor: '#52c41a' }
  ];

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

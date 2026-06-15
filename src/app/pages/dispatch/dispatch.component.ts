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
  productionMode: string;       // 生产模式：约料 / -
  isMaterialReserved: boolean;   // 是否约料（checkbox置灰）
  checked?: boolean;
}

/** 按直接派工单号分组的行数据 */
interface GroupedRow {
  directDispatchNo: string;
  records: DispatchRecord[];
  expanded: boolean;
  index: number;
}

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})
export class DispatchComponent {
  searchOrderNo = '';
  searchMaterialNo = '';

  /** 约料订单号集合 */
  private readonly RESERVED_ORDERS = new Set([
    '20000130758', '20000130757'
  ]);

  listOfData: DispatchRecord[] = [
    { id: 1, dispatchNo: '0000001985', directDispatchNo: '0000001898', productionOrder: '20000130758', worker: '4730-俞国生 ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '暂存', statusColor: '#faad14', productionMode: '约料', isMaterialReserved: true },
    { id: 2, dispatchNo: '0000001982', directDispatchNo: '0000001897', productionOrder: '20000130757', worker: '4730-俞国生 ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '初始', statusColor: '#ff4d4f', productionMode: '约料', isMaterialReserved: true },
    { id: 3, dispatchNo: '0000001983', directDispatchNo: '0000001896', productionOrder: '20000130757', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '暂存', statusColor: '#faad14', productionMode: '约料', isMaterialReserved: true },
    { id: 4, dispatchNo: '0000001986', directDispatchNo: '0000001896', productionOrder: '20000130758', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '暂存', statusColor: '#faad14', productionMode: '约料', isMaterialReserved: true },
    { id: 5, dispatchNo: '0000001987', directDispatchNo: '0000001895', productionOrder: '20000130758', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '初始', statusColor: '#ff4d4f', productionMode: '约料', isMaterialReserved: true },
    { id: 6, dispatchNo: '0000001984', directDispatchNo: '0000001894', productionOrder: '20000130757', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '初始', statusColor: '#ff4d4f', productionMode: '约料', isMaterialReserved: true },
    { id: 7, dispatchNo: '0000001968', directDispatchNo: '0000001893', productionOrder: '20000130758', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '暂存', statusColor: '#faad14', productionMode: '约料', isMaterialReserved: true },
    { id: 8, dispatchNo: '0000001967', directDispatchNo: '0000001892', productionOrder: '20000130758', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '完成', statusColor: '#52c41a', productionMode: '-', isMaterialReserved: false },
    { id: 9, dispatchNo: '0000001966', directDispatchNo: '0000001891', productionOrder: '20000130757', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '初始', statusColor: '#ff4d4f', productionMode: '约料', isMaterialReserved: true },
    { id: 10, dispatchNo: '0000001965', directDispatchNo: '0000001890', productionOrder: '20000130757', worker: 'ADMIN_MES-MES系统管理员', quantity: 10, scrapPending: true, status: '完成', statusColor: '#52c41a', productionMode: '约料', isMaterialReserved: true }
  ];

  /** 分组后的表格数据 */
  groupedRows: GroupedRow[] = [];

  ngOnInit(): void {
    this.groupByDirectDispatchNo();
  }

  /** 按直接派工单号分组 */
  private groupByDirectDispatchNo(): void {
    const map = new Map<string, DispatchRecord[]>();
    this.listOfData.forEach(item => {
      if (!map.has(item.directDispatchNo)) map.set(item.directDispatchNo, []);
      map.get(item.directDispatchNo)!.push(item);
    });
    let idx = 1;
    this.groupedRows = Array.from(map.entries()).map(([directDispatchNo, records]) => ({
      directDispatchNo,
      records,
      expanded: false,
      index: idx++
    }));
  }

  toggleExpand(row: GroupedRow): void {
    row.expanded = !row.expanded;
  }

  checked = false;
  indeterminate = false;

  get allRecords(): DispatchRecord[] {
    return this.groupedRows.flatMap(g => g.records);
  }

  onAllChecked(checked: boolean): void {
    this.allRecords.forEach(item => {
      if (!item.isMaterialReserved) item.checked = checked;
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(_id: number, _checked: boolean): void {
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const selectable = this.allRecords.filter(item => !item.isMaterialReserved);
    const allChecked = selectable.every(item => item.checked);
    const someChecked = this.allRecords.some(item => item.checked);
    this.checked = allChecked;
    this.indeterminate = !allChecked && someChecked;
  }
}

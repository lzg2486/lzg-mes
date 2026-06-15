import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

// 派工单行数据（父级行：预制派工单级别）
export interface DispatchAssignRow {
  id: number;
  checked: boolean;
  workCenterId: string | null;
  workCenterName: string;
  workCenterLabel: string;   // 完整标签
  productionCount: number;
  qualityCheck: boolean;
  dispatchNo: string;
  partCode: string;
  processNo: string;         // 工序号
  wbs: string;               // WBS
}

// 展示行（工单明细级别，由父级展开）
export interface WorkOrderDisplayRow {
  id: number;
  parentId: number;          // 关联的父级行 id
  checked: boolean;
  dispatchNo: string;        // 预制派工单号
  workCenterId: string | null;
  workCenterName: string;
  workCenterLabel: string;
  productionCount: number;
  qualityCheck: boolean;
  workOrderNos: string[];    // 工单号列表
  orderNo: string;
  partCode: string;
  wbs: string;
  processNo: string;
  quantity: number;
}

// 人员数据
interface Person {
  empNo: string;
  name: string;
  team: string;
  selected: boolean;
}

// 备选工单池行
interface BackupRow {
  id: number;
  dispatchNo: string;       // 预制派工单号（同父级）
  workCenterLabel: string;   // 加工中心+工位
  orderNo: string;           // 生产订单号
  partCode: string;          // 部件编码
  wbs: string;               // WBS
  processNo: string;         // 工序号
  quantity: number;          // 加工数量
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-dispatch-assign',
  templateUrl: './dispatch-assign.component.html',
  styleUrls: ['./dispatch-assign.component.css']
})
export class DispatchAssignComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private message = inject(NzMessageService);

  // 面包屑：当前选中的预派工单（null=全部）
  selectedDispatchFilter: string | null = null;

  // 计算每个已勾选预派工单的明细数量（按工单明细去重后计数）
  get dispatchOrderItems(): { dispatchNo: string; deptName: string; count: number }[] {
    return this.rows.filter(r => r.checked).map(r => ({
      dispatchNo: r.dispatchNo,
      deptName: '总装制造中心（西）',
      count: this._getDedupedDetailRows(r).length,
    }));
  }

  // 所有勾选预派工单的明细总数
  get totalDispatchCount(): number {
    return this.dispatchOrderItems.reduce((sum, item) => sum + item.count, 0);
  }

  // 当前筛选下的展示行数（与备选池 currentFilteredCount 对齐）
  get filteredDisplayCount(): number {
    if (!this.selectedDispatchFilter) return this._displayRows.length;
    return this._displayRows.filter(r => r.dispatchNo === this.selectedDispatchFilter).length;
  }

  // 当前备选池中的实际条数
  get currentFilteredCount(): number {
    if (!this.selectedDispatchFilter) return this.backupRows.length;
    return this.backupRows.filter(r => r.dispatchNo === this.selectedDispatchFilter).length;
  }

  /** 备选抽屉标题（含部门） */
  get backupDrawerTitle(): string {
    if (this.selectedDispatchFilter) {
      const item = this.rows.find(r => r.dispatchNo === this.selectedDispatchFilter);
      return `备选加工单 - ${this.selectedDispatchFilter} 总装制造中心（西）`;
    }
    return '备选加工单 - 全部预派工单';
  }

  /** 展示行缓存：将已勾选父级行展开为工单明细行 */
  private _displayRows: WorkOrderDisplayRow[] = [];

  get displayRows(): WorkOrderDisplayRow[] {
    return this._displayRows;
  }

  /**
   * 重建展示行（当 rows 或 selectedDispatchFilter 变化时调用）
   * 保留已有行的 checked 和 workCenter 状态
   */
  private _rebuildDisplayRows(): void {
    const oldMap = new Map<number, WorkOrderDisplayRow>();
    for (const old of this._displayRows) {
      oldMap.set(old.id, old);
    }

    const result: WorkOrderDisplayRow[] = [];
    let idCounter = Date.now();

    let parentItems = this.rows.filter(r => r.checked);
    if (this.selectedDispatchFilter) {
      parentItems = parentItems.filter(r => r.dispatchNo === this.selectedDispatchFilter);
    }

    for (const item of parentItems) {
      const deduped = this._getDedupedDetailRows(item);
      // 为该父级行生成工单号列表
      const workOrderNos: string[] = deduped.map((d, i) => `20000130${String(750 + i + 1).padStart(3, '0')}`);
      
      const newId = ++idCounter;
      // 尝试复用旧行的用户编辑状态
      const oldRow = [...oldMap.values()].find(old =>
        old.parentId === item.id
      );
      result.push({
        id: newId,
        parentId: item.id,
        checked: oldRow ? oldRow.checked : true,
        dispatchNo: item.dispatchNo,
        workCenterId: oldRow ? oldRow.workCenterId : item.workCenterId,
        workCenterName: oldRow ? oldRow.workCenterName : item.workCenterName,
        workCenterLabel: oldRow ? oldRow.workCenterLabel : (item.workCenterLabel || '-'),
        productionCount: oldRow ? oldRow.productionCount : item.productionCount,
        qualityCheck: oldRow ? oldRow.qualityCheck : item.qualityCheck,
        workOrderNos: workOrderNos,
        orderNo: deduped[0]?.orderNo || '',
        partCode: item.partCode,
        wbs: item.wbs,
        processNo: item.processNo,
        quantity: deduped.reduce((sum, d) => sum + d.quantity, 0),
      });
    }
    this._displayRows = result;
  }

  get allDisplayRowsChecked(): boolean {
    const list = this._displayRows;
    return list.length > 0 && list.every(r => r.checked);
  }

  onAllDisplayRowChecked(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    for (const row of this._displayRows) {
      row.checked = checked;
    }
    this._syncParentCheckFromDisplay();
  }

  onDisplayRowChecked(_rowId: number): void {
    this._syncParentCheckFromDisplay();
  }

  /** 根据展示行勾选状态同步父级行 */
  private _syncParentCheckFromDisplay(): void {
    for (const parent of this.rows) {
      const children = this._displayRows.filter(r => r.parentId === parent.id);
      parent.checked = children.length > 0 && children.every(c => c.checked);
    }
  }

  // ---- 左侧：人员选择 ----
  personSearch = '';
  personTab: 'all' | 'selected' = 'all';

  persons: Person[] = [
    { empNo: '6129', name: '毛荣魁', team: '常日班', selected: false },
    { empNo: '4592', name: '周亮', team: '24小时空运转', selected: false },
    { empNo: '4730', name: '俞闰生', team: '等工测试20201110', selected: true },
    { empNo: '4720', name: '沈文杰', team: '常日班', selected: false },
    { empNo: '4612', name: '应晔', team: '等工测试日历', selected: false },
    { empNo: '2723', name: '顾志伟', team: '常日班', selected: false },
    { empNo: '4677', name: '陈国歆', team: '常日班', selected: false },
    { empNo: '4789', name: '庞源', team: '常日班', selected: false },
    { empNo: '4824', name: '李聪', team: '常日班', selected: false },
    { empNo: '6157', name: '姜群', team: '常日班', selected: false },
    { empNo: '9334', name: '苏士伟', team: '24小时空运转', selected: false },
    { empNo: '2631', name: '周俊', team: '常日班', selected: false },
    { empNo: '6048', name: '陆建平', team: '常日班', selected: false },
  ];

  get filteredPersons(): Person[] {
    let list = this.persons;
    if (this.personSearch) {
      const kw = this.personSearch.toLowerCase();
      list = list.filter(p => p.empNo.includes(kw) || p.name.toLowerCase().includes(kw));
    }
    if (this.personTab === 'selected') {
      list = list.filter(p => p.selected);
    }
    return list;
  }

  togglePerson(person: Person): void {
    if (this.personTab === 'selected' && !person.selected) return;
    person.selected = !person.selected;
  }

  cancelSelection(): void {
    this.persons.forEach(p => { if (!['6129','4592'].includes(p.empNo)) p.selected = false; });
  }

  // ---- 右侧：工作中心分配 ----
  totalWorkCenter: string | null = null;
  lockWorkCenter = false;

  workCenterOptions = [
    { label: 'X2D04-电气工位4', value: 'X2D04' },
    { label: 'X2D03-电气工位3', value: 'X2D03' },
    { label: 'X2D02-电气工位2', value: 'X2D02' },
    { label: 'X2D01-电气工位1', value: 'X2D01' },
    { label: 'X2B11-装配工位11', value: 'X2B11' },
    { label: 'X2D06-电气工位6', value: 'X2D06' },
    { label: 'X2B12-装配工位12', value: 'X2B12' },
    { label: 'X2D05-电气工位5', value: 'X2D05' },
    { label: 'D4-总装工位', value: 'D4' },
    { label: 'D6-总装工位', value: 'D6' },
  ];

  // 从上一页勾选传入的预派工单（默认全部打勾禁用）
  rows: DispatchAssignRow[] = [];

  ngOnInit(): void {
    // 从路由参数或 sessionStorage 获取上一页勾选的数据
    const raw = sessionStorage.getItem('dispatchAssignData');
    if (raw) {
      const data = JSON.parse(raw);
      this.rows = data.map((item: any) => {
        const wcLabel = item.workCenter ? (this.workCenterOptions.find(w => w.value === item.workCenter)?.label || '') : '';
        return {
          id: item.id,
          checked: true,
          workCenterId: item.workCenter || null,
          workCenterName: wcLabel,
          workCenterLabel: wcLabel,
          productionCount: item.productionCount || 1,
          qualityCheck: false,
          dispatchNo: item.dispatchNo,
          partCode: item.partCode,
          processNo: item.processNo || '',
          wbs: item.wbs || '',
        };
      });
    } else {
      // 无参数时的默认演示数据（从约料管理勾选的已发料记录）
      this.rows = [
        { id: 6, checked: true, workCenterId: 'X2D01', workCenterName: 'X2D01-电气工位1', workCenterLabel: 'X2D01-电气工位1', productionCount: 1, qualityCheck: false, dispatchNo: '2000YPG25072900010', partCode: '21BAH2660000', processNo: '0070', wbs: 'Z-2000_20336ZJ01' },
        { id: 9, checked: true, workCenterId: 'D6', workCenterName: 'D6-总装工位', workCenterLabel: 'D6-总装工位', productionCount: 3, qualityCheck: false, dispatchNo: '2000YPG26012600004', partCode: '21BBH5700002', processNo: '0030', wbs: '20400' },
      ];
    }
    this._rebuildDisplayRows();
  }

  autoFill(): void {
    const target = this.totalWorkCenter;
    if (!target) return;
    const wc = this.workCenterOptions.find(w => w.value === target);
    for (const item of this.rows) {
      if (item.checked) {
        item.workCenterId = target;
        item.workCenterName = wc?.label || '';
        item.workCenterLabel = wc?.label || '';
      }
    }
  }

  clearWorkCenters(): void {
    for (const item of this.rows) {
      if (item.checked) { item.workCenterId = null; item.workCenterName = ''; item.workCenterLabel = ''; }
    }
  }

  /** 面包屑筛选切换（重建展示行） */
  selectFilter(val: string | null): void {
    this.selectedDispatchFilter = val;
    this._rebuildDisplayRows();
  }

  /** 展示行修改加工中心时，同步到同父级行的所有子行 */
  onDisplayWorkCenterChange(displayRow: WorkOrderDisplayRow): void {
    const parent = this.rows.find(r => r.id === displayRow.parentId);
    if (!parent) return;
    parent.workCenterId = displayRow.workCenterId;
    parent.workCenterName = displayRow.workCenterName;
    // 同步到同级所有展示行
    const wc = this.workCenterOptions.find(w => w.value === displayRow.workCenterId);
    const label = wc?.label || '';
    for (const dr of this._displayRows.filter(r => r.parentId === displayRow.parentId)) {
      dr.workCenterId = displayRow.workCenterId;
      dr.workCenterName = label;
      dr.workCenterLabel = label;
    }
  }

  // ---- 底部操作栏 ----
  linkAgv = true;
  addShift = false;
  linkMode = true;
  parallel = false;
  priority: 'low' | 'medium' | 'high' = 'medium';
  machineCount = 1;

  // ---- 备选工单池 ----
  backupRows: BackupRow[] = [];
  backupDrawerVisible = false;

  viewBackup(_filterDispatchNo?: string | null): void {
    this.backupDrawerVisible = true;
  }

  _togglePriority(row: BackupRow): void {
    const map: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const idx = map.indexOf(row.priority);
    row.priority = map[(idx + 1) % map.length];
  }

  _priorityText(p: string): string {
    return p === 'high' ? '高' : p === 'medium' ? '中' : '低';
  }

  _removeBackupRow(rowId: number): void {
    const idx = this.backupRows.findIndex(r => r.id === rowId);
    if (idx >= 0) this.backupRows.splice(idx, 1);
  }

  _saveBackup(): void {
    this.message.success('已保存备选工单');
    this.backupDrawerVisible = false;
  }

  _saveAndSendBackup(): void {
    this.message.success('已保存并下发备选工单');
    this.backupDrawerVisible = false;
  }

  addToBackup(): void {
    const newRows = this.generateBackupData(this.selectedDispatchFilter);
    if (newRows.length === 0) {
      this.message.warning('当前筛选下无可用记录');
      return;
    }
    // 去重：已存在于备选池的不再添加
    const existingKeys = new Set(this.backupRows.map(r => `${r.dispatchNo}|${r.orderNo}|${r.partCode}|${r.wbs}|${r.processNo}`));
    const toAdd = newRows.filter(r => !existingKeys.has(`${r.dispatchNo}|${r.orderNo}|${r.partCode}|${r.wbs}|${r.processNo}`));
    if (toAdd.length === 0) {
      this.message.info('所选记录已全部在备选池中');
      return;
    }
    // 生成新数据追加到备选池
    this.backupRows.push(...toAdd);
    this.message.success(`已添加 ${toAdd.length} 条到备选工单池`);
  }

  /** 根据当前勾选的行生成备选子项，使用与约料管理工单明细相同的数据源并可筛选 */
  private generateBackupData(filterDispatchNo?: string | null): BackupRow[] {
    const rows: BackupRow[] = [];
    let idCounter = Date.now();

    let items = this.rows.filter(r => r.checked);
    if (filterDispatchNo) {
      items = items.filter(r => r.dispatchNo === filterDispatchNo);
    }

    for (const item of items) {
      // 使用与约料管理工单明细相同的数据生成 + 去重逻辑
      const deduped = this._getDedupedDetailRows(item);
      for (const d of deduped) {
        rows.push({
          id: ++idCounter,
          dispatchNo: item.dispatchNo,
          workCenterLabel: item.workCenterLabel || '-',
          orderNo: d.orderNo,
          partCode: d.partCode,
          wbs: d.wbs,
          processNo: d.processNo,
          quantity: d.quantity,
          priority: 'medium',
        });
      }
    }
    return rows;
  }

  /** 与约料管理 getMockDetailRows 完全相同的数据生成逻辑 */
  private _getDetailRows(item: DispatchAssignRow): { orderNo: string; materialCode: string; materialName: string; partCode: string; partName: string; wbs: string; processNo: string; quantity: number }[] {
    const baseRows = [
      { orderNo: '20000130748', materialCode: '361080131201', materialName: '平垫圈Φ20.1xΦ32×3Fe/Ct.obk', partCode: item.partCode, partName: '一号轮推杆支座', wbs: 'K181A', processNo: item.processNo, quantity: 5 },
      { orderNo: '20000130748', materialCode: '361080131202', materialName: '平垫圈Φ20.2xΦ33×3Fe/Ct.obk', partCode: item.partCode, partName: '一号轮推杆支座', wbs: 'K181A', processNo: item.processNo, quantity: 6 },
      { orderNo: '20000130749', materialCode: '361080131203', materialName: '平垫圈Φ20.3xΦ34×3Fe/Ct.obk', partCode: item.partCode + '-A', partName: '二号轮推杆支座', wbs: 'K181B', processNo: item.processNo, quantity: 10 },
      { orderNo: '20000130750', materialCode: '361080131204', materialName: '平垫圈Φ20.4xΦ35×3Fe/Ct.obk', partCode: item.partCode, partName: '一号轮推杆支座', wbs: 'K181C', processNo: item.processNo, quantity: 12 },
      { orderNo: '20000130751', materialCode: '361080131205', materialName: '平垫圈Φ20.5xΦ36×3Fe/Ct.obk', partCode: item.partCode + '-B', partName: '三号轮推杆支座', wbs: 'K181D', processNo: item.processNo, quantity: 15 },
      { orderNo: '20000130752', materialCode: '361080131206', materialName: '平垫圈Φ20.6xΦ37×3Fe/Ct.obk', partCode: item.partCode + '-C', partName: '四号轮推杆支座', wbs: 'K181E', processNo: item.processNo, quantity: 18 },
    ];
    // 不同预制派工单展示不同数量的明细
    const countMap: Record<string, number> = {
      '2000YPG26041300001': 8,
      '2000YPG25072900010': 12,
      '2000YPG26012600004': 6,
    };
    const targetCount = countMap[item.dispatchNo] || baseRows.length;
    const result = baseRows.slice(0, targetCount);
    // 扩展数据
    let idx = baseRows.length;
    while (result.length < targetCount) {
      result.push({
        orderNo: `20000130${String(753 + idx).padStart(2, '0')}`,
        materialCode: `361080131${String(207 + idx).padStart(3, '0')}`,
        materialName: `平垫圈Φ20.${7 + idx}xΦ${38 + idx}×3Fe/Ct.obk`,
        partCode: `${item.partCode}-${String.fromCharCode(65 + idx % 5)}`,
        partName: `${['一号', '二号', '三号', '四号', '五号'][idx % 5]}轮推杆支座`,
        wbs: `K18${String(1 + idx % 9).padStart(2, '0')}${String.fromCharCode(65 + idx % 6)}`,
        processNo: item.processNo,
        quantity: 20 + idx * 3,
      });
      idx++;
    }
    return result;
  }

  /** 按工单明细去重（与约料管理 openPartOrder 逻辑一致：orderNo+partCode+wbs+processNo） */
  private _getDedupedDetailRows(item: DispatchAssignRow): { orderNo: string; partCode: string; wbs: string; processNo: string; quantity: number }[] {
    const detailRows = this._getDetailRows(item);
    const seen = new Map<string, { orderNo: string; partCode: string; wbs: string; processNo: string; quantity: number }>();
    for (const d of detailRows) {
      const key = `${d.orderNo}|${d.partCode}|${d.wbs}|${d.processNo}`;
      if (!seen.has(key)) {
        seen.set(key, {
          orderNo: d.orderNo,
          partCode: d.partCode,
          wbs: d.wbs,
          processNo: d.processNo,
          quantity: d.quantity,
        });
      }
    }
    return Array.from(seen.values());
  }

  goBack(): void {
    sessionStorage.removeItem('dispatchAssignData');
    this.router.navigate(['/material-dispatch']);
  }
}

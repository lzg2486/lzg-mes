import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

interface MaterialDispatch {
  id: number;
  dispatchNo: string;       // 预派工单号
  partCode: string;          // 部件编码
  demandDate: string;        // 物料需求时间
  confirmDate: string | null; // 确认到料时间
  wbs: string;
  processNo: string;         // 工序号（高亮）
  workCenter: string;        // 工作中心
  sortString: string;        // 排序字符串
  productionCount: number;   // 投产数
  componentCount: number;    // 组件数
  keyComponentCount: number; // 关键组件数
  componentArrived: number;  // 已到位组件数
  componentRate: number;     // 组件到位率(%)
  status: 'pending_issue' | 'pending_confirm' | 'pending_delivery' | 'pending_dispatch' | 'dispatched';
  checked?: boolean;
}

// 明细行数据
interface DetailRow {
  orderNo: string;       // 订单号
  materialCode: string;  // 物料编码
  materialName: string;  // 物料名称
  partCode: string;      // 部件编码
  partName: string;      // 部件名称
  wbs: string;
  processNo: string;     // 工序号
  quantity: number;      // 数量
}

// 工单明细分项（不含物料，按 orderNo+partCode+wbs+processNo 去重）
interface WorkOrderRow {
  id: number;
  orderNo: string;
  partCode: string;
  wbs: string;
  processNo: string;
  quantity: number;
  dispatchOrderNo: string;  // 派工单号（已派工回显，其他状态 -）
  workOrderNo: string;       // 工单号（已派工回显，其他状态 -）
}

// 缺件行数据
interface ShortageRow {
  orderNo: string;       // 订单号
  purchaseGroup: string; // 采购组
  materialCode: string;  // 物料编码
  materialName: string;  // 物料名称
  reserveNo: string;     // 预留号/预留行号
  wbs: string;
  sqTrace: string;       // SQ追溯
  demandQty: number;     // 需求数量
  issuedQty: number;     // 发料数量
}

@Component({
  selector: 'app-material-dispatch',
  templateUrl: './material-dispatch.component.html',
  styleUrls: ['./material-dispatch.component.css']
})
export class MaterialDispatchComponent {
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  searchExpanded = false;

  // 搜索条件
  searchWbs = '';
  searchDispatchNo = '';
  searchPartCode = '';
  searchProcessNo = '';
  searchWorkCenter = '';
  searchSortString = '';
  searchStatus = null as string | null;
  searchConfirmDateRange: [Date | null, Date | null] | null = null;
  searchDemandDateRange: [Date | null, Date | null] | null = null;

  // 状态选项
  statusOptions = [
    { label: '待下发', value: 'pending_issue' },
    { label: '待确认', value: 'pending_confirm' },
    { label: '待发料', value: 'pending_delivery' },
    { label: '待派工', value: 'pending_dispatch' },
    { label: '已派工', value: 'dispatched' },
  ];

  toggleSearch(): void {
    this.searchExpanded = !this.searchExpanded;
  }

  resetSearch(): void {
    this.searchWbs = '';
    this.searchDispatchNo = '';
    this.searchPartCode = '';
    this.searchProcessNo = '';
    this.searchWorkCenter = '';
    this.searchSortString = '';
    this.searchStatus = null;
    this.searchConfirmDateRange = null;
    this.searchDemandDateRange = null;
  }

  get scrollY(): string {
    return this.searchExpanded ? 'calc(100vh - 340px)' : 'calc(100vh - 260px)';
  }

  // 表格数据
  listOfData: MaterialDispatch[] = [
    { id: 1, dispatchNo: '2000YPG26032500007', partCode: '21BAH2660000', demandDate: '2026-03-31', confirmDate: null, wbs: '-', processNo: '0060', workCenter: 'X2D06', sortString: '-', productionCount: 1, componentCount: 6, keyComponentCount: 0, componentArrived: 0, componentRate: 0.00, status: 'pending_issue' },
    { id: 2, dispatchNo: '2000YPG26041300001', partCode: '21BAH2660002', demandDate: '2026-05-10', confirmDate: '2026-05-11', wbs: 'K181B', processNo: '0050', workCenter: 'X2D05', sortString: 'E-E02-BAH', productionCount: 2, componentCount: 10, keyComponentCount: 3, componentArrived: 7, componentRate: 70.00, status: 'pending_dispatch' },
    { id: 3, dispatchNo: '2000YPG26032500006', partCode: '21BAH2660000', demandDate: '2026-03-31', confirmDate: null, wbs: '-', processNo: '0010', workCenter: 'X2D02', sortString: 'A-A07-BAH', productionCount: 1, componentCount: 5, keyComponentCount: 0, componentArrived: 2, componentRate: 40.00, status: 'pending_issue' },
    { id: 4, dispatchNo: '2000YPG26012700010', partCode: 'ZB417K1772SH', demandDate: '', confirmDate: null, wbs: 'K177Z', processNo: '0010', workCenter: 'D4', sortString: '-', productionCount: 1, componentCount: 534, keyComponentCount: 0, componentArrived: 534, componentRate: 100.00, status: 'pending_confirm' },
    { id: 5, dispatchNo: '2000YPG26012700009', partCode: '72BAH220001016', demandDate: '', confirmDate: null, wbs: '20311', processNo: '0010', workCenter: 'X2B11', sortString: '-', productionCount: 1, componentCount: 2, keyComponentCount: 0, componentArrived: 1, componentRate: 50.00, status: 'pending_delivery' },
    { id: 6, dispatchNo: '2000YPG25072900010', partCode: '21BAH2660000', demandDate: '', confirmDate: null, wbs: 'Z-2000_20336ZJ01', processNo: '0070', workCenter: 'X2D01', sortString: '-', productionCount: 1, componentCount: 3, keyComponentCount: 0, componentArrived: 3, componentRate: 100.00, status: 'dispatched' },
    { id: 7, dispatchNo: '2000YPG25072800008', partCode: '21BCH5400001', demandDate: '2026-04-15', confirmDate: null, wbs: '-', processNo: '0060', workCenter: 'X2D06', sortString: 'B-B03-BCH', productionCount: 2, componentCount: 12, keyComponentCount: 2, componentArrived: 5, componentRate: 41.67, status: 'pending_issue' },
    { id: 8, dispatchNo: '2000YPG26041500003', partCode: '21BBG4320000', demandDate: '2026-04-20', confirmDate: '2026-04-21', wbs: 'K182C', processNo: '0050', workCenter: 'X2D05', sortString: 'E-E08-BBG', productionCount: 2, componentCount: 8, keyComponentCount: 2, componentArrived: 8, componentRate: 100.00, status: 'pending_dispatch' },
    { id: 9, dispatchNo: '2000YPG26032800005', partCode: '21BBG4320001', demandDate: '2026-04-10', confirmDate: null, wbs: 'K180A', processNo: '0020', workCenter: 'X2D03', sortString: 'C-C05-BBG', productionCount: 1, componentCount: 8, keyComponentCount: 1, componentArrived: 8, componentRate: 100.00, status: 'pending_confirm' },
    { id: 10, dispatchNo: '2000YPG26012600004', partCode: '21BBH5700002', demandDate: '', confirmDate: null, wbs: '20400', processNo: '0030', workCenter: 'D6', sortString: '-', productionCount: 3, componentCount: 120, keyComponentCount: 3, componentArrived: 120, componentRate: 100.00, status: 'pending_dispatch' },
    { id: 11, dispatchNo: '2000YPG25072700003', partCode: '21BAH2660001', demandDate: '2026-05-01', confirmDate: null, wbs: '-', processNo: '0040', workCenter: 'X2B12', sortString: 'D-D07-BAH', productionCount: 1, componentCount: 15, keyComponentCount: 0, componentArrived: 7, componentRate: 46.67, status: 'pending_delivery' },
    { id: 12, dispatchNo: '2000YPG26032900002', partCode: 'ZB417K1773SH', demandDate: '', confirmDate: null, wbs: 'Z-2001_20337ZK02', processNo: '0010', workCenter: 'D4', sortString: '-', productionCount: 1, componentCount: 42, keyComponentCount: 1, componentArrived: 0, componentRate: 0.00, status: 'pending_issue' },
  ];

  checked = false;
  indeterminate = false;

  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(item => {
      if (item.status !== 'dispatched') item.checked = checked;
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(_id: number, _checked: boolean): void {
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    // 已派工行不可勾选，不计入全选判断
    const checkableItems = this.listOfData.filter(item => item.status !== 'dispatched');
    const allChecked = checkableItems.length > 0 && checkableItems.every(item => item.checked);
    const someChecked = this.listOfData.some(item => item.checked);
    this.checked = allChecked;
    this.indeterminate = !allChecked && someChecked;

    // 混合状态自动提示
    if (someChecked && !allChecked) {
      const items = this.listOfData.filter(item => item.checked);
      const firstStatus = items[0].status;
      const isMixed = !items.every(item => item.status === firstStatus);
      if (isMixed) {
        this.message.warning('混合状态无法进行操作，请选择相同状态的记录。');
        return;
      }
      // 待派工到位率低于80%自动提示
      if (firstStatus === 'pending_dispatch') {
        const below80 = items.filter(item => item.componentRate < 80);
        if (below80.length > 0) {
          const names = below80.map(item => item.dispatchNo).join('、');
          this.message.warning(`${names} 部件到位率低于80%，无法一键派工。`);
        }
      }
    }
  }

  // 状态标签配置
  getStatusConfig(status: string): { color: string; text: string } {
    const map: Record<string, { color: string; text: string }> = {
      pending_issue: { color: 'default', text: '待下发' },
      pending_confirm: { color: '#722ed1', text: '待确认' },
      pending_delivery: { color: 'warning', text: '待发料' },
      pending_dispatch: { color: 'success', text: '待派工' },
      dispatched: { color: '#13c2c2', text: '已派工' },
    };
    return map[status] || { color: 'default', text: status };
  }

  // ---- 底部操作按钮逻辑 ----

  // 获取勾选项
  get checkedItems(): MaterialDispatch[] {
    return this.listOfData.filter(item => item.checked);
  }

  // 所有勾选项的统一状态（混合返回 null）
  get selectionStatus(): string | null {
    const items = this.checkedItems;
    if (items.length === 0) return null;
    const first = items[0].status;
    return items.every(item => item.status === first) ? first : 'mixed';
  }

  // 按钮标签与图标（混合状态不显示按钮）
  get actionButton(): string | null {
    const status = this.selectionStatus;
    if (!status || status === 'mixed') return null;
    switch (status) {
      case 'pending_issue':
        return '下发仓库';
      case 'pending_confirm':
        return '仓库确认';
      case 'pending_delivery':
        return '仓库发料';
      case 'pending_dispatch':
        if (this.checkedItems.some(item => item.componentRate < 80)) return null;
        return '一键派工';
      case 'dispatched':
        return null;
      default:
        return null;
    }
  }

  // ---- 明细弹窗 ----
  detailVisible = false;
  currentDetail: MaterialDispatch | null = null;
  detailRows: DetailRow[] = [];
  detailPageIndex = 1;
  detailPageSize = 20;

  openDetail(item: MaterialDispatch): void {
    this.currentDetail = item;
    this.detailRows = this.getMockDetailRows(item);
    this.detailVisible = true;
  }

  // 根据预派工单生成模拟明细数据
  private getMockDetailRows(item: MaterialDispatch): DetailRow[] {
    // 唯一性规则：每条记录的订单号、物料编码、部件编码必须至少有一项不同
    const base: DetailRow[] = [
      // 订单号不同
      { orderNo: '20000130748', materialCode: '361080131201', materialName: '平垫圈Φ20.1xΦ32×3Fe/Ct.obk', partCode: item.partCode, partName: '一号轮推杆支座', wbs: 'K181A', processNo: item.processNo, quantity: 5 },
      // 物料编码不同
      { orderNo: '20000130748', materialCode: '361080131202', materialName: '平垫圈Φ20.2xΦ33×3Fe/Ct.obk', partCode: item.partCode, partName: '一号轮推杆支座', wbs: 'K181A', processNo: item.processNo, quantity: 6 },
      // 部件编码不同（通过不同的partName表示不同部件）
      { orderNo: '20000130749', materialCode: '361080131203', materialName: '平垫圈Φ20.3xΦ34×3Fe/Ct.obk', partCode: item.partCode + '-A', partName: '二号轮推杆支座', wbs: 'K181B', processNo: item.processNo, quantity: 10 },
      // 订单号不同，物料编码不同
      { orderNo: '20000130750', materialCode: '361080131204', materialName: '平垫圈Φ20.4xΦ35×3Fe/Ct.obk', partCode: item.partCode, partName: '一号轮推杆支座', wbs: 'K181C', processNo: item.processNo, quantity: 12 },
      // 订单号不同，部件编码不同
      { orderNo: '20000130751', materialCode: '361080131205', materialName: '平垫圈Φ20.5xΦ36×3Fe/Ct.obk', partCode: item.partCode + '-B', partName: '三号轮推杆支座', wbs: 'K181D', processNo: item.processNo, quantity: 15 },
      // 物料编码不同，部件编码不同
      { orderNo: '20000130752', materialCode: '361080131206', materialName: '平垫圈Φ20.6xΦ37×3Fe/Ct.obk', partCode: item.partCode + '-C', partName: '四号轮推杆支座', wbs: 'K181E', processNo: item.processNo, quantity: 18 },
    ];
    // 模拟不同预派工单有不同数量的明细
    const countMap: Record<string, number> = {
      '2000YPG26041300001': 8,
      '2000YPG25072900010': 12,
      '2000YPG26012600004': 6,
    };
    const targetCount = countMap[item.dispatchNo] || base.length;
    if (targetCount <= base.length) return base.slice(0, targetCount);
    // 扩展数据（确保唯一性）
    while (base.length < targetCount) {
      const index = base.length;
      // 生成唯一的数据组合
      const extra: DetailRow = {
        orderNo: `20000130${String(753 + index).padStart(2, '0')}`,
        materialCode: `361080131${String(207 + index).padStart(3, '0')}`,
        materialName: `平垫圈Φ20.${7 + index}xΦ${38 + index}×3Fe/Ct.obk`,
        partCode: `${item.partCode}-${String.fromCharCode(65 + index % 5)}`, // 生成不同的部件编码
        partName: `${['一号', '二号', '三号', '四号', '五号'][index % 5]}轮推杆支座`,
        wbs: `K18${String(1 + index % 9).padStart(2, '0')}${String.fromCharCode(65 + index % 6)}`,
        processNo: item.processNo,
        quantity: 20 + index * 3,
      };
      base.push(extra);
    }
    return base;
  }

  // ---- 工单明细弹窗（点击部件编码弹出） ----
  partOrderVisible = false;
  partOrderItem: MaterialDispatch | null = null;
  partOrderRows: WorkOrderRow[] = [];

  openPartOrder(item: MaterialDispatch): void {
    this.partOrderItem = item;
    // 取物料明细数据，按 orderNo+partCode+wbs+processNo 去重
    const detailRows = this.getMockDetailRows(item);
    const seen = new Map<string, WorkOrderRow>();
    let idCounter = 0;
    const isDispatched = item.status === 'dispatched';
    // 已派工状态时，同一笔预派工单下所有行共享同一个派工单号（基于预派工单号生成）
    const dispatchOrderNo = isDispatched ? `000000${String(1980 + item.id)}` : '';
    for (const d of detailRows) {
      const key = `${d.orderNo}|${d.partCode}|${d.wbs}|${d.processNo}`;
      if (!seen.has(key)) {
        seen.set(key, {
          id: ++idCounter,
          orderNo: d.orderNo,
          partCode: d.partCode,
          wbs: d.wbs,
          processNo: d.processNo,
          quantity: d.quantity,
          dispatchOrderNo: isDispatched ? dispatchOrderNo : '-',
          workOrderNo: isDispatched ? `20000130${String(750 + idCounter).padStart(3, '0')}` : '-',
        });
      }
    }
    this.partOrderRows = Array.from(seen.values());
    this.partOrderVisible = true;
  }

  // ---- 缺件弹窗 ----
  shortageVisible = false;
  currentShortageItem: MaterialDispatch | null = null;
  shortageRows: ShortageRow[] = [];

  openShortage(item: MaterialDispatch): void {
    // 100% 到位率不缺件，不弹窗
    if (item.componentRate >= 100) return;
    this.currentShortageItem = item;
    this.shortageRows = this.getMockShortageRows(item);
    this.shortageVisible = true;
  }

  // 根据预派工单生成模拟缺件数据
  private getMockShortageRows(item: MaterialDispatch): ShortageRow[] {
    const missingCount = item.componentCount - item.componentArrived;
    const base: ShortageRow[] = [
      { orderNo: '20000130491', purchaseGroup: '203', materialCode: '3BCH51200100', materialName: '螺柱', reserveNo: '00018008120002', wbs: '-', sqTrace: '', demandQty: 2, issuedQty: 0 },
      { orderNo: '20000130491', purchaseGroup: '201', materialCode: '32G021613006', materialName: 'O形橡胶密封圈_6.75×1.78_72NBR872', reserveNo: '00018008120004', wbs: '-', sqTrace: '', demandQty: 1, issuedQty: 0 },
      { orderNo: '20000130491', purchaseGroup: '203', materialCode: '3BCH51200200', materialName: '螺柱', reserveNo: '00018008120005', wbs: '-', sqTrace: '', demandQty: 1, issuedQty: 0 },
      { orderNo: '20000130492', purchaseGroup: '202', materialCode: '361080131201', materialName: '平垫圈Φ20.1xΦ32×3Fe/Ct.obk', reserveNo: '00018008120010', wbs: '-', sqTrace: '', demandQty: 4, issuedQty: 0 },
      { orderNo: '20000130492', purchaseGroup: '205', materialCode: '3BCH51080030', materialName: '内六角圆柱头螺钉M8×25', reserveNo: '00018008120015', wbs: '-', sqTrace: '', demandQty: 2, issuedQty: 0 },
      { orderNo: '20000130493', purchaseGroup: '203', materialCode: '32G021613006', materialName: 'O形橡胶密封圈_6.75×1.78_72NBR872', reserveNo: '00018008120022', wbs: '-', sqTrace: '', demandQty: 3, issuedQty: 0 },
    ];
    // 根据实际缺件数量裁剪
    return base.slice(0, Math.min(missingCount || 3, base.length));
  }

  handleAction(): void {
    const items = this.checkedItems;
    if (items.length === 0) return;

    const status = this.selectionStatus;

    // 混合状态
    if (status === 'mixed') {
      this.modal.warning({
        nzTitle: '操作提示',
        nzContent: '混合状态无法进行操作，请选择相同状态的记录。',
        nzOkText: '知道了'
      });
      return;
    }

    // 待派工：跳转派工页面
    if (status === 'pending_dispatch') {
      const below80 = items.filter(item => item.componentRate < 80);
      if (below80.length > 0) {
        const names = below80.map(item => item.dispatchNo).join('、');
        this.modal.warning({
          nzTitle: '到位率不达标',
          nzContent: `${names} 部件到位率低于80%，无法一键派工。`,
          nzOkText: '知道了'
        });
        return;
      }
      // 跳转到派工页面（传递勾选数据）
      sessionStorage.setItem('dispatchAssignData', JSON.stringify(items));
      this.router.navigate(['/dispatch-assign']);
      return;
    }

    // 执行对应操作
    const label = this.actionButton || '';
    this.modal.success({
      nzTitle: '操作成功',
      nzContent: `已执行「${label}」操作，共 ${items.length} 条记录。`,
      nzOkText: '确定'
    });
  }
}

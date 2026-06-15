import { Component, OnDestroy } from '@angular/core';

interface ProcessingRecord {
  id: number;
  dispatchNo: string;
  workNo: string;
  processCode: string;
  actualPercent: string | number;
  materialDesc: string;
  seqNo: number;
  workCenter: string;
  quantity: number;
  productionMode: string;
  isMaterialReserved: boolean;
  orderNo: string;
  partNo: string;
  checked?: boolean;
}

/** 第一级：派工单汇总行 */
interface DispatchSummary {
  dispatchNo: string;
  records: ProcessingRecord[];
  /** 该派工单下涉及物料（去重拼接） */
  materialDesc: string;
  productionMode: string;
  isMaterialReserved: boolean;
  count: number;
}

interface DispatchWorkOrderRow {
  workNo: string;
  processCode: string;
  actualPercent: string;
  materialDesc: string;
  workCenter: string;
  quantity: number;
  orderNo: string;
  partNo: string;
}

interface ScanMaterialItem {
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  received: boolean;
  orderNo: string;
  processCode: string;
}

interface ScanWorkOrderItem {
  workNo: string;
  processCode: string;
  materialDesc: string;
  workCenter: string;
  quantity: number;
  started: boolean;
  orderNo: string;
  dispatchNo: string;
}

interface BindPartItem {
  partSerialNo: string;
  partCode: string;
  partName: string;
  scanTime: string;
}

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnDestroy {
  viewMode = 'process';
  searchOrderNo = '';
  searchMaterialNo = '';

  /** ========== 两级视图状态 ========== */
  detailMode = false;
  currentDispatchNo = '';
  currentSummary: DispatchSummary | null = null;

  /** 第二级详情页查询条件 */
  detailSearchWorkNo = '';
  detailSearchProcessCode = '';

  /** 约料派工单号集合 */
  private readonly RESERVED_DISPATCH_NOS = new Set([
    '0000001898', '0000001896', '0000001893', '0000001891'
  ]);

  listOfData: ProcessingRecord[] = [
    { id: 1, dispatchNo: '0000001898', workNo: '0000001985', processCode: '0030', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'X2D05', quantity: 10, productionMode: '约料', isMaterialReserved: true, orderNo: '20260613001', partNo: 'FLZ-001' },
    { id: 2, dispatchNo: '0000001896', workNo: '0000001986', processCode: '0040', actualPercent: '1%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'X2D02', quantity: 10, productionMode: '约料', isMaterialReserved: true, orderNo: '20260613001', partNo: 'FLZ-001' },
    { id: 3, dispatchNo: '0000001896', workNo: '0000001983', processCode: '0040', actualPercent: '1%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'X2D02', quantity: 10, productionMode: '约料', isMaterialReserved: true, orderNo: '20260613001', partNo: 'FLZ-001' },
    { id: 4, dispatchNo: '0000001893', workNo: '0000001968', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'D6', quantity: 3, productionMode: '约料', isMaterialReserved: true, orderNo: '20260613002', partNo: 'FLZ-002' },
    { id: 5, dispatchNo: '0000001891', workNo: '0000001966', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'D6', quantity: 3, productionMode: '约料', isMaterialReserved: true, orderNo: '20260613002', partNo: 'FLZ-002' },
    { id: 6, dispatchNo: '0000001888', workNo: '0000001966', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'D4', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613003', partNo: 'FLZ-003' },
    { id: 7, dispatchNo: '0000001868', workNo: '0000001949', processCode: '9002', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0, workCenter: 'ZB', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613004', partNo: 'NKZ-001' },
    { id: 8, dispatchNo: '0000001867', workNo: '0000001948', processCode: '9001', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0, workCenter: 'ZB', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613004', partNo: 'NKZ-001' },
    { id: 9, dispatchNo: '0000001866', workNo: '0000001947', processCode: '0010', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0, workCenter: 'ZB', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613004', partNo: 'NKZ-001' },
    { id: 10, dispatchNo: '0000001852', workNo: '0000001637', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B11', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613005', partNo: 'DMF-001' },
    { id: 11, dispatchNo: '0000001852', workNo: '0000001636', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B11', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613005', partNo: 'DMF-001' },
    { id: 12, dispatchNo: '0000001852', workNo: '0000001641', processCode: '0020', actualPercent: '0%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B12', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613005', partNo: 'DMF-001' },
    { id: 13, dispatchNo: '0000001852', workNo: '0000001635', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B11', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613005', partNo: 'DMF-001' },
    { id: 14, dispatchNo: '0000001852', workNo: '0000001640', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B11', quantity: 1, productionMode: '-', isMaterialReserved: false, orderNo: '20260613005', partNo: 'DMF-001' }
  ];

  /** 第一级：派工单汇总列表（普通属性，避免 getter 死循环） */
  dispatchSummaries: DispatchSummary[] = [];
  /** 第二级：过滤后明细行 */
  filteredDetailRows: DispatchWorkOrderRow[] = [];
  /** 第二级明细总数 */
  detailTotalCount = 0;

  private buildDispatchSummaries(): DispatchSummary[] {
    const map = new Map<string, ProcessingRecord[]>();
    this.listOfData.forEach(item => {
      if (!map.has(item.dispatchNo)) map.set(item.dispatchNo, []);
      map.get(item.dispatchNo)!.push(item);
    });
    return Array.from(map.entries()).map(([dispatchNo, records]) => {
      const first = records[0];
      const materials = [...new Set(records.map(r => r.materialDesc))].join('、');
      return {
        dispatchNo,
        records,
        materialDesc: materials,
        productionMode: first.productionMode,
        isMaterialReserved: first.isMaterialReserved,
        count: records.length
      };
    });
  }

  private buildFilteredDetailRows(): DispatchWorkOrderRow[] {
    if (!this.currentSummary) return [];
    let rows = this.currentSummary.records.map(r => ({
      workNo: r.workNo,
      processCode: r.processCode,
      actualPercent: String(r.actualPercent),
      materialDesc: r.materialDesc,
      workCenter: r.workCenter,
      quantity: r.quantity,
      orderNo: r.orderNo,
      partNo: r.partNo
    }));
    if (this.detailSearchWorkNo) {
      rows = rows.filter(r => r.workNo.includes(this.detailSearchWorkNo));
    }
    if (this.detailSearchProcessCode) {
      rows = rows.filter(r => r.processCode.includes(this.detailSearchProcessCode));
    }
    return rows;
  }

  ngOnInit(): void {
    this.dispatchSummaries = this.buildDispatchSummaries();
  }

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

  /** 进入派工单详情（面包屑第二级） */
  enterDispatchDetail(summary: DispatchSummary): void {
    this.currentDispatchNo = summary.dispatchNo;
    this.currentSummary = summary;
    this.detailMode = true;
    this.detailSearchWorkNo = '';
    this.detailSearchProcessCode = '';
    this.detailTotalCount = summary.records.length;
    this.filteredDetailRows = this.buildFilteredDetailRows();
  }

  /** 面包屑返回第一级列表 */
  backToList(): void {
    this.detailMode = false;
    this.currentDispatchNo = '';
    this.currentSummary = null;
    this.detailSearchWorkNo = '';
    this.detailSearchProcessCode = '';
    this.filteredDetailRows = [];
    this.detailTotalCount = 0;
  }

  /** 详情页搜索 */
  searchDetails(): void {
    this.filteredDetailRows = this.buildFilteredDetailRows();
  }

  getProgressValue(val: string | number): number {
    if (typeof val === 'string') return parseFloat(val) || 0;
    return val || 0;
  }

  // ---- 点收开工弹窗 ----
  scanVisible = false;
  scanStage: 'scanning' | 'result' = 'scanning';
  scannedDispatchNo = '';
  scanMaterialItems: ScanMaterialItem[] = [];
  scanWorkOrderItems: ScanWorkOrderItem[] = [];
  private scanTimer: ReturnType<typeof setTimeout> | null = null;

  openScanReceipt(): void {
    this.scanVisible = true;
    this.scanStage = 'scanning';
    this.scannedDispatchNo = '';
    this.scanMaterialItems = [];
    this.scanWorkOrderItems = [];

    this.scanTimer = setTimeout(() => {
      const target = this.listOfData.find(d => d.isMaterialReserved) || this.listOfData[0];
      this.scannedDispatchNo = '2000YPG26041300001';
      this.scanMaterialItems = this.getMockScanMaterials(target);
      this.scanWorkOrderItems = this.getMockScanWorkOrders(target);
      this.scanStage = 'result';
    }, 2500);
  }

  private getMockScanMaterials(_item: ProcessingRecord): ScanMaterialItem[] {
    return [
      { materialCode: '361080131201', materialName: '平垫圈Φ20.1×Φ32×3Fe/Ct.obk', quantity: 5, unit: 'EA', received: true, orderNo: '20260613001', processCode: '0030' },
      { materialCode: '361080131202', materialName: '平垫圈Φ20.2×Φ33×3Fe/Ct.obk', quantity: 6, unit: 'EA', received: true, orderNo: '20260613001', processCode: '0030' },
      { materialCode: '32G021613006', materialName: 'O形橡胶密封圈_6.75×1.78_72NBR872', quantity: 2, unit: 'EA', received: true, orderNo: '20260613001', processCode: '0030' },
      { materialCode: '3BCH51200100', materialName: '螺柱 M8×25', quantity: 4, unit: 'EA', received: true, orderNo: '20260613001', processCode: '0030' },
      { materialCode: '361080131203', materialName: '平垫圈Φ20.3×Φ34×3Fe/Ct.obk', quantity: 3, unit: 'EA', received: true, orderNo: '20260613001', processCode: '0040' },
      { materialCode: '3BCH51080030', materialName: '内六角圆柱头螺钉M8×25', quantity: 8, unit: 'EA', received: true, orderNo: '20260613001', processCode: '0040' },
      { materialCode: '3BCH42030010', materialName: '内六角平端紧定螺钉M6×10', quantity: 12, unit: 'EA', received: true, orderNo: '20260613002', processCode: '0020' },
      { materialCode: '4BCH12011005', materialName: '六角螺母 M10', quantity: 10, unit: 'EA', received: true, orderNo: '20260613002', processCode: '0020' },
      { materialCode: '5BCH33010020', materialName: '弹簧垫圈Φ10', quantity: 8, unit: 'EA', received: true, orderNo: '20260613003', processCode: '0050' },
      { materialCode: '5BCH33010022', materialName: '弹簧垫圈Φ12', quantity: 6, unit: 'EA', received: true, orderNo: '20260613003', processCode: '0050' },
    ];
  }

  private getMockScanWorkOrders(_item: ProcessingRecord): ScanWorkOrderItem[] {
    return [
      { workNo: '0000001985', processCode: '0030', materialDesc: '法兰轴', workCenter: 'X2D05', quantity: 10, started: true, orderNo: '20260613001', dispatchNo: '0000001898' },
      { workNo: '0000001986', processCode: '0040', materialDesc: '法兰轴', workCenter: 'X2D02', quantity: 10, started: true, orderNo: '20260613001', dispatchNo: '0000001898' },
      { workNo: '0000001988', processCode: '0070', materialDesc: '法兰轴', workCenter: 'X2D01', quantity: 10, started: true, orderNo: '20260613001', dispatchNo: '0000001898' },
      { workNo: '0000001968', processCode: '0020', materialDesc: '法兰轴', workCenter: 'D6', quantity: 3, started: true, orderNo: '20260613002', dispatchNo: '0000001896' },
      { workNo: '0000001972', processCode: '0060', materialDesc: '法兰轴', workCenter: 'D4', quantity: 3, started: true, orderNo: '20260613002', dispatchNo: '0000001896' },
      { workNo: '0000001949', processCode: '9002', materialDesc: '内框纸输送轮装置', workCenter: 'ZB', quantity: 1, started: true, orderNo: '20260613003', dispatchNo: '0000001891' },
      { workNo: '0000001948', processCode: '9001', materialDesc: '内框纸输送轮装置', workCenter: 'ZB', quantity: 1, started: true, orderNo: '20260613003', dispatchNo: '0000001891' },
      { workNo: '0000001947', processCode: '0010', materialDesc: '内框纸输送轮装置', workCenter: 'ZB', quantity: 1, started: true, orderNo: '20260613003', dispatchNo: '0000001891' },
    ];
  }

  closeScan(): void {
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }
    this.scanVisible = false;
  }

  // ---- 关键件绑定弹窗 ----
  bindVisible = false;
  bindStage: 'scanComponent' | 'componentDone' | 'scanningParts' | 'done' = 'scanComponent';
  scannedComponentSerial = '';
  scannedComponentName = '';
  bindPartItems: BindPartItem[] = [];
  private bindTimers: ReturnType<typeof setTimeout>[] = [];

  private readonly partPool: { serialNo: string; code: string; name: string }[] = [
    { serialNo: 'SN-FL-20260601-001', code: '361080131201', name: '平垫圈Φ20.1×Φ32×3Fe/Ct.obk' },
    { serialNo: 'SN-FL-20260601-002', code: '361080131202', name: '平垫圈Φ20.2×Φ33×3Fe/Ct.obk' },
    { serialNo: 'SN-FL-20260601-003', code: '32G021613006', name: 'O形橡胶密封圈_6.75×1.78_72NBR872' },
    { serialNo: 'SN-FL-20260601-004', code: '3BCH51200100', name: '螺柱 M8×25' },
    { serialNo: 'SN-FL-20260601-005', code: '3BCH51080030', name: '内六角圆柱头螺钉M8×25' },
  ];

  openBindKeyPart(): void {
    this.bindVisible = true;
    this.bindStage = 'scanComponent';
    this.scannedComponentSerial = '';
    this.scannedComponentName = '';
    this.bindPartItems = [];
    this.clearBindTimers();

    this.bindTimers.push(setTimeout(() => {
      this.scannedComponentSerial = 'COMP-FLZ-20260601-A01';
      this.scannedComponentName = '法兰轴部件';
      this.bindStage = 'componentDone';

      this.bindTimers.push(setTimeout(() => {
        this.bindStage = 'scanningParts';
        this.scanNextPart(0);
      }, 800));
    }, 2000));
  }

  private scanNextPart(index: number): void {
    if (index >= this.partPool.length) {
      this.bindStage = 'done';
      return;
    }
    this.bindTimers.push(setTimeout(() => {
      const p = this.partPool[index];
      this.bindPartItems.push({
        partSerialNo: p.serialNo,
        partCode: p.code,
        partName: p.name,
        scanTime: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      });
      this.scanNextPart(index + 1);
    }, 1500));
  }

  private clearBindTimers(): void {
    this.bindTimers.forEach(t => clearTimeout(t));
    this.bindTimers = [];
  }

  closeBind(): void {
    this.clearBindTimers();
    this.bindVisible = false;
  }

  ngOnDestroy(): void {
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
    }
    this.clearBindTimers();
  }
}

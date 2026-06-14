import { Component, OnDestroy } from '@angular/core';

interface ProcessingRecord {
  id: number;
  dispatchNo: string;
  workNo: string;
  processCode: string;
  actualPercent: string | number;
  materialDesc: string;
  seqNo: number;
  workCenter: string;            // 工作中心
  quantity: number;              // 数量
  productionMode: string;        // 生产模式：约料 / -
  isMaterialReserved: boolean;   // 是否约料（派工单号可点击）
  checked?: boolean;
}

interface DispatchWorkOrderRow {
  workNo: string;          // 工单编号
  processCode: string;     // 工序
  actualPercent: string;   // 实动定额百分比
  materialDesc: string;    // 物料描述
  workCenter: string;      // 工作中心
  quantity: number;        // 数量
}

interface ScanMaterialItem {
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  received: boolean;
  orderNo: string;       // 生产订单号
  processCode: string;   // 工序号
}

interface ScanWorkOrderItem {
  workNo: string;
  processCode: string;
  materialDesc: string;
  workCenter: string;
  quantity: number;
  started: boolean;
  orderNo: string;       // 生产订单号
}

interface BindPartItem {
  partSerialNo: string;   // 零件序列号
  partCode: string;       // 零件编码
  partName: string;       // 零件名称
  scanTime: string;       // 扫描时间
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

  /** 约料派工单号集合 */
  private readonly RESERVED_DISPATCH_NOS = new Set([
    '0000001898', '0000001896', '0000001893', '0000001891'
  ]);

  listOfData: ProcessingRecord[] = [
    { id: 1, dispatchNo: '0000001898', workNo: '0000001985', processCode: '0030', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'X2D05', quantity: 10, productionMode: '约料', isMaterialReserved: true },
    { id: 2, dispatchNo: '0000001896', workNo: '0000001986', processCode: '0040', actualPercent: '1%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'X2D02', quantity: 10, productionMode: '约料', isMaterialReserved: true },
    { id: 3, dispatchNo: '0000001896', workNo: '0000001983', processCode: '0040', actualPercent: '1%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'X2D02', quantity: 10, productionMode: '约料', isMaterialReserved: true },
    { id: 4, dispatchNo: '0000001893', workNo: '0000001968', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'D6', quantity: 3, productionMode: '约料', isMaterialReserved: true },
    { id: 5, dispatchNo: '0000001891', workNo: '0000001966', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'D6', quantity: 3, productionMode: '约料', isMaterialReserved: true },
    { id: 6, dispatchNo: '0000001888', workNo: '0000001966', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0, workCenter: 'D4', quantity: 1, productionMode: '-', isMaterialReserved: false },
    { id: 7, dispatchNo: '0000001868', workNo: '0000001949', processCode: '9002', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0, workCenter: 'ZB', quantity: 1, productionMode: '-', isMaterialReserved: false },
    { id: 8, dispatchNo: '0000001867', workNo: '0000001948', processCode: '9001', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0, workCenter: 'ZB', quantity: 1, productionMode: '-', isMaterialReserved: false },
    { id: 9, dispatchNo: '0000001866', workNo: '0000001947', processCode: '0010', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0, workCenter: 'ZB', quantity: 1, productionMode: '-', isMaterialReserved: false },
    { id: 10, dispatchNo: '0000001852', workNo: '0000001637', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B11', quantity: 1, productionMode: '-', isMaterialReserved: false },
    { id: 11, dispatchNo: '0000001852', workNo: '0000001636', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B11', quantity: 1, productionMode: '-', isMaterialReserved: false },
    { id: 12, dispatchNo: '0000001852', workNo: '0000001641', processCode: '0020', actualPercent: '0%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B12', quantity: 1, productionMode: '-', isMaterialReserved: false },
    { id: 13, dispatchNo: '0000001852', workNo: '0000001635', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B11', quantity: 1, productionMode: '-', isMaterialReserved: false },
    { id: 14, dispatchNo: '0000001852', workNo: '0000001640', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0, workCenter: 'X2B11', quantity: 1, productionMode: '-', isMaterialReserved: false }
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

  // ---- 工单明细弹窗（约料订单点击派工单号） ----
  dispatchDetailVisible = false;
  currentDispatchItem: ProcessingRecord | null = null;
  dispatchDetailRows: DispatchWorkOrderRow[] = [];

  openDispatchDetail(item: ProcessingRecord): void {
    if (!item.isMaterialReserved) return;
    this.currentDispatchItem = item;
    // 根据派工单号生成模拟工单明细数据
    this.dispatchDetailRows = this.getMockDispatchDetails(item);
    this.dispatchDetailVisible = true;
  }

  private getMockDispatchDetails(item: ProcessingRecord): DispatchWorkOrderRow[] {
    // 同一派工单下可能有多条工单，这里模拟2-3条明细
    const baseRows: DispatchWorkOrderRow[] = [
      { workNo: item.workNo, processCode: item.processCode, actualPercent: String(item.actualPercent), materialDesc: item.materialDesc, workCenter: item.workCenter, quantity: item.quantity },
    ];
    if (item.id <= 3) {
      baseRows.push(
        { workNo: '0000001987', processCode: '0050', actualPercent: '0%', materialDesc: '法兰轴', workCenter: 'X2D05', quantity: 5 },
        { workNo: '0000001988', processCode: '0070', actualPercent: '0%', materialDesc: '法兰轴', workCenter: 'X2D01', quantity: 5 }
      );
    }
    return baseRows;
  }

  getProgressValue(val: string | number): number {
    if (typeof val === 'string') return parseFloat(val) || 0;
    return val || 0;
  }

  // ---- 点收开工弹窗 ----
  scanVisible = false;
  /** 扫描阶段: 'scanning' | 'result' */
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

    // 模拟扫描：2.5 秒后扫到派工单号并显示结果
    this.scanTimer = setTimeout(() => {
      // 取第一条约料数据作为扫描目标
      const target = this.listOfData.find(d => d.isMaterialReserved) || this.listOfData[0];
      this.scannedDispatchNo = target.dispatchNo;
      this.scanMaterialItems = this.getMockScanMaterials(target);
      this.scanWorkOrderItems = this.getMockScanWorkOrders(target);
      this.scanStage = 'result';
    }, 2500);
  }

  private getMockScanMaterials(_item: ProcessingRecord): ScanMaterialItem[] {
    // 模拟3个生产订单的物料清单，共10条
    return [
      // -- 订单 PO202606001，工序 0030 --
      { materialCode: '361080131201', materialName: '平垫圈Φ20.1×Φ32×3Fe/Ct.obk', quantity: 5, unit: 'EA', received: true, orderNo: 'PO202606001', processCode: '0030' },
      { materialCode: '361080131202', materialName: '平垫圈Φ20.2×Φ33×3Fe/Ct.obk', quantity: 6, unit: 'EA', received: true, orderNo: 'PO202606001', processCode: '0030' },
      { materialCode: '32G021613006', materialName: 'O形橡胶密封圈_6.75×1.78_72NBR872', quantity: 2, unit: 'EA', received: true, orderNo: 'PO202606001', processCode: '0030' },
      { materialCode: '3BCH51200100', materialName: '螺柱 M8×25', quantity: 4, unit: 'EA', received: true, orderNo: 'PO202606001', processCode: '0030' },
      // -- 订单 PO202606001，工序 0040 --
      { materialCode: '361080131203', materialName: '平垫圈Φ20.3×Φ34×3Fe/Ct.obk', quantity: 3, unit: 'EA', received: true, orderNo: 'PO202606001', processCode: '0040' },
      { materialCode: '3BCH51080030', materialName: '内六角圆柱头螺钉M8×25', quantity: 8, unit: 'EA', received: true, orderNo: 'PO202606001', processCode: '0040' },
      // -- 订单 PO202606002，工序 0020 --
      { materialCode: '3BCH42030010', materialName: '内六角平端紧定螺钉M6×10', quantity: 12, unit: 'EA', received: true, orderNo: 'PO202606002', processCode: '0020' },
      { materialCode: '4BCH12011005', materialName: '六角螺母 M10', quantity: 10, unit: 'EA', received: true, orderNo: 'PO202606002', processCode: '0020' },
      // -- 订单 PO202606003，工序 0050 --
      { materialCode: '5BCH33010020', materialName: '弹簧垫圈Φ10', quantity: 8, unit: 'EA', received: true, orderNo: 'PO202606003', processCode: '0050' },
      { materialCode: '5BCH33010022', materialName: '弹簧垫圈Φ12', quantity: 6, unit: 'EA', received: true, orderNo: 'PO202606003', processCode: '0050' },
    ];
  }

  private getMockScanWorkOrders(_item: ProcessingRecord): ScanWorkOrderItem[] {
    // 模拟3个生产订单的工单清单，共8条
    return [
      // -- 订单 PO202606001：法兰轴 三个工序 --
      { workNo: '0000001985', processCode: '0030', materialDesc: '法兰轴', workCenter: 'X2D05', quantity: 10, started: true, orderNo: 'PO202606001' },
      { workNo: '0000001986', processCode: '0040', materialDesc: '法兰轴', workCenter: 'X2D02', quantity: 10, started: true, orderNo: 'PO202606001' },
      { workNo: '0000001988', processCode: '0070', materialDesc: '法兰轴', workCenter: 'X2D01', quantity: 10, started: true, orderNo: 'PO202606001' },
      // -- 订单 PO202606002：法兰轴 两个工序 --
      { workNo: '0000001968', processCode: '0020', materialDesc: '法兰轴', workCenter: 'D6', quantity: 3, started: true, orderNo: 'PO202606002' },
      { workNo: '0000001972', processCode: '0060', materialDesc: '法兰轴', workCenter: 'D4', quantity: 3, started: true, orderNo: 'PO202606002' },
      // -- 订单 PO202606003：内框纸输送轮装置 三个工序 --
      { workNo: '0000001949', processCode: '9002', materialDesc: '内框纸输送轮装置', workCenter: 'ZB', quantity: 1, started: true, orderNo: 'PO202606003' },
      { workNo: '0000001948', processCode: '9001', materialDesc: '内框纸输送轮装置', workCenter: 'ZB', quantity: 1, started: true, orderNo: 'PO202606003' },
      { workNo: '0000001947', processCode: '0010', materialDesc: '内框纸输送轮装置', workCenter: 'ZB', quantity: 1, started: true, orderNo: 'PO202606003' },
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
  /** 绑定阶段: 'scanComponent' | 'componentDone' | 'scanningParts' | 'done' */
  bindStage: 'scanComponent' | 'componentDone' | 'scanningParts' | 'done' = 'scanComponent';
  scannedComponentSerial = '';                 // 部件序列号
  scannedComponentName = '';                   // 部件名称
  bindPartItems: BindPartItem[] = [];          // 零件绑定明细
  private bindTimers: ReturnType<typeof setTimeout>[] = [];

  /** 待扫描的零件序列号池 */
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

    // 阶段1：扫描部件序列号，2s 后完成
    this.bindTimers.push(setTimeout(() => {
      this.scannedComponentSerial = 'COMP-FLZ-20260601-A01';
      this.scannedComponentName = '法兰轴部件';
      this.bindStage = 'componentDone';

      // 阶段2：短暂停留后自动进入逐条零件扫描
      this.bindTimers.push(setTimeout(() => {
        this.bindStage = 'scanningParts';
        this.scanNextPart(0);
      }, 800));
    }, 2000));
  }

  /** 递归逐条扫描零件 */
  private scanNextPart(index: number): void {
    if (index >= this.partPool.length) {
      this.bindStage = 'done';
      return;
    }
    // 模拟扫描中动画，1.5s 后扫到
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
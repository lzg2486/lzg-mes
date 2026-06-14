import { Component } from '@angular/core';

interface ProcessingRecord {
  id: number;
  dispatchNo: string;
  workNo: string;
  processCode: string;
  actualPercent: string | number;
  materialDesc: string;
  seqNo: number;
  checked?: boolean;
}

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent {
  // 视图模式
  viewMode = 'process';

  // 搜索条件
  searchOrderNo = '';
  searchMaterialNo = '';

  // 表格数据
  listOfData: ProcessingRecord[] = [
    { id: 1, dispatchNo: '0000001898', workNo: '0000001985', processCode: '0030', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0 },
    { id: 2, dispatchNo: '0000001896', workNo: '0000001986', processCode: '0040', actualPercent: '1%', materialDesc: '法兰轴', seqNo: 0 },
    { id: 3, dispatchNo: '0000001896', workNo: '0000001983', processCode: '0040', actualPercent: '1%', materialDesc: '法兰轴', seqNo: 0 },
    { id: 4, dispatchNo: '0000001893', workNo: '0000001968', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0 },
    { id: 5, dispatchNo: '0000001891', workNo: '0000001966', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0 },
    { id: 6, dispatchNo: '0000001888', workNo: '0000001966', processCode: '0020', actualPercent: '0%', materialDesc: '法兰轴', seqNo: 0 },
    { id: 7, dispatchNo: '0000001868', workNo: '0000001949', processCode: '9002', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0 },
    { id: 8, dispatchNo: '0000001867', workNo: '0000001948', processCode: '9001', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0 },
    { id: 9, dispatchNo: '0000001866', workNo: '0000001947', processCode: '0010', actualPercent: '0%', materialDesc: '内框纸输送轮装置', seqNo: 0 },
    { id: 10, dispatchNo: '0000001852', workNo: '0000001637', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0 },
    { id: 11, dispatchNo: '0000001852', workNo: '0000001636', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0 },
    { id: 12, dispatchNo: '0000001852', workNo: '0000001641', processCode: '0020', actualPercent: '0%', materialDesc: '端面热封夹装部件', seqNo: 0 },
    { id: 13, dispatchNo: '0000001852', workNo: '0000001635', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0 },
    { id: 14, dispatchNo: '0000001852', workNo: '0000001640', processCode: '0010', actualPercent: '0.00%', materialDesc: '端面热封夹装部件', seqNo: 0 }
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

  getProgressValue(val: string | number): number {
    if (typeof val === 'string') return parseFloat(val) || 0;
    return val || 0;
  }
}

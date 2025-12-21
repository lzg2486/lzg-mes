// 看板统计数据接口类型定义
export interface WorkOrderDispatch {
  dispatchedCount: number // 派工工单数
  secondaryDispatchedCount: number // 二次派工单数
}

export interface ProductionProcessing {
  dailyProcessingCount: number // 日常加工单数
  overtimeProcessingCount: number // 加班加工单数
}

export interface WorkOrderInspection {
  inspectionCount: number // 工单质检单数
}

export interface WorkOrderApproval {
  approvalCount: number // 工单审核单数
}

export interface WorkHourFeedback {
  feedbackCount: number // 工时回传单数
}

export interface Reminder {
  scrapReminderCount: number // 报废提醒数量（直接派工单）
  directOrderCompletedCount: number // 订单完成数量（直接派工单）
  indirectOrderCompletedCount: number // 订单完成数量（间接派工单）
}

export interface DashboardStatistics {
  workOrderDispatch: WorkOrderDispatch
  productionProcessing: ProductionProcessing
  workOrderInspection: WorkOrderInspection
  workOrderApproval: WorkOrderApproval
  workHourFeedback: WorkHourFeedback
  reminder?: Reminder // 提醒模块（接口暂未提供，先使用默认值）
  id?: number
}

export interface DashboardQueryParams {
  date?: string // 日期（格式：YYYY-MM-DD），可选，默认今日
  orgId?: string // 组织机构ID，可选
}

/**
 * 获取看板统计数据
 * @param params 查询参数
 * @returns 看板统计数据
 */
export async function getDashboardStatistics(
  params?: DashboardQueryParams
): Promise<DashboardStatistics> {
  const url = new URL('https://m1.apifoxmock.com/m1/7565539-7303133-default/board')
  url.searchParams.set('apifoxApiId', '391611150')
  
  if (params?.date) {
    url.searchParams.set('date', params.date)
  }
  if (params?.orgId) {
    url.searchParams.set('orgId', params.orgId)
  }

  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`获取看板统计数据失败: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}


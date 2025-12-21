// 班车任务接口类型定义

// 运行状态枚举
export type RunStatus = '未发车' | '发车' | '到车'

// 班车任务实体
export interface BusTask {
  id: string // 任务ID
  batchNo: string // 批次号
  plateNo: string // 车牌号
  trailerPlateNo?: string // 挂厢车牌号
  tagNos: string // 车签号（多个用英文逗号隔开）
  routeName: string // 线路名称
  runStatus: RunStatus // 运行状态
  plannedDepartureTime: string // 计划发车时间
  actualDepartureTime?: string // 实际发车时间
  driverName: string // 司机姓名
  driverPhone: string // 司机手机号
  driverIdCard: string // 司机身份证号
  vehicleType: string // 车辆类型
  workType: string // 作业类型
  departureProvince?: string // 发车省区
  departureStation?: string // 发车站点
  creator: string // 创建人
  createTime: string // 创建时间
  updater: string // 修改人
  updateTime: string // 修改时间
  remark?: string // 备注
}

// 查询参数
export interface BusTaskQueryParams {
  batchNos?: string[] // 批次号数组（最多50个）
  departureTimeStart?: string // 发车时间开始
  departureTimeEnd?: string // 发车时间结束
  departureProvinces?: string[] // 发车省区（多选）
  departureStation?: string // 发车站点
  plateNo?: string // 车牌号码（模糊搜索）
  runStatuses?: RunStatus[] // 运行状态（多选）
  pageNum?: number // 页码
  pageSize?: number // 每页条数
}

// 分页响应
export interface BusTaskPageResponse {
  list: BusTask[]
  total: number
  pageNum: number
  pageSize: number
}

// 发车登记表单数据
export interface BusTaskFormData {
  routeName: string // 线路名称（必填）
  workType: string // 作业类型（必填）
  headPlateNo: string // 头车车牌（必填）
  trailerPlateNo?: string // 挂厢车牌
  vehicleType: string // 车辆类型（自动带出，不可编辑）
  driverName: string // 驾驶员姓名（必填，仅汉字）
  driverPhone: string // 联系电话（必填，11位数字）
  driverIdCard: string // 驾驶证号（必填，身份证号规则）
  remark?: string // 备注（最多200字符）
}

// 编辑任务表单数据
export interface BusTaskEditFormData {
  trailerPlateNo?: string // 挂厢车牌
  driverName: string // 驾驶员姓名
  driverPhone: string // 联系电话
  driverIdCard: string // 驾驶证号
  remark?: string // 备注
}

// Mock 数据
const mockBusTasks: BusTask[] = [
  {
    id: '1',
    batchNo: 'BC20250101001',
    plateNo: '京A12345',
    trailerPlateNo: '京A12346',
    tagNos: 'T001,T002,T003',
    routeName: '北京-天津专线',
    runStatus: '发车',
    plannedDepartureTime: '2025-01-01 08:00:00',
    actualDepartureTime: '2025-01-01 08:05:00',
    driverName: '张三',
    driverPhone: '13800138000',
    driverIdCard: '110101199001011234',
    vehicleType: '大型货车',
    workType: '直跑车',
    departureProvince: '北京',
    departureStation: '北京站',
    creator: '管理员',
    createTime: '2025-01-01 07:00:00',
    updater: '管理员',
    updateTime: '2025-01-01 08:05:00',
    remark: '正常发车'
  },
  {
    id: '2',
    batchNo: 'BC20250101002',
    plateNo: '京B23456',
    tagNos: 'T004,T005',
    routeName: '北京-河北专线',
    runStatus: '未发车',
    plannedDepartureTime: '2025-01-01 10:00:00',
    driverName: '李四',
    driverPhone: '13900139000',
    driverIdCard: '110101199002021234',
    vehicleType: '中型货车',
    workType: '网点非直跑车',
    departureProvince: '北京',
    departureStation: '北京南站',
    creator: '操作员',
    createTime: '2025-01-01 09:00:00',
    updater: '操作员',
    updateTime: '2025-01-01 09:00:00',
    remark: '待发车'
  },
  {
    id: '3',
    batchNo: 'BC20250101003',
    plateNo: '京C34567',
    trailerPlateNo: '京C34568',
    tagNos: 'T006',
    routeName: '北京-山东专线',
    runStatus: '到车',
    plannedDepartureTime: '2025-01-01 06:00:00',
    actualDepartureTime: '2025-01-01 06:10:00',
    driverName: '王五',
    driverPhone: '13700137000',
    driverIdCard: '110101199003031234',
    vehicleType: '大型货车',
    workType: '直跑车',
    departureProvince: '北京',
    departureStation: '北京西站',
    creator: '管理员',
    createTime: '2025-01-01 05:00:00',
    updater: '管理员',
    updateTime: '2025-01-01 14:00:00',
    remark: '已到达'
  },
  {
    id: '4',
    batchNo: 'BC20250101004',
    plateNo: '京D45678',
    tagNos: 'T007,T008,T009,T010',
    routeName: '北京-河南专线',
    runStatus: '发车',
    plannedDepartureTime: '2025-01-01 12:00:00',
    actualDepartureTime: '2025-01-01 12:03:00',
    driverName: '赵六',
    driverPhone: '13600136000',
    driverIdCard: '110101199004041234',
    vehicleType: '中型货车',
    workType: '直跑车',
    departureProvince: '北京',
    departureStation: '北京站',
    creator: '操作员',
    createTime: '2025-01-01 11:00:00',
    updater: '操作员',
    updateTime: '2025-01-01 12:03:00'
  },
  {
    id: '5',
    batchNo: 'BC20250101005',
    plateNo: '京E56789',
    trailerPlateNo: '京E56790',
    tagNos: 'T011',
    routeName: '北京-山西专线',
    runStatus: '未发车',
    plannedDepartureTime: '2025-01-01 14:00:00',
    driverName: '孙七',
    driverPhone: '13500135000',
    driverIdCard: '110101199005051234',
    vehicleType: '大型货车',
    workType: '网点非直跑车',
    departureProvince: '北京',
    departureStation: '北京南站',
    creator: '管理员',
    createTime: '2025-01-01 13:00:00',
    updater: '管理员',
    updateTime: '2025-01-01 13:00:00',
    remark: '准备发车'
  }
]

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取班车任务列表
 * @param params 查询参数
 * @returns 分页响应数据
 */
export async function getBusTaskList(
  params?: BusTaskQueryParams
): Promise<BusTaskPageResponse> {
  console.log('[API调试] getBusTaskList 被调用，参数:', JSON.stringify(params, null, 2))
  await delay(300) // 模拟网络延迟
  console.log('[API调试] 模拟延迟完成，开始处理数据')

  let filteredList = [...mockBusTasks]
  console.log('[API调试] 初始数据量:', filteredList.length)

  // 批次号筛选
  if (params?.batchNos && params.batchNos.length > 0) {
    filteredList = filteredList.filter(task => 
      params.batchNos!.includes(task.batchNo)
    )
  }

  // 发车时间筛选
  if (params?.departureTimeStart) {
    filteredList = filteredList.filter(task => 
      task.plannedDepartureTime >= params.departureTimeStart!
    )
  }
  if (params?.departureTimeEnd) {
    filteredList = filteredList.filter(task => 
      task.plannedDepartureTime <= params.departureTimeEnd!
    )
  }

  // 发车省区筛选
  if (params?.departureProvinces && params.departureProvinces.length > 0) {
    filteredList = filteredList.filter(task => 
      task.departureProvince && params.departureProvinces!.includes(task.departureProvince)
    )
  }

  // 发车站点筛选
  if (params?.departureStation) {
    filteredList = filteredList.filter(task => 
      task.departureStation === params.departureStation
    )
  }

  // 车牌号模糊搜索
  if (params?.plateNo) {
    const plateNoLower = params.plateNo.toLowerCase()
    filteredList = filteredList.filter(task => 
      task.plateNo.toLowerCase().includes(plateNoLower) ||
      (task.trailerPlateNo && task.trailerPlateNo.toLowerCase().includes(plateNoLower))
    )
  }

  // 运行状态筛选
  if (params?.runStatuses && params.runStatuses.length > 0) {
    filteredList = filteredList.filter(task => 
      params.runStatuses!.includes(task.runStatus)
    )
  }

  // 分页
  const pageNum = params?.pageNum || 1
  const pageSize = params?.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const paginatedList = filteredList.slice(start, end)

  console.log('[API调试] 筛选后数据量:', filteredList.length)
  console.log('[API调试] 分页信息:', { pageNum, pageSize, start, end })
  console.log('[API调试] 返回数据量:', paginatedList.length)

  const result = {
    list: paginatedList,
    total: filteredList.length,
    pageNum,
    pageSize
  }
  
  console.log('[API调试] getBusTaskList 返回结果:', {
    listCount: result.list.length,
    total: result.total
  })
  
  return result
}

/**
 * 获取班车任务详情
 * @param id 任务ID
 * @returns 任务详情
 */
export async function getBusTaskDetail(id: string): Promise<BusTask> {
  await delay(200)
  const task = mockBusTasks.find(t => t.id === id)
  if (!task) {
    throw new Error('任务不存在')
  }
  return { ...task }
}

/**
 * 创建班车任务（发车登记）
 * @param data 表单数据
 * @returns 创建的任务
 */
export async function createBusTask(data: BusTaskFormData): Promise<BusTask> {
  console.log('[API调试] createBusTask 被调用，数据:', JSON.stringify(data, null, 2))
  await delay(500)
  console.log('[API调试] 模拟延迟完成，开始创建任务')
  
  // 生成新的批次号
  const now = new Date()
  const batchNo = `BC${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(mockBusTasks.length + 1).padStart(3, '0')}`
  console.log('[API调试] 生成的批次号:', batchNo)
  
  const newTask: BusTask = {
    id: String(mockBusTasks.length + 1),
    batchNo,
    plateNo: data.headPlateNo,
    trailerPlateNo: data.trailerPlateNo,
    tagNos: '',
    routeName: data.routeName,
    runStatus: '未发车',
    plannedDepartureTime: now.toISOString().replace('T', ' ').substring(0, 19),
    driverName: data.driverName,
    driverPhone: data.driverPhone,
    driverIdCard: data.driverIdCard,
    vehicleType: data.vehicleType,
    workType: data.workType,
    creator: '当前用户',
    createTime: now.toISOString().replace('T', ' ').substring(0, 19),
    updater: '当前用户',
    updateTime: now.toISOString().replace('T', ' ').substring(0, 19),
    remark: data.remark
  }
  
  mockBusTasks.push(newTask)
  console.log('[API调试] 任务已创建并添加到列表，当前任务总数:', mockBusTasks.length)
  console.log('[API调试] createBusTask 返回新任务:', JSON.stringify(newTask, null, 2))
  return newTask
}

/**
 * 更新班车任务（编辑任务）
 * @param id 任务ID
 * @param data 表单数据
 * @returns 更新后的任务
 */
export async function updateBusTask(
  id: string,
  data: BusTaskEditFormData
): Promise<BusTask> {
  await delay(500)
  
  const taskIndex = mockBusTasks.findIndex(t => t.id === id)
  if (taskIndex === -1) {
    throw new Error('任务不存在')
  }
  
  const now = new Date()
  mockBusTasks[taskIndex] = {
    ...mockBusTasks[taskIndex],
    ...data,
    updater: '当前用户',
    updateTime: now.toISOString().replace('T', ' ').substring(0, 19)
  }
  
  return mockBusTasks[taskIndex]
}

/**
 * 删除班车任务
 * @param id 任务ID
 */
export async function deleteBusTask(id: string): Promise<void> {
  await delay(300)
  
  const taskIndex = mockBusTasks.findIndex(t => t.id === id)
  if (taskIndex === -1) {
    throw new Error('任务不存在')
  }
  
  mockBusTasks.splice(taskIndex, 1)
}

/**
 * 获取线路列表（用于下拉选择）
 * @param keyword 关键词
 * @returns 线路名称列表
 */
export async function getRouteList(keyword?: string): Promise<string[]> {
  console.log('[API调试] getRouteList 被调用，关键词:', keyword)
  await delay(200)
  
  const routes = [
    '北京-天津专线',
    '北京-河北专线',
    '北京-山东专线',
    '北京-河南专线',
    '北京-山西专线',
    '北京-内蒙古专线',
    '北京-辽宁专线',
    '北京-吉林专线',
    '北京-黑龙江专线'
  ]
  
  if (!keyword) {
    console.log('[API调试] getRouteList 返回全部线路，数量:', routes.length)
    return routes
  }
  
  const filtered = routes.filter(route => route.includes(keyword))
  console.log('[API调试] getRouteList 返回筛选结果，数量:', filtered.length, '关键词:', keyword)
  return filtered
}

/**
 * 获取车牌号列表（用于下拉选择）
 * @param keyword 关键词
 * @returns 车牌号列表
 */
export async function getPlateNoList(keyword?: string): Promise<string[]> {
  console.log('[API调试] getPlateNoList 被调用，关键词:', keyword)
  await delay(200)
  
  const plateNos = [
    '京A12345',
    '京B23456',
    '京C34567',
    '京D45678',
    '京E56789',
    '京F67890',
    '京G78901',
    '京H89012',
    '京J90123',
    '京K01234'
  ]
  
  if (!keyword) {
    console.log('[API调试] getPlateNoList 返回全部车牌号，数量:', plateNos.length)
    return plateNos
  }
  
  const keywordLower = keyword.toLowerCase()
  const filtered = plateNos.filter(plate => plate.toLowerCase().includes(keywordLower))
  console.log('[API调试] getPlateNoList 返回筛选结果，数量:', filtered.length, '关键词:', keyword)
  return filtered
}

/**
 * 获取省区列表（用于下拉选择）
 * @returns 省区列表
 */
export async function getProvinceList(): Promise<string[]> {
  await delay(100)
  
  return [
    '北京',
    '天津',
    '河北',
    '山西',
    '内蒙古',
    '辽宁',
    '吉林',
    '黑龙江',
    '上海',
    '江苏',
    '浙江',
    '安徽',
    '福建',
    '江西',
    '山东',
    '河南',
    '湖北',
    '湖南',
    '广东',
    '广西',
    '海南',
    '重庆',
    '四川',
    '贵州',
    '云南',
    '西藏',
    '陕西',
    '甘肃',
    '青海',
    '宁夏',
    '新疆'
  ]
}

/**
 * 获取站点列表（用于下拉选择）
 * @param province 省区（可选）
 * @returns 站点列表
 */
export async function getStationList(province?: string): Promise<string[]> {
  await delay(100)
  
  const stations = [
    '北京站',
    '北京南站',
    '北京西站',
    '北京北站',
    '天津站',
    '天津南站',
    '石家庄站',
    '太原站',
    '呼和浩特站'
  ]
  
  if (!province) {
    return stations
  }
  
  // 根据省区过滤站点（简化处理）
  if (province === '北京') {
    return ['北京站', '北京南站', '北京西站', '北京北站']
  }
  
  return stations.filter(station => station.includes(province))
}

/**
 * 根据车牌号获取车辆类型
 * @param plateNo 车牌号
 * @returns 车辆类型
 */
export async function getVehicleTypeByPlateNo(plateNo: string): Promise<string> {
  console.log('[API调试] getVehicleTypeByPlateNo 被调用，车牌号:', plateNo)
  await delay(100)
  
  // Mock 逻辑：根据车牌号判断车辆类型
  let vehicleType: string
  if (plateNo.includes('A') || plateNo.includes('C') || plateNo.includes('D')) {
    vehicleType = '大型货车'
  } else if (plateNo.includes('B') || plateNo.includes('E')) {
    vehicleType = '中型货车'
  } else {
    vehicleType = '小型货车'
  }
  console.log('[API调试] getVehicleTypeByPlateNo 返回车辆类型:', vehicleType)
  return vehicleType
}

/**
 * 根据线路名称获取作业类型
 * @param routeName 线路名称
 * @returns 作业类型
 */
export async function getWorkTypeByRoute(routeName: string): Promise<string> {
  console.log('[API调试] getWorkTypeByRoute 被调用，线路名称:', routeName)
  await delay(100)
  
  // Mock 逻辑：根据线路名称判断作业类型
  const workType = routeName.includes('专线') ? '直跑车' : '网点非直跑车'
  console.log('[API调试] getWorkTypeByRoute 返回作业类型:', workType)
  return workType
}


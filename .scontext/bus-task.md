## 1. 业务功能概述
"班车任务"模块用于对班车发车任务进行**查询、登记、编辑、删除**等管理操作，核心场景包括：
- 列表查询：按批次号（最多50个）、发车时间范围、省区/站点、车牌号、运行状态筛选。
- 发车登记：选择线路、自动带出作业类型；选择头车车牌、自动带出车辆类型；录入司机信息并提交创建。
- 编辑任务：在不可编辑的基础信息之上，维护挂厢车牌、司机信息、备注等可变字段。
- 辅助操作：批次号一键复制、查看司机信息弹窗、（预留）查看车辆轨迹。
> 说明：当前 `src/api/busTask.ts` 为 Mock 实现（内存数据 + delay），便于前端联调与演示；后续可替换为真实后端接口。

## 2. 相关文件与功能映射
### 视图/入口
- 路由入口
  - **src/router/index.ts**（`/bus-task` -> `src/views/bus-task/index.vue`，title: 班车任务）
- 主页面
  - **src/views/bus-task/index.vue**（容器页：维护查询参数、拉取列表、承接表格/弹窗事件）

### 业务模块组件
- **src/views/bus-task/SearchForm.vue**（查询条件：批次号多行输入、时间范围、省区/站点、车牌号联想、运行状态；触发查询/重置）
- **src/views/bus-task/TaskTable.vue**（列表表格：展示字段、分页、操作按钮；事件上抛）
- **src/views/bus-task/AddDialog.vue**（发车登记：表单校验 + 创建任务）
- **src/views/bus-task/EditDialog.vue**（编辑任务：表单校验 + 更新任务）
- **src/views/bus-task/DriverInfoDialog.vue**（司机信息弹窗：只读展示）

### API
- **src/api/busTask.ts**（班车任务相关 API、类型定义、Mock 数据与筛选分页逻辑）

## 3. 主要调用关系与逻辑
```flowchart
flowchart TD
  R[router /bus-task] --> P[src/views/bus-task/index.vue]

  P --> SF[SearchForm.vue]
  P --> TB[TaskTable.vue]
  P --> AD[AddDialog.vue]
  P --> ED[EditDialog.vue]
  P --> DD[DriverInfoDialog.vue]

  SF -->|emit search/reset| P
  TB -->|emit edit/delete/copy/view-driver-info/view-vehicle-track| P

  P -->|getBusTaskList| API1[src/api/busTask.ts]
  P -->|deleteBusTask| API1

  SF -->|getProvinceList/getStationList/getPlateNoList| API1
  AD -->|getRouteList/getPlateNoList/getWorkTypeByRoute/getVehicleTypeByPlateNo/createBusTask| API1
  ED -->|getPlateNoList/updateBusTask| API1
```

- 页面初始化：`index.vue` 在 `onMounted` 时计算默认发车时间范围并调用 `fetchList()` 拉取列表。
- 查询/重置：`SearchForm.vue` 仅负责维护表单输入（部分字段写入父组件 `queryParams`），通过 `emit('search'|'reset')` 触发父组件重新查询。
- 表格与分页：`TaskTable.vue` 通过 `update:page-num/page-size` 双向同步分页参数，分页变化由父组件 `fetchList()` 重新拉取。
- 新增/编辑：弹窗组件内部完成校验与 API 调用，成功后关闭弹窗并 `emit('saved')` 通知父组件刷新列表。

## 4. 关键伪代码与调用链
```pseudo
// 1) 页面集成
// src/views/bus-task/index.vue
onMounted:
  queryParams.departureTimeRange = getDefaultDepartureTimeRange()
  fetchList()

fetchList():
  params = map(queryParams) -> BusTaskQueryParams
  resp = getBusTaskList(params)
  tableData = resp.list
  total = resp.total

// 2) 查询组件（批次号多行输入 -> 数组）
// src/views/bus-task/SearchForm.vue
onBatchNoBlur:
  batchNos = textarea.splitByNewline().trim().filterNotEmpty().take(50)
  queryParams.batchNos = batchNos
  if batchNos >= 50: warn("最多查询50个批次号")

onSearchClick -> emit('search')
onResetClick:
  form.resetFields()
  batchNoInput = ''
  queryParams.batchNos = []
  emit('reset')

// 3) 发车登记（AddDialog）
onRouteSelect:
  workType = getWorkTypeByRoute(routeName)

onHeadPlateNoSelect:
  vehicleType = getVehicleTypeByPlateNo(headPlateNo)

onSave:
  validate()
  createBusTask(formData)
  closeDialog()
  emit('saved')

// 4) 编辑任务（EditDialog）
onOpen:
  formData = pick(task, editableFields)
onSave:
  validate()
  updateBusTask(task.id, formData)
  closeDialog()
  emit('saved')
```

## 5. 依赖与组件说明
- 依赖 UI：Element Plus（`el-form/el-table/el-dialog/el-pagination/el-autocomplete/el-date-picker` 等）
- 依赖框架：Vue 3 + `<script setup>` + TypeScript
- 依赖浏览器能力：`navigator.clipboard.writeText`（批次号复制）
- 关键校验规则：
  - 司机姓名：仅汉字（`/^[\u4e00-\u9fa5]+$/`）
  - 手机号：11位手机号（`/^1[3-9]\d{9}$/`）
  - 身份证：身份证号规则校验（18位，末位可 X/x）

## 6. 典型用法
- 进入“班车任务”页面（`/bus-task`），默认带出发车时间范围：
  - 当前时间 < 12 点：前日 12:00 -> 当日 12:00
  - 当前时间 ≥ 12 点：当日 12:00 -> 次日 12:00
- 输入多个批次号：在“批次号”输入框用回车分隔（最多 50 个），点击“查询”刷新列表。
- 点击“发车登记”：选择线路自动带出作业类型；选择头车车牌自动带出车辆类型；填写司机信息后提交创建。
- 在表格中：
  - 点击批次号：复制到剪贴板
  - 点击司机姓名：弹出司机信息
  - 点击“编辑/删除”：维护或移除任务
  - 点击车牌号：触发“查看车辆轨迹”（目前为 TODO 提示）

## 7. 文件地址映射表
| 业务功能 | 文件路径 |
|---|---|
| 路由入口 | src/router/index.ts |
| 主页面/容器 | src/views/bus-task/index.vue |
| 查询表单 | src/views/bus-task/SearchForm.vue |
| 列表表格/分页/操作 | src/views/bus-task/TaskTable.vue |
| 发车登记弹窗 | src/views/bus-task/AddDialog.vue |
| 编辑任务弹窗 | src/views/bus-task/EditDialog.vue |
| 司机信息弹窗 | src/views/bus-task/DriverInfoDialog.vue |
| API/类型/Mock | src/api/busTask.ts |



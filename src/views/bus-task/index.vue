<template>
  <div class="bus-task-view">
    <BusTaskSearchForm :query-params="queryParams" @search="handleSearch" @reset="handleReset" />

    <!-- 操作按钮区域 -->
    <el-card class="action-card">
      <el-button type="primary" :icon="Plus" @click="handleAdd">发车登记</el-button>
    </el-card>

    <BusTaskTable
      :loading="loading"
      :table-data="tableData"
      :total="total"
      :page-num="queryParams.pageNum"
      :page-size="queryParams.pageSize"
      @update:page-num="val => (queryParams.pageNum = val)"
      @update:page-size="val => (queryParams.pageSize = val)"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @edit="handleEdit"
      @delete="handleDelete"
      @copy="copyToClipboard"
      @view-vehicle-track="handleViewVehicleTrack"
      @view-driver-info="handleViewDriverInfo"
    />

    <BusTaskAddDialog v-model="addDialogVisible" @saved="fetchList" />

    <BusTaskEditDialog
      v-model="editDialogVisible"
      :task="currentTask"
      @saved="fetchList"
    />

    <BusTaskDriverInfoDialog
      v-model="driverInfoDialogVisible"
      :driver-info="currentDriverInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { deleteBusTask, getBusTaskList, type BusTask, type BusTaskQueryParams } from '@/api/busTask'
import BusTaskSearchForm from './SearchForm.vue'
import BusTaskTable from './TaskTable.vue'
import BusTaskAddDialog from './AddDialog.vue'
import BusTaskEditDialog from './EditDialog.vue'
import BusTaskDriverInfoDialog from './DriverInfoDialog.vue'

type BusTaskQueryModel = BusTaskQueryParams & {
  departureTimeRange?: [string, string]
  batchNos: string[]
  departureProvinces: string[]
  runStatuses: ('未发车' | '发车' | '到车')[]
  pageNum: number
  pageSize: number
}

// 响应式状态
const loading = ref(false)
const tableData = ref<BusTask[]>([])
const total = ref(0)

// 查询参数
const queryParams = reactive<BusTaskQueryModel>({
  batchNos: [],
  departureTimeRange: getDefaultDepartureTimeRange(),
  departureProvinces: [],
  departureStation: undefined,
  plateNo: undefined,
  runStatuses: [],
  pageNum: 1,
  pageSize: 10
})

// 发车登记对话框
const addDialogVisible = ref(false)

// 编辑任务对话框
const editDialogVisible = ref(false)
const currentTask = ref<BusTask>({} as BusTask)

// 司机信息对话框
const driverInfoDialogVisible = ref(false)
const currentDriverInfo = ref({
  driverName: '',
  driverPhone: '',
  driverIdCard: ''
})

/**
 * 获取默认发车时间范围
 * 当前时间早于12点，默认值为前日12点-当日12点
 * 当前时间晚于等于12点，默认值为当日12点-明日12点
 */
function getDefaultDepartureTimeRange(): [string, string] {
  const now = new Date()
  const hour = now.getHours()
  let start: Date
  let end: Date

  if (hour < 12) {
    // 前日12点-当日12点
    start = new Date(now)
    start.setDate(start.getDate() - 1)
    start.setHours(12, 0, 0, 0)
    end = new Date(now)
    end.setHours(12, 0, 0, 0)
  } else {
    // 当日12点-明日12点
    start = new Date(now)
    start.setHours(12, 0, 0, 0)
    end = new Date(now)
    end.setDate(end.getDate() + 1)
    end.setHours(12, 0, 0, 0)
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return [formatDate(start), formatDate(end)]
}

/**
 * 获取列表数据
 */
const fetchList = async () => {
  console.log('[班车任务调试] fetchList 开始执行')
  try {
    loading.value = true
    console.log('[班车任务调试] 设置 loading = true')

    // 处理查询参数
    const params: BusTaskQueryParams = {
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize
    }

    // 批次号处理
    if (queryParams.batchNos && queryParams.batchNos.length > 0) {
      params.batchNos = queryParams.batchNos
      console.log('[班车任务调试] 批次号参数:', params.batchNos)
    }

    // 发车时间处理
    if (queryParams.departureTimeRange && queryParams.departureTimeRange.length === 2) {
      params.departureTimeStart = queryParams.departureTimeRange[0]
      params.departureTimeEnd = queryParams.departureTimeRange[1]
      console.log('[班车任务调试] 发车时间范围:', params.departureTimeStart, '至', params.departureTimeEnd)
    }

    if (queryParams.departureProvinces && queryParams.departureProvinces.length > 0) {
      params.departureProvinces = queryParams.departureProvinces
      console.log('[班车任务调试] 发车省区:', params.departureProvinces)
    }

    if (queryParams.departureStation) {
      params.departureStation = queryParams.departureStation
      console.log('[班车任务调试] 发车站点:', params.departureStation)
    }

    if (queryParams.plateNo) {
      params.plateNo = queryParams.plateNo
      console.log('[班车任务调试] 车牌号:', params.plateNo)
    }

    if (queryParams.runStatuses && queryParams.runStatuses.length > 0) {
      params.runStatuses = queryParams.runStatuses
      console.log('[班车任务调试] 运行状态:', params.runStatuses)
    }

    console.log('[班车任务调试] 调用 API getBusTaskList，参数:', JSON.stringify(params, null, 2))
    const response = await getBusTaskList(params)
    console.log('[班车任务调试] API 响应成功:', {
      listCount: response.list?.length || 0,
      total: response.total,
      pageNum: response.pageNum,
      pageSize: response.pageSize
    })

    tableData.value = response.list
    total.value = response.total
    console.log('[班车任务调试] 数据已更新到表格，数据条数:', tableData.value.length)
  } catch (error) {
    console.error('[班车任务调试] 获取列表数据失败:', error)
    console.error('[班车任务调试] 错误详情:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    ElMessage.error('获取列表数据失败，请稍后重试')
  } finally {
    loading.value = false
    console.log('[班车任务调试] 设置 loading = false，fetchList 执行完成')
  }
}

/**
 * 查询处理（由子组件触发）
 */
const handleSearch = () => {
  console.log('[班车任务调试] 点击查询按钮')
  console.log('[班车任务调试] 查询前参数:', JSON.parse(JSON.stringify(queryParams)))
  queryParams.pageNum = 1
  console.log('[班车任务调试] 重置页码为 1，开始查询')
  fetchList()
}

/**
 * 重置处理（由子组件触发）
 */
const handleReset = () => {
  queryParams.batchNos = []
  queryParams.departureTimeRange = getDefaultDepartureTimeRange()
  queryParams.departureProvinces = []
  queryParams.departureStation = undefined
  queryParams.plateNo = undefined
  queryParams.runStatuses = []
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  fetchList()
}

/**
 * 分页大小改变
 */
const handleSizeChange = () => {
  fetchList()
}

/**
 * 当前页改变
 */
const handleCurrentChange = () => {
  fetchList()
}

/**
 * 发车登记
 */
const handleAdd = () => {
  console.log('[班车任务调试] 点击发车登记按钮')
  addDialogVisible.value = true
}

/**
 * 编辑任务
 */
const handleEdit = (row: BusTask) => {
  currentTask.value = { ...row }
  editDialogVisible.value = true
}

/**
 * 删除任务
 */
const handleDelete = async (row: BusTask) => {
  try {
    await deleteBusTask(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败，请稍后重试')
  }
}

/**
 * 复制到剪贴板
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}

/**
 * 查看车辆轨迹
 */
const handleViewVehicleTrack = (row: BusTask) => {
  ElMessage.info(`查看车辆轨迹功能：批次号 ${row.batchNo}，车牌号 ${row.plateNo}`)
  // TODO: 实现车辆轨迹查询页面跳转
}

/**
 * 查看司机信息
 */
const handleViewDriverInfo = (row: BusTask) => {
  currentDriverInfo.value = {
    driverName: row.driverName,
    driverPhone: row.driverPhone,
    driverIdCard: row.driverIdCard
  }
  driverInfoDialogVisible.value = true
}

// 生命周期
onMounted(() => {
  console.log('[班车任务调试] BusTask index 组件已挂载')
  console.log('[班车任务调试] 初始查询参数:', JSON.parse(JSON.stringify(queryParams)))
  console.log('[班车任务调试] 开始获取列表数据')
  fetchList()
})
</script>

<style scoped>
.bus-task-view {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100%;
}

.action-card {
  margin-bottom: 16px;
}
</style>



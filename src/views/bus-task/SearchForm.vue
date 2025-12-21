<template>
  <el-card class="search-card">
    <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="search-form">
      <el-form-item label="批次号" prop="batchNos">
        <el-input
          v-model="batchNoInput"
          type="textarea"
          :rows="2"
          placeholder="多个批次号用回车键隔开，最多查询50个"
          @blur="handleBatchNoBlur"
          style="width: 300px"
        />
      </el-form-item>

      <el-form-item label="发车时间" prop="departureTimeRange">
        <el-date-picker
          v-model="queryParams.departureTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 400px"
        />
      </el-form-item>

      <el-form-item label="发车省区" prop="departureProvinces">
        <el-select
          v-model="queryParams.departureProvinces"
          multiple
          placeholder="请选择发车省区"
          clearable
          filterable
          style="width: 200px"
          @focus="loadProvinceList"
        >
          <el-option v-for="province in provinceList" :key="province" :label="province" :value="province" />
        </el-select>
      </el-form-item>

      <el-form-item label="发车站点" prop="departureStation">
        <el-select
          v-model="queryParams.departureStation"
          placeholder="请选择发车站点"
          clearable
          filterable
          style="width: 200px"
          @focus="loadStationList"
        >
          <el-option v-for="station in stationList" :key="station" :label="station" :value="station" />
        </el-select>
      </el-form-item>

      <el-form-item label="车牌号码" prop="plateNo">
        <el-autocomplete
          v-model="queryParams.plateNo"
          :fetch-suggestions="searchPlateNo"
          placeholder="请输入车牌号码"
          clearable
          style="width: 200px"
          @select="handlePlateNoSelect"
        />
      </el-form-item>

      <el-form-item label="运行状态" prop="runStatuses">
        <el-select
          v-model="queryParams.runStatuses"
          multiple
          placeholder="请选择运行状态"
          clearable
          style="width: 200px"
        >
          <el-option label="未发车" value="未发车" />
          <el-option label="发车" value="发车" />
          <el-option label="到车" value="到车" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="emit('search')">查询</el-button>
        <el-button :icon="Refresh" @click="handleResetClick">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { getPlateNoList, getProvinceList, getStationList, type BusTaskQueryParams } from '@/api/busTask'

type BusTaskQueryModel = BusTaskQueryParams & {
  departureTimeRange?: [string, string]
  batchNos: string[]
  departureProvinces: string[]
  runStatuses: ('未发车' | '发车' | '到车')[]
  pageNum: number
  pageSize: number
}

interface PlateNoOption {
  value: string
}

const props = defineProps<{
  queryParams: BusTaskQueryModel
}>()

const emit = defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
}>()

const queryFormRef = ref<FormInstance>()
const batchNoInput = ref('')

// 下拉选项数据（组件内缓存）
const provinceList = ref<string[]>([])
const stationList = ref<string[]>([])

/**
 * 批次号输入框失焦处理
 */
const handleBatchNoBlur = () => {
  if (!batchNoInput.value.trim()) {
    props.queryParams.batchNos = []
    return
  }

  // 按回车键分割，最多50个
  const batchNos = batchNoInput.value
    .split(/[\r\n]+/)
    .map(no => no.trim())
    .filter(no => no)
    .slice(0, 50)

  props.queryParams.batchNos = batchNos

  if (batchNos.length >= 50) {
    ElMessage.warning('最多查询50个批次号')
  }
}

/**
 * 重置按钮点击
 */
const handleResetClick = () => {
  queryFormRef.value?.resetFields()
  batchNoInput.value = ''
  props.queryParams.batchNos = []
  emit('reset')
}

/**
 * 加载省区列表
 */
const loadProvinceList = async () => {
  if (provinceList.value.length > 0) return
  try {
    provinceList.value = await getProvinceList()
  } catch (error) {
    console.error('加载省区列表失败:', error)
  }
}

/**
 * 加载站点列表
 */
const loadStationList = async () => {
  if (stationList.value.length > 0) return
  try {
    stationList.value = await getStationList()
  } catch (error) {
    console.error('加载站点列表失败:', error)
  }
}

/**
 * 搜索车牌号
 */
const searchPlateNo = async (queryString: string, cb: (options: PlateNoOption[]) => void) => {
  try {
    const list = await getPlateNoList(queryString)
    const options = list.map(plate => ({ value: plate }))
    cb(options)
  } catch (error) {
    console.error('搜索车牌号失败:', error)
    cb([])
  }
}

/**
 * 车牌号选择处理
 */
const handlePlateNoSelect = () => {
  // 预留扩展
}
</script>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.search-form {
  margin-top: 10px;
}
</style>



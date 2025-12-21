<template>
  <el-dialog
    v-model="visible"
    title="发车登记"
    width="800px"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form ref="addFormRef" :model="formData" :rules="addFormRules" label-width="120px">
      <el-divider content-position="left">线路信息</el-divider>

      <el-form-item label="线路名称" prop="routeName">
        <el-autocomplete
          v-model="formData.routeName"
          :fetch-suggestions="searchRoute"
          placeholder="请输入线路名称关键词"
          style="width: 100%"
          @select="handleRouteSelect"
        />
      </el-form-item>

      <el-form-item label="作业类型" prop="workType">
        <el-input
          v-model="formData.workType"
          :disabled="isWorkTypeDisabled"
          placeholder="选择线路后自动带出"
          style="width: 100%"
        />
      </el-form-item>

      <el-divider content-position="left">车辆司机信息</el-divider>

      <el-form-item label="头车车牌" prop="headPlateNo">
        <el-autocomplete
          v-model="formData.headPlateNo"
          :fetch-suggestions="searchPlateNo"
          placeholder="请输入头车车牌关键词"
          style="width: 100%"
          @select="handleHeadPlateNoSelect"
        />
      </el-form-item>

      <el-form-item label="挂厢车牌" prop="trailerPlateNo">
        <el-autocomplete
          v-model="formData.trailerPlateNo"
          :fetch-suggestions="searchPlateNo"
          placeholder="请输入挂厢车牌关键词"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="车辆类型" prop="vehicleType">
        <el-input v-model="formData.vehicleType" disabled placeholder="选择头车车牌后自动带出" style="width: 100%" />
      </el-form-item>

      <el-form-item label="驾驶员姓名" prop="driverName">
        <el-input v-model="formData.driverName" placeholder="请输入驾驶员姓名（仅可为汉字）" style="width: 100%" />
      </el-form-item>

      <el-form-item label="联系电话" prop="driverPhone">
        <el-input
          v-model="formData.driverPhone"
          placeholder="请输入11位手机号"
          maxlength="11"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="驾驶证号" prop="driverIdCard">
        <el-input
          v-model="formData.driverIdCard"
          placeholder="请输入身份证号"
          maxlength="18"
          style="width: 100%"
        />
      </el-form-item>

      <el-divider content-position="left">其他信息</el-divider>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息（最多200个字符）"
          maxlength="200"
          show-word-limit
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSaveAdd">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  createBusTask,
  getPlateNoList,
  getRouteList,
  getVehicleTypeByPlateNo,
  getWorkTypeByRoute,
  type BusTaskFormData
} from '@/api/busTask'

interface RouteOption {
  value: string
}

interface PlateNoOption {
  value: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'saved'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

const saving = ref(false)
const addFormRef = ref<FormInstance>()

const formData = reactive<BusTaskFormData & { trailerPlateNo: string; remark: string }>({
  routeName: '',
  workType: '',
  headPlateNo: '',
  trailerPlateNo: '',
  vehicleType: '',
  driverName: '',
  driverPhone: '',
  driverIdCard: '',
  remark: ''
})

const addFormRules: FormRules = {
  routeName: [{ required: true, message: '请输入线路名称', trigger: 'blur' }],
  workType: [{ required: true, message: '作业类型不能为空', trigger: 'blur' }],
  headPlateNo: [{ required: true, message: '请输入头车车牌', trigger: 'blur' }],
  driverName: [
    { required: true, message: '请输入驾驶员姓名', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]+$/, message: '姓名仅可为汉字', trigger: 'blur' }
  ],
  driverPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' }
  ],
  driverIdCard: [
    { required: true, message: '请输入驾驶证号', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
      message: '请输入正确的身份证号',
      trigger: 'blur'
    }
  ]
}

const isWorkTypeDisabled = computed(() => {
  // 首次进入/未选线路时置灰；当为网点非直跑车时也置灰
  return !formData.routeName || formData.workType === '网点非直跑车'
})

const resetFormData = () => {
  Object.assign(formData, {
    routeName: '',
    workType: '',
    headPlateNo: '',
    trailerPlateNo: '',
    vehicleType: '',
    driverName: '',
    driverPhone: '',
    driverIdCard: '',
    remark: ''
  })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      resetFormData()
      addFormRef.value?.clearValidate()
    }
  }
)

const handleDialogClose = () => {
  addFormRef.value?.resetFields()
}

/**
 * 搜索线路
 */
const searchRoute = async (queryString: string, cb: (options: RouteOption[]) => void) => {
  try {
    const list = await getRouteList(queryString)
    cb(list.map(route => ({ value: route })))
  } catch (error) {
    console.error('搜索线路失败:', error)
    cb([])
  }
}

/**
 * 搜索车牌号
 */
const searchPlateNo = async (queryString: string, cb: (options: PlateNoOption[]) => void) => {
  try {
    const list = await getPlateNoList(queryString)
    cb(list.map(plate => ({ value: plate })))
  } catch (error) {
    console.error('搜索车牌号失败:', error)
    cb([])
  }
}

/**
 * 线路选择处理
 */
const handleRouteSelect = async () => {
  if (!formData.routeName) {
    formData.workType = ''
    return
  }

  try {
    formData.workType = await getWorkTypeByRoute(formData.routeName)
  } catch (error) {
    console.error('获取作业类型失败:', error)
    ElMessage.error('获取作业类型失败')
  }
}

/**
 * 头车车牌选择处理
 */
const handleHeadPlateNoSelect = async () => {
  if (!formData.headPlateNo) {
    formData.vehicleType = ''
    return
  }

  try {
    formData.vehicleType = await getVehicleTypeByPlateNo(formData.headPlateNo)
  } catch (error) {
    console.error('获取车辆类型失败:', error)
    ElMessage.error('获取车辆类型失败')
  }
}

/**
 * 保存发车登记
 */
const handleSaveAdd = async () => {
  if (!addFormRef.value) return

  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    saving.value = true
    await createBusTask(formData)
    ElMessage.success('发车登记成功')
    visible.value = false
    emit('saved')
  } catch (error) {
    console.error('发车登记失败:', error)
    ElMessage.error('发车登记失败，请稍后重试')
  } finally {
    saving.value = false
  }
}
</script>



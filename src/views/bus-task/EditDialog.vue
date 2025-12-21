<template>
  <el-dialog
    v-model="visible"
    title="编辑任务"
    width="800px"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form ref="editFormRef" :model="formData" :rules="editFormRules" label-width="120px">
      <el-divider content-position="left">基本信息（不可编辑）</el-divider>

      <el-form-item label="批次号">
        <el-input v-model="task.batchNo" disabled style="width: 100%" />
      </el-form-item>
      <el-form-item label="头车车牌">
        <el-input v-model="task.plateNo" disabled style="width: 100%" />
      </el-form-item>
      <el-form-item label="车辆类型">
        <el-input v-model="task.vehicleType" disabled style="width: 100%" />
      </el-form-item>
      <el-form-item label="线路名称">
        <el-input v-model="task.routeName" disabled style="width: 100%" />
      </el-form-item>
      <el-form-item label="作业类型">
        <el-input v-model="task.workType" disabled style="width: 100%" />
      </el-form-item>

      <el-divider content-position="left">可编辑信息</el-divider>

      <el-form-item label="挂厢车牌" prop="trailerPlateNo">
        <el-autocomplete
          v-model="formData.trailerPlateNo"
          :fetch-suggestions="searchPlateNo"
          placeholder="请输入挂厢车牌关键词"
          style="width: 100%"
        />
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
        <el-input v-model="formData.driverIdCard" placeholder="请输入身份证号" maxlength="18" style="width: 100%" />
      </el-form-item>

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
      <el-button type="primary" :loading="saving" @click="handleSaveEdit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getPlateNoList, updateBusTask, type BusTask, type BusTaskEditFormData } from '@/api/busTask'

interface PlateNoOption {
  value: string
}

const props = defineProps<{
  modelValue: boolean
  task: BusTask
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
const editFormRef = ref<FormInstance>()

const formData = reactive<BusTaskEditFormData & { trailerPlateNo: string; remark: string }>({
  trailerPlateNo: '',
  driverName: '',
  driverPhone: '',
  driverIdCard: '',
  remark: ''
})

const editFormRules: FormRules = {
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

const initFromTask = () => {
  Object.assign(formData, {
    trailerPlateNo: props.task.trailerPlateNo || '',
    driverName: props.task.driverName || '',
    driverPhone: props.task.driverPhone || '',
    driverIdCard: props.task.driverIdCard || '',
    remark: props.task.remark || ''
  })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      initFromTask()
      editFormRef.value?.clearValidate()
    }
  }
)

const handleDialogClose = () => {
  editFormRef.value?.resetFields()
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
 * 保存编辑
 */
const handleSaveEdit = async () => {
  if (!editFormRef.value) return
  if (!props.task?.id) return

  const valid = await editFormRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    saving.value = true
    await updateBusTask(props.task.id, formData)
    ElMessage.success('编辑任务成功')
    visible.value = false
    emit('saved')
  } catch (error) {
    console.error('编辑任务失败:', error)
    ElMessage.error('编辑任务失败，请稍后重试')
  } finally {
    saving.value = false
  }
}
</script>



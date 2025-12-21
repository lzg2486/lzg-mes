<template>
  <el-dialog v-model="visible" title="司机信息" width="500px">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="姓名">
        {{ driverInfo.driverName }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号">
        {{ driverInfo.driverPhone }}
      </el-descriptions-item>
      <el-descriptions-item label="身份证号">
        {{ driverInfo.driverIdCard }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  driverInfo: {
    driverName: string
    driverPhone: string
    driverIdCard: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})
</script>



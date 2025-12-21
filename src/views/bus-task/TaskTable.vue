<template>
  <el-card class="table-card">
    <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="batchNo" label="批次号" width="150" fixed>
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('copy', row.batchNo)">
            {{ row.batchNo }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="plateNo" label="车牌号" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('view-vehicle-track', row)">
            {{ row.plateNo }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="tagNos" label="车签号" width="200" />
      <el-table-column prop="routeName" label="线路名称" width="150" />

      <el-table-column prop="runStatus" label="运行状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getRunStatusTagType(row.runStatus)">
            {{ row.runStatus }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="plannedDepartureTime" label="计划发车时间" width="160" />
      <el-table-column prop="actualDepartureTime" label="实际发车时间" width="160" />

      <el-table-column prop="driverName" label="司机姓名" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('view-driver-info', row)">
            {{ row.driverName }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="creator" label="创建人" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column prop="updater" label="修改人" width="100" />
      <el-table-column prop="updateTime" label="修改时间" width="160" />
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />

      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" :icon="Edit" @click="emit('edit', row)">编辑</el-button>
          <el-popconfirm title="是否确认删除该批次？" @confirm="emit('delete', row)">
            <template #reference>
              <el-button link type="danger" :icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="emit('size-change')"
        @current-change="emit('current-change')"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { BusTask, RunStatus } from '@/api/busTask'

const props = defineProps<{
  loading: boolean
  tableData: BusTask[]
  total: number
  pageNum: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'update:page-num', val: number): void
  (e: 'update:page-size', val: number): void
  (e: 'size-change'): void
  (e: 'current-change'): void
  (e: 'edit', row: BusTask): void
  (e: 'delete', row: BusTask): void
  (e: 'copy', batchNo: string): void
  (e: 'view-vehicle-track', row: BusTask): void
  (e: 'view-driver-info', row: BusTask): void
}>()

const currentPage = computed({
  get: () => props.pageNum,
  set: (val: number) => emit('update:page-num', val)
})

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (val: number) => emit('update:page-size', val)
})

const getRunStatusTagType = (status: RunStatus) => {
  if (status === '到车') return 'success'
  if (status === '发车') return 'warning'
  return 'info'
}
</script>

<style scoped>
.table-card {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>



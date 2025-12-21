<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2 class="dashboard-title">MES系统看板统计</h2>
      <el-button
        type="primary"
        :icon="Refresh"
        :loading="loading"
        @click="handleRefresh"
      >
        刷新
      </el-button>
    </div>

    <div class="dashboard-content" v-loading="loading">
      <!-- 工单派发统计面板 -->
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">工单派发</span>
          </div>
        </template>
        <div class="stat-content">
          <div class="stat-item">
            <div class="stat-label">派工工单数</div>
            <div class="stat-value">{{ statistics.workOrderDispatch?.dispatchedCount ?? 0 }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">二次派工单数</div>
            <div class="stat-value">{{ statistics.workOrderDispatch?.secondaryDispatchedCount ?? 0 }}</div>
          </div>
        </div>
      </el-card>

      <!-- 生产加工统计面板 -->
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">生产加工</span>
          </div>
        </template>
        <div class="stat-content">
          <div class="stat-item">
            <div class="stat-label">日常加工单数</div>
            <div class="stat-value">{{ statistics.productionProcessing?.dailyProcessingCount ?? 0 }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">加班加工单数</div>
            <div class="stat-value">{{ statistics.productionProcessing?.overtimeProcessingCount ?? 0 }}</div>
          </div>
        </div>
      </el-card>

      <!-- 工单质检统计面板 -->
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">工单质检</span>
          </div>
        </template>
        <div class="stat-content">
          <div class="stat-item">
            <div class="stat-label">工单质检单数</div>
            <div class="stat-value">{{ statistics.workOrderInspection?.inspectionCount ?? 0 }}</div>
          </div>
        </div>
      </el-card>

      <!-- 提醒统计面板 -->
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">提醒</span>
          </div>
        </template>
        <div class="stat-content">
          <div class="stat-item">
            <div class="stat-label">报废提醒数量（直接派工单）</div>
            <div class="stat-value">{{ statistics.reminder?.scrapReminderCount ?? 0 }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">订单完成数量（直接派工单）</div>
            <div class="stat-value">{{ statistics.reminder?.directOrderCompletedCount ?? 0 }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">订单完成数量（间接派工单）</div>
            <div class="stat-value">{{ statistics.reminder?.indirectOrderCompletedCount ?? 0 }}</div>
          </div>
        </div>
      </el-card>

      <!-- 工单审核统计面板 -->
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">工单审核</span>
          </div>
        </template>
        <div class="stat-content">
          <div class="stat-item">
            <div class="stat-label">工单审核单数</div>
            <div class="stat-value">{{ statistics.workOrderApproval?.approvalCount ?? 0 }}</div>
          </div>
        </div>
      </el-card>

      <!-- 工时回传统计面板 -->
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">工时回传</span>
          </div>
        </template>
        <div class="stat-content">
          <div class="stat-item">
            <div class="stat-label">工时回传单数</div>
            <div class="stat-value">{{ statistics.workHourFeedback?.feedbackCount ?? 0 }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getDashboardStatistics, type DashboardStatistics } from '@/api/dashboard'

// 统计数据
const statistics = ref<DashboardStatistics>({
  workOrderDispatch: {
    dispatchedCount: 0,
    secondaryDispatchedCount: 0
  },
  productionProcessing: {
    dailyProcessingCount: 0,
    overtimeProcessingCount: 0
  },
  workOrderInspection: {
    inspectionCount: 0
  },
  workOrderApproval: {
    approvalCount: 0
  },
  workHourFeedback: {
    feedbackCount: 0
  },
  reminder: {
    scrapReminderCount: 0,
    directOrderCompletedCount: 0,
    indirectOrderCompletedCount: 0
  }
})

// 加载状态
const loading = ref(false)

// 自动刷新定时器
let refreshTimer: number | null = null

/**
 * 获取看板统计数据
 */
const fetchStatistics = async () => {
  try {
    loading.value = true
    const data = await getDashboardStatistics()
    // 如果接口没有返回reminder字段，使用默认值
    statistics.value = {
      ...data,
      reminder: data.reminder || {
        scrapReminderCount: 0,
        directOrderCompletedCount: 0,
        indirectOrderCompletedCount: 0
      }
    }
  } catch (error) {
    console.error('获取看板统计数据失败:', error)
    ElMessage.error('获取统计数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 手动刷新
 */
const handleRefresh = () => {
  fetchStatistics()
}

/**
 * 启动自动刷新
 */
const startAutoRefresh = () => {
  // 清除已有定时器
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  
  // 每30秒自动刷新
  refreshTimer = window.setInterval(() => {
    fetchStatistics()
  }, 30000)
}

/**
 * 停止自动刷新
 */
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 组件挂载时获取数据并启动自动刷新
onMounted(() => {
  fetchStatistics()
  startAutoRefresh()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.dashboard {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.dashboard-content {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
  gap: 20px;
  min-height: 0;
}

/* 现在有6个面板，两行三列，不需要特殊居中处理 */

.stat-card {
  height: 200px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.stat-card :deep(.el-card__body) {
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.stat-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  text-align: center;
  line-height: 1;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
  
  .stat-card {
    height: 180px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .stat-card {
    height: 160px;
  }
}
</style>

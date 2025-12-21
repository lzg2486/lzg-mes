<template>
  <div class="aside">
    <div class="logo">Custom colors</div>
    <el-menu
      class="menu"
      :default-active="activeKey"
      background-color="#545a62"
      text-color="#cfd2d6"
      active-text-color="#f2c94c"
    >
      <el-menu-item index="home" @click="goHome">
        <el-icon><HomeFilled /></el-icon>
        <span>Home</span>
      </el-menu-item>
      <el-menu-item index="busTask" @click="goBusTask">
        <el-icon><Box /></el-icon>
        <span>班车任务</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, Box } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

console.log('[菜单调试] SidebarMenu 组件初始化')

const activeKey = computed(() => {
  const key = (route.name as string) || 'home'
  console.log('[菜单调试] 计算 activeKey:', { routeName: route.name, activeKey: key })
  return key
})

// 监听路由变化
watch(() => route.name, (newName, oldName) => {
  console.log('[菜单调试] 路由名称变化:', { oldName, newName })
}, { immediate: true })

const goHome = () => {
  console.log('[菜单调试] 点击 Home 菜单')
  if (route.name !== 'home') {
    console.log('[菜单调试] 跳转到 Home')
    router.push({ name: 'home' })
  } else {
    console.log('[菜单调试] 已在 Home 页面，无需跳转')
  }
}

const goBusTask = () => {
  console.log('[菜单调试] 点击班车任务菜单')
  if (route.name !== 'busTask') {
    console.log('[菜单调试] 跳转到班车任务页面')
    router.push({ name: 'busTask' })
  } else {
    console.log('[菜单调试] 已在班车任务页面，无需跳转')
  }
}

onMounted(() => {
  console.log('[菜单调试] SidebarMenu 组件已挂载')
  console.log('[菜单调试] 当前路由信息:', {
    path: route.path,
    name: route.name,
    params: route.params,
    query: route.query
  })
})
</script>

<style scoped>
.aside {
  width: 220px;
  min-height: 100vh;
  background: #545a62;
  color: #cfd2d6;
  display: flex;
  flex-direction: column;
  padding: 12px 0 0;
}

.logo {
  color: #d9dbdf;
  font-weight: 700;
  font-size: 16px;
  padding: 0 20px 12px;
}

.menu {
  border-right: none;
}

.menu :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
}

.menu :deep(.el-menu-item.is-active) {
  background-color: transparent;
}
</style>


<template>
  <el-container class="layout">
    <sidebar-menu />
    <el-container>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import SidebarMenu from '@/components/SidebarMenu.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.main {
  padding: 24px;
}
</style>


import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

console.log('[应用调试] 开始初始化应用')

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

// 处理 aria-hidden 警告
app.mount('#app')

// 监听 body 属性变化，防止 aria-hidden 被设置
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
      const body = document.body
      if (body.getAttribute('aria-hidden') === 'true') {
        console.warn('[应用调试] 检测到 body 被设置为 aria-hidden="true"，已自动移除')
        body.removeAttribute('aria-hidden')
      }
    }
  })
})

// 初始检查
if (document.body.getAttribute('aria-hidden') === 'true') {
  console.warn('[应用调试] 检测到 body 初始状态为 aria-hidden="true"，已自动移除')
  document.body.removeAttribute('aria-hidden')
}

// 开始观察 body 属性变化
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['aria-hidden']
})

console.log('[应用调试] 应用初始化完成')


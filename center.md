## 1. 业务功能概述
"中心"模块（转运中心）主要用于展示、查询、统计和地图联动全国各地转运中心的分布与详情。典型场景包括中心列表浏览、中心详情查看、地图高亮与气泡弹窗、统计信息展示等。

## 2. 相关文件与功能映射
### 视图
- 主页面/入口页面
  - **src/views/center-list/index.vue**（中心列表页）
  - **src/views/center-detail/index.vue**（中心详情页）
- 业务模块组件
  - **src/views/center-list/components/card-list/index.vue**（卡片列表）
  - **src/views/center-list/components/card-item/index.vue**（卡片项）
  - **src/views/center-list/components/search/index.vue**、**search-options.vue**（搜索）
  - **src/views/center-detail/components/detail/index.vue**（详情卡片）
  - **src/views/center-detail/components/search/index.vue**、**search-options.vue**（详情页搜索）

### 地图绘制
- mapApp/业务事件入口文件
  - **src/modules/map-app/core/center/index.ts**（中心地图事件主类）
- 业务事件绘制类
  - **src/modules/map-app/core/center/index.ts**（集成数据加载、图层初始化、地图绘制、label管理等）
- 业务事件地图自定义气泡弹窗组件、自定义label组件
  - **src/modules/map-app/core/center/index.ts**（内置label管理，暂无独立弹窗组件）

### API
- **src/api/center/index.ts**（中心相关API）
- **src/api/center/type.ts**（中心API类型定义）

### 依赖组件
- **src/components/info-card-component/index.vue**（信息卡片，详情页复用）

## 3. 主要调用关系与逻辑
```flowchart
flowchart TD
  A[center-list/index.vue] --> B[card-list/card-item/search]
  A --> C[mapApp.center]
  B <--> C
  C --> D[center地图事件主类]
  D --> E[label管理/地图高亮]
  B <--> D
  A --> F[center-detail/index.vue]
  F --> G[detail/search]
  F --> C
  G <--> C
```
- 页面加载时，主页面初始化`center-list`组件，并将`mapApp`传递给业务组件。
- 业务组件通过`mapApp.center`访问地图事件，获取数据、渲染视图、联动地图。
- `mapApp.center`负责数据加载、图层绘制、label管理、地图高亮等。
- 详情页通过`mapApp.center.drawOne`和`drawCenterLabel`实现单点高亮与label展示。

## 4. 关键伪代码与调用链
```pseudo
// 1. 页面集成
// src/views/center-list/index.vue
<card-list :mapApp="mapApp" :list="list" @click="onCardClick" />

// 2. 事件组件
// src/views/center-list/components/card-list/index.vue
props: { mapApp }
onCardClick(item) => mapApp.center.drawOne(item)

// 3. 地图工具类
// src/modules/map-app/core/center/index.ts
async draw(params) => await getPoints(params); drawCenter()
drawOne(point) => centerLayer.setData([point]); map.setViewport([point])
drawCenterLabel(point, text) => new BMapGL.Label(text, { position: ... })

// 4. 事件调度
// src/views/center-detail/index.vue
onMounted() => mapApp.center.drawOne(point); mapApp.center.drawCenterLabel(point, name)
onUnmounted() => mapApp.center.destroy()
```

## 5. 依赖与组件说明
- 依赖地图能力：BMapGL、IconLayer（自研）、label管理
- 依赖自研能力：IconLayer、addZcatTrackEvent、toLayerPoint
- 组件复用：info-card-component、statistics-component、slider-component

## 6. 典型用法
- 进入"中心"列表页，自动加载中心数据，地图批量绘制中心点，点击卡片高亮地图并弹出label。
- 切换到"中心详情"页，地图高亮单个中心点并展示label，支持详情页内切换中心。
- 支持地图与列表联动，点击地图中心点或label可同步高亮列表项。

## 7. 文件地址映射表
| 业务功能           | 文件路径                                                                 |
|--------------------|-------------------------------------------------------------------------|
| 主页面             | src/views/center-list/index.vue                                         |
| 详情页             | src/views/center-detail/index.vue                                       |
| 业务模块组件        | src/views/center-list/components/card-list/index.vue                    |
| 卡片项组件         | src/views/center-list/components/card-item/index.vue                    |
| 搜索组件           | src/views/center-list/components/search/index.vue                       |
| 详情卡片组件       | src/views/center-detail/components/detail/index.vue                     |
| 详情页搜索组件     | src/views/center-detail/components/search/index.vue                     |
| 业务事件入口       | src/modules/map-app/core/center/index.ts                                |
| 业务事件类         | src/modules/map-app/core/center/index.ts                                |
| API                | src/api/center/index.ts                                                 |
| API类型            | src/api/center/type.ts                                                  |
| 依赖组件           | src/components/info-card-component/index.vue                            |
``` 
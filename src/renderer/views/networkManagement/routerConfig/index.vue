<template>
  <div style="width: 100%;padding-left: 24px;padding-right:24px;">
    <div class="group-detail-tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="路由监控" name="first">
          <RouterWatch v-if="activeName === 'first'" :activeName="activeName" />
        </el-tab-pane>
        <el-tab-pane label="静态路由" name="second">
          <StaticManagementPort v-if="activeName === 'second'" :activeName="activeName" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import RouterWatch from './components/routerWatch/index.vue'
import StaticManagementPort from './components/staticManagementPort/index.vue'
export default{
  name: 'RouterConfig',
  components: {
    RouterWatch, StaticManagementPort
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {

  }
}
</script>
<style>
/* 带有tabs样式 */
.group-detail-tabs {
  background: #fff;
}

.group-detail-tabs .el-tabs__item {
  font-size: 14px;
}

.group-detail-tabs .el-tabs .el-tabs__header {
  padding-left: 30px;
  padding-right: 30px;
  background: #fff;
}

.group-detail-tabs .el-tabs__content {
  margin: 0 30px;
}
</style>

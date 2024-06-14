<template>
  <div class="container-padding-body2">
    <div class="container-padding-body-wrapper">
      <div>
        <span class="title">路由监控列表</span>
      </div>
      <div style="margin-top: 26px;">
        <el-table
          :data="tableData"
          :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
          class="tableStyle tableFixedStyle">
          <el-table-column align="left" label="目的网段" min-width="160">
            <template #default="scope">
              {{ scope.row.ipAddress + '/' + scope.row.subnetMask }}
            </template>
          </el-table-column>
          <el-table-column align="left" label="类型" min-width="160">
            <template #default="scope">
              <span v-if="scope.row.type == 0">
                直连路由
              </span>
              <span v-else>
                静态路由
              </span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="出接口" min-width="160">
            <template #default="scope">
              {{ scope.row.outInterface || '--' }}
            </template>
          </el-table-column>
          <el-table-column align="left" label="下一跳网关" min-width="160">
            <template #default="scope">
              {{ scope.row.gateWay || '--' }}
            </template>
          </el-table-column>
        </el-table>
        <div class="gva-pagination">
          <el-pagination style="padding: 20px 0;"
                         :current-page="page"
                         :page-size="pageSize"
                         :page-sizes="[10, 30, 50, 100]"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper"
                         @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getRouterConfigList
} from '@/api/networkManagement'
export default{
  name: 'RouterWatchConfig',
  data () {
    return {
      tableLoading: true,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      routerTitle: '',
      routerType: -1
    }
  },
  watch: {
    'activeName': {
      handler: function (val, oldval) {
        this.getTableData()
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    async getTableData () {
      let tmpdata = {
        'type': this.routerType,
        'pageIndex': this.page,
        'pageSize': this.pageSize
      }
      let res = await getRouterConfigList(tmpdata)
      if (res.code === 200) {
        this.tableLoading = false
        this.tableData = res.data.list
        this.total = res.data.total
        this.onTotal = res.data.onTotal
      } else {
        this.tableLoading = false
      }
    },

    handleSizeChange (val) {
      this.pageSize = val
      this.page = 1
      this.getTableData()
    },

    handleCurrentChange (val) {
      this.page = val
      this.getTableData()
    }
  }
}
</script>

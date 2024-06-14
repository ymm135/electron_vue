<template>
  <div class="container-padding-body2">
    <div class="container-padding-body-wrapper">
      <div>
        <span class="title">静态路由列表</span>
        <div style="float: right;">
          <el-button
            size="mini"
            icon="el-icon-delete"
            :disabled="choosedList.length > 0 ? false : true"
            @click="deleteFunc">
            删除
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click="addFunc">
            添加
          </el-button>
        </div>
      </div>
      <div style="margin-top: 26px;">
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
          class="tableStyle tableFixedStyle">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column align="left" label="目的网段" min-width="160">
            <template #default="scope">
              {{ scope.row.ipAddress + '/' + scope.row.subnetMask }}
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
        <div class="container-choose-all-wrapper">
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
    <!-- 添加/编辑 -->
    <el-drawer v-if="addDrawerFlag" :size="dialogSize" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
      <AddComponent :activeName="activeName" :isEdit="isEdit" :choosedRow="choosedRow" @closeAddEmit="closeAddFunc" @closeEmit="closeFunc" />
    </el-drawer>
  </div>
</template>
<script>
import {
  getRouterConfigList,
  deleteRouterConfig
} from '@/api/networkManagement'
import AddComponent from './subComponents/addComponent.vue'

export default {
  name: 'RouterWatch',
  props: {
    activeName: {
      default: function () {
        return ''
      }
    }
  },
  components: {
    AddComponent
  },
  data () {
    return {
      tableLoading: true,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      routerType: 1,
      // 添加、编辑
      addDrawerFlag: false,
      addDrawer: false,
      dialogSize: '500px',
      dialogTitle: '',
      direction: 'rtl',
      classmodel: false,
      choosedRow: {},
      isEdit: false,
      deleteList: [],
      choosedList: []
    }
  },
  watch: {
    'activeName': {
      handler: function (val, oldval) {
        // if (val == 'second') {
        //   this.routerTitle = '静态路由（管理口）列表'
        //   this.routerType = 1
        // } else if (val == 'third') {
        //   this.routerTitle = '静态路由（业务口）列表'
        //   this.routerType = 2
        // }
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
    },

    handleSelectionChange (val) {
      let tmpList = []
      if (val && val.length > 0) {
        tmpList = val.map(v => v.id)
      }
      this.choosedList = tmpList
    },

    deleteFunc () {
      this.$confirm(`确定删除选中内容吗?`, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, ctx, close) => {
          if (action !== 'confirm') {
            close()
            return
          }
          ctx.confirmButtonLoading = true
          let tmpdata = {
            'ids': this.choosedList
          }
          deleteRouterConfig(tmpdata).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              if (this.page > 1) {
                this.page--
              }
              this.getTableData()
            }
            ctx.confirmButtonLoading = false
            close()
          })
        }
      }).then(() => {

      }).catch(() => {})
    },

    addFunc () {
      this.addDrawerFlag = true
      this.$nextTick(() => {
        this.addDrawer = true
      })
      this.dialogTitle = '添加'
    },

    editFunc (row) {
      this.isEdit = true
      this.addDrawerFlag = true
      this.$nextTick(() => {
        this.addDrawer = true
      })
      this.dialogTitle = '编辑'
    },

    closeDialog () {
      this.isEdit = false
      this.addDrawerFlag = false
      this.addDrawer = false
    },

    handleWrapperMousedown (e) {
      // 如果为true，则表示点击发生在遮罩层
      this.classmodel = !!e.target.classList.contains('el-drawer__container')
    },

    handleWrapperMouseup (e) {
      if ((!!e.target.classList.contains('el-drawer__container')) && this.classmodel) {
        this.closeDialog()
      } else {
        this.addDrawerFlag = true
        this.$nextTick(() => {
          this.addDrawer = true
        })
      }
      this.classmodel = false
    },

    closeAddFunc () {
      this.closeDialog()
      this.getTableData()
    },

    closeFunc () {
      this.closeDialog()
    }
  }
}
</script>

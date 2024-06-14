<template>
  <div style="width: 100%;padding-left: 24px;padding-right:24px;">
    <div class="container-padding-body2">
      <div class="interface-config-title">
        <div style="text-align: right;">
          权限：
          <el-checkbox
            class="chooseAll"
            v-model="manageInterfaceConfig.enableSSH"
            @change="updateManageInterfaceConfigFunc">
            允许SSH
          </el-checkbox>
          <el-checkbox
            class="chooseAll"
            v-model="manageInterfaceConfig.enablePING"
            @change="updateManageInterfaceConfigFunc">
            允许ping
          </el-checkbox>
          <el-checkbox
            class="chooseAll"
            v-model="manageInterfaceConfig.enableSMP"
            @change="updateManageInterfaceConfigFunc">
            安管
          </el-checkbox>
        </div>
      </div>
      <div class="container-padding-body-wrapper container-padding-body-wrapper2">
        <div>
          <span class="title">接口列表</span>
        </div>
        <div style="margin-top: 26px;">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
            class="tableStyle tableFixedStyle">
            <el-table-column align="left" label="接口名称" min-width="120" prop="outInterface" />
            <el-table-column align="left" label="IPV4/子网掩码" min-width="160">
              <template #default="scope">
                <span>
                  <span>{{ scope.row.address || '--' }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="MAC" min-width="160">
              <template #default="scope">
                <span>{{ scope.row.macAddress || '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" fixed="right" label="操作" width="160">
              <template #default="scope">
                <el-button
                  size="small"
                  type="text"
                  @click="editFunc(scope.row)">
                  编辑
                </el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="detailFunc(scope.row)">
                  详情
                </el-button>
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
    </div>
    <!-- 添加/编辑 -->
    <el-drawer v-if="addDrawerFlag" :size="dialogSize" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
      <EditComponent :isEdit="isEdit" :choosedRow="choosedRow" @closeAddEmit="closeAddFunc" @closeEmit="closeFunc" />
    </el-drawer>
    <!-- 详情 -->
    <el-drawer v-if="detailDrawerFlag" custom-class="blackDrawer" title="详情" :visible.sync="detailDrawer" :direction="detailDirection" :before-close="closeDetailDialog">
      <DetailComponent :row="detailRow" />
    </el-drawer>
  </div>
</template>
<script>
import {
  getManageInterfaceConfig, getManageInterfaceConfigList, updateManageInterfaceConfig
} from '@/api/networkManagement'
import EditComponent from './components/editComponent.vue'
import DetailComponent from './components/detailComponent.vue'
export default{
  name: 'NetworkConfig',
  components: {
    EditComponent, DetailComponent
  },
  data () {
    return {
      manageInterfaceConfig: {},
      tableLoading: true,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      addDrawerFlag: false,
      addDrawer: false,
      dialogSize: '500px',
      dialogTitle: '',
      direction: 'rtl',
      classmodel: false,
      choosedRow: {},
      isEdit: false,
      deleteList: [],
      // 详情
      detailDrawerFlag: false,
      detailDrawer: false,
      detailDirection: 'rtl',
      detailRow: {}
    }
  },
  created () {

  },
  mounted () {
    this.getManageInterfaceConfigFunc()
    this.getTableData()
  },
  methods: {
    async getManageInterfaceConfigFunc () {
      let res = await getManageInterfaceConfig()
      if (res.code === 200) {
        this.manageInterfaceConfig = res.data
      }
    },

    async updateManageInterfaceConfigFunc () {
      let tmpdata = {
        'enableSSH': this.manageInterfaceConfig.enableSSH,
        'enablePING': this.manageInterfaceConfig.enablePING,
        'enableSMP': this.manageInterfaceConfig.enableSMP
      }
      let res = await updateManageInterfaceConfig(tmpdata)
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getManageInterfaceConfigFunc()
      }
    },

    async getTableData () {
      this.tableLoading = false
      let tmpdata = {
        'pageIndex': this.page,
        'pageSize': this.pageSize
      }
      let res = await getManageInterfaceConfigList(tmpdata)
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

    editFunc (row) {
      this.isEdit = true
      let copy = Object.assign({}, row)
      this.choosedRow = copy
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
    },

    detailFunc (row) {
      this.detailDrawerFlag = true
      this.$nextTick(() => {
        this.detailDrawer = true
      })
      this.detailRow = row
    },

    closeDetailDialog () {
      this.detailDrawerFlag = false
      this.detailDrawer = false
    }
  }
}
</script>
<style>
.interface-config-title {
  margin-left: 22px;
  margin-right: 22px;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 14px;
  border-bottom: 1px solid #E4E7ED;
}
</style>

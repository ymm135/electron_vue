<template>
  <div>
    <div class="detailStyle">
      <div class="detailTitle">基本信息</div>
      <el-row class="detailrow">
        <el-col :span="12">
          接口名称：{{ businessPortDetail.outInterface }}
        </el-col>
        <el-col :span="24">
          <el-table
            :data="businessPortDetail.interfaceConfigNetArray"
            :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
            class="tableStyle tableFixedStyle">
            <el-table-column label="ip地址" prop="ipAddress" min-width="160" />
            <el-table-column label="子网掩码" prop="subnetMask" min-width="160" />
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  getBusinessInterfaceConfigDetail
} from '@/api/networkManagement'
export default {
  name: 'BusinessPortDetail',
  props: {
    row: {
      default: function () {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      businessPortDetail: {}
    }
  },
  created () {

  },
  mounted () {
    this.getBusinessInterfaceConfigDetailFunc()
  },
  methods: {
    async getBusinessInterfaceConfigDetailFunc () {
      let res = await getBusinessInterfaceConfigDetail(this.row.outInterface)
      if (res.code === 200) {
        this.businessPortDetail = res.data
      }
    }
  }
}
</script>
<style>
.detailStyle {
  font-size: 14px;
  color: #606266;
}

.detailrow {
  margin-top: 4px;
}

.detailrow .el-col {
  padding-top: 14px;
}

.detailTitle {
  text-align: left;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.detailTitle:before{
  content: ' ';
  border-left: 3px solid orangered;
  display: inline-block;
  height: 16px;
  margin-right: 6px;
}
</style>

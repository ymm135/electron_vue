<template>
  <div>
    <el-form class="formDrawer" ref="form" :model="form" :rules="rules">
      <el-form-item label="接口名称">
        <el-input v-model="form.outInterface" disabled/>
      </el-form-item>
<!--      <el-form-item label="模式">-->
<!--        <div style="background: #F5F7FA;padding: 2px 12px;">-->
<!--          <el-radio v-model="form.type" label="1">路由模式</el-radio>-->
<!--          <el-radio v-model="form.type" label="2">监听模式</el-radio>-->
<!--        </div>-->
<!--      </el-form-item>-->
<!--      <div v-if="form.type == '1'">-->
        <el-form-item>
          <el-row :gutter="20" style="color: #909399;font-size: 14px;margin-bottom: 6px;">
            <el-col :span="8">IP地址</el-col>
            <el-col :span="9">子网掩码</el-col>
          </el-row>
          <div class="bgStyle">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input v-model="routeModeObject.ipAddress" @change="ipInputChange" placeholder="x.x.x.x"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="routeModeObject.subnetMask" @change="subnetMaskInputChange"
                          placeholder="255.255.255.0或者0~32"></el-input>
              </el-col>
              <el-col :span="4" style="text-align: right;cursor: pointer;">
                <div @click="addCondition">
                  <img src="@/assets/usb_images/addBtn.png""
                       style="width: 16px;vertical-align: middle;padding-right: 4px;"/>
                  <span style="color: #303133;vertical-align: middle;">添加</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="bgStyle2" v-for="item, index in treeData" :key="index">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="inputDeep">
                  <el-input class="business-disabled-input" v-model="item.ipAddress" disabled></el-input>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="inputDeep">
                  <el-input class="business-disabled-input" v-model="item.subnetMask" disabled></el-input>
                </div>
              </el-col>
              <span @click="deleteCondition(item, index)" style="font-size: 14px;color: #303133;cursor: pointer;">
                删除
              </span>
            </el-row>
          </div>
        </el-form-item>
<!--      </div>-->
    </el-form>
    <div class="form-drawer__footer" style="width: 452px;">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="enterDialog">
        确 定
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  getBusinessInterfaceConfigDetail, updateBusinessInterfaceConfig
} from '@/api/networkManagement'
export default {
  name: 'StaticManagementPortAdd',
  props: {
    isEdit: {
      default: function () {
        return Boolean
      }
    },
    choosedRow: {
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {},
      rules: {},
      loading: false,
      searchInput: '',
      ethList: [],
      interfaceCollectionChoosedArray: [],
      routeModeObject: {
        ipAddress: '',
        subnetMask: ''
      },
      treeData: []
    }
  },
  created () {

  },
  mounted () {
    this.getBusinessInterfaceConfigDetailFunc()
  },
  methods: {
    async getBusinessInterfaceConfigDetailFunc () {
      let res = await getBusinessInterfaceConfigDetail(this.choosedRow.outInterface)
      if (res.code === 200) {
        this.form = res.data
        this.linkType = res.data.linkType
        this.treeData = this.form.interfaceConfigNetArray
      }
    },

    addCondition () {
      if ((!this.routeModeObject.ipAddress || this.routeModeObject.ipAddress == '') || (!this.routeModeObject.subnetMask || this.routeModeObject.subnetMask == '')) {
        this.$message({
          type: 'warning',
          message: 'IP地址、子网掩码必填'
        })
        return
      }
      if (this.treeData && this.treeData.length >= 5) {
        this.$message({
          type: 'warning',
          message: '最多只能填写5个'
        })
        return
      }
      this.treeData.push(this.routeModeObject)
      this.routeModeObject = {
        ipAddress: '',
        subnetMask: ''
      }
    },

    deleteCondition (item, index) {
      const itemList = this.treeData.indexOf(item)
      if (itemList !== -1) {
        this.treeData.splice(index, 1)
      }
    },

    ipInputChange () {
      let ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (!ipReg.test(this.routeModeObject.ipAddress)) {
        this.$message({
          type: 'warning',
          message: '请输入正确的IP地址'
        })
        this.routeModeObject.ipAddress = ''
      }
    },

    subnetMaskInputChange () {
      let maskReg = /^(((254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0))|(([0-9]|[1-2]\d|3[0-2])))$/
      if (!maskReg.test(this.routeModeObject.subnetMask)) {
        this.$message({
          type: 'warning',
          message: '请输入正确的子网掩码'
        })
        this.routeModeObject.subnetMask = ''
      }
    },

    async enterDialog () {
      let tmpdata = {
        'outInterface': this.form.outInterface,
        'type': this.form.type,
        'interfaceConfigNetArray': this.treeData
      }
      let res = await updateBusinessInterfaceConfig(tmpdata)
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('closeAddEmit')
      }
    },

    initForm () {

    },

    closeDialog () {
      this.$refs.form.resetFields()
      this.initForm()
      this.$emit('closeEmit')
    }
  }
}
</script>
<style>
.bgStyle {
  background: #ECEEF5;
  padding: 10px;
}

.bgStyle2 {
  padding: 14px 10px 0 10px;
}

.business-disabled-input.el-input.is-disabled .el-input__inner {
  border-color: none !important;
}

.inputDeep .business-disabled-input.el-input .el-input__inner {
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: none !important;
  border-radius: 0;
}
</style>

<template>
  <div>
    <el-form class="formDrawer" ref="form" :model="form" :rules="rules">
      <el-form-item label="IP地址" prop="ipAddress">
        <el-input v-model="form.ipAddress" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="子网掩码" prop="subnetMask">
        <el-input v-model="form.subnetMask" placeholder="255.255.255.0或者0~32"/>
      </el-form-item>
      <el-form-item label="出接口" prop="outInterface">
        <el-select v-model="form.outInterface" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in outInterfaceList"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下一跳网关" prop="gateWay">
        <el-input v-model="form.gateWay" placeholder="请输入"/>
      </el-form-item>
      <el-form-item>
        默认路由&nbsp;&nbsp;<el-switch v-model="defaultRoute" @change="changeDefultRoute"></el-switch>
      </el-form-item>
      <div style="color: red;">
        提示：手动配置的静态路由优先级高于直连路由优先级
      </div>
    </el-form>
    <div class="form-drawer__footer" style="width: 500px;">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="enterDialog">
        确 定
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  addRouterConfig,
  updateRouterConfig,
  getEthList
} from '@/api/networkManagement'

export default {
  name: 'StaticManagementPortAdd',
  props: {
    activeName: {
      default: function () {
        return ''
      }
    },
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
      form: {
        ipAddress: '',
        subnetMask: '',
        outInterface: '',
        gateWay: ''
      },
      defaultRoute: false,
      rules: {
        ipAddress: [
          {required: true, message: 'IP地址必填'},
          {
            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: '请输入正确的IP地址'
          }
        ],
        subnetMask: [
          {required: true, message: '子网掩码必填'},
          {
            pattern: /^(((254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0))|(([0-9]|[1-2]\d|3[0-2])))$/,
            message: '请输入正确的子网掩码'
          }
        ],
        outInterface: [
          {required: true, message: '出接口必填'}
        ],
        gateWay: [
          {required: true, message: '下一跳网关必填'},
          {
            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: '请输入正确的下一跳网关'
          }
        ]
      },
      outInterfaceList: [],
      loading: false
    }
  },
  created () {

  },
  mounted () {
    this.getEthListFunc()
  },
  methods: {
    async getEthListFunc () {
      let res = await getEthList()
      if (res.code === 200) {
        if (res.data && res.data.length > 0) {
          this.outInterfaceList = res.data
        }
      }
    },

    enterDialog () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          this.form.type = 1
          if (this.isEdit) {
            let res = await updateRouterConfig(this.form)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.$emit('closeAddEmit')
            }
          } else {
            let res = await addRouterConfig(this.form)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.$emit('closeAddEmit')
            } else {
              this.loading = false
            }
          }
        }
      })
    },

    initForm () {

    },

    closeDialog () {
      this.$refs.form.resetFields()
      this.initForm()
      this.$emit('closeEmit')
    },

    changeDefultRoute () {
      if (this.defaultRoute) {
        this.form.ipAddress = '0.0.0.0'
        this.form.subnetMask = '0.0.0.0'
      } else {
        this.form.ipAddress = ''
        this.form.subnetMask = ''
      }
    }
  }
}
</script>

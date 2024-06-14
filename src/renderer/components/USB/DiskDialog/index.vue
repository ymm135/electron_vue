<template>
    <div>
        <div>
            <!-- 未知设备提示框 -->
            <el-dialog title="未知设备插入提示" :visible.sync="unknowdialog" :before-close="unknowClose" :append-to-body='true' width="30%">
                <el-table :data="untableData">
                    <el-table-column prop="uuid" label="U盘编号" min-width="40%"></el-table-column>
                    <el-table-column prop="time" label="时间" min-width="40%"></el-table-column>
                    <el-table-column prop="status" label="状态" min-width="20%"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="unknowClose">取 消</el-button>
                    <el-button type="primary" @click="todisk">确 定</el-button>
                </span>
            </el-dialog>
        </div>

        <div>
            <el-dialog title="安全U盘插入" :visible.sync="safedialog" :before-close="safeClose" :append-to-body='true' width="30%">
                <span slot="footer" class="dialog-footer">
                    <el-button type="warning" @click="VirusSure" :loading="virusLoading">病毒库升级</el-button>
                    <el-button type="warning" @click="SysSure" :loading="sysLoading">系统升级</el-button>
                </span>
            </el-dialog>
        </div>

        <div>
            <el-dialog title="提示" :visible.sync="untruedialog" :before-close="diskClose" :append-to-body='true' width="30%">
            <div style="padding: 28px 73px;">
                <span>U盘扫描异常，请重新授权</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="diskClose">确 定</el-button>
            </span>
        </el-dialog>
        </div>
    </div>

</template>

<script>
import { getdiskList, getSafe, uploadSafe, getStatus, plugStatus } from '@/api/disk'

export default {
  name: 'DiskDialog',
  props: {
    componentcount: { type: Number }
  },
  data () {
    return {
      unknowdialog: false,
      safedialog: false,
      untruedialog: false,
      virusLoading: false,
      sysLoading: false,
      untableData: [],
      unknowList: [],
      componentnum: this.componentcount,
      intervaldisk: null,
      safeupgrade: '',
      curPageUrl: '' // 当前页面的路由地址
    }
  },
  watch: {
    unknowList (newval, oldval) {
      if (this.$route.path == '/UsbManagement') {
        this.unknowdialog = false
      } else {
        if (newval.length > oldval.length) {
          this.componentnum++
          if (this.componentnum == 1) {
            this.unknowdialog = false
          } else {
            this.unknowdialog = true
          }
        } else if (newval.length == 1 && newval[0] == '') {
          this.unknowdialog = false
        } else {
          let newarr = JSON.parse(JSON.stringify(newval))
          let oldarr = JSON.parse(JSON.stringify(oldval))
          let re = newarr.filter(t => oldarr.includes(t))// 判断旧数组包含的新数组的元素
          let res = JSON.stringify(re) == JSON.stringify(newarr)// 相等为true
          if (!res && newarr[0] !== '') {
            this.unknowdialog = true
          }
        }
      }
    }
  },
  created () {
    this.curPageUrl = this.$route.path
  },
  mounted () {
    this.start()
  },
  destroyed () {
    this.cleardisk()
  },
  methods: {
    loadData () {
      getdiskList().then(res => {
        if (res.code == 200) {
          this.untableData = res.data.list.unAuthorizedList
          this.unknowList = this.untableData.map((v) => v.uuid).join(',').split(',')
          if (res.msg == '2') {
            this.untruedialog = true
          }
        }
      })
      getSafe().then(res => {
        if (res.code == 200) {
          if (res.plug) {
            this.safedialog = true
          } else {
            this.safedialog = false
          }
        }
      })
      plugStatus().then(res => {
        if (res.code == 1004) {
          this.$message.error('认证卡已拔出')
        }
      })
      getStatus().then((res) => {
        if (res.code == 200) {
          if (res.status !== 2) {
            this.$store.dispatch('user/resetToken')
            this.$router.push('/Login')
          }
        }
      })
    },
    start () {
      // 计时器正在进行中，退出函数
      if (this.intervaldisk != null) {
        return
      }
      // 计时器为空，操作
      this.intervaldisk = setInterval(() => {
        this.loadData() // 加载数据函数
      }, 5000)
    },
    // 停止定时器
    cleardisk () {
      clearInterval(this.intervaldisk) // 清除计时器
      this.intervaldisk = null // 设置为null
    },
    unknowClose () {
      this.unknowdialog = false
    },
    safeClose () {
      this.safedialog = false
    },
    diskClose () {
      this.untruedialog = false
    },
    todisk () {
      this.$router.push('/UsbManagement')
      this.unknowdialog = false
    },
    // 病毒库升级
    VirusSure () {
      this.virusLoading = true
      this.safeupgrade = 'virusUpgrade'
      let tmpdata = {
        'upgrade': this.safeupgrade
      }
      uploadSafe(tmpdata).then((res) => {
        if (res.code == 200) {
          this.virusLoading = false
          this.$message.success('升级完成，请拔出U盘')
        }
      }).catch((e) => {
        this.virusLoading = false
      })
    },
    // 系统升级
    SysSure () {
      this.sysLoading = true
      this.safeupgrade = 'sysUpgrade'
      let tmpdata = {
        'upgrade': this.safeupgrade
      }
      uploadSafe(tmpdata).then((res) => {
        if (res.code == 200) {
          this.sysLoading = false
          this.$message.success('升级完成，请拔出U盘')
        }
      }).catch((e) => {
        this.sysLoading = false
      })
    }
  }
}
</script>



<template>
    <div style="width: 100%; padding-left: 24px;padding-right:24px;">
            <div style="margin-bottom: 16px;background-color: #fff;height:80px;line-height: 80px;">
                <el-form ref="form" :model="form" :inline="true" style="margin-left: 24px;">
                    <el-form-item label="用户名：">
                        <!-- <el-input style="margin-top: 24px;" v-model.trim="form.userName" placeholder="请输入用户名"></el-input> -->
                        <el-select style="margin-top: 24px;" v-model.trim="form.userName" placeholder="请选择">
                            <el-option v-for="item in userlist"
                            :key="item.userId"
                            :label="item.username"
                            :value="item.username">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="U盘名称：">
                        <el-input style="margin-top: 24px;" v-model.trim="form.diskName" placeholder="请输入U盘名称"></el-input>
                    </el-form-item>
                    <el-form-item label="在线状态：">
                        <el-select style="margin-top: 24px;" v-model="diskstatus" placeholder="请选择">
                            <el-option label="在线" value="在线"></el-option>
                            <el-option label="离线" value="离线"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button style="margin: 24px 19px 0 10px;background-color: #F26521;color:#fff;" @click="Submit">查询</el-button>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button style="float:right;margin-top: 24px;" @click="Reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div style="background-color: #fff;padding:20px 24px 0 24px;">
                <div v-if="unauth" style="margin-bottom:10px;font-size: 16px;font-weight: 500;color:#000;">待处理U盘</div>
                <el-table v-if="unauth"
                    :data="untableData"
                    stripe
                    style="width: 100%;margin-bottom:29px;">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="uuid"
                        label="U盘编号"
                        min-width="10%">
                    </el-table-column>
                    <el-table-column
                        label="U盘类型"
                        min-width="10%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.diskType == '1'">安全U盘</span>
                            <span v-else>普通U盘</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="时间"
                        min-width="10%">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        min-width="10%">
                        <template slot-scope="scope">
                            <el-button size="small" style="background-color: #F26521;color:#fff;" @click="allowAuth(scope.row)">授权</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div style="margin-bottom:10px;font-size: 16px;font-weight: 500;color:#000;">U盘管理</div>
                <el-table 
                    :data="tableData"
                    :cell-class-name="progressType"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="diskName"
                        label="U盘名称"
                        min-width="10%">
                    </el-table-column>
                    <el-table-column
                        label="U盘类型"
                        min-width="10%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.diskType == '1'">安全U盘</span>
                            <span v-else>普通U盘</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="所属用户"
                        min-width="10%">
                    </el-table-column>
                    <el-table-column
                        prop="plugstatus"
                        label="在线状态"
                        min-width="10%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.plugStatus" style="color:#67C23A;">
                                <img style="margin-right:4px;" src="../../assets/usb_images/success_log.png"/>在线
                            </span>
                            <span v-else style="color:#E6A23C;">
                                <img style="margin-right:4px;" src="../../assets/usb_images/error_log.png"/>离线
                            </span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        label="接入主机类型"
                        width="200">
                        <template slot-scope="scope">
                            <span v-if="scope.row.trustHost == 1">外部主机</span>
                            <span v-else-if="scope.row.trustHost == 2">内部主机</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop="progress"
                        label="查杀进度"
                        min-width="20%">
                        <template #default="scope">
                            <el-progress v-if="scope.row.progress == 100" :percentage="scope.row.progress" status="success"></el-progress>
                            <el-progress v-else :percentage="scope.row.progress"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="10%">
                        <template #default="scope">
                            <el-button v-if="scope.row.progress == 0 || scope.row.progress == 100" size="medium" style="color:#F26521;" type="text" @click="cancel_auth(scope.row)" >取消授权</el-button>
                            <el-button v-else size="medium" style="color:#FF2033;" type="text" @click="cancel_pro(scope.row)">取消查杀</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="usb-pagination">
                    <el-pagination style="padding: 20px 0;"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :page-sizes="[10, 30, 50, 100]"
                        :total="total"
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                    />
                </div>
            </div>

        <!-- 授权提示 -->
        <el-drawer
            title="U盘授权"
            :visible.sync="drawerauth"
            :with-header="true"
            :before-close="closeDrawer">
            <el-form ref="authform" :model="authform" :rules="rules">
                <el-form-item label="U盘ID">
                    <el-input :disabled="true" :readonly="true" v-model.trim="authform.id"></el-input>
                </el-form-item>
                <!-- <el-form-item label="U盘类型"></el-form-item>
                <el-form-item style="margin-top: -15px;">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option v-for="item in styles"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="U盘类型">
                    <el-input v-if='authform.disktype == "1"' :disabled="true" :readonly="true" placeholder="安全U盘"></el-input>
                    <el-input v-else :disabled="true" :readonly="true" placeholder="普通U盘"></el-input>
                </el-form-item>
                <el-form-item label="选择用户"></el-form-item>
                <el-form-item style="margin-top: -15px;">
                    <el-select v-model="authform.username" placeholder="请选择" @change="userchange" style="width:517px;">
                        <el-option v-for="item in userlist"
                        :key="item.userId"
                        :label="item.username"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="U盘命名" prop="diskName">
                    <el-input v-model.trim="authform.diskName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button @click="closeDrawer">取消</el-button>
                    <el-button type="warning" @click="enterSure">确定</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-dialog title="提示" :visible.sync="untruedialog" :before-close="diskClose" :append-to-body='true' width="30%">
            <div style="padding: 28px 73px;">
                <span>U盘扫描异常，请重新授权</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="diskClose">确 定</el-button>
            </span>
        </el-dialog>

        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>

<script>
import { getdiskList, authdisk, getuser, delauth, cancelpro } from '@/api/disk'
import {ifDanger} from '@/api/systemsetting'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'
import axios from 'axios'

export default{
  components: {
    // DiskDialog
    TimeoutDialog
  },
  data () {
    return {
      tableData: [],
      untableData: [],
      userlist: [],
      unauth: false,
      finddata: {},
      form: {
        userName: '',
        diskName: ''
      },
      authform: {
        id: '',
        diskName: '',
        username: '',
        userId: 1,
        disktype: ''
      },
      value: undefined,
      diskstatus: '',
      plug: '',
      count: 0,
      unknowList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      prostatus: null,
      drawerauth: false,
      unknowdialog: false,
      // progress: null,
      rules: {
        diskName: [
          { required: true, pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,10}$/, message: 'U盘名称支持10位以内的中文、英文或数字' }
        ]
      },
      intervalId: null,
      untruedialog: false
    }
  },
  created () {
    this.findList()
    this.dataRefreh()
    this.getUserList()
  },
  destroyed () {
    // 在页面销毁后，清除计时器
    this.clear()
  },
  methods: {
    findList () {
      getdiskList(this.finddata).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list.authorizedMapList
          this.untableData = res.data.list.unAuthorizedList.filter((n) => {
            return n.status !== '不支持'
          })
          this.unauth = this.untableData.length > 0
          this.unknowList = res.data.list.unAuthorizedList.map((v) => v.uuid).join(',').split(',')
          this.total = res.data.count
          if (res.msg == '2') {
            this.untruedialog = true
          }
        }
      })
    },
    diskClose () {
      this.untruedialog = false
    },
    dataRefreh () {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        this.findList() // 加载数据函数
      }, 5000)
    },
    // 停止定时器
    clear () {
      clearInterval(this.intervalId) // 清除计时器
      this.intervalId = null // 设置为null
    },
    progressType (row) {
      if (row.progress == 100) {
        row.prostatus == 'success'
      }
    },
    // 查询
    Submit () {
      if (this.diskstatus == '在线') {
        this.plug = '2'
      } else if (this.diskstatus == '离线') {
        this.plug = '1'
      } else {
        this.plug = ''
      }
      this.finddata = {
        'pageIndex': 1,
        'pageSize': this.pageSize,
        'userName': this.form.userName,
        'diskName': this.form.diskName,
        'plug': this.plug
      }
      this.findList()
    },
    Reset () {
      this.finddata = {}
      this.diskstatus = ''
      this.form = {}
      this.findList()
    },
    unknowClose () {
      this.unknowdialog = false
    },
    // 选择用户下拉框
    getUserList () {
      getuser().then(res => {
        if (res.code == 200) {
          this.userlist = res.data
          this.authform.username = this.userlist[0].username
        }
      })
    },
    // 点击授权框
    allowAuth (row) {
      let dangerdata = {
        'apiId': '9-1'
      }
      ifDanger(dangerdata).then(res => {
        if (res.code == 200) {
          if (res.data) {
            const h = this.$createElement
            this.$confirm('', {
              confirmButtonText: '继续',
              cancelButtonText: '取消',
              // type: 'warning'
              title: '危险提示',
              message: h('p', null, [
                h('span', null, '您正在进行危险操作行为： '),
                h('span', { style: 'color: #F56C6C' }, 'U盘授权, 请谨慎操作！')
              ])
            }).then(() => {
              this.authform.id = row.uuid
              this.drawerauth = true
              this.getUserList()
            })
          } else {
            this.authform.id = row.uuid
            // this.authform.username = row.userName
            this.authform.disktype = row.diskType
            this.drawerauth = true
            this.getUserList()
          }
        }
      })
    },
    closeDrawer () {
      this.drawerauth = false
      this.authform = {
        id: '',
        diskName: '',
        username: '',
        userId: 1
      }
      this.$refs['authform'].resetFields()
    },
    userchange (value) {
      this.authform.userId = value.userId
      this.authform.username = value.username
    },
    // 确认授权
    enterSure () {
      this.$refs['authform'].validate((valid) => {
        if (valid) {
          let tempdata = {
            'diskName': this.authform.diskName,
            'uuid': this.authform.id,
            'userName': this.authform.username,
            'userId': this.authform.userId,
            'diskType': this.authform.disktype
          }
          authdisk(tempdata).then(res => {
            if (res.code == 200) {
              this.drawerauth = false
              this.authform.diskName = ''
              this.findList()
              this.closeDrawer()
            }
          })
        }
      })
    },
    // 取消授权
    cancel_auth (row) {
      let dangerdata = {
        'apiId': '9-3'
      }
      ifDanger(dangerdata).then(res => {
        if (res.code == 200) {
          if (res.data) {
            const h = this.$createElement
            this.$confirm('', {
              confirmButtonText: '继续',
              cancelButtonText: '取消',
              // type: 'warning'
              title: '危险提示',
              message: h('p', null, [
                h('span', null, '您正在进行危险操作行为： '),
                h('span', { style: 'color: #F56C6C' }, 'U盘取消授权, 请谨慎操作！')
              ])
            }).then(() => {
              let tempdata = {
                'uuid': row.uuid
              }
              delauth(tempdata).then(res => {
                if (res.code == 200) {
                  this.findList()
                }
              })
            }).catch(() => {})
          } else {
            let tempdata = {
              'uuid': row.uuid
            }
            delauth(tempdata).then(res => {
              if (res.code == 200) {
                this.findList()
              }
            })
          }
        }
      })
    },
    // 取消查杀
    cancel_pro (row) {
      let dangerdata = {
        'apiId': '9-2'
      }
      ifDanger(dangerdata).then(res => {
        if (res.code == 200) {
          if (res.data) {
            const h = this.$createElement
            this.$confirm('', {
              confirmButtonText: '继续',
              cancelButtonText: '取消',
              // type: 'warning'
              title: '危险提示',
              message: h('p', null, [
                h('span', null, '您正在进行危险操作行为： '),
                h('span', { style: 'color: #F56C6C' }, 'U盘取消查杀, 请谨慎操作！')
              ])
            }).then(() => {
              let tempdata = {
                'uuid': row.uuid
              }
              cancelpro(tempdata).then(ret => {
                if (ret.code == 200) {
                  row.prostatus = 'warning'
                  row.progress = 0
                }
              })
            }).catch(() => {})
          } else {
            let tempdata = {
              'uuid': row.uuid
            }
            cancelpro(tempdata).then(ret => {
              if (ret.code == 200) {
                row.prostatus = 'warning'
                row.progress = 0
              }
            })
          }
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.findList()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.findList()
    }
  }
}
</script>
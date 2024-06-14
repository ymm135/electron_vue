<template>
    <div style="width: 100%;padding-left: 24px;padding-right:24px;">
        <div style="background-color: #fff;padding:20px 24px 0 24px;">
            <div style="margin-bottom: 10px;height:80px;line-height: 80px;">
                <span style="line-height: 24px;font-size: 16px;font-weight: 500;">用户管理</span>
                <el-button style="float:right;margin: 24px 0 10px 10px;background-color: #F26521;color:#fff;" @click="addFunc">新增用户</el-button>
            </div>
            <el-table
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                    prop="username"
                    label="用户名"
                    min-width="10%">
                </el-table-column>
                <el-table-column
                    prop="sysRole.roleName"
                    label="角色名"
                    min-width="10%">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="创建时间"
                    min-width="15%">
                </el-table-column>
                <el-table-column
                    prop="LastLoginTime"
                    label="最后登录时间"
                    min-width="15%">
                </el-table-column>
                <el-table-column
                    label="状态"
                    min-width="10%">
                    <template #default="scope">
                        <span style="width: 48px;display: inline-block;text-align: center;background-color:#FFEBE7; color:#FF2033 ;font-size:12px;font-weight: 500;" v-if='scope.row.status == "1"'>停用</span>
                        <span style="width: 48px;display: inline-block;text-align: center;background-color:#DEEBFF; color:#3169EC; font-size:12px;font-weight: 500;" v-else-if='scope.row.status == "2"'>正常</span>
                        <span style="width: 48px;display: inline-block;text-align: center;background-color:#FEEACF; color:#F4A622;font-size:12px;font-weight: 500;" v-else-if='scope.row.status == "3"'>锁定</span>
                        <!-- <el-dropdown v-else>
                            <span style="background-color:#DEEBFF; color:#3169EC; font-size:12px;font-weight: 500;" class="el-dropdown-link">
                                正常<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item style="background-color:#FEEACF; color:#F4A622;font-size:12px;font-weight: 500;" @click.native="lock(scope.row)">锁定</el-dropdown-item>
                                <el-dropdown-item style="background-color:#FFEBE7; color:#FF2033 ;font-size:12px;font-weight: 500;" @click.native="stopuse(scope.row)">停用</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="10%">
                    <template #default="scope">
                        <el-button style="color:#E6A23C;" v-if='scope.row.userId !== 1 && scope.row.status == "2"' size="small" type="text" @click="lock(scope.row)">锁定</el-button>
                        <el-button style="color:#F56C6C;" v-if='scope.row.userId !== 1 && scope.row.status == "2"' size="small" type="text" @click="stopuse(scope.row)">停用</el-button>
                        <el-button style="color:#0052D9;" v-if='scope.row.status == "1"' size="small" type="text" @click="startuse(scope.row)">启用</el-button>
                        <el-button style="color:#0052D9;" v-if='scope.row.status == "3"' size="small" type="text" @click="lockout(scope.row)">解锁</el-button>
                        <el-button style="color:#F26521;" v-if="scope.row.userId !== 1 && scope.row.userId !== 2 && scope.row.userId !== 3 && scope.row.userId !== 4" size="small" type="text" @click="editFunc(scope.row)">编辑</el-button>
                        <el-button style="color:#F26521;" v-if="scope.row.userId !== 1 && scope.row.userId !== 2 && scope.row.userId !== 3 && scope.row.userId !== 4" size="small" type="text" @click="deleteFunc(scope.row)">删除</el-button>
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

        <el-drawer
            :destroy-on-close="true"
            :title="drawertitle"
            :visible.sync="draweradd"
            :with-header="true"
            :before-close="closeDrawer">
            <el-form ref="adduserform" :model="adduserform" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input :disabled="userdisable" v-model.trim="adduserform.username" placeholder="请输入用户名" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input show-password v-model.trim="adduserform.password" placeholder="请输入8-32位大小写字母、数字、特殊符号" ></el-input>
                </el-form-item>
                <el-form-item label="内部主机" prop="hostName">
                <!-- </el-form-item> -->
                <!-- <el-form-item > -->
                    <el-select style="width:100%;" v-model="adduserform.hostName"  placeholder="请选择主机名" @change="hostchange" >
                        <el-option v-for="item in hosts"
                        :key="item.id"
                        :label="item.hostName"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户角色" prop="roleName">
                <!-- </el-form-item> -->
                <!-- <el-form-item> -->
                    <el-select style="width:100%;" :disabled="disable" v-model="adduserform.roleName" placeholder="请选择角色名" @change="rolechange" >
                        <el-option v-for="item in options"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button @click="closeDrawer">取消</el-button>
                    <el-button type="warning" @click="enterSure">确定</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>

<script>
import { getuserList, deluser, adduser, addroleList, edituser, editstatus } from '@/api/rolemanagement'
import { gethostList } from '@/api/trusthost'
import {ifDanger} from '@/api/systemsetting'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'

export default{
  components: {
    // DiskDialog
    TimeoutDialog
  },
  data () {
    return {
      tableData: [],
      draweradd: false,
      drawertitle: '',
      disable: false,
      userdisable: false,
      form: {
        username: ''
      },
      adduserform: {
        username: '',
        password: '',
        ip: '',
        hostName: '',
        roleName: '',
        roleId: null,
        id: null,
        hostId: null
      },
      options: [],
      hosts: [],
      userId: 0,
      rules: {},
      isEdit: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      status: '',
      userids: []
    }
  },
  created () {
    this.findList()
    this.getRole()
    this.findHost()
  },
  methods: {
    findList () {
      let tempdata = {
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      getuserList(tempdata).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list
          this.total = res.data.count
        }
      })
    },
    findHost () {
      gethostList().then(res => {
        if (res.code == 200) {
          this.hosts = res.data.list
        }
      })
    },
    // 重置
    Reset () {
      this.form = {}
      this.pageIndex = 1
      this.findList()
    },
    // 删除
    deleteFunc (row) {
      let dangerdata = {
        'apiId': '7-3'
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
                h('span', { style: 'color: #F56C6C' }, '删除用户, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdataarray = []
              tmpdataarray.push(row.userId)
              // 防止传空
              if (tmpdataarray !== []) {
                let tmpdata = {
                  'ids': tmpdataarray
                }
                deluser(tmpdata).then(res => {
                  if (res.code == 200) {
                    this.$message({
                      type: 'success',
                      message: res.msg
                    })
                    this.findList()
                  }
                })
              }
            }).catch(() => {})
          } else {
            let tmpdataarray = []
            tmpdataarray.push(row.userId)
            // 防止传空
            if (tmpdataarray !== []) {
              let tmpdata = {
                'ids': tmpdataarray
              }
              deluser(tmpdata).then(res => {
                if (res.code == 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  this.findList()
                }
              })
            }
          }
        }
      })
    },
    getRole () {
      addroleList().then(res => {
        if (res.code == 200) {
          this.options = res.data
          this.tableData.roleId = res.data.roleId
          this.tableData.userId = res.data.userId
        }
      })
    },
    rolechange (value) {
      this.adduserform.roleId = value
    },
    hostchange (value) {
      this.adduserform.ip = value.ip
      this.adduserform.hostName = value.hostName
      this.adduserform.hostId = value.id
    },
    // 新增
    enterSure () {
      let tempdataadd = {
        'username': this.adduserform.username,
        'password': this.adduserform.password,
        'ip': this.adduserform.ip,
        'roleId': this.adduserform.roleId,
        'hostId': this.adduserform.hostId
        // "userId": this.row.userId
      }
      let tempdataedit = {
        'username': this.adduserform.username,
        'password': this.adduserform.password,
        'ip': this.adduserform.ip,
        'roleId': this.adduserform.roleId,
        'userId': this.userId,
        'hostId': this.adduserform.hostId
      }
      // 编辑
      this.$refs['adduserform'].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            edituser(tempdataedit).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.findList()
                this.closeDrawer()
              }
            })
            // 添加
          } else {
            adduser(tempdataadd).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.findList()
                this.closeDrawer()
              }
            })
          }
        }
      })
    },
    // 锁定
    lock (row) {
      this.status = '3'
      this.userids[0] = row.userId
      this.statusFunc()
    },
    // 停用
    stopuse (row) {
      this.status = '1'
      this.userids[0] = row.userId
      this.statusFunc()
    },
    // 启用
    startuse (row) {
      this.status = '2'
      this.userids[0] = row.userId
      this.statusFunc()
    },
    // 解锁
    lockout (row) {
      this.status = '4'
      this.userids[0] = row.userId
      this.statusFunc()
    },
    // 状态
    statusFunc () {
      let tempdata = {
        'status': this.status,
        'userIds': this.userids
      }
      editstatus(tempdata).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.findList()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
        this.userids = []
      })
    },
    editFunc (row) {
      let dangerdata = {
        'apiId': '7-2'
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
                h('span', { style: 'color: #F56C6C' }, '修改用户, 请谨慎操作！')
              ])
            }).then(() => {
              this.draweradd = true
              this.drawertitle = '编辑'
              this.isEdit = true
              this.rules = {
                username: [
                  { required: true, message: '请输入用户名', trigger: 'blur'},
                  { pattern: /^[0-9a-zA-Z]{1,20}$/, message: '用户名支持20位以内英文或数字', trigger: 'blur'}
                ],
                hostName: [
                  { required: true, message: '请选择主机名', trigger: 'blur' }
                ],
                roleName: [
                  { required: true, message: '请选择角色名', trigger: 'blur' }
                ]
              },
              this.userId = row.userId
              this.adduserform.roleId = row.roleId
              this.adduserform.username = row.username
              this.adduserform.roleName = row.sysRole.roleName
              this.adduserform.ip = row.ip
              if (this.adduserform.username == 'AuditAdmin' || this.adduserform.username == 'UserAdmin' || this.adduserform.username == 'SysAdmin') {
                this.disable = true
              }
              this.userdisable = true
              for (let i = 0; i < this.hosts.length; i++) {
                if (this.hosts[i].ip == row.ip) {
                  this.adduserform.hostName = this.hosts[i].hostName
                  this.adduserform.hostId = this.hosts[i].id
                  return
                }
              }
            })
          } else {
            this.draweradd = true
            this.drawertitle = '编辑'
            this.isEdit = true
            this.rules = {
              username: [
                { required: true, message: '请输入用户名', trigger: 'blur'},
                { pattern: /^[0-9a-zA-Z]{1,20}$/, message: '用户名支持20位以内英文或数字', trigger: 'blur'}
              ],
              hostName: [
                { required: true, message: '请选择主机名', trigger: 'blur' }
              ],
              roleName: [
                { required: true, message: '请选择角色名', trigger: 'blur' }
              ]
            },
            // this.$set(this.adduserform, roleId, row.roleId)
            // this.$set(this.adduserform, username, row.username)
            // this.$set(this.adduserform, roleName, row.sysRole.roleName)
            // this.$set(this.adduserform, ip, row.ip)
            this.userId = row.userId
            this.adduserform.roleId = row.roleId
            this.adduserform.username = row.username
            this.adduserform.roleName = row.sysRole.roleName
            this.adduserform.ip = row.ip
            if (this.adduserform.username == 'AuditAdmin' || this.adduserform.username == 'UserAdmin' || this.adduserform.username == 'SysAdmin') {
              this.disable = true
            }
            this.userdisable = true
            for (let i = 0; i < this.hosts.length; i++) {
              if (this.hosts[i].ip == row.ip) {
                this.adduserform.hostName = this.hosts[i].hostName
                this.adduserform.hostId = this.hosts[i].id
                return
              }
            }
          }
        }
      })
    },
    addFunc () {
      let dangerdata = {
        'apiId': '7-1'
      }
      if (this.hosts.length == 0) {
        this.$message({
          type: 'error',
          message: '请先配置可信主机'
        })
        return
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
                h('span', { style: 'color: #F56C6C' }, '新增用户, 请谨慎操作！')
              ])
            }).then(() => {
              this.drawertitle = '添加'
              this.draweradd = true
              this.isEdit = false
              this.userdisable = false
              this.rules = {
                username: [
                  { required: true, message: '请输入用户名', trigger: 'blur'},
                  { pattern: /^[0-9a-zA-Z]{1,20}$/, message: '用户名支持20位以内英文或数字', trigger: 'blur'}
                ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/, message: '密码必须由8-32位大小写字母、数字、特殊字符组成', trigger: 'blur'}
                ],
                hostName: [
                  { required: true, message: '请选择主机名', trigger: 'blur' }
                ],
                roleName: [
                  { required: true, message: '请选择角色名', trigger: 'blur' }
                ]
              }
            })
          } else {
            this.drawertitle = '添加'
            this.draweradd = true
            this.isEdit = false
            this.userdisable = false
            this.rules = {
              username: [
                { required: true, message: '请输入用户名', trigger: 'blur'},
                { pattern: /^[0-9a-zA-Z]{1,20}$/, message: '用户名支持20位以内英文或数字', trigger: 'blur'}
              ],
              password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/, message: '密码必须由8-32位大小写字母、数字、特殊字符组成', trigger: 'blur'}
              ],
              hostName: [
                { required: true, message: '请选择主机名', trigger: 'blur' }
              ],
              roleName: [
                { required: true, message: '请选择角色名', trigger: 'blur' }
              ]
            }
          }
        }
      })
    },
    closeDrawer () {
      this.adduserform = {
        username: '',
        password: '',
        hostName: '',
        roleName: ''
      }
      this.draweradd = false
      this.isEdit = false
      this.disable = false
      // this.$refs['adduserform'].resetFields()
      // Object.assign(this.adduserform, this.$options.data().adduserform);
      this.$nextTick(() => {
        this.$refs['adduserform'].resetFields()
      })
      // this.$refs.adduserform.resetFields()
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

<style scoped>
::v-deep :focus {
    outline: 0;
}
/deep/.el-drawer__header{
    border-bottom: 1px solid #E7E7E7 !important;
    margin-bottom: 0 !important;
}
</style>

<template>
    <div style="width: 100%;padding-left: 24px;padding-right:24px;">
        <div style="background-color: #fff;padding:20px 24px 0 24px;">
            <div style="margin-bottom: 10px;height:80px;line-height: 80px;">
                <span style="line-height: 24px;font-size: 16px;font-weight: 500;color:#000;">角色管理</span>
                <el-button style="float:right;margin: 24px 0 10px 10px;background-color: #F26521;color:#fff;" @click="addFunc">新增角色</el-button>
            </div>
            
            <el-table
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                    prop="roleName"
                    label="角色名"
                    min-width="10%">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="角色描述"
                    min-width="15%">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="创建时间"
                    min-width="10%">
                </el-table-column>
                <el-table-column
                    prop="updatedAt"
                    label="修改时间"
                    min-width="10%">
                </el-table-column>
                <el-table-column label="操作" min-width="10%">
                    <template #default="scope">
                        <el-button style="margin-right:3px;color:#F26521;" v-if='!scope.row.roleName.includes("管理员")' size="small" type="text" @click="editFunc(scope.row)">编辑</el-button>

                        <el-tooltip v-if='scope.row.roleName == "超级管理员" ' popper-class="item" :content="supercontent" effect="light" placement="top">
                            <!-- <el-button size="small" type="text" v-if='!scope.row.roleName.includes("管理员")'>权限详情</el-button> -->
                            <el-button style="color:#F26521;" size="small" type="text">权限详情</el-button>
                        </el-tooltip>
                        <el-tooltip v-else popper-class="item" :content="scope.row.sysMenu.map(v=>v.title).join(' ')" effect="light" placement="top">
                            <!-- <el-button size="small" type="text" v-if='!scope.row.roleName.includes("管理员")'>权限详情</el-button> -->
                            <el-button style="color:#F26521;" size="small" type="text">权限详情</el-button>
                        </el-tooltip>

                        <el-button style="color:#F26521;" v-if='!scope.row.roleName.includes("管理员")' size="small" type="text" @click="deleteFunc(scope.row)">删除</el-button>
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

            <el-drawer
                :title="drawertitle"
                :visible.sync="draweradd"
                :with-header="true"
                :before-close="closeDrawer">
                <el-form ref="addform" :model="addform" :rules="rules">
                    <el-form-item label="角色名" prop="roleName">
                        <el-input v-model.trim="addform.roleName" :disabled="editdisable" placeholder="请输入角色名"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="remark">
                        <el-input v-model.trim="addform.remark" placeholder="请输入角色描述"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <div>权限</div>
                        <el-checkbox  v-model="source" style="display:block;" @change="handleCheckAll">资源库</el-checkbox>

                            <el-checkbox style="margin-left:30px;" :indeterminate="ischeckAccess" v-model="checkAccess" @change="handleAllAccess">访问方式</el-checkbox>
                            <el-checkbox-group class="stylecheckbox" style="margin-left:60px;" v-model="checkedMethod" @change="handlecheckedMethod">
                                <el-checkbox v-model="web" label="WEB" disabled style="color:#C0C4CC;"></el-checkbox>
                                <el-checkbox v-for="item in accesss" :key="item" :label="item" :value="item" >{{item.slice(4)}}</el-checkbox>
                                <el-tooltip class="item" content="勾选UNC时,用户可通过UNC方式上传、下载文件" effect="dark" placement="top">
                                    <el-button type="text" ><img style="vertical-align: middle;" :src='require("../../assets/usb_images/question.png")'/></el-button>
                                </el-tooltip>
                            </el-checkbox-group>

                            <el-checkbox style="margin-left:30px;" :indeterminate="ischeckConfig" v-model="checkConfig" @change="handleAllConfig">权限设置</el-checkbox>
                            <el-checkbox-group style="margin-left:60px;" v-model="checkedType" @change="handleCheckedType">
                                <el-checkbox v-for="item in configs" :key="item" :label="item" >{{item.slice(4)}}</el-checkbox> 
                            </el-checkbox-group>
                       
                        <el-checkbox v-model="checkedlog">日志管理</el-checkbox>
                    </el-form-item>

                    <el-form-item style="float:right;">
                        <el-button @click="closeDrawer">取消</el-button>
                        <el-button type="warning" @click="enterSure">确定</el-button>
                    </el-form-item>
                </el-form>

            </el-drawer>
        </div>

        <!-- <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog> -->
        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>

<script>
import { getroleList, delrole, addrole, editrole } from '@/api/rolemanagement'
import { getAccess } from '@/api/source'
import {ifDanger} from '@/api/systemsetting'
// import  DiskDialog  from '@/components/USB/DiskDialog/index'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'

const modelTypeConfig = ['554:新建文件夹', '555:删除', '558:复制', '559:移动', '557:重命名', '556:上传', '560:下载']
const modelAccess = ['561:SFTP/FTP', '567:UNC']
export default{
  components: {
    // DiskDialog
    TimeoutDialog
  },
  data () {
    return {
      componentcount: 0,
      configs: modelTypeConfig,
      accesss: modelAccess,
      ischeckAccess: false,
      checkAccess: false,
      ischeckConfig: false,
      checkConfig: false,
      values1: [],
      labels2: [],
      values2: [],
      labels2: [],
      checkedType: [],
      checkedMethod: ['WEB'],
      web: true,
      tableData: [],
      drawertitle: '',
      detailVisible: false,
      isEdit: false,
      roleId: 0,
      form: {
        roleName: ''
      },
      addform: {
        roleName: '',
        remark: '',
        log: []
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,10}$/, message: '角色名支持10位以内中文、英文或数字', trigger: 'blur'}
        ],
        remark: [
          { required: true, message: '请输入角色描述', trigger: 'blur'},
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,10}$/, message: '角色描述支持10位以内中文、英文或数字', trigger: 'blur'}
        ]
      },
      draweradd: false,
      checkAll: false,
      checkedlog: false,
      source: false,
      menulist: [],
      detail: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      popcontent: '',
      editdisable: true,
      supercontent: '资源库 白名单 黑名单 隔离区 日志管理 用户管理 U盘管理 主机管理 系统设置 新建文件夹 删除 上传 重命名 复制 移动 下载 FTP/SFTP UNC'
    }
  },
  created () {
    this.findList()
    this.findAccess()
  },
  methods: {
    findList () {
      let tempdata = {
        'roleName': this.form.roleName,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      getroleList(tempdata).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list
          this.total = res.data.count
        }
      })
    },
    // 获得权限
    findAccess () {
      getAccess().then((res) => {
        if (res.code == 200) {
          this.filepermission = res.data.filePermission
        }
      })
    },
    Reset () {
      this.form = {}
      this.pageIndex = 1
      this.findList()
    },
    // 查询
    Submit () {
      this.pageIndex = 1
      this.findList()
    },
    // 删除
    deleteFunc (row) {
      let dangerdata = {
        'apiId': '8-3'
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
                h('span', { style: 'color: #F56C6C' }, '删除角色, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdataarray = []
              tmpdataarray.push(row.roleId)
              let tmpdata = {
                'ids': tmpdataarray
              }
              delrole(tmpdata).then(res => {
                if (res.code == 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  this.findList()
                }
              })
            }).catch(() => {})
          } else {
            let tmpdataarray = []
            tmpdataarray.push(row.roleId)
            let tmpdata = {
              'ids': tmpdataarray
            }
            delrole(tmpdata).then(res => {
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
      })
    },
    // 新增
    enterSure () {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          if (this.checkedlog) {
            this.menulist.push(548)
          }
          if (this.source) {
            this.menulist.push(544)
          }
          this.menulist.push(...this.values1, ...this.values2)
          let arr = this.menulist.filter((n) => {
            return n > 0
          })
          this.menulist = arr

          if (this.values1.length == 0) {
            this.$message.warning('请选择权限设置')
          } else {
            let tempdataedit = {
              'roleName': this.addform.roleName,
              'roleId': this.roleId,
              'remark': this.addform.remark,
              'admin': false,
              'menuIds': this.menulist
            }
            let tempdataadd = {
              'roleName': this.addform.roleName,
              'remark': this.addform.remark,
              'admin': false,
              'menuIds': this.menulist
            }
            if (this.isEdit) {
              editrole(tempdataedit).then(res => {
                if (res.code == 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  this.closeDrawer()
                  this.findList()
                }
              })
            } else {
              addrole(tempdataadd).then(ret => {
                if (ret.code == 200) {
                  this.$message({
                    type: 'success',
                    message: ret.msg
                  })
                  this.closeDrawer()
                  this.findList()
                }
              })
            }
          }
        }
      })
    },
    editFunc (row) {
      let dangerdata = {
        'apiId': '8-2'
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
                h('span', { style: 'color: #F56C6C' }, '修改角色, 请谨慎操作！')
              ])
            }).then(() => {
              this.draweradd = true
              this.drawertitle = '编辑'
              this.editdisable = true
              this.roleId = row.roleId
              this.isEdit = true
              let copy = Object.assign({}, row)
              this.addform = copy
              let tmpdata = {
                'roleId': row.roleId
              }
              getroleList(tmpdata).then((res) => {
                if (res.code == 200) {
                  let arr = res.data.list[0].sysMenu.map(v => v.menuId)
                  if (arr.indexOf(561) > -1) { this.checkedMethod.push('561:SFTP/FTP') }
                  if (arr.indexOf(567) > -1) { this.checkedMethod.push('567:UNC') }
                  if (arr.indexOf(554) > -1) { this.checkedType.push('554:新建文件夹') }
                  if (arr.indexOf(555) > -1) { this.checkedType.push('555:删除') }
                  if (arr.indexOf(556) > -1) { this.checkedType.push('556:上传') }
                  if (arr.indexOf(557) > -1) { this.checkedType.push('557:重命名') }
                  if (arr.indexOf(558) > -1) { this.checkedType.push('558:复制') }
                  if (arr.indexOf(559) > -1) { this.checkedType.push('559:移动') }
                  if (arr.indexOf(560) > -1) { this.checkedType.push('560:下载') }
                  if (arr.indexOf(548) > -1) { this.checkedlog = true }
                  if (arr.indexOf(544) > -1) { this.source = true }
                  this.values1 = this.checkedType.map(n => parseInt(n.slice(0, 3)))
                  this.values2 = this.checkedMethod.map(n => parseInt(n.slice(0, 3)))
                }
              })
            })
          } else {
            this.draweradd = true
            this.drawertitle = '编辑'
            this.editdisable = true
            this.roleId = row.roleId
            this.isEdit = true
            let copy = Object.assign({}, row)
            this.addform = copy
            let tmpdata = {
              'roleId': row.roleId
            }
            getroleList(tmpdata).then((res) => {
              if (res.code == 200) {
                let arr = res.data.list[0].sysMenu.map(v => v.menuId)
                if (arr.indexOf(561) > -1) { this.checkedMethod.push('561:SFTP/FTP') }
                if (arr.indexOf(567) > -1) { this.checkedMethod.push('567:UNC') }
                if (arr.indexOf(554) > -1) { this.checkedType.push('554:新建文件夹') }
                if (arr.indexOf(555) > -1) { this.checkedType.push('555:删除') }
                if (arr.indexOf(556) > -1) { this.checkedType.push('556:上传') }
                if (arr.indexOf(557) > -1) { this.checkedType.push('557:重命名') }
                if (arr.indexOf(558) > -1) { this.checkedType.push('558:复制') }
                if (arr.indexOf(559) > -1) { this.checkedType.push('559:移动') }
                if (arr.indexOf(560) > -1) { this.checkedType.push('560:下载') }
                if (arr.indexOf(548) > -1) { this.checkedlog = true }
                if (arr.indexOf(544) > -1) { this.source = true }
                this.values1 = this.checkedType.map(n => parseInt(n.slice(0, 3)))
                this.values2 = this.checkedMethod.map(n => parseInt(n.slice(0, 3)))
                this.ischeckConfig = this.checkedType.length > 0
                this.ischeckAccess = this.checkedMethod.length > 1
              }
            })
          }
        }
      })
    },
    addFunc () {
      let dangerdata = {
        'apiId': '8-1'
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
                h('span', { style: 'color: #F56C6C' }, '新增角色, 请谨慎操作！')
              ])
            }).then(() => {
              this.drawertitle = '添加'
              this.draweradd = true
              this.isEdit = false
              this.editdisable = false
            })
          } else {
            this.drawertitle = '添加'
            this.draweradd = true
            this.isEdit = false
            this.editdisable = false
            this.$nextTick(() => {
              this.$refs.addform.clearValidate()
            })
          }
        }
      })
    },
    closeDrawer () {
      this.addform = {
        username: '',
        password: '',
        ip: '',
        roleName: '',
        remark: ''
      }
      this.draweradd = false
      this.isEdit = false
      this.menulist = []
      this.values1 = []
      this.values2 = []
      this.checkedType = []
      this.checkedMethod = ['WEB']
      this.checkAccess = false
      this.checkConfig = false
      this.ischeckAccess = false
      this.ischeckConfig = false
      this.source = false
      this.checkedlog = false
      this.$refs.addform.resetFields()
      // Object.assign(this.addform, this.$options.data().addform);
    },
    // 资源库全选-待改
    handleCheckAll (val) {
      //     this.checkedType = val ? modelTypeConfig : [];
      //     this.checkedMethod = val ? modelAccess : [];
      this.checkAccess = val
      this.checkConfig = val
      // this.ischeckAccess = !val
      // this.ischeckConfig = !val
      //     if(val){
      //         this.values1 = [554, 555, 556, 557, 558, 559, 560]
      //         this.values2 = [561, 567]
      //     }else{
      //         this.values1 = []
      //         this.values2 = []
      //     }
      this.handleAllConfig(val)
      this.handleAllAccess(val)
      this.source = val
    },
    // 权限
    handleAllConfig (value) {
      this.checkedType = value ? modelTypeConfig : []
      this.values1 = value ? [554, 555, 556, 557, 558, 559, 560] : []
      this.ischeckConfig = false
      this.source = this.checkedType.length != 0
    },
    // 权限
    handleCheckedType (val) {
      this.values1 = []
      this.labels1 = []
      val.forEach(item => {
        const value = parseInt(item.split(':')[0])
        const label = item.split(':')[1]
        this.values1.push(value)
        this.labels1.push(label)
      })
      if (this.values1.length > 0) {
        this.source = true
      } else {
        this.source = false
      }
      let checkedCount = val.length
      this.checkConfig = checkedCount === this.configs.length
      this.ischeckConfig = checkedCount > 0 && checkedCount < this.configs.length
    },
    // 访问方式
    handleAllAccess (value) {
      this.checkedMethod = value ? ['WEB', '561:SFTP/FTP', '567:UNC'] : ['WEB']
      this.values2 = value ? [561, 567] : []
      this.ischeckAccess = false
    },
    // 访问方式
    handlecheckedMethod (val) {
      this.values2 = []
      this.labels2 = []
      val.forEach(item => {
        if (item !== 'WEB') {
          const value = parseInt(item.split(':')[0])
          const label = item.split(':')[1]
          this.values2.push(value)
          this.labels2.push(label)
        }
      })
      let checkedCount = val.length
      this.checkAccess = checkedCount === 3
      this.ischeckAccess = checkedCount > 1 && checkedCount < 3
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
.item{
    font-size: 14px;
    font-weight: 400;
    color: #606266;
}

/deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #F2F6FC;
    border-color: #DCDFE6;
}

</style>
<style>
.el-tooltip__popper[x-placement^="top"] .popper__arrow {   
	border-top-color: #fff !important;
}
.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {  
	border-top-color: #fff !important;
}

.el-tooltip__popper {
  color: #606266 !important;
  background: #fff !important;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1) !important;
  border-radius: 4px;
  border: none !important;
}
.el-checkbox__label {
    display: inline-block;
    padding-left: 6px;
    line-height: 19px;
    font-size: 14px;
    width: 60px;
}
.stylecheckbox label:nth-child(3)>span:nth-child(2){
    width:36px !important;
}
/* .el-checkbox:last-of-type {
    margin-right: 0;
    width: 50px !important;
} */
</style>
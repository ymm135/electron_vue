<template>
    <div style="width: 100%; padding-left: 24px;padding-right:24px;">
        <div style="margin-bottom: 16px;background-color: #fff;height:80px;line-height: 80px;">
            <el-form ref="form" :model="form" :inline="true" style="margin-left: 24px">
                <el-form-item label="主机名称：">
                    <el-input style="margin-top:24px;" v-model.trim="form.hostname" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="主机IP：">
                    <el-input style="margin-top:24px;" v-model.trim="form.ipname" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button style="margin: 24px 15px 0 10px;background-color: #F26521;color:#fff;" @click="Submit">查询</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button style="margin-left: 10px;margin-top: 24px;" @click="Reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

            <div style="background-color: #fff;padding:20px 24px 0 24px;">
                <el-form :inline="true">
                    <span style="line-height: 24px;font-size: 16px;font-weight: 500;">内部主机</span>
                    <el-form-item style="float:right;">
                        <el-button style="background-color: #F26521;color:#fff;margin-right: -10px;" @click="addFunc">添加</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        prop="hostName"
                        label="主机名称"
                        min-width="20%">
                    </el-table-column>
                    <el-table-column
                        prop="ip"
                        label="主机IP"
                        min-width="20%">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="主机描述"
                        min-width="30%">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        min-width="20%">
                        <template #default="scope">
                            <el-button v-if='scope.row.hostName !== "Any"' size="small" type="text" style="color:#F26521;" @click="editFunc(scope.row)">编辑</el-button>
                            <el-button v-if='scope.row.hostName !== "Any"' size="small" type="text" style="color:#F26521;" @click="deleteFunc(scope.row)">删除</el-button>
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
            title="添加"
            :visible.sync="draweradd"
            :before-close="closeAddDrawer"
            :with-header="true">
            <el-form ref="addhostform" :model="addhostform" :rules="addrules">
                <el-form-item label="主机名称" prop="hostname">
                    <el-input v-model.trim="addhostform.hostname" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="主机IP" prop="ip">
                    <el-input v-model.trim="addhostform.ip" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input v-model.trim="addhostform.remark" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button @click="closeAddDrawer">取消</el-button>
                    <el-button type="warning" @click="addenterSure">确定</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-drawer
            title="编辑"
            :visible.sync="draweredit"
            :before-close="closeEditDrawer"
            :with-header="true">
            <el-form ref="edithostform" :model="edithostform" :rules="editrules">
                <el-form-item label="主机名称">
                    <el-input v-model.trim="edithostform.hostname" :disabled="true" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="主机IP" prop="ip">
                    <el-input v-model.trim="edithostform.ip" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input v-model.trim="edithostform.remark" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button @click="closeEditDrawer">取消</el-button>
                    <el-button type="warning" @click="editenterSure">确定</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>

<script>
import { gethostList, delhost, editInfo, addhostList, puthost } from '@/api/trusthost'
import {ifDanger} from '@/api/systemsetting'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'

export default{
  components: {
    TimeoutDialog
  },
  data () {
    return {
      form: {
        hostname: '',
        ipname: ''
      },
      addhostform: {
        hostname: '',
        ip: '',
        remark: ''
      },
      edithostform: {
        hostname: '',
        ip: '',
        remark: '',
        id: ''
      },
      tableData: [],
      draweradd: false,
      draweredit: false,
      // 编辑框禁用
      disabled: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addrules: {
        hostname: [
          { required: true, message: '请输入主机名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,10}$/, message: '主机名称支持10位以内中文、英文或数字', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入主机描述信息', trigger: 'blur' },
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,10}$/, message: '主机描述支持10位以内中文、英文或数字', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ]
      },
      editrules: {
        remark: [
          { required: true, message: '请输入主机描述信息' },
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,10}$/, message: '主机描述支持10位以内中文、英文或数字', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP地址' }
        ]
      }
    }
  },
  created () {
    this.findList()
  },
  methods: {
    findList () {
      let tempdata = {
        'hostName': this.form.hostname,
        'ip': this.form.ipname,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      gethostList(tempdata).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list
          this.total = res.data.count
        }
      })
    },
    // 重置
    Reset () {
      this.form = {}
      this.pageIndex = 1
      this.findList()
    },
    Submit () {
      this.pageIndex = 1
      this.findList()
    },
    // 添加
    addFunc () {
      let dangerdata = {
        'apiId': '10-1'
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
                h('span', { style: 'color: #F56C6C' }, '新增内部主机, 请谨慎操作！')
              ])
            }).then(() => {
              this.draweradd = true
            }).catch(() => {})
          } else {
            this.draweradd = true
          }
        }
      })
    },
    // 确认添加
    addenterSure () {
      this.$refs['addhostform'].validate((valid) => {
        if (valid) {
          let tmpdata = {
            'ip': this.addhostform.ip,
            'remark': this.addhostform.remark,
            'hostName': this.addhostform.hostname
          }
          addhostList(tmpdata).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.findList()
              this.closeAddDrawer()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        }
      })
    },
    closeAddDrawer () {
      this.addhostform.ip = ''
      this.addhostform.remark = ''
      this.addhostform.hostname = ''
      this.draweradd = false
      this.$refs.addhostform.resetFields()
    },
    // 编辑
    editFunc (row) {
      let dangerdata = {
        'apiId': '10-2'
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
                h('span', { style: 'color: #F56C6C' }, '修改内部主机, 请谨慎操作！')
              ])
            }).then(() => {
              this.draweredit = true
              this.edithostform.id = row.id
              editInfo(row.id).then(res => {
                if (res.code == 200) {
                  this.edithostform.hostname = res.data.hostName
                  this.edithostform.ip = res.data.ip
                  this.edithostform.remark = res.data.remark
                }
              })
            }).catch(() => {})
          } else {
            this.draweredit = true
            this.edithostform.id = row.id
            editInfo(row.id).then(res => {
              if (res.code == 200) {
                this.edithostform.hostname = res.data.hostName
                this.edithostform.ip = res.data.ip
                this.edithostform.remark = res.data.remark
              }
            })
          }
        }
      })
    },
    // 确认编辑
    editenterSure () {
      let tmpdata = {
        'ip': this.edithostform.ip,
        'remark': this.edithostform.remark,
        'hostName': this.edithostform.hostname,
        'id': this.edithostform.id
      }
      puthost(tmpdata).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.findList()
          this.closeEditDrawer()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    closeEditDrawer () {
      this.edithostform.ip = ''
      this.edithostform.remark = ''
      this.edithostform.hostname = ''
      this.draweredit = false
    },
    // 删除
    deleteFunc (row) {
      let dangerdata = {
        'apiId': '10-3'
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
                h('span', { style: 'color: #F56C6C' }, '删除内部主机, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdataarray = []
              tmpdataarray.push(row.id)
              let tmpdata = {
                'ids': tmpdataarray
              }
              delhost(tmpdata).then(res => {
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
            tmpdataarray.push(row.id)
            let tmpdata = {
              'ids': tmpdataarray
            }
            delhost(tmpdata).then(res => {
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
/deep/.el-drawer__header{
    border-bottom: 1px solid #E7E7E7 !important;
    margin-bottom: 0 !important;
}
</style>
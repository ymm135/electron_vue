<template>
    <div style="width: 100%; padding-left: 24px;padding-right:24px;">
      <div style="margin-bottom: 16px;background-color: #fff;height:80px;line-height: 80px;">
        <span style="margin-left: 20px;font-size: 14px;color: #606266;">文件类型：</span>
        <el-input v-model="filetype" placeholder="请输入文件类型" style="width: 200px" />
  
        <el-button style="float:right;margin: 24px 24px 0 10px;background-color: #F26521;color:#fff;" @click="Submit">查询</el-button>
        <el-button type="default" style="margin-left: 10px;float:right;margin-top: 24px;" @click="Reset">重置</el-button>
      </div>

      <div style="background-color: #fff;padding:20px 24px 0 24px;">
        <span style="line-height: 24px;font-size: 16px;">黑名单</span>
        <div style="margin-bottom: 10px;float:right;">
          <el-button type="default" style="margin-left: 10px;" @click="delFunc">删除</el-button>
          <el-button type="default" style="margin-left: 10px;" @click="editFunc">编辑</el-button>
          <el-button style="margin-left: 10px;background-color: #F26521;color:#fff;" @click="addFunc">添加</el-button>
        </div>
    
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          stripe
        >
          <el-table-column
          type="selection"
          width="55">
          </el-table-column>
          <el-table-column
            prop="fileType"
            label="文件类型"
            min-width="70%">
          </el-table-column>
          <el-table-column
            align="center"
            label="禁止上传"
            min-width="15%"
          >
            <template slot-scope="scope">
              <el-image style="width: 16px;" v-if='scope.row.permission == "1" || scope.row.permission == "3"'
                :src='require("../../assets/usb_images/checked.png")'></el-image>
              <el-image v-else :src='require("../../assets/usb_images/unchecked.png")'></el-image>
            </template>
          </el-table-column>
          <el-table-column
          align="center"
            label="文件隔离"
            min-width="15%"
          >
            <template slot-scope="scope">
                <el-image style="width: 16px;" v-if='scope.row.permission == "2" || scope.row.permission == "3"'
                  :src='require("../../assets/usb_images/checked.png")'></el-image>
                <el-image v-else :src='require("../../assets/usb_images/unchecked.png")'></el-image>
              </template>
          </el-table-column>
        </el-table>

        <div class="usb-pagination">
            <el-pagination style="padding: 20px 0; margin-left: 337px"
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

      <el-dialog
        :title="diatitle"
        :visible.sync="dialogVisible"
        :before-close="closeDialog"
        width="30%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :validate-on-rule-change="false">
            <el-form-item label="文件类型" prop="edittype" style="margin-bottom: 12px;">
              <el-input :disabled="disable" v-model="ruleForm.edittype" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="banload">禁止上传</el-checkbox>
              <el-checkbox v-model="fileiso">文件隔离</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button style="float: right;" type="primary" @click="enterSure">确 定</el-button>
              <el-button style="float: right; margin-right: 6px;" @click="closeDialog">取 消</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>

      <!-- <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog> -->
      <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
  </template>
  
  <script>
  import { getList, delList, addList, editList } from '@/api/blacklist'
  import {ifDanger} from '@/api/systemsetting'
  // import  DiskDialog  from '@/components/USB/DiskDialog/index'
  import TimeoutDialog from '@/components/USB/TimeoutDialog/index'
  
  export default {
    name: 'Blacklist',
    components: {
      // DiskDialog
      TimeoutDialog
    },
    data () {
      return {
        componentcount: 0,
        filetype: '',
        permission: undefined,
        editpermission: '',
        tableData: [],
        deleteList: [],
        edittList: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        banload: false,
        fileiso: false,
        diatitle: '',
        dialogVisible: false,
        disable: false,
        ruleForm: {
          edittype: ''
        },
        rules: {}
      }
    },
    created () {
      this.findList()
    },
    methods: {
      findList () {
        let tempdata = {
          'pageIndex': this.pageIndex,
          'pageSize': this.pageSize,
          'fileType': this.filetype
        }
        getList(tempdata).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list
            this.total = res.data.count
          }
        })
      },
      Submit () {
        this.pageIndex = 1
        this.findList()
      },
      Reset () {
        this.filetype = ''
        this.findList()
      },
      delFunc () {
        if (this.deleteList && this.deleteList.length > 0) {
          let dangerdata = {
            'apiId': '3-3'
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
                    h('span', { style: 'color: #F56C6C' }, '删除黑名单文件类型, 请谨慎操作！')
                  ])
                }).then(async () => {
                  let tmpdata = {
                    'ids': this.deleteList
                  }
                  let res = await delList(tmpdata)
                  if (res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: res.msg
                    })
                    if (this.tableData.length == 1 && this.pageIndex > 1) {
                      this.pageIndex--
                    }
                    this.findList()
                    this.deleteList = []
                  }
                }).catch(() => {})
              } else {
                let tmpdata = {
                  'ids': this.deleteList
                }
                delList(tmpdata).then((res) => {
                  if (res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: res.msg
                    })
                    if (this.tableData.length == 1 && this.pageIndex > 1) {
                      this.pageIndex--
                    }
                    this.findList()
                    this.deleteList = []
                  }
                })
              }
            }
          })
        } else {
          this.$message({
            message: '请选择要删除的文件',
            type: 'warning'
          })
        }
      },
      // 添加
      addFunc () {
        let dangerdata = {
          'apiId': '3-1'
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
                  h('span', { style: 'color: #F56C6C' }, '新增黑名单文件类型, 请谨慎操作！')
                ])
              }).then(() => {
                this.rules = {
                  edittype: [{ required: true, message: '文件类型不能为空', trigger: 'blur' },
                    {pattern: /^[A-Za-z0-9]+$/, message: '文件类型不支持中文格式且无需加"."', trigger: 'blur'}
                    // {pattern: /\n\s*\r/, message: '文件类型不能为空格', trigger: 'blur'}
                  ]
                }
                this.disable = false
                this.dialogVisible = true
                this.diatitle = '添加'
                this.ruleForm.edittype = ''
              })
            } else {
              this.rules = {
                edittype: [{ required: true, message: '文件类型不能为空', trigger: 'blur' },
                  {pattern: /^[A-Za-z0-9]+$/, message: '文件类型不支持中文格式且无需加"."', trigger: 'blur'}
                  // {pattern: /\n\s*\r/, message: '文件类型不能为空格', trigger: 'blur'}
                ]
              }
              this.disable = false
              this.dialogVisible = true
              this.diatitle = '添加'
              this.ruleForm.edittype = ''
            }
          }
        })
      },
      // 编辑
      editFunc () {
        let dangerdata = {
          'apiId': '3-2'
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
                  h('span', { style: 'color: #F56C6C' }, '修改黑名单文件类型, 请谨慎操作！')
                ])
              }).then(() => {
                this.rules = {}
                this.disable = true
                if (this.edittList.length !== 1) {
                  this.$message({
                    message: '请选择一条数据进行编辑',
                    type: 'warning'
                  })
                } else {
                  this.dialogVisible = true
                  this.diatitle = '编辑'
                  this.ruleForm.edittype = this.edittList[0]
                  if (this.editpermission == '3') {
                    this.banload = true
                    this.fileiso = true
                  } else if (this.editpermission == '1') {
                    this.banload = true
                    this.fileiso = false
                  } else {
                    this.fileiso = true
                    this.banload = false
                  }
                }
              })
            } else {
              this.rules = {}
              this.disable = true
              if (this.edittList.length !== 1) {
                this.$message({
                  message: '请选择一条数据进行编辑',
                  type: 'warning'
                })
              } else {
                this.dialogVisible = true
                this.diatitle = '编辑'
                this.ruleForm.edittype = this.edittList[0]
                if (this.editpermission == '3') {
                  this.banload = true
                  this.fileiso = true
                } else if (this.editpermission == '1') {
                  this.banload = true
                  this.fileiso = false
                } else {
                  this.fileiso = true
                  this.banload = false
                }
              }
            }
          }
        })
      },
      closeDialog () {
        this.dialogVisible = false
        this.diatitle = ''
        // this.ruleForm.edittype = ''
        this.fileiso = false
        this.banload = false
        // this.ruleForm = {}
        this.rules = {}
        this.$refs.ruleForm.resetFields()
      },
      enterSure () {
        if (this.banload && !this.fileiso) {
          this.permission = '1'
        } else if (this.fileiso && !this.banload) {
          this.permission = '2'
        } else {
          this.permission = '3'
        }
        // 添加
        if (this.diatitle == '添加') {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              if (!this.banload && !this.fileiso) {
                this.$message({
                  message: '请至少勾选一项',
                  type: 'warning'
                })
              } else {
                let temdata = {
                  'fileType': this.ruleForm.edittype,
                  'permission': this.permission
                }
                addList(temdata).then(ret => {
                  if (ret.code == 200) {
                    this.$message({
                      message: '操作成功',
                      type: 'success'
                    })
                    this.closeDialog()
                    this.ruleForm.edittype = ''
                    this.findList()
                  }
                })
              }
            }
          })
        }
        // 编辑
        if (this.diatitle == '编辑') {
          if (!this.banload && !this.fileiso) {
            this.$message({
              message: '请至少勾选一项',
              type: 'warning'
            })
          } else {
            let temdata = {
              'id': this.deleteList[0],
              'fileType': this.ruleForm.edittype,
              'permission': this.permission
            }
            editList(temdata).then(ret => {
              if (ret.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.closeDialog()
                this.ruleForm.edittype = ''
                this.findList()
              }
            })
          }
        }
      },
      handleSelectionChange (val) {
        let tmpDeleteList = []
        let editttList = []
        let permissionList = []
        if (val) {
          tmpDeleteList = val.map(v => v.id)
          editttList = val.map(v => v.fileType)
          permissionList = val.map(v => v.permission)
        }
        this.deleteList = tmpDeleteList
        this.edittList = editttList
        this.permissionList = permissionList
        this.editpermission = permissionList[0]
      },
      handleCurrentChange (val) {
        this.pageIndex = val
        this.findList()
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.findList()
      }
    }
  }
    </script>
  
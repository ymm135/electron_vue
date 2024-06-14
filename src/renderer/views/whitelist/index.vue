<template>
    <div style="width: 100%; padding-left: 24px;padding-right:24px;">
        <div style="margin-bottom: 16px;background-color: #fff;height:80px;line-height: 80px;">
            <span style="margin-left: 24px;font-size: 14px;color: #606266;">文件名：</span>
            <el-input v-model="filename" placeholder="请输入文件名" style="width: 200px" />

            <el-button style="float:right;margin: 24px 24px 0 10px;background-color: #F26521;color:#fff;"
                @click="submit">查询</el-button>
            <el-button type="default" style="margin-left: 10px;float:right;margin-top: 24px;"
                @click="Reset">重置</el-button>
        </div>

        <div style="background-color: #fff;padding:20px 24px 0 24px;">
            <span style="line-height: 24px;font-size: 16px;font-weight: 500;color: #000000;">白名单</span>
            <el-button style="margin-left: 10px;margin-bottom: 10px;float:right;background-color: #F26521;color:#fff;"
                @click="addFunc">添加</el-button>
            <el-button type="default" style="margin-left: 10px;float:right;" @click="delFunc">删除</el-button>
            <el-button type="text" style="margin-left: 10px;float:right; color: #F26521;"
                @click="delAllFunc">清空自动学习白名单</el-button>

            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
                @selection-change="handleSelectionChange" style="width: 100%" stripe>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="fileName" :show-overflow-tooltip='true' label="文件名" min-width="15%">
                </el-table-column>
                <el-table-column prop="sha1" :show-overflow-tooltip='true' label="文件特征" min-width="40%">
                </el-table-column>
                <el-table-column prop="createdAt" label="加入时间" min-width="10%">
                </el-table-column>
                <el-table-column prop="source" label="加入方式" min-width="5%">
                    <template slot-scope="scope">
                        <span style="color: #0052D9;" v-if='scope.row.source == "手动"'>手动</span>
                        <span v-else-if='scope.row.source == "自动"'>自动</span>
                        <span style="color: #F26521;" v-else>安管</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="usb-pagination">
                <el-pagination style="padding: 20px 0; margin-left: 337px" :current-page.sync="pageno"
                    :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" :total="total"
                    layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
                    @size-change="handleSizeChange" />
            </div>
        </div>

        <el-dialog title="添加" :visible.sync="dialogVisible" :before-close="closeuploadDialog" width="30%">
            <el-form ref="importDialogForm" :model="importForm">
                <el-form-item>
                    <el-row :gutter="8">
                        <el-col :span="18" style="text-align: right;">
                            <el-input v-model="fileName" />
                        </el-col>
                        <el-col :span="6">
                            <el-upload class="uploadDemo" action="#" :show-file-list="false"
                                :http-request="uploadHttpRequest" :on-remove="fileRemove" :on-change="fileChange"
                                style="float: left;">
                                <el-button>选择文件</el-button>
                            </el-upload>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeuploadDialog">取 消</el-button>
                    <el-button type="warning" @click="uploadSure" :loading="uploadLoading">确 定</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog> -->
        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>
  
<script>
import { getwhiteList, delwhiteList, delAll, uploadWhite } from '@/api/whitelist'
import { ifDanger } from '@/api/systemsetting'
//   import  DiskDialog  from '@/components/USB/DiskDialog/index'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'
import { async } from 'q'

export default {
  name: 'Whitelist',
  components: {
    // DiskDialog
    TimeoutDialog
  },
  data () {
    return {
      componentcount: 0,
      filename: '',
      tableData: [],
      pageno: 1,
      pageSize: 10,
      total: 0,
      deleteList: [],
      single: true,
      input: '',
      dialogVisible: false,
      importForm: {},
      fileList: [], // 上传文件列表
      fileName: '',
      customFile: '',
      uploadLoading: false
    }
  },
  created () {
    this.findList()
  },
  methods: {

    fileRemove (file, fileList) { },
    fileChange (file, fileList) {
      this.fileName = file.name
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.fileList = fileList
    },
    uploadHttpRequest (param) {
      this.customFile = param.file
    },
    closeuploadDialog () {
      this.fileList = []
      this.customFile = ''
      this.fileName = ''
      this.dialogVisible = false
    },
    // 上传成功
    uploadSure () {
      if (!this.fileList || this.fileList.length <= 0) {
        this.$message.warning('请点击浏览按钮上传所需要上传的文件')
        return
      }
      const data = new FormData()
      const fileUps = this.customFile
      data.append('file', fileUps)
      if (this.customFile.size > 1073741824) {
        this.$message.warning('超出文件上传大小上限1G')
        return
      }
      //   loading加载
      this.uploadLoading = true
      uploadWhite(data).then(res => {
        if (res.code == 200) {
          this.uploadLoading = false
          this.$message({
            type: 'success',
            message: '添加成功',
            showClose: true
          })
          this.closeuploadDialog()
          this.findList()
        } else {
          this.uploadLoading = false
          this.$message({
            type: 'error',
            message: res.msg,
            showClose: true
          })
          this.closeuploadDialog()
        }
      }).catch((e) => {
        this.uploadLoading = false
      })
    },
    findList () {
      let tempdata = {
        'pageIndex': this.pageno,
        'pageSize': this.pageSize,
        'fileName': this.filename
      }
      getwhiteList(tempdata).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list
          this.total = res.data.count
        }
      })
    },
    // 查询
    submit () {
      this.pageno = 1
      this.findList()
    },
    Reset () {
      this.filename = ''
      this.findList()
    },
    // 添加
    addFunc () {
      let dangerdata = {
        'apiId': '2-3'
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
                h('span', { style: 'color: #F56C6C' }, '添加白名单文件, 请谨慎操作！')
              ])
            }).then(() => {
              this.dialogVisible = true
            })
          } else {
            this.dialogVisible = true
          }
        }
      })
    },
    // 删除
    delFunc () {
      if (this.deleteList && this.deleteList.length > 0) {
        let dangerdata = {
          'apiId': '2-1'
        }
        ifDanger(dangerdata).then(res => {
          if (res.code == 200) {
            // if(res.data){
            if (res.data) {
              const h = this.$createElement
              this.$confirm('', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                // type: 'warning'
                title: '危险提示',
                message: h('p', null, [
                  h('span', null, '您正在进行危险操作行为： '),
                  h('span', { style: 'color: #F56C6C' }, '白名单手动删除, 请谨慎操作！')
                ])
              }).then(() => {
                let tmpdata = {
                  'ids': this.deleteList
                }
                delwhiteList(tmpdata).then((res) => {
                  if (res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: res.msg
                    })
                    if (this.tableData.length === 1 && this.pageno > 1) {
                      this.pageno--
                    }
                    this.findList()
                    this.deleteList = []
                  }
                })
              }).catch(() => { })
            } else {
              let tmpdata = {
                'ids': this.deleteList
              }
              delwhiteList(tmpdata).then((res) => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  if (this.tableData.length === 1 && this.pageno > 1) {
                    this.pageno--
                  }
                  this.findList()
                  this.deleteList = []
                }
              })
            }
          }
        })
      } else {
        this.$message.warning('请选择要删除的数据')
      }
    },
    // 清空
    delAllFunc () {
      let dangerdata = {
        'apiId': '2-2'
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
                h('span', { style: 'color: #F56C6C' }, '清空自动学习白名单, 请谨慎操作！')
              ])
            }).then(async () => {
              let res = await delAll()
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.findList()
              }
            }).catch(() => { })
          } else {
            delAll().then((res) => {
              if (res.code === 200) {
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
    handleSelectionChange (val) {
      let tmpDeleteList = []
      if (val) {
        tmpDeleteList = val.map(v => v.id)
      }
      this.deleteList = tmpDeleteList
    },
    handleCurrentChange (val) {
      this.pageno = val
      this.findList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageno = 1
      this.findList()
    }
  }
}
</script>

<style scoped>
/deep/.el-dialog__footer {
    padding: 10px 52px 20px;
}
</style>
  
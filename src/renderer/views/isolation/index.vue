<template>
    <div style="width: 100%; padding-left: 24px;padding-right:24px;">
        <div style="margin-bottom: 10px;background-color: #fff;height:80px;line-height: 80px;">
            <el-form ref="form" :model="form" :inline="true" style="width: 100%;">
                <el-form-item style="margin-left: 24px;margin-top: 24px;">
                    <span style="color: #606266;">文件名：</span>
                </el-form-item>
                <el-form-item>
                    <el-input style="margin-top: 24px;" v-model.trim="form.fileName" placeholder="请输入文件名"></el-input>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button style="margin: 24px 24px 0 10px;background-color: #F26521;color:#fff;" @click="Submit">查询</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button style="float:right;margin-top: 24px;" @click="Reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div style="background-color: #fff;padding:20px 24px 0 24px;">
            <el-form :inline="true" style="width: 100%;">
                <el-form-item style="margin-bottom: -10px;">
                    <span style="color:#000;font-size: 16px;font-weight: 500;">隔离区({{ total }})</span> 
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button @click="delFunc">删除</el-button>
                    <el-button @click="backFunc">还原</el-button>
                    <el-button @click="downFunc">下载</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" style="width: 100%;">
                <el-form-item style="line-height: 35px;">
                    <span style="color:#303133;font-size: 16px;font-weight: 400;">占用空间：{{size}}M</span>
                </el-form-item>
            </el-form>
            <el-table 
                :data="tableData"
                @selection-change="handleSelectionChange"
                stripe
                style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                    <el-table-column
                        prop="fileName,sourcePath"
                        label="文件名"
                        min-width="50%">
                        <template slot-scope="scope">{{scope.row.fileName}}<br/>{{scope.row.virtualPath}}</template>
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="加入时间"
                        min-width="10%">
                    </el-table-column>
            </el-table>

            <!-- 还原提示框 -->
            <!-- <el-dialog
            title="危险提示"
            :visible.sync="dialogVisible"
            width="45%"
            :before-close="closeDialog">
                <div style="padding-bottom: 10px;">此操作为危险操作, 是否继续?</div>
                <div>
                    <el-checkbox v-model="backcheck">追加到白名单(系统将不再对该文件扫描)</el-checkbox>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="warning" @click="sureBack">确 定</el-button>
                </span>
            </el-dialog> -->
            <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="25%"
            :before-close="closeDialog">
                <div style="padding-bottom: 10px;padding-left: 30px;font-size: 16px;color: #303133;font-weight: 400;">确定要还原该文件?</div>
                <div style="padding-left: 30px;">
                    <el-checkbox v-model="backcheck" style="color:#606266;font-weight: 400;">追加到白名单(系统将不再对该文件扫描)</el-checkbox>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="warning" @click="sureBack">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 操作提示 -->
            <el-dialog>
                <el-alert
                    :visible.sync="alertVisible"
                    :title="alerttitle"
                    :type="alerttype"
                    show-icon>
                </el-alert>
            </el-dialog>

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

        <!-- <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog> -->
        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>

<script>
import { getisoList, delisoList, backisoList, downisoList, getSize } from '@/api/isolation'
import {ifDanger} from '@/api/systemsetting'
// import  DiskDialog  from '@/components/USB/DiskDialog/index'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'

export default{
  components: {
    // DiskDialog
    TimeoutDialog
  },
  data () {
    return {
      componentcount: 0,
      form: {
        fileName: ''
      },
      tableData: [],
      deleteList: [],
      backList: [],
      downList: [],
      dialogVisible: false,
      alertVisible: false,
      alerttitle: '',
      alerttype: '',
      backcheck: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      aw: 0,
      size: 0
    }
  },
  created () {
    this.findList()
  },
  methods: {
    findList () {
      let tempdata = {
        'fileName': this.form.fileName,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      getisoList(tempdata).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list
          this.total = res.data.count
        }
      })
      getSize().then((res) => {
        this.size = res.data
      })
    },
    // 重置
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
    // 关闭还原框
    closeDialog () {
      this.dialogVisible = false
      this.backcheck = true
    },
    // 删除
    delFunc () {
      if (this.deleteList && this.deleteList.length > 0) {
        let dangerdata = {
          'apiId': '4-3'
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
                  h('span', { style: 'color: #F56C6C' }, '隔离区文件删除, 请谨慎操作！')
                ])
              }).then(async () => {
                let tmpdata = {
                  'ids': this.deleteList
                }
                let res = await delisoList(tmpdata)
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  if (this.tableData.length === 1 && this.pageIndex > 1) {
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
              delisoList(tmpdata).then((res) => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  if (this.tableData.length === 1 && this.pageIndex > 1) {
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
          type: 'warning',
          message: '请选择需要删除的数据'
        })
        // this.alertVisible = true
        // this.alerttitle = '请选择需要删除的数据'
        // this.alerttype = 'warning'
      }
    },
    // 还原
    backFunc () {
      if (this.backList && this.backList.length > 0) {
        // ifDanger(dangerdata).then(res=>{
        // if(res.code == 200){
        // if(res.data){
        this.dialogVisible = true
        // }else{
        // this.dialogVisible = false
        // }
        // }
        // })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择需要还原的数据'
        })
        // this.alertVisible = true
        // this.alerttitle = '请选择需要删除的数据'
        // this.alerttype = 'warning'
      }
    },

    sureBack () {
      // let aw = 0
      if (this.backcheck) {
        this.aw = 1
      } else {
        this.aw = 0
      }
      // let dangerdata = {
      //     'apiId': '4-2'
      // }

      let tmpdata = {
        'ids': this.backList,
        'addWhitelist': this.aw
      }
      backisoList(tmpdata).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          if (this.tableData.length === 1 && this.pageIndex > 1) {
            this.pageIndex--
          }
          this.backList = []
          this.closeDialog()
          this.findList()
        }
      })
    },

    // 下载
    downFunc () {
      if (this.downList && this.downList.length > 0) {
        // const h = this.$createElement
        // this.$confirm('', {
        //     title:"提示",
        //     type:'warnig',
        //     confirmButtonText: '确定下载',
        //     cancelButtonText: '取消',
        //     message:h('p', null, [
        //     h('span', null, '您正在进行危险操作行为： '),
        //     h('span', { style: 'color: red' }, '隔离区文件下载，请谨慎操作！')
        // ]),
        // iconClass:"el-icon-warning colorYellow",
        // })
        let dangerdata = {
          'apiId': '4-1'
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
                  h('span', { style: 'color: #F56C6C' }, '隔离区文件下载, 请谨慎操作！')
                ])
              }).then(() => {
                let downdata = {
                  'filePath': this.downList.join(',')
                }
                downisoList(downdata).then(res => {
                  let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
                  const blob = new Blob([res.data])
                  let link = document.createElement('a')
                  link.href = URL.createObjectURL(blob)
                  link.setAttribute('download', window.decodeURI(filename))
                  link.click()
                  link = null
                  this.$message({
                    type: 'success',
                    message: '下载成功'
                  })
                })
              }).catch(() => {
                // this.$message({
                //     type: 'error',
                //     message: res.msg
                // })
              })
            } else {
              let downdata = {
                'filePath': this.downList.join(',')
              }
              downisoList(downdata).then(res => {
                let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
                const blob = new Blob([res.data])
                let link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.setAttribute('download', window.decodeURI(filename))
                link.click()
                link = null
                this.$message({
                  type: 'success',
                  message: '下载成功'
                })
              })
            }
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择需要下载的数据'
        })
      }
    },
    handleSelectionChange (val) {
      let tmpDeleteList = []
      let tmpDownList = []
      if (val) {
        tmpDeleteList = val.map(v => v.id)
        tmpDownList = val.map(v => v.filePath)
      }
      this.deleteList = tmpDeleteList
      this.backList = tmpDeleteList
      this.downList = tmpDownList
      // console.log(this.downList.toString());
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
/deep/.el-checkbox__input.is-checked+.el-checkbox__label {
    color: #606266 ;
}
/deep/.el-form--inline .el-form-item {
    margin-right: 0 !important;
}
</style>
<template>
    <div style="width: 100%;padding-left: 24px;padding-right:24px;">
        <div style="margin-bottom: 18px;background-color: #fff;height:80px;line-height: 80px;">
            <el-form ref="form" :model="form" :inline="true" style="margin-left: 24px">
                <el-form-item label="用户名：">
                    <el-select v-model="form.username" filterable placeholder="请选择/搜索" style="width:190px;margin-top:24px;">
                        <el-option v-for="item in userlist"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间：">
                    <el-date-picker
                        style="margin-top:24px;"
                        v-model="processTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button style="margin: 24px 18px 0 10px;background-color: #F26521;color:#fff;" @click="Submit">查询</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button style="margin-left: 10px;;margin-top: 24px;" @click="Reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div style="background-color: #fff;padding:20px 24px 10px 24px;">
            <span style="line-height: 24px;font-size: 16px;font-weight: 500;">告警日志</span>
            <el-button style="margin-left: 10px;margin-bottom: 10px;float:right;background-color: #F26521;color:#fff;" @click="Logout">导出日志</el-button>

            <el-table
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    width="100%">
                    <template slot-scope="scope">
                        {{(pageIndex - 1) * pageSize + scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operName"
                    label="用户名"
                    min-width="10%">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    :show-overflow-tooltip='true'
                    label="详情"
                    min-width="30%">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="操作时间"
                    min-width="10%">
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

        <!-- <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog> -->
        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>

<script>
import { getalertList, downlogalert, getUserList } from '@/api/log'
import {ifDanger} from '@/api/systemsetting'
// import  DiskDialog  from '@/components/USB/DiskDialog/index'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'
import moment from 'moment'

export default{
  components: {
    // DiskDialog
    TimeoutDialog
  },
  data () {
    return {
      componentcount: 0,
      form: {
        username: '',
        beginTime: '',
        endTime: ''
      },
      processTime: [],
      tableData: [],
      userlist: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  created () {
    this.findList()
  },
  methods: {
    findList () {
      let tempdata = {
        'operName': this.form.username,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize,
        'beginTime': this.form.beginTime,
        'endTime': this.form.endTime
      }
      getalertList(tempdata).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list
          this.total = res.data.count
        }
      })
      getUserList().then((res) => {
        if (res.code == 200) {
          this.userlist = res.data.map(v => v.username)
        }
      })
    },
    // 重置
    Reset () {
      this.form = {}
      this.pageIndex = 1
      this.findList()
      this.processTime = []
    },
    Submit () {
      if (this.processTime && this.processTime.length > 0) {
        this.form.beginTime = moment(this.processTime[0]).format('YYYY-MM-DD HH:mm:ss')
        this.form.endTime = moment(this.processTime[1]).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.form.beginTime = ''
        this.form.endTime = ''
      }
      this.pageIndex = 1
      this.findList()
    },

    // 导出日志
    Logout () {
      let dangerdata = {
        'apiId': '6-1'
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
                h('span', { style: 'color: #F56C6C' }, '导出告警日志, 请谨慎操作！')
              ])
            }).then(() => {
              let logdata = {
                'operName': this.form.username,
                // "operIp": this.form.ipadd,
                // "title": this.form.model,
                'beginTime': this.form.beginTime,
                'endTime': this.form.endTime
              }
              downlogalert(logdata).then(res => {
                let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
                const blob = new Blob([res.data], {
                  type: 'application/vnd.ms-excel'
                })
                let link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.setAttribute('download', window.decodeURI(filename))
                link.click()
                link = null
                this.$message({
                  type: 'success',
                  message: '导出成功'
                })
              })
            }).catch(() => {})
          } else {
            let logdata = {
              'operName': this.form.username,
              // "operIp": this.form.ipadd,
              // "title": this.form.model,
              'beginTime': this.form.beginTime,
              'endTime': this.form.endTime
            }
            downlogalert(logdata).then(res => {
              let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
              const blob = new Blob([res.data], {
                type: 'application/vnd.ms-excel'
              })
              let link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.setAttribute('download', window.decodeURI(filename))
              link.click()
              link = null
              this.$message({
                type: 'success',
                message: '导出成功'
              })
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

<template>
    <div style="width: 100%;padding-left: 24px;padding-right:24px;">
        <div style="margin-bottom: 18px;background-color: #fff;height:128px;line-height: 80px;">
            <el-form ref="form" :model="form" style="margin: 0 24px;height:80px;line-height: 80px;width: 100%" label-width="80px">
            <el-row >
            <el-col :span="6">
                <el-form-item label="用户名：" style="margin-top:24px;">
                    <el-select v-model.trim="form.username" placeholder="请选择" style="width:85%;">
                        <el-option v-for="item in userlist"
                        :key="item.userId"
                        :label="item.username"
                        :value="item.username">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="IP：" style="margin-top:24px;">
                    <el-select v-model="form.ipadd" filterable placeholder="请选择/搜索" style="width:85%;">
                        <el-option v-for="item in iplist"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="操作模块：" style="margin-top:24px;" class="operation">
                    <el-select v-model="form.model" placeholder="请选择" style="width:85%;">
                        <el-option v-for="item in titlelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="时间：" style="margin-top:24px;">
                    <el-date-picker
                        style="width:85%;"
                        v-model="processTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            </el-row>
            </el-form>
            <div style="margin-top:22px;">
                <el-button style="float:right;margin: -20px 24px 0 10px;background-color: #F26521;color:#fff;" @click="Submit">查询</el-button>
                <el-button style="margin-left: 10px;margin-top:-20px;float:right;" @click="Reset">重置</el-button>
            </div>
        </div>
        

        <div style="background-color: #fff;padding:20px 24px 10px 24px;">
            <span style="line-height: 24px;font-size: 16px;font-weight: 500;color: #000;">操作日志</span>
            <el-button style="margin-left: 10px;margin-bottom: 10px;float:right;background-color: #F26521;color:#fff;" @click="Logout">导出日志</el-button>

            <el-table
                :data="tableData"
                stripe
                style="width: 100%;">
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
                    prop="title"
                    label="操作模块"
                    min-width="7%">
                </el-table-column>
                <el-table-column
                    prop="operIp"
                    label="操作IP"
                    min-width="8%">
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
                <el-table-column
                    label="结果"
                    min-width="5%">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 2" style="color: #67C23A;">
                            <img style="margin-right:4px;" src="../../assets/usb_images/success_log.png"/>成功
                        </span>
                        <span v-else style="color: #F56C6C;">
                            <img style="margin-right:4px;" src="../../assets/usb_images/error_log.png"/>失败
                        </span>
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

        <!-- <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog> -->
        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>

<script>
import { getlogList, getUserList, getipList, gettitleList, downlog } from '@/api/log'
import {ifDanger} from '@/api/systemsetting'
import moment from 'moment'
// import  DiskDialog  from '@/components/USB/DiskDialog/index'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'

export default{
  name: 'Logmanage',
  components: {
    // DiskDialog
    TimeoutDialog
  },
  data () {
    return {
      componentcount: 0,
      form: {
        username: '',
        ipadd: '',
        model: '',
        beginTime: '',
        endTime: ''
      },
      processTime: [],
      tableData: [],
      userlist: [],
      iplist: [],
      titlelist: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  created () {
    this.getInfo()
    this.findList()
  },
  methods: {
    findList () {
      // this.pageIndex = val
      let tempdata = {
        'operName': this.form.username,
        'operIp': this.form.ipadd,
        'title': this.form.model,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize,
        'beginTime': this.form.beginTime,
        'endTime': this.form.endTime
      }
      getlogList(tempdata).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list
          this.total = res.data.count
        }
      })
    },
    // 获取下拉框信息
    getInfo () {
      getUserList().then(res => {
        if (res.code == 200) {
          this.userlist = res.data
        }
      })
      getipList().then(res => {
        if (res.code == 200) {
          this.iplist = res.data
        }
      })
      let titledata = {
        'dictType': 'sys_opera_log_title'
      }
      gettitleList(titledata).then(res => {
        if (res.code == 200) {
          this.titlelist = res.data
        }
      })
    },
    // 重置
    Reset () {
      this.form = {}
      this.processTime = []
      this.pageIndex = 1
      this.findList()
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
        'apiId': '5-1'
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
                h('span', { style: 'color: #F56C6C' }, '导出操作日志, 请谨慎操作！')
              ])
            }).then(() => {
              let logdata = {
                'operName': this.form.username,
                'operIp': this.form.ipadd,
                'title': this.form.model,
                'beginTime': this.form.beginTime,
                'endTime': this.form.endTime
              }
              downlog(logdata).then(res => {
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
              'operIp': this.form.ipadd,
              'title': this.form.model,
              'beginTime': this.form.beginTime,
              'endTime': this.form.endTime
            }
            downlog(logdata).then(res => {
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

<style>
.operation label{
    width: 82px !important;
}
</style>
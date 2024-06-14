<template>
  <div style="width: 100%; padding: 20px; background-color: white">
    <div style="line-height: 35px">数据列表</div>
    <div style="margin-bottom: 10px">
      <span>产品目录：</span>
      <el-select v-model="productName" placeholder="请选择">
        <el-option
          v-for="item in keyList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <span style="margin-left: 20px">文件名称：</span>
      <el-input v-model="filename" placeholder="请输入文件名称" style="width: 200px" />

      <span style="margin-left: 20px">时间范围：</span>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
      />
      <el-button type="primary" style="margin-left: 10px" @click="findDataList">查询</el-button>
      <el-button type="default" style="margin-left: 10px" @click="resetData">重置</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      :row-key="(record) => record.Filename"
      style="width: 100%"
    >
      <el-table-column
        prop="Filename"
        label="文件名称"
      />
      <el-table-column
        prop="CreateTime"
        label="上传时间"
        width="300"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadFile(scope.row.Filename)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findListByRole, downloadFile } from '@/api/service/service'
import { listUser } from '@/api/admin/sys-user'

export default {
  name: 'AdminView',
  data () {
    return {
      productName: '',
      filename: '',
      tableData: [],
      dateRange: null,
      startTime: '',
      endTime: '',
      queryParams: {
        pageIndex: 1,
        pageSize: 100000
      },
      keyList: []
    }
  },
  created () {
    this.findRoleKeyList()
  },
  methods: {
    findRoleKeyList () {
      listUser(this.addDateRange(this.queryParams, null)).then(response => {
        if (response.code === 200) {
          const data = []
          response.data.list.forEach((li) => {
            if (li.username !== 'admin') {
              const temp = {}
              temp.value = li.username
              temp.label = li.nickName.split('管理员')[0]
              data.push(temp)
            }
          })

          if (data.length > 0) {
            this.productName = data[0].value
          }
          this.keyList = data
          this.findDataList()
        } else {
          // this.$message.error(response.msg)
        }
      })
    },
    findDataList () {
      const params = {
        roleKey: this.productName,
        filename: this.filename,
        startTime: this.startTime,
        endTime: this.endTime
      }
      findListByRole(params).then(response => {
        if (response.code === 200) {
          this.tableData = response.data
        } else {
          // this.$message.error(response.msg)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    resetData () {
      this.filename = ''
      this.startTime = ''
      this.endTime = ''
      this.dateRange = null
      if (this.keyList.length > 0) {
        this.productName = this.keyList[0].value
      }
      this.findDataList()
    },
    dateChange () {
      if (this.dateRange) {
        this.startTime = this.timestampToTime(this.dateRange[0]) + ' 00:00:00'
        this.endTime = this.timestampToTime(this.dateRange[1]) + ' 23:59:59'
      } else {
        this.startTime = ''
        this.endTime = ''
      }
    },
    // 时间格式化
    timestampToTime (timestamp) {
      const date = new Date(timestamp)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    downloadFile (filename) {
      const params = {
        filename: filename
      }
      downloadFile(params).then(response => {
        if (response.status === 200) {
          const name = decodeURI(
            response.config.params.filename.split('/')[response.config.params.filename.split('/').length - 1]
          )
          const blob = new Blob([response.data])
          const a = document.createElement('a')
          const url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = name
          a.click()
          window.URL.revokeObjectURL(url)
          this.$message.success('导出成功')
        } else {
          const reader = new FileReader()
          reader.readAsText(response.data, 'utf-8')

          const $this = this
          reader.addEventListener('loadend', function () {
            const jsonData = JSON.parse(reader.result)
            // $this.$message.error(jsonData.msg)
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

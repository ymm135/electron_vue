<template>
  <div style="width: 100%; padding: 20px; background-color: white">
    <div style="line-height: 35px">{{ productName }}-列表</div>
    <div style="margin-bottom: 10px">
      <span>文件名称：</span>
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

      <el-upload action="#" :http-request="uploadHttpRequest" :show-file-list="false" style="float: right; margin-bottom: 10px">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
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
          <el-button type="text" size="small" @click="openDelete(scope.row.Filename)">删除</el-button>
          <el-button type="text" size="small" @click="downloadFile(scope.row.Filename)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findListByRole, deleteFile, downloadFile, uploadFile } from '@/api/service/service'

export default {
  name: 'ChildView',
  data () {
    return {
      productName: '',
      filename: '',
      tableData: [],
      dateRange: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.productName = this.$store.getters.roles[0]
    this.findDataList()
  },
  methods: {
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
    openDelete (filename) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFile(filename)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteFile (filename) {
      const params = {
        filename: filename
      }
      deleteFile(params).then(response => {
        if (response.code === 200) {
          this.$message.success(response.msg)
          this.findDataList()
        } else {
          // this.$message.error(response.msg)
        }
      }).catch(error => {
        console.log(error)
      })
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
    },
    uploadHttpRequest (param) {
      const formData = new FormData()
      formData.append('upload[]', param.file)
      formData.append('roleKey', this.productName)
      uploadFile(formData).then(response => {
        if (response.code === 200) {
          this.$message.success(response.msg)
          this.findDataList()
        } else {
          // this.$message.error(response.msg)
        }
      })
    }
  }
}
</script>

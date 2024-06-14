<template>
    <div class="time-container">
        <div class="set-container">
            <div style="margin: 38px auto 20px 37px;font-size: 20px;">设置时间</div>
            <div style="margin-bottom:20px;margin-left: 37px;">当前时间：{{curtime}}</div>
            <div style="margin-bottom:20px;margin-left: 37px;">
                <el-date-picker
                    v-model="value"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <el-button style="margin-left: 37px; width:223px;" type="warning" @click="setMyTime">设置</el-button>
        </div>
    </div>
</template>

<script>
import {getCurTime, putCurTime} from '@/api/settime'

export default{
  name: 'setTime',
  data () {
    return {
      value: '',
      curtime: ''
    }
  },
  created () {
    this.findData()
  },
  methods: {
    findData () {
      getCurTime().then((res) => {
        if (res.code == 200) {
          this.curtime = res.time
        }
      })
    },
    setMyTime () {
      if (this.value == '') {
        this.$message.warning('时间不能为空')
      } else {
        let tmpdata = {
          'serverTime': this.value
        }
        putCurTime(tmpdata).then((res) => {
          if (res.code == 200) {
            this.$message.success('设置成功')
            this.findData()
          }
        })
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.time-container{
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-align: center;
    -ms-flex-align: center;
    width: 100%;
    height: 100%;
    background: url("../../assets/usb_images/login_div.png") no-repeat;
    background-size: cover;
    height: 100vh;
    background-position: 50%;
}
.set-container{
    border: 1px;
    background-color: #fff;
    // margin-left: 920px;
    width: 310px;
    height: 272px;
    // width: 1000px;
    z-index: 1000;
    margin-left: 65%
}
</style>
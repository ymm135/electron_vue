<template>
    <div>
        <el-dialog title="提示" :visible.sync="timeoutdialog" :before-close="toLogin" :append-to-body='true' width="25%">
            <div style="padding: 28px 73px;">
                <span>登录状态已过期，请重新登录</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="toLogin">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getTime } from '@/utils/auth'
export default{
  name: 'TimeoutDialog',
  data () {
    return {
      timeoutdialog: false,
      tokennowtime: '',
      intervaltime: null
    }
  },
  created () {
    this.ifTimeout()
  },
  destroyed () {
    this.cleartime()
  },
  methods: {
    async toLogin () {
      // this.$store.dispatch('user/resetToken')
      // this.timeoutdialog = false
      // this.$router.push('/Login')
      this.$store.dispatch('user/LogOut').then(() => {
        this.$store.dispatch('user/resetToken')
        this.timeoutdialog = false
        this.$router.push('/Login')
      })
    },
    ifTimeout () {
      // 获取存储token的开始时间
      let tokenStartTime = getTime()
      // console.log(tokenStartTime);

      const timeOver = 30 * 60 * 1000
      // const timeOver = 10 * 1000

      if (this.intervaltime != null) {
        return
      }
      this.intervaltime = setInterval(() => {
        this.tokennowtime = new Date().getTime()
        // console.log(this.tokennowtime);
        if (this.tokennowtime - tokenStartTime > timeOver) {
          this.timeoutdialog = true
        }
      }, 1000)
      // console.log(this.tokennowtime - tokenStartTime);
    },
    cleartime () {
      clearInterval(this.intervaltime) // 清除计时器
      this.intervaltime = null // 设置为null
    }
  }
}
</script>

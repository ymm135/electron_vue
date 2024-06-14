<template>
  <div style="padding-bottom: 24px;">
    <el-form label-position="top" label-width="80px" ref="repoform" :model="repoform" :rules="rules">
        <el-form-item label="原密码" prop="oldpass" >
            <el-input v-model="repoform.oldpass" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass" >
            <el-input v-model="repoform.newpass" placeholder="请输入8-32位大小写字母、数字、特殊符号" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmpass" >
            <el-input v-model="repoform.confirmpass" placeholder="请确认新密码" show-password></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="repopassClose">取 消</el-button>
        <el-button type="warning" @click="surePassword()">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { editpassword } from '@/api/rolemanagement'
import store from '@/store'
export default {
  name: 'ModifyPassword',
  data () {
    return {
      repoform: {
        oldpass: '',
        newpass: '',
        confirmpass: ''
      },
      rules: {
        oldpass: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newpass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/, message: '密码必须由8-32位大小写字母、数字、特殊字符组成', trigger: 'blur'}
        ],
        confirmpass: [
          { required: true, message: '请确认新密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    repopassClose () {
      // this.repopassdialog = false
      this.repoform = {}

      this.$refs.repoform.resetFields()
      this.$emit('closeAddEmit')
    },
    surePassword () {
      if (this.repoform.newpass !== this.repoform.confirmpass) {
        this.$message.warning('两次输入的密码不一致')
      } else {
        this.$refs['repoform'].validate(valid => {
          if (valid) {
            let tmpdata = {
              'oldPassword': this.repoform.oldpass,
              'newPassword': this.repoform.newpass,
              'userName': localStorage.getItem('modifyPasswordUserName')
            // "newPassword": this.repoform.confirmpass,
            }
            editpassword(tmpdata).then((res) => {
              if (res.code == 200) {
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                store.dispatch('user/resetToken')
                this.$router.push('/Login')
                this.repopassClose()
                this.$message.success(res.msg)
              // localStorage.setItem('showModifyPasswordFlag', 'false')
              }
            })
          }
        })
      }
    }
  }
}
</script>

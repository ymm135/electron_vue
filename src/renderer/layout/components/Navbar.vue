<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <breadcrumb v-if="!topNav" id="breadcrumb-container" class="breadcrumb-container"/>
    <top-nav v-if="topNav" id="topmenu-container" class="breadcrumb-container"/>

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item"/>

        <screenfull id="screenfull" class="right-menu-item hover-effect"/>

      </template> -->

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span style="font-size:16px;">{{showname}}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--          <router-link to="/profile/index">-->
          <!--            <el-dropdown-item>个人中心</el-dropdown-item>-->
          <!--          </router-link>-->
          <!--          <router-link to="/profile/index">-->
          <!--            <el-dropdown-item>重启</el-dropdown-item>-->
          <!--          </router-link>-->
          <!--          <router-link to="/profile/index">-->
          <!--            <el-dropdown-item>关机</el-dropdown-item>-->
          <!--          </router-link>-->
          <el-dropdown-item @click.native="putPassword">
            <img style="width:18px; vertical-align:middle;padding-right: 6px;" :src='require("../../assets/usb_images/lock.png")'/>
            <span >修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <img style="width:18px; vertical-align:middle;padding-right: 6px;" :src='require("../../assets/usb_images/logout.png")'/>
            <span >退出登录</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="(admin || system)" @click.native="shutdownSystem">
            <img style="width:18px; vertical-align:middle;padding-right: 6px;" :src='require("../../assets/usb_images/poweroff.png")'/>
            <span >关机</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="(admin || system)" @click.native="reloadSystem">
            <img style="width:18px; vertical-align:middle;padding-right: 6px;" :src='require("../../assets/usb_images/reload.png")'/>
            <span >重启</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <img align="middle" style="width:24px;display: inline-block;padding-bottom: 10px;" :src='require("../../assets/usb_images/logo.png")'/>
    </div>

      <!-- 修改密码提示框 -->
      <el-dialog class="passworddialog" title="修改密码" :visible.sync="repopassdialog" :before-close="repopassClose" :append-to-body='true' :close-on-click-modal="false" width="30%">
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="repopassClose">取 消</el-button>
                <el-button type="warning" @click="surePassword()">确 定</el-button>
            </span>
        </el-dialog>

        <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog>
        <!-- <TimeoutDialog ref="timeoutdialog"></TimeoutDialog> -->
  </div>


</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import { editpassword } from '@/api/rolemanagement'
import { getInfo } from '@/api/user'
import store from '@/store'
import DiskDialog from '@/components/USB/DiskDialog/index'
// import  TimeoutDialog  from '@/components/USB/TimeoutDialog/index'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    Search,
    DiskDialog
    // TimeoutDialog
  },
  data () {
    return {
      componentcount: 0,
      repopassdialog: false,
      adminname: '',
      showname: '',
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
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'username',
      'admin',
      'password',
      'system'
    ]),
    setting: {
      get () {
        return this.$store.state.settings.showSettings
      },
      set (val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get () {
        return this.$store.state.settings.topNav
      }
    }

  },
  created () {
    this.showUserName()
  },
  methods: {
    showUserName () {
      getInfo().then(res => {
        if (res.code === 200) {
          this.showname = res.data.userName
        }
      })
    },
    repopassClose () {
      this.repopassdialog = false
      this.repoform = {}
      this.$refs.repoform.resetFields()
    },
    surePassword () {
      if (this.repoform.oldpass !== this.$store.getters.password) {
        this.$message.warning('请输入正确的旧密码')
      } else if (this.repoform.newpass !== this.repoform.confirmpass) {
        this.$message.warning('两次输入的密码不一致')
      } else {
        this.$refs['repoform'].validate(valid => {
          if (valid) {
            let tmpdata = {
              'oldPassword': this.repoform.oldpass,
              'newPassword': this.repoform.newpass,
              'userName': this.username
            // "newPassword": this.repoform.confirmpass,
            }
            editpassword(tmpdata).then((res) => {
              if (res.code == 200) {
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                store.dispatch('user/resetToken')
                this.$router.push('/Login')
                this.repopassClose()
                this.$message.success(res.msg)
              }
            })
          }
        })
      }
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    // findRole() {
    //       getroleList().then(res => {
    //         if(res.code == 200){
    //           this.tableData = res.data.list
    //                     this.total = res.data.count
    //         }
    //       })
    // },
    async putPassword () {
      this.repopassdialog = true
    },
    async logout () {
      this.$confirm('确定退出当前用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/LogOut').then(() => {
          // location.reload()
          store.dispatch('user/resetToken')
          this.$router.push('/Login')
        })
      })
    },
    async reloadSystem () {
      this.$confirm('确定重启吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/ReloadSystem').then(() => {
          location.reload()
        })
      }).catch(() => {
        this.$message.error(res.msg)
      })
    },
    async shutdownSystem () {
      this.$confirm('确定关机吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/ShutdownSystem').then(() => {
          location.reload()
        })
      }).catch(() => {
        this.$message.error(res.msg)
      })
    }
  }
}
</script>

<style scoped>
/deep/.el-form--label-top .el-form-item__label{
  padding: 0 !important;
}
.passworddialog .el-form-item {
    //margin-bottom: 0 !important;
}
/deep/.el-dialog__body{
  padding-top: 10px !important;
}
</style>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  width: 100%;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    // transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 42px;
    margin-right: 22px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-align;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

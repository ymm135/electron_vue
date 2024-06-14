<template>
    <div class="login-container">
      <div class="login-weaper animated bounceInDown">
        <div class="login-border">
          <div class="login-main">
            <div class="login_content_title">
              <img :src='require("../../assets/usb_images/logo.png")'/>
              <span>USB安全隔离装置</span>
            </div>
            <div class="login_content_subtitle">
                        用户登录
                    </div>
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
              autocomplete="on"
              label-position="left"
            >
              <el-form-item prop="username">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="用户名"
                  name="username"
                  type="text"
                  tabindex="1"
                />
              </el-form-item>

                <el-form-item prop="password">
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    tabindex="2"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon
                      :icon-class="
                        passwordType === 'password' ? 'eye' : 'eye-open'
                      "
                    />
                  </span>
                </el-form-item>

              <el-form-item prop="code" >
                <div style="width: 218px;height:36px; float: left">
                  <el-input
                    style="width: 75%; "
                    ref="code"
                    v-model="loginForm.code"
                    placeholder="验证码"
                    name="code"
                    type="text"
                    tabindex="3"
                    maxlength="5"
                    autocomplete="off"
                    @keyup.enter.native="handleLogin"
                  />
                </div>
                <div
                class="login-code"
                style="cursor: pointer; width: 30%;height: 36px;float: right;background-color: #f0f1f5;">
                <img
                  style="height: 36px;width: 100px;"
                  :src="codeUrl"
                  @click="getCode"
                >
              </div>
              </el-form-item>

                <el-form-item v-if="ifgoogle" prop="googleCode" style="display: block;">
                  <!-- <span class="svg-container">
                    <svg-icon icon-class="validCode" />
                  </span> -->
                  <el-input
                      ref="googlenumber"
                      key="loginForm.googleCode"
                      tabindex="4"
                      v-model="loginForm.googleCode"
                      :type="passwordType"
                      placeholder="身份验证器"
                      name="googlenumber"
                      @keyup.enter.native="handleLogin"
                    />
                </el-form-item>

              <div style=" padding-bottom: 5px;">
                <el-button type="text" style="font-size:14px; color:#F26521;" @click="(forgetVisible = true)">忘记密码</el-button>
              </div>

              <el-button
                class="login_button"
                style="width: 100%;height: 48px;font-size: 16px;"
                @click.native.prevent="handleLogin"
              >
                <span style="font-size:20px;">登 录</span>
                <!-- <span v-else>登 录 中...</span> -->
              </el-button>
            </el-form>
          </div>
        </div>
      </div>
      <div class="footer_copyright ">
        <span>© Copyright ©2016-{{footyear}} 网藤科技 版权所有.USB安全隔离装置</span>
      </div>

        <el-dialog
            title="提示"
            :visible.sync="authVisible"
            width="30%">
            <div v-if="expireType == 1 && licenseType == 4">
              <div class="first_line">
                <i class="el-icon-warning" style="color: #ffba00;"></i>
                  系统未授权
              </div>
              <div class="second_line">
                请联系厂商进行授权后使用 ！
              </div>
            </div>
            <div v-else-if="expireType == 1 && licenseType == 1">
              <div class="first_line">
              <i class="el-icon-warning" style="color: #ffba00;"></i>
                产品试用授权已到期
              </div>
              <div class="second_line">
                请联系厂商进行正式授权后使用 ！
              </div>
            </div>
            <div v-else-if="licenseType == 1 && remind">
              <div class="first_line">
                <i class="el-icon-warning" style="color: #ffba00;"></i>
                  产品试用授权即将到期
              </div>
              <div class="second_line">
                请联系厂商进行正式授权后使用 ！
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- 未授权 -->
                <el-button style="background-color: #F26521;color:#fff;" v-if="((!adminData) && (!sysadmin) && expireType == 1 && licenseType == 4)" @click="closeAuth()">确 认</el-button>
                <el-button v-if="((adminData || sysadmin) && expireType == 1 && licenseType == 4)" @click="closeAuth()">取 消</el-button>
                <el-button style="background-color: #F26521;color:#fff;" v-if="((adminData || sysadmin) && expireType == 1 && licenseType == 4)"  @click="nextauth()">授 权</el-button>
                <!-- 授权到期 -->
                <el-button style="background-color: #F26521;color:#fff;" v-if="((!adminData) && (!sysadmin) && expireType == 1 && licenseType == 1)"  @click="closeAuth()">确 认</el-button>
                <el-button v-if="((adminData || sysadmin) && expireType == 1 && licenseType == 1)" @click="closeAuth()">取 消</el-button>
                <el-button style="background-color: #F26521;color:#fff;" v-if="((adminData || sysadmin) && expireType == 1 && licenseType == 1)"  @click="nextauth()">更新授权</el-button>
                <!-- 试用期小于7天 -->
                <el-button style="background-color: #F26521;color:#fff;" v-if="((!adminData) && (!sysadmin) && licenseType == 1 && remind)"  @click="enterIndex()">确 认</el-button>
                <el-button v-if="((adminData || sysadmin) && licenseType == 1 && remind)" @click="enterIndex()">取 消</el-button>
                <el-button style="background-color: #F26521;color:#fff;" v-if="((adminData || sysadmin) && licenseType == 1 && remind)"  @click="nextauth()">更新授权</el-button>
            </span>
        </el-dialog>

        <el-dialog
            class="auth_dialog"
            title="产品授权"
            width="35%"
            :visible.sync="doauth"
            @opened="showCode">
              <el-steps :active="active" finish-status="success">
                  <el-step title="获取文件"></el-step>
                  <el-step title="导入文件"></el-step>
                  <el-step title="成功授权"></el-step>
              </el-steps>
              <div class="exportLicenseDialogWrapper" v-if="active == 0">
                  <div class="FirstQrcode">
                      <div class="qrcode" id="qrcodeid" ref="qrCodeUrl" @mouseover="mouseOver"></div>
                  </div>
                  <div class="FirstNum">
                      <div>
                          <span style="font-weight: 600;font-size: 15px;">设备序列号: </span>
                          <span style="font-weight: 600;font-size: 15px;">{{ sn }}     </span>
                          <el-button plain size="small" type="warning" class="exportLicenseBtn"
                                  v-clipboard:copy="sn"
                                  v-clipboard:success="onCopy"
                                  v-clipboard:error="onError"
                                  style="font-size: 14px;">
                              复制
                          </el-button>
                      </div>
                  </div>
              </div>
              <div class="exportLicenseDialogWrapper" style="padding-top: 51px;padding-bottom: 35px;" v-if="active == 1">
                  <div style="color: #17243E;font-size: 16px;">授权文件路径：</div>
                  <div style="padding: 10px 0;">
                      <el-row :gutter="8">
                          <el-col :span="18" style="text-align: right;">
                              <el-input v-model="fileName" />
                          </el-col>
                          <el-col :span="6">
                              <el-upload
                                  class="uploadDemo"
                                  action="#"
                                  :multiple="false"
                                  :show-file-list="false"
                                  :before-upload="beforeUpload"
                                  :http-request="uploadHttpRequest"
                                  :on-remove="fileRemove"
                                  :on-change="fileChange"
                                  style="float: left;">
                                  <el-button>选择文件</el-button>
                              </el-upload>
                          </el-col>
                      </el-row>
                  </div>
              </div>
              <div class="exportLicenseDialogWrapper" style="padding-top: 30px;color: #17243E;font-size: 20px;" v-if="active == 2">
                  <p style="font-weight: 600;font-size: 20px;margin: 0;margin-bottom: 10px;">授权成功，欢迎使用USB安全隔离系统！</p>
                  <p class="success_line">设备序列号：<span>{{sn}}</span><span style="margin-left: 10px;">软件版本号：V1.0</span><span>({{sysData.CurrentVersion}})</span></p>
                  <p class="success_line">有效期：<span>{{sysData.LicenseInfo.expireDate}}</span></p>
                  <p class="success_line">授权类型：<span v-if="sysData.LicenseInfo.licenseType == 1">试用授权</span><span v-else-if="sysData.LicenseInfo.licenseType == 2">正式授权</span><span v-else>永久授权</span></p>
              </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="backstep()">取消</el-button>
                <el-button class="authbutton" size="small" style="background-color: #F26521;color:#fff;" v-if="active == 0" @click="next()">
                    下一步
                </el-button>
                <el-button class="authbutton" size="small" style="background-color: #F26521;color:#fff;" v-if="active == 1" @click="sureAuthorityFunc()">
                    授 权
                </el-button>
                <el-button class="authbutton" size="small" style="background-color: #F26521;color:#fff;" v-if="active == 2" @click="enterIndex()">
                    确 定
                </el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="提示"
            :visible.sync="forgetVisible"
            width="35%">
            <div style="font-size: 14px;padding-left:30px;margin-top: 10px;font-family: PingFangSC-Regular, PingFang SC;">
              <img style="vertical-align: middle;" :src='require("../../assets/usb_images/忘记密码.png")'/>
              【忘记密码】
            </div>
            <div style="font-size: 14px;padding-left:30px;margin-top: 14px;font-family: PingFangSC-Regular, PingFang SC;">
              普通用户忘记密码，请联系账户管理员为您重新设置密码。
            </div>
            <div style="font-size: 14px;padding-left:30px;margin-top: 14px;font-family: PingFangSC-Regular, PingFang SC;">
              系统管理员/账户管理员/审计管理员忘记密码，请联系超级管理员，为您重新设置密码。
            </div>
            <div style="font-size: 14px;padding-left:30px;margin-top: 14px;font-family: PingFangSC-Regular, PingFang SC;">
              超级管理员忘记密码，请联系系统运维人员，为您重新设置密码。
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="(forgetVisible = false)">取 消</el-button>
                <el-button type="warning" @click="(forgetVisible = false)">确 认</el-button>
            </span>
        </el-dialog>

        <el-dialog class="passworddialog" title="修改密码" :visible.sync="repopassdialog" :before-close="repopassClose" :append-to-body='true' :close-on-click-modal="false" width="30%">
          <ModifyPassword @closeAddEmit="closeAdd" />
        </el-dialog>

    </div>
  </template>

  <script>
  import { getCodeImg, getGoogle, usbLogin, updateAuth } from '@/api/login'
  import { getBasicInfo } from '@/api/systemsetting'
import store from '@/store'
  import moment from 'moment'
  import QRCode from 'qrcodejs2'
  import ModifyPassword from './components/modifyPassword.vue'

  export default {
    name: 'USBLogin',
    data () {
      return {
        codeUrl: '',
        cookiePassword: '',
        refreshParticles: true,
        loginForm: {
          username: '',
          password: '',
          kind: 1,
          code: '',
          uuid: '',
          googleCode: null
        },
        // googleauth: null,
        ifgoogle: false,
        // googleSwitch: '',
        loginRules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名!' }
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码！' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请输入验证码！' }
          ],
          googlenumber: [
            { required: true, trigger: 'blur', message: '请输入Google验证码！' }
          ]
        },
        passwordType: 'password',
        capsTooltip: false,
        showDialog: false,
        redirect: undefined,
        otherQuery: {},
        currentTime: null,
        sysInfo: '',
        authVisible: false,
        active: 0,
        qrcode: '',
        fileList: [],
        fileName: '',
        customFile: '',
        doauth: false,
        adminData: false,
        sysadmin: false,
        sysData: [],
        licenseType: 0,
        expireType: 0,
        sn: '',
        remind: false,
        // expireDate: '',
        data: '',
        forgetVisible: false,
        footyear: new Date().getFullYear() + 1,
        repopassdialog: false
      }
    },
    components: { ModifyPassword },
    watch: {
      $route: {
        handler: function (route) {
          const query = route.query
          if (query) {
            if (query !== '/setTimeNow') {
              this.redirect = query.redirect
              this.otherQuery = this.getOtherQuery(query)
            }
          }
        },
        immediate: true
      }
    },
    created () {
      this.getCode()
      this.getGoogleNumber()
    //   this.getSystemSetting()
    },
    mounted () {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
      window.addEventListener('resize', () => {
        this.refreshParticles = false
        this.$nextTick(() => (this.refreshParticles = true))
      })
    },
    destroyed () {
      clearInterval(this.timer)
      window.removeEventListener('resize', () => {})
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      getCurrentTime () {
        this.timer = setInterval((_) => {
          this.currentTime = moment().format('YYYY-MM-DD HH时mm分ss秒')
        }, 1000)
      },
      // 验证码
      getCode () {
        getCodeImg().then((res) => {
          if (res !== undefined) {
            this.codeUrl = res.data
            this.loginForm.uuid = res.id
          }
        })
      },
      getGoogleNumber () {
        // 谷歌身份验证器
        getGoogle().then((res) => {
          if (res.code == 200) {
            // this.googleSwitch = res.data
            this.ifgoogle = res.data
          }
        })
      },
      checkCapslock ({ shiftKey, key } = {}) {
        if (key && key.length === 1) {
          if (
            (shiftKey && key >= 'a' && key <= 'z') ||
            (!shiftKey && key >= 'A' && key <= 'Z')
          ) {
            this.capsTooltip = true
          } else {
            this.capsTooltip = false
          }
        }
        if (key === 'CapsLock' && this.capsTooltip === true) {
          this.capsTooltip = false
        }
      },
      showPwd () {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      // 登录
      handleLogin () {
        this.$refs.loginForm.validate((valid) => {
          localStorage.setItem('modifyPasswordUserName', this.loginForm.username)
          if (valid) {
            let tmpdata = {
              'username': this.loginForm.username,
              'password': this.loginForm.password,
              'kind': this.loginForm.kind,
              'code': this.loginForm.code,
              'uuid': this.loginForm.uuid,
              'googleCode': Number(this.loginForm.googleCode)
            }
            this.$store.dispatch('user/login', tmpdata).then(() => {
              this.licenseType = this.$store.getters.licenseType
              this.expireType = this.$store.getters.expireType
              this.sn = this.$store.getters.sn
              this.remind = this.$store.getters.remind
              // this.expireDate = this.$store.getters.expireDate
              this.data = this.$store.getters.data
              this.adminData = this.$store.getters.admin
              this.sysadmin = this.$store.getters.system
              this.prompt = this.$store.getters.prompt
              if (this.prompt > 0) {
                localStorage.setItem('showModifyPasswordFlag', 'true')
              } else {
                localStorage.setItem('showModifyPasswordFlag', 'false')
              }
              if (((this.expireType == 2 || this.expireType == 1) && this.licenseType == 2) || (this.licenseType == 1 && this.expireType == 2 && !this.remind) || ((this.expireType == 2 || this.expireType == 1) && this.licenseType == 3)) {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                // 存储token开始时间
                window.sessionStorage.setItem('tokenStartTime', new Date().getTime())
                // window.sessionStorage.setItem('refreshTime',new Date().getTime() + 25 * 60 * 1000)
              } else {
                this.authVisible = true
              }
            }).catch((rej) => {
              // this.$refs.loginForm.resetFields()
              if (rej == 'modifyPassword') {
                this.repopassdialog = true
              }
              this.getCode()
            })
          }
        })
      },
      enterIndex () {
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        // this.$refs.loginForm.resetFields()
      },
      //   进入授权
      nextauth () {
        this.authVisible = false
        this.doauth = true
      },
      // 授权步骤条
      next () {
        if (this.active++ > 2) this.active = 0
      },
      // 鼠标悬浮二维码显示
      mouseOver () {
        document.getElementById('qrcodeid').title = ''
      },
      // 复制
      onCopy: function (e) {
        this.$message({
          type: 'success',
          message: '复制成功！'
        })
      },

      onError: function (e) {
        this.$message({
          type: 'success',
          message: '复制失败！'
        })
      },

      // 第二步授权文件
      beforeUpload (file) {
        // 文件类型
        const isType = file.name.substring(file.name.lastIndexOf('.') + 1)
        const fileType = isType
        if (fileType != 'license') {
          this.$message.error('上传文件只能是license格式')
          this.fileName = ''
          this.fileList = []
        }
        return fileType
      },
      uploadHttpRequest (param) {
        this.customFile = param.file
      },
      fileRemove (file, fileList) {},
      fileChange (file, fileList) {
        this.fileName = file.name
        this.fileList = fileList
      },
      async sureAuthorityFunc () {
        if (!this.fileList || this.fileList.length <= 0) {
          this.$message.warning('请点击选择文件上传所需要上传的文件')
          return
        }
        const data = new FormData()
        const fileUps = this.customFile
        data.append('license', fileUps)
        let res = await updateAuth(data)
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg,
            showClose: true
          })
          this.active++

          getBasicInfo().then((ret) => {
            if (ret.code == 200) {
              this.sysData = ret.data
            }
          })
        }
      },
      // 二维码显示
      showCode () {
        this.$nextTick(() => {
          const codeHtml = document.getElementById('qrcodeid')
          codeHtml.innerHTML = ''
        })
        this.makeQrcode(this.data)
      },
      makeQrcode (val) {
        let tmpdata = val
        this.$nextTick(() => {
          this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: tmpdata, // 需要转换为二维码的内容
            width: 120,
            height: 120,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          })
        })
      },
      backstep () {
        this.doauth = false
        this.fileName = ''
        this.fileList = []
        this.active = 0
      },
      closeAuth () {
        this.authVisible = false
        this.getCode()
      },
      getOtherQuery (query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },

      repopassClose () {
        this.repopassdialog = false
      },

      closeAdd () {
        this.repopassClose()
        localStorage.setItem('showModifyPasswordFlag', 'false')
      }
    }
}
  </script>

  <style lang="scss" scoped>
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  .login-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: url("../../assets/usb_images/login_back.webp") no-repeat;
    background-color: #fff;
    position: relative;
    background-size: cover;
    // height: 100vh;
    background-position: 50%;
  }
  ::v-deep .el-form-item__content {
    border: 1px solid #D2D8E5 ;
}

    .exportLicenseDialogWrapper {
        height: 160px;
    }

    .exportLicenseDialogWrapper .FirstQrcode {
        display: inline-block;
        width: 120px;
        vertical-align: middle;
        padding-top: 30px;
        padding-right: 30px;
    }

    .exportLicenseDialogWrapper .FirstNum {
        display: inline-block;
        width: calc(100% - 150px);
        text-align: center;
        color: #303133;
        font-size: 14px;
    }
    .authbutton{
        width: 70px;
        height: 36px;
    }

  // .FirstQrcode {
  //   display: inline-block;
  // }
  // .FirstNum {
  //   display: inline-block;
  //   float: right;
  //   padding-top: 46px;
  //   padding-right: 112px;
  // }

  #particles-js {
    z-index: 1;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .login-weaper {
    width: 1000px;
    // -webkit-box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
    // box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    margin-left: 65%;
    // margin-left: 1077px;
    // margin-top: 270px;
  }

  .login-left {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background-color: rgba(64, 158, 255, 0);
    color: #fff;
    float: left;
    width: 50%;
    position: relative;
    min-height: 500px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    .login-time {
      position: absolute;
      left: 25px;
      top: 25px;
      width: 100%;
      color: #fff;
      opacity: 0.9;
      font-size: 18px;
      overflow: hidden;
      font-weight: 500;
    }
  }
  .second_line{
    font-weight: 100;
    font-size: 16px;
    color: #999999;
    height: 24px;
    line-height: 24px;
    // text-align: center;
    padding-left: 83px;
    padding-top: 10px;
    margin-bottom: 40px;
  }
  .success_line{
    font-weight: 400;
    font-size: 16px;
    color: #677184;
    height: 24px;
    line-height: 24px;
    margin: 1px;
  }
  .first_line{
    font-size: 18px;
    font-weight: bold;
    color: #17243E;
    height: 25px;
    line-height: 25px;
    // text-align: center;
    padding-left: 83px;
  }
  .qrcode{
    width: 144px;
    height: 139px;
  }
  .auth_dialog{
    // height: 441px !important;
  }

  .el-form-item__error{
    padding-top: 2px !important;
  }

  .login-left .img {
    width: 90px;
    height: 90px;
    border-radius: 3px;
  }

  .login-left .title {
    text-align: center;
    color: #fff;
    letter-spacing: 2px;
    font-size: 16px;
    font-weight: 600;
  }

  .login-border {
    position: relative;
    // min-height: 500px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-left: none;
    // border-top-right-radius: 5px;
    // border-bottom-right-radius: 5px;
    color: #fff;
    background-color: hsla(0, 0%, 100%, 0.9);
    // width: 50%;
    float: left;
    width: 430px;
    height: 489px;
    border-radius: 10px;
    padding-left: 49px;
  }

  .login-main {
    // margin: 0 auto;
    // width: 80%;
    // padding: 45px 63px 49px 63px;
  }

  .login-title {
    color: #333;
    margin-bottom: 40px;
    font-weight: 500;
    font-size: 22px;
    text-align: center;
    letter-spacing: 1px;
  }
  .login_content_title {
        // text-align: center;
        padding-bottom: 30px;
    }

    .login_content_title img {
        height: 30px;
        vertical-align: middle;
    }

    .login_content_title span {
        display: inline-block;
        font-weight: 500;
        font-size: 28px;
        color: #303133;
        padding-top: 2px;
        vertical-align: middle;
        padding-left: 10px;
    }
    .login_content_subtitle {
        text-align: left;
        padding-bottom: 24px;
        color: #17243E;
        font-size: 20px;
    }

    .login_button{
      background-color: #F26521;
      color: #fff;
      width: 332px;
      height: 48px;
    }

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-form {
    ::v-deep .el-input {
      display: inline-block;
      height: 36px;
      width: 85%;

      input {
        // background: transparent;
        border: 0px;
        // -webkit-appearance: none;
        // border-radius: 0px;
        padding: 12px 5px 12px 15px;
        // color: #333;
        height: 36px;
        // caret-color: #333;

        // &:-webkit-autofill {
        //   // box-shadow: 0 0 0px 1000px $bg inset !important;
        //   -webkit-text-fill-color: $cursor !important;
        // }
      }
    }
    .el-form-item--medium{
      height: 36px;
      width: 332px;
    }

    .el-form-item {
      // border: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.8);
      // border-radius: 5px;
      color: #454545;
      margin-bottom: 20px;
    }
  }
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
      .login-weaper {
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
        box-shadow: none;
      }
      // .login-main{
      //   width: 80%;
      // }
      .login-left {
        display: none !important;
      }
      .login-border {
        width: 100%;
      }
    }

    ::v-deep .el-step__head.is-success {
      color: #F26521;
      border-color: #F26521;
    }
    ::v-deep .el-step__title.is-success {
        font-weight: bold;
        color: #F26521;
    }

    // ::v-deep .el-step__description.is-success {
        // color: rgb(52, 158, 250);
    // }
    .footer_copyright {
        position: fixed;
        bottom: 10px;
        left: 50%;
        font-weight: 400;
        color: #606266;
        font-size: 14px;
        transform: translate(-50%,-50%);
    }
  }
  </style>

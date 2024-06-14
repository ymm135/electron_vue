<template>
  <div style="padding: 20px; background-color: white; margin: 0 24px 16px;">
    <div style="line-height: 35px;margin-bottom:16px;font-size: 16px;font-weight: 500;color:#303133;">功能设置</div>
    <el-form ref="form" :model="form">
      <!-- <div>
          <div class="rowclass"></div>
          <span class="titleclass">告警提示音</span>
          <el-form-item style="margin: 10px 0 10px 40px;" label="告警提示音:">
              <el-radio v-model="radio" label="1">开启</el-radio>
              <el-radio v-model="radio" label="2">关闭</el-radio>
          </el-form-item>
      </div> -->
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">多引擎配置</span>
        <el-button class="store_button" style="float:right;" type="warning" @click="restoreengine">保存</el-button>
        <el-form-item style="margin: 10px 0 10px 10px;">
          <el-checkbox v-model="basicstatus">基础引擎</el-checkbox>
          <el-checkbox v-if="deeptype" v-model="deepstatus">深度引擎</el-checkbox>
          <el-checkbox v-model="assiststatus">辅助引擎</el-checkbox>
        </el-form-item>
      </div>
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">SYSLOG设置</span>
        <el-button class="store_button" style="float:right;" type="warning" @click="restoresyslog">保存</el-button>
        <el-form :inline="true" style="margin: 10px 0 10px 40px;" ref="syslogform" :model="syslogform" :rules="syslogformrules">
          <el-form-item label="IP地址：" prop="syslogiP">
            <el-input v-model="syslogform.syslogiP" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="端口：" prop="syslogport">
            <el-input v-model="syslogform.syslogport" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">平台认证</span>
        <el-button class="store_button" style="float:right;" type="warning" @click="restorecertify">保存</el-button>
        <el-form :inline="true" style="margin: 10px 0 10px 40px;" ref="platform" :model="platform" :rules="platformrules">
          <el-form-item label="IP地址：" prop="platformauthenticationip">
            <el-input v-model="platform.platformauthenticationip" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="连接状态：">
            <img v-if="platform.onlinestatus" :src='require("../../assets/usb_images/success_log.png")' style="display:inline-block;margin-right: 3px;"/>
            <span v-if="platform.onlinestatus">连接成功 {{funcData.OnlineIp}}</span>
            <img v-if="!platform.onlinestatus" :src='require("../../assets/usb_images/error_log.png")' style="display:inline-block;margin-right: 3px;"/>
            <span v-if="!platform.onlinestatus">未连接</span>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">登录锁定设置</span>
        <el-button class="store_button" style="float:right;" type="warning" @click="restorelock">保存</el-button>
        <el-form :inline="true" style="margin: 10px 0 10px 40px;">
          <el-form-item>
            <span>登录失败</span>
            <el-input-number v-model="form.loginnum" size="mini" controls-position="right" @change="handleChange" :min="3" :max="8"></el-input-number>
            <span>次后锁定账户，锁定时间</span>
            <el-input-number v-model="form.locktime" size="mini" controls-position="right" @change="handleChange" :min="5" :max="30"></el-input-number>
            <span>分钟</span>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">定期修改密码设置</span>
        <el-button class="store_button" style="float:right;" type="warning" @click="restorePWDChange">保存</el-button>
        <el-form :inline="true" style="margin: 10px 0 10px 40px;">
          <el-form-item>
            <span>系统超过</span>
            <el-input-number v-model="form.notUpdatePasswordDays" size="mini" controls-position="right" @change="handleChange" :min="1" :max="30"></el-input-number>
            <span>天未修改登录密码时，弹窗提示用户</span>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">危险告警策略</span>
        <el-form :inline="true" style="margin: 10px 0 10px 10px;">
          <el-select v-model="form.dangerid"  placeholder="请选择危险操作" @change="handleDanger" style="margin-bottom: 10px;margin-right:3px;">
            <el-option
              v-for="item in safeList"
              :key="item.apiId"
              :label="item.apiName"
              :value="item.apiId">
            </el-option>
          </el-select>
          <el-button class="func_button" style="margin-bottom: 10px;" @click="addtoDanger">添加</el-button>
          <!-- <el-dropdown style="margin-bottom: 10px;" trigger="click" type="warning">
              <span class="el-dropdown-link">
                  添加<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                  <el-checkbox style="margin-right:100px; margin-bottom:5px;" v-model="item.isChecked" v-for="item in safeList" :key='item.apiId' :value="item.apiId" >
                      <span @click.prevent style="width:200px" class="aaa">{{item.apiName}}</span>
                  </el-checkbox>
                  <div>
                      <el-button style="float:right;margin-left: 5px;" type="warning" class="sure" @click="addtoDanger">确认</el-button>
                      <el-button style="float:right;" class="cancel" @click="">取消</el-button>
                  </div>
              </el-dropdown-menu>
          </el-dropdown> -->
          <el-table
            :data="dangerData"
            highlight-current-row
            style="width: 50%">
            <el-table-column
              prop="apiName"
              label="危险操作"
              min-width="85%">
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="15%">
              <template #default="scope">
                <el-button style="color:#F26521;" type="text" @click="deleteDanger(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <!-- <div>
          <div class="rowclass"></div>
          <span class="titleclass">威胁管理联动</span>
          <el-form :inline="true" style="margin: 10px 0 10px 40px;">
              <el-button>一键同步</el-button>
              <el-button>导出</el-button>
          </el-form>
      </div> -->
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">配置管理</span>
        <el-form :inline="true" style="margin: 10px 0 10px 10px;">
          <el-button class="func_button" @click="logCon">配置导出</el-button>
          <el-button class="func_button" @click="loginCon">配置导入</el-button>
        </el-form>
      </div>
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">系统日志导出</span>
        <el-form :inline="true" style="margin: 10px 0 10px 10px;">
          <el-button class="func_button" @click="logSys">导出日志</el-button>
        </el-form>
      </div>
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">恢复出厂设置</span>
        <el-form :inline="true" style="margin: 10px 0 10px 10px;">
          <el-button class="func_button" @click="restoreSet">恢复出厂</el-button>
        </el-form>
      </div>
      <div style="margin-bottom:35px;">
        <div class="rowclass"></div>
        <span class="titleclass">病毒库升级</span>
        <div style="display:inline-block; float:right;">
          <span>升级病毒库(当前版本</span><span>{{ funcData.virusCharacteristics }}</span><span>条病毒特征)</span>
        </div>
        <el-form :inline="true" style="margin: 10px 0 10px 10px;">
          <el-button class="func_button" style="margin-bottom: 10px;" @click="virusFunc"> 上传 </el-button>
          <el-table
            ref="singleTable"
            :data="virusData"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              prop="id"
              label="序号"
              min-width="10%">
            </el-table-column>
            <el-table-column
              prop="virus_type"
              label="病毒类型"
              min-width="15%">
            </el-table-column>
            <el-table-column
              prop="package_version"
              label="病毒版本"
              width="200">
            </el-table-column>
            <el-table-column
              prop="createdAt"
              label="上传时间"
              min-width="15%">
            </el-table-column>
            <el-table-column
              prop="username"
              label="操作者"
              min-width="15%">
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述信息"
              min-width="15%">
            </el-table-column>
            <el-table-column
              prop="msg"
              label="升级信息"
              min-width="15%">
            </el-table-column>
            <el-table-column label="引擎启动状态" min-width="10%">
              <template #default="scope">
                <span v-if="scope.row.status == 1">启动中</span>
                <span v-if="scope.row.status == 2">启动成功</span>
                <span v-if="scope.row.status == 3">启动失败</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div>
        <div class="rowclass"></div>
        <span class="titleclass">系统升级</span>
        <el-form :inline="true" style="margin: 10px 0 10px 10px;">
          <span>当前版本： V1.0</span><span>({{funcData.CurrentVersion}})</span>
          <el-button class="func_button" style="margin-left:10px;width:136px;" @click="goBack">回退上一个版本</el-button>
          <el-button class="func_button" style="margin-left:10px;width:136px;" @click="upSys">上传升级包</el-button>
        </el-form>
      </div>
    </el-form>

    <el-dialog
      class="functiondialog"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="closeuploadDialog"
      width="30%">
      <el-form ref="importDialogForm" :model="importForm">
        <el-form-item>
          <el-row :gutter="8">
            <el-col :span="18" style="text-align: right;">
              <el-input v-model="filename" />
            </el-col>
            <el-col :span="6">
              <el-upload
                class="uploadDemo"
                action="#"
                :multiple = "true"
                :limit = 10
                :http-request="uploadHttpRequest"
                :on-remove="fileRemove"
                :on-change="fileChange"
                :on-progress="uploadProcess"
                :show-file-list="false"
                style="float: left;">
                <el-button >选择文件</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="dialogTitle == '上传文件'" style="width:95%;">
          <span>描述信息：</span><el-input style="display:inline;" v-model="descrip" placeholder="请输入描述信息"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeuploadDialog">取 消</el-button>
          <el-button type="warning" @click="uploadSure" :loading="uploadLoading">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="authVisible"
      width="40%">
      <div class="first_line" v-if='((updateSoftware !== "2" || upgradeVirusDb !== "2") && !timeOut)'>
        <i class="el-icon-warning" style="color: #ffba00;"></i>
        此功能未授权，暂不支持</div>
      <div class="first_line" v-if='(timeOut)'>
        <i class="el-icon-warning" style="color: #ffba00;"></i>
        功能授权已到期</div>
      <div class="second_line">请联系厂商进行授权后使用</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if='(adminData || sysData)' size="small"  @click="authVisible = false">取消</el-button>
          <el-button v-if='(!adminData && !sysData)' size="small" style="background-color: #F26521;color:#fff;" @click="authVisible = false">确 定</el-button>
          <el-button v-if="(timeOut && (adminData || sysData))" size="small" style="background-color: #F26521;color:#fff;" @click="goauth">更新授权</el-button>
          <el-button v-if='(!timeOut && (adminData || sysData))' size="small" style="background-color: #F26521;color:#fff;" @click="goauth">授权</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      class="auth_dialog"
      title="产品授权"
      :visible.sync="doauth"
      :before-close="authcloseAuthDialog"
      width="35%"
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
        <div style="color: #17243E;font-size: 16px;font-weight: bold;">授权文件路径：</div>
        <div style="padding: 20px 0;">
          <el-row :gutter="8">
            <el-col :span="18" style="text-align: right;">
              <el-input v-model="authfileName" />
            </el-col>
            <el-col :span="6">
              <el-upload
                class="uploadDemo"
                action="#"
                :multiple="false"
                :show-file-list="false"
                :before-upload="authbeforeUpload"
                :http-request="authuploadHttpRequest"
                :on-remove="authfileRemove"
                :on-change="authfileChange"
                style="float: left;">
                <el-button>选择文件</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="exportLicenseDialogWrapper" style="padding-top: 30px;color: #17243E;font-size: 20px;" v-if="active == 2">
        <p style="font-weight: 600;font-size: 20px;margin: 0;margin-bottom: 10px;">授权成功，欢迎使用USB安全隔离装置！</p>
        <p class="success_line">设备序列号：<span>{{sn}}</span><span style="margin-left: 10px;">软件版本号：V1.0</span><span>( {{funcData.CurrentVersion}})</span></p>
        <p class="success_line">有效期：<span>{{funcData.LicenseInfo.expireDate}}</span></p>
        <p class="success_line">授权类型：<span v-if="funcData.LicenseInfo.licenseType === 1">试用授权</span><span v-else-if="sysData.LicenseInfo.licenseType == 2">正式授权</span><span v-else>永久授权</span></p>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="authcloseAuthDialog()">取消</el-button>
                <el-button class="authbutton" size="small" style="background-color: #F26521;color:#fff;" v-if="active == 0" @click="authnext()">
                    下一步
                </el-button>
                <el-button class="authbutton" size="small" style="background-color: #F26521;color:#fff;" v-if="active == 1" @click="authsureAuthorityFunc()">
                    授 权
                </el-button>
                <el-button class="authbutton" size="small" style="background-color: #F26521;color:#fff;" v-if="active == 2" @click="authenterProductLicenseDialog()">
                    确 定
                </el-button>
            </span>
    </el-dialog>

    <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>

    <!-- 恢复出厂设置 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogRestoreVisible"
      width="30%"
      :before-close="handleClose">
      <div class="restoreFactoryClass" style="padding: 10px 20px;">
        <div style="color: #000;font-size: 14px;padding-bottom: 4px;">
          确定恢复出厂设置？
        </div>
        <div style="color: #919398;font-size: 14px;padding-bottom: 4px;">
          可能会影响设备正常运行，请谨慎操作
        </div>
        <el-checkbox v-model="clearNet">清除接口、路由配置</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleEnter">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBasicInfo, logSystem, logConfig, versionBack, recoverSet, getVirusInfo, uploadVirus, uploadConfig, uploadSys, putInfo, ifDanger, putDanger } from '@/api/systemsetting'
import { request } from '@/utils/request'
import { updateAuth } from '@/api/login'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'
import QRCode from 'qrcodejs2'

export default{
  name: 'FuncSystem',
  components: {
    // DiskDialog
    TimeoutDialog

  },
  data () {
    return {
      radio: '1',
      qrcode: '',
      basicstatus: false,
      deepstatus: false,
      deeptype: false,
      assiststatus: false,
      basicstatusDB: '',
      deepstatusDB: '',
      assiststatusDB: '',
      form: {},
      platform: {},
      platformrules: {
        platformauthenticationip: [{ pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/, message: '请输入正确格式的ip地址', trigger: 'blur'}]
      },
      syslogform: {},
      syslogformrules: {
        syslogiP: [{ pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/, message: '请输入正确格式的ip地址', trigger: 'blur'}],
        syslogport: [
          { pattern: /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/, message: '请输入正确格式的端口', trigger: 'blur' }
        ]
      },
      funcData: [],
      virusData: [],
      dangerData: [],
      safeList: [],
      dialogTitle: '',
      dialogVisible: false,
      authVisible: false,
      importForm: {},
      List: [],
      filename: '',
      authfileName: '',
      customFile: '',
      btnswitch: false,
      appswitch: false,
      descrip: '',
      adminData: false,
      sysData: false,
      timeOut: false,
      doauth: false,
      active: 0,
      sn: '',
      licensetype: 0,
      expireType: 0,
      basic: '',
      encrypt: '',
      updateSoftware: '',
      upgradeVirusDb: '',
      t1: null,
      showProcess: false,
      processLen: 0,
      uploadLoading: false,
      dialogRestoreVisible: false,
      clearNet: false
    }
  },
  created () {
    this.findData()
  },
  methods: {
    findData () {
      this.adminData = this.$store.getters.admin
      this.sysData = this.$store.getters.system
      getBasicInfo().then(res => {
        if (res.code == 200) {
          this.licensetype = res.data.LicenseInfo.licenseType
          this.expireType = res.data.LicenseInfo.expireType
          this.funcData = res.data
          this.virusData = res.data.virusUpdateLogs
          this.form = {
            // syslogiP: this.funcData.SyslogIP,
            // syslogport: this.funcData.SyslogPort,
            // PlatformAuthenticationIp: this.funcData.PlatformAuthenticationIp,
            // onlinestatus: this.funcData.OnlineStatus,
            loginnum: this.funcData.LoginNum,
            locktime: this.funcData.LockTime,
            notUpdatePasswordDays: this.funcData.NotUpdatePasswordDays
          }
          this.platform = {
            platformauthenticationip: this.funcData.PlatformAuthenticationIp,
            onlinestatus: this.funcData.OnlineStatus
          }
          this.syslogform = {
            syslogiP: this.funcData.SyslogIP,
            syslogport: this.funcData.SyslogPort
          }
          if (this.funcData.LicenseInfo.upgradeVirusDb == 1 || this.funcData.LicenseInfo.upgradeVirusDb == '') {
            this.btnswitch = true
          } else {
            this.btnswitch = false
          }

          if (this.funcData.LicenseInfo.updateSoftware == 1 || this.funcData.LicenseInfo.updateSoftware == '') {
            this.appswitch = true
          } else {
            this.appswitch = false
          }
          if (this.funcData.LicenseInfo.licenseType === 2 && this.funcData.time >= this.funcData.LicenseInfo.expireDate) {
            this.timeOut = true
          } else {
            this.timeOut = false
          }

          this.basicstatus = res.data.WhiteListDB == '2'
          this.deepstatus = res.data.AdvanceVirusDB == '2'
          this.assiststatus = res.data.AssistVirusDB == '2'
          this.deeptype = res.data.AdvanceVirusDB != '3'

          this.basic = res.data.LicenseInfo.argsValue.basic
          this.encrypt = res.data.LicenseInfo.argsValue.encrypt
          this.updateSoftware = res.data.LicenseInfo.argsValue.updateSoftware
          this.upgradeVirusDb = res.data.LicenseInfo.argsValue.upgradeVirusDb
          this.sn = this.funcData.LicenseInfo.sn
        }
      })
      let dangerdata = {
        'status': '1'
      }
      let safedata = {
        'status': '2'
      }
      ifDanger(dangerdata).then(res => {
        if (res.code == 200) {
          this.dangerData = res.data
        }
      })
      ifDanger(safedata).then(res => {
        if (res.code == 200) {
          this.safeList = res.data
        }
      })
    },
    handleDanger (value) {
      this.form.dangerid = value
    },
    addtoDanger () {
      // let arr = this.safeList.map(function (item) {
      //     if(item.isChecked === true){
      //         return item.apiId
      //     }
      // })
      // let ids = arr.filter((n)=>{
      //     return n!==undefined
      // })
      if (this.form.dangerid == undefined) {
        this.$message.warning('请选择要添加的操作')
      } else {
        let tmpdata = {
          'apiId': this.form.dangerid,
          'status': '1'
        }
        putDanger(tmpdata).then((res) => {
          if (res.code == 200) {
            this.$message.success('添加成功')
            this.findData()
            this.form.dangerid = ''
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    deleteDanger (row) {
      this.$confirm('确定删除该项危险操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let tmpdata = {
          'apiId': row.apiId,
          'status': '2'
        }
        putDanger(tmpdata).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.findData()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 导出系统日志
    logSys () {
      logSystem().then((res) => {
        let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
        const blob = new Blob([res.data], {
          type: 'application/x-rar-compressed'
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
    },
    // 配置导出
    logCon () {
      let dangerdata = {
        'apiId': '11-10'
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
                h('span', { style: 'color: #F56C6C' }, '用户配置导出, 请谨慎操作！')
              ])
            }).then(() => {
              logConfig().then((res) => {
                let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
                const blob = new Blob([res.data], {
                  type: 'application/x-rar-compressed'
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
            logConfig().then((res) => {
              let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
              const blob = new Blob([res.data], {
                type: 'application/x-rar-compressed'
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
    // 回退版本
    goBack () {
      this.$confirm(`确定回退上一版本吗?
                            (回退需拔出U盘)`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        versionBack().then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.findData()
          }
        })
      }).catch(() => {})
    },
    // 配置导入
    loginCon () {
      let dangerdata = {
        'apiId': '11-9'
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
                h('span', { style: 'color: #F56C6C' }, '用户配置导入, 请谨慎操作！')
              ])
            }).then(() => {
              this.dialogTitle = '配置导入'
              this.dialogVisible = true
            }).catch(() => {})
          } else {
            this.dialogTitle = '配置导入'
            this.dialogVisible = true
          }
        }
      })
    },
    fileRemove (file, List) {},
    fileChange (file, List) {
      this.filename = file.name
      //   if (List.length > 1) {
      //     List.splice(0, 1);
      //   }
      //   this.List = List
      // this.showProcess = true;
      // this.processLen = file.percentage; // file.percentage获取文件上传进度
      // this.showProcess = true; // 显示进度条
      // this.processLen = parseInt(event.percentage); // 动态获取文件上传进度
      // if (this.processLen >= 100) {
      //     this.processLen = 100
      //     setTimeout( () => {this.showProcess = false}, 1000) // 一秒后关闭进度条
      // }
    },
    uploadProcess (event, file, fileList) {
      this.showProcess = true
      this.processLen = file.percentage.toFixed(0) // file.percentage获取文件上传进度
    },
    uploadHttpRequest (param) {
      this.customFile = param.file
      let tempfile = param
      let filetype = tempfile.file.name.split('.').slice(-1)[0]
      if (this.dialogTitle == '配置导入') {
        if (filetype !== 'zip') {
          this.$message.error('仅支持zip类型文件')
          this.List = []
        }
      } else if (this.dialogTitle == '上传文件') {
        if (filetype !== 'zip') {
          this.$message.error('仅支持zip类型文件')
          this.List = []
        }
      } else if (this.dialogTitle == '系统升级') {
        if (filetype !== 'rar') {
          this.$message.error('仅支持rar类型文件')
          this.List = []
        }
      }
    },
    closeuploadDialog () {
      this.List = []
      this.dialogVisible = false
      this.dialogTitle = ''
      this.descrip = ''
      this.filename = ''
      this.totalsize = 0
    },
    uploadSure () {
      this.uploadLoading = true
      const data = new FormData()
      const fileUps = this.customFile
      data.append('file', fileUps)
      // 病毒库上传
      if (this.dialogTitle == '上传文件') {
        data.append('fileName', this.customFile.name)
        data.append('description', this.descrip)
        uploadVirus(data).then((res) => {
          if (res.code == 200) {
            this.uploadLoading = false
            this.$message({
              type: 'success',
              message: '上传成功',
              showClose: true
            })
            this.closeuploadDialog()
            this.findData()
          } else {
            this.uploadLoading = false
            this.$message({
              type: 'error',
              message: res.msg,
              showClose: true
            })
            this.closeuploadDialog()
          }
        }).catch((e) => {
          this.uploadLoading = false
        })
      } else if (this.dialogTitle == '配置导入') {
        uploadConfig(data).then((res) => {
          if (res.code == 200) {
            this.uploadLoading = false
            this.$message({
              type: 'success',
              message: '导入成功',
              showClose: true
            })
            this.closeuploadDialog()
            this.findData()
          } else {
            this.uploadLoading = false
            this.$message({
              type: 'error',
              message: res.msg,
              showClose: true
            })
            this.closeuploadDialog()
          }
        }).catch((e) => {
          this.uploadLoading = false
        })
      } else if (this.dialogTitle == '系统升级') {
        data.append('fileName', this.customFile.name)
        uploadSys(data).then((res) => {
          if (res.code == 200) {
            this.uploadLoading = false
            this.$message({
              type: 'success',
              message: '升级成功',
              showClose: true
            })
            this.closeuploadDialog()
            this.findData()
          } else {
            this.uploadLoading = false
            this.$message({
              type: 'error',
              message: res.msg,
              showClose: true
            })
            this.closeuploadDialog()
          }
        }).catch((e) => {
          this.uploadLoading = false
        })
      }
    },
    // 病毒库上传
    virusFunc () {
      if (this.upgradeVirusDb !== '2') {
        this.authVisible = true
      } else {
        let dangerdata = {
          'apiId': '12-2'
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
                  h('span', { style: 'color: #F56C6C' }, '病毒库升级, 请谨慎操作！')
                ])
              }).then(() => {
                if (this.ExpireType == 1) {
                  this.authVisible = true
                }
                getVirusInfo().then((res) => {
                  if (res.code == 200) {
                    if (res.data.udiskMount) {
                      this.$message.error('请先拔出U盘')
                    } else {
                      if (!this.btnswitch) {
                        this.dialogVisible = true
                        this.dialogTitle = '上传文件'
                      }
                    }
                  }
                })
              }).catch(() => {})
            } else {
              getVirusInfo().then((res) => {
                if (res.code == 200) {
                  if (res.data.udiskMount) {
                    this.$message.error('请先拔出U盘')
                  } else {
                    if (!this.btnswitch) {
                      this.dialogVisible = true
                      this.dialogTitle = '上传文件'
                    }
                  }
                }
              })
            }
          }
        })
      }
    },
    // 升级包上传
    upSys () {
      if (this.updateSoftware !== '2') {
        this.authVisible = true
      } else {
        if (!this.appswitch && !this.btnswitch) {
          let dangerdata = {
            'apiId': '12-3'
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
                    h('span', { style: 'color: #F56C6C' }, '系统升级, 请谨慎操作！')
                  ])
                }).then(() => {
                  getVirusInfo().then((res) => {
                    if (res.code == 200) {
                      if (res.data.udiskMount) {
                        this.$message.error('请先拔出U盘')
                      } else {
                        if (!this.appswitch) {
                          this.dialogVisible = true
                          this.dialogTitle = '系统升级'
                        }
                      }
                    }
                  })
                }).catch(() => {})
              } else {
                getVirusInfo().then((res) => {
                  if (res.code == 200) {
                    if (res.data.udiskMount) {
                      this.$message.error('请先拔出U盘')
                    } else {
                      if (!this.appswitch) {
                        this.dialogVisible = true
                        this.dialogTitle = '系统升级'
                      }
                    }
                  }
                })
              }
            }
          })
        } else {
          this.authVisible = true
        }
      }
    },
    // 恢复出厂
    handleClose () {
      this.dialogRestoreVisible = false
      this.clearNet = false
    },

    handleEnter () {
      this.dialogVisible = false
      this.$confirm(`确定重启USB系统？重启可能会影响设备正常运行。请谨慎操作`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        showClose: false, // 是否显示右上角的x
        closeOnClickModal: false, // 是否可以点击空白处关闭弹窗
        type: 'warning',
        beforeClose: (action, ctx, close) => {
          if (action !== 'confirm') {
            close()
            return
          }
          document.getElementsByClassName('btn-custom-cancel')[0].style.display = 'none'
          ctx.confirmButtonLoading = true
          let tmpdata = {
            clearNet: this.clearNet ? '1' : '0'
          }
          recoverSet(tmpdata).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.findData()
            }
            ctx.confirmButtonLoading = false
            close()
            this.handleClose()
          })
        }
      }).then(async () => {

      }).catch(() => {})
    },

    restoreSet () {
      let dangerdata = {
        'apiId': '12-1'
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
                h('span', { style: 'color: #F56C6C' }, '恢复出厂设置, 请谨慎操作！')
              ])
            }).then(() => {
              this.dialogRestoreVisible = true
              // recoverSet().then((res)=>{
              //   if (res.code === 200) {
              //     this.$message({
              //       type: 'success',
              //       message: res.msg
              //     })
              //     this.findData()
              //   }
              // })
            }).catch(() => {})
          } else {
            this.dialogRestoreVisible = true
            // recoverSet().then((res)=>{
            //   if (res.code === 200) {
            //     this.$message({
            //       type: 'success',
            //       message: res.msg
            //     })
            //     this.findData()
            //   }
            // })
          }
        }
      })
    },
    handleChange (val) {},
    restoreengine () {
      let dangerdata = {
        'apiId': '11-6'
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
                h('span', { style: 'color: #F56C6C' }, '引擎配置, 请谨慎操作！')
              ])
            }).then(() => {
              this.basicstatusDB = this.basicstatus ? '2' : '1'
              this.deepstatusDB = !this.deeptype ? '3' : (this.deepstatus ? '2' : '1')
              this.assiststatusDB = this.assiststatus ? '2' : '1'
              let tmpdata = {
                'advanceVirusDB': this.deepstatusDB,
                'assistVirusDB': this.assiststatusDB,
                'whiteListDB': this.basicstatusDB,
                'groupId': 4
              }
              putInfo(tmpdata).then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.findData()
                }
              })
            }).catch(() => {})
          } else {
            this.basicstatusDB = this.basicstatus ? '2' : '1'
            this.deepstatusDB = !this.deeptype ? '3' : (this.deepstatus ? '2' : '1')
            this.assiststatusDB = this.assiststatus ? '2' : '1'
            let tmpdata = {
              'advanceVirusDB': this.deepstatusDB,
              'assistVirusDB': this.assiststatusDB,
              'whiteListDB': this.basicstatusDB,
              'groupId': 4
            }
            putInfo(tmpdata).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.findData()
              }
            })
          }
        }
      })
    },
    restoresyslog () {
      this.$refs['syslogform'].validate(valid => {
        if (valid) {
          let dangerdata = {
            'apiId': '11-7'
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
                    h('span', { style: 'color: #F56C6C' }, 'syslog设置, 请谨慎操作！')
                  ])
                }).then(() => {
                  let tmpdata = {
                    'syslogIP': this.syslogform.syslogiP,
                    'syslogPort': this.syslogform.syslogport,
                    'groupId': 5
                  }
                  putInfo(tmpdata).then((res) => {
                    if (res.code == 200) {
                      this.$message.success(res.msg)
                      this.findData()
                    }
                  })
                }).catch(() => {})
              } else {
                let tmpdata = {
                  'syslogIP': this.syslogform.syslogiP,
                  'syslogPort': this.syslogform.syslogport,
                  'groupId': 5
                }
                putInfo(tmpdata).then((res) => {
                  if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.findData()
                  }
                })
              }
            }
          })
        }
      })
      // this.$refs.syslogform.resetFields()
    },
    restorecertify () {
      this.$refs['platform'].validate(valid => {
        if (valid) {
          let dangerdata = {
            'apiId': '11-8'
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
                    h('span', { style: 'color: #F56C6C' }, '平台认证, 请谨慎操作！')
                  ])
                }).then(() => {
                  let tmpdata = {
                    'platformAuthenticationIp': this.platform.platformauthenticationip,
                    'groupId': 6
                  }
                  putInfo(tmpdata).then((res) => {
                    if (res.code == 200) {
                      this.$message.success(res.msg)
                      setTimeout(() => {
                        this.findData() //
                      }, 1000)
                    }
                  })
                })
              } else {
                let tmpdata = {
                  'platformAuthenticationIp': this.platform.platformauthenticationip,
                  'groupId': 6
                }
                putInfo(tmpdata).then((res) => {
                  if (res.code == 200) {
                    this.$message.success(res.msg)
                    setTimeout(() => {
                      this.findData() //
                    }, 1000)
                  }
                })
              }
            }
          })
        }
      })
      // this.$refs.platform.resetFields()
    },
    restorelock () {
      let tmpdata = {
        'loginNum': this.form.loginnum.toString(),
        'lockTime': this.form.locktime.toString(),
        'groupId': 1
      }
      putInfo(tmpdata).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.findData()
        }
      })
    },
    restorePWDChange () {
      let tmpdata = {
        'notUpdatePasswordDays': this.form.notUpdatePasswordDays.toString(),
        'groupId': 12
      }
      putInfo(tmpdata).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.findData()
        }
      })
    },
    goauth () {
      this.doauth = true
      this.authVisible = false
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
    authnext () {
      this.active++
    },

    // 第二步授权文件
    authbeforeUpload (file) {
      // 文件类型
      const isType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const fileType = isType
      if (fileType != 'license') {
        this.authfileName = ''
        this.fileList = []
        this.$message.error('上传文件只能是license格式！')
      }
      return fileType
    },
    authuploadHttpRequest (param) {
      const Type = param.file.name.substring(param.file.name.lastIndexOf('.') + 1)
      const authfileType = Type
      if (authfileType != 'license') {
        this.authfileName = ''
      } else {
        this.authfileName = param.file.name
      }
      this.customFile = param.file
    },
    authfileRemove (file, fileList) {},
    authfileChange (file, fileList) {
      this.fileName = file.name
      this.fileList = fileList
    },
    authsureAuthorityFunc () {
      if (!this.fileList || this.fileList.length <= 0) {
        this.$message.warning('请点击选择文件上传所需要上传的文件')
        return
      }
      const data = new FormData()
      const fileUps = this.customFile
      data.append('license', fileUps)
      updateAuth(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg,
            showClose: true
          })
          this.active++

          getBasicInfo().then((res) => {
            if (res.code == 200) {
              this.sysData = res.data
            }
          })
        }
      })
    },
    // 二维码显示
    showCode () {
      this.$nextTick(() => {
        const codeHtml = document.getElementById('qrcodeid')
        codeHtml.innerHTML = ''
      })
      this.makeQrcode(this.$store.getters.data)
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
    authcloseAuthDialog () {
      this.doauth = false
      this.authfileName = ''
      this.fileList = []
      this.active = 0
    },
    authenterProductLicenseDialog () {
      this.authcloseAuthDialog()
      this.findData()
    }
  }
}
</script>

<style scoped>
.rowclass{
  width: 4px;
  height: 18px;
  border: 1px;
  background-color: #F26521;
  display: inline-block;
  margin-right: 3px;
  vertical-align:middle;
}
.store_button{
  background-color: #F26521;
  color:#fff;
}
el-progress{
  display: block !important;
}

/deep/.el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #F26521 !important;
  border: 1px solid #F26521 !important;
}
/deep/.el-checkbox__inner:hover {
  border-color: #F26521;
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #303133;
}
/deep/.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #F26521!important;
}
/deep/.el-dialog__footer {
  padding: 10px 52px 20px;
}
/deep/.el-input-number--mini {
  width: 100px;
  line-height: 26px;
  margin: 0 8px;
}
/deep/.el-input-number__increase{
  margin-right: 3px;
  border-right: 1px solid #DCDFE6;
}
/deep/.el-input-number__decrease{
  margin-right: 3px;
  border-right: 1px solid #DCDFE6 !important;
}

.func_button:hover {
  background-color: #F26521;
  border-color: #F26521;
  color: #fff
}
.func_button{
  width: 98px;
}
.authbutton{
  width: 70px;
  height: 36px;
}
/* .FirstNum {
    display: inline-block;
    float: right;
    padding-top: 34px;
    padding-right: 112px;
  }
  .FirstQrcode {
    display: inline-block;
  } */
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
.qrcode{
  width: 144px;
  height: 139px;
}
.first_line{
  font-size: 18px;
  font-weight: bold;
  color: #17243E;
  height: 25px;
  line-height: 25px;
  padding-left: 83px;
  /* text-align: center; */
}
.second_line{
  font-weight: 100;
  font-size: 16px;
  color: #999999;
  height: 24px;
  line-height: 24px;
  /* text-align: center; */
  padding-left: 104px;
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

.titleclass{
  display: inline-block;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}
span{
  color: #606266
}
</style>

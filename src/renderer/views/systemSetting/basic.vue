<template>
    <div style=" padding: 20px; background-color: white;margin: 0 24px 16px !important;">
        <div style="line-height: 35px;margin-bottom:16px;font-size: 16px;font-weight: 500;color:#303133 ;">基础设置</div>
        <el-form ref="form" :model="form" :rules="rules">
            <div style="margin-bottom:24px;">
                <div class="rowclass"></div>
                <span class="titleclass">管理IP</span>
                <el-button style="float:right;" type="warning" @click="restoremaip">保存</el-button>
                <el-form-item style="margin-bottom:2px;margin-left: 56px;" label="管理IP：">
                    <el-radio v-model="radio" label="2">开启</el-radio>
                    <el-radio v-model="radio" label="1">关闭</el-radio>
                </el-form-item>
                <el-form-item style="margin-bottom:2px;margin-left: 56px;" label="管理IP：">
                    <el-input style="display: grid;width: 200px;" v-model="form.ipname" placeholder="请输入"></el-input>
                </el-form-item>
                <div  style="margin:10px 0 2px 50px;">
                    <div style="color: #606266; font-size: 14px;font-weight: 400;color: #303133;margin-bottom: 5px;">如果您修改管理IP需注意以下两点：</div>
                    <!-- <ul> -->
                        <li style="color: #606266; font-size: 14px;color: #606266;line-height: 20px;">当开启管理IP开关后管理员只能在该IP地址访问</li>
                        <li style="color: #606266; font-size: 14px;color: #606266;line-height: 20px;">当需要修改系统IP时建议先将管理IP开关关闭以防无法登录</li>
                    <!-- </ul> -->
                </div>
            </div>

            <div style="margin-bottom:24px;">
                <div class="rowclass"></div>
                <span class="titleclass">设备信息</span>
                <el-button style="float:right;" type="warning" @click="restoredevice">保存</el-button>
                <el-form :inline="true" style="margin-bottom:2px;margin-left: 40px;" ref="basicform" :model="basicform" :rules="basicformrules">
                    <el-form-item label="设备名称：" prop="devicename" class="basic_form">
                        <el-input v-model="basicform.devicename" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型：" prop="devicetype" class="basic_form">
                        <el-input v-model="basicform.devicetype" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="安全负责人：" prop="secleader" class="basic_form" style="margin-left:12px;">
                        <el-input v-model="basicform.secleader" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" style="margin-bottom:2px;margin-left: 40px;" ref="impform" :model="impform" :rules="impformrules">
                    <el-form-item label="重要程度：" prop="importance" class="basic_form">
                        <el-input v-model="impform.importance" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="所处位置：" prop="location" class="basic_form">
                        <el-input v-model="impform.location" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div style="margin-bottom:24px;" v-if="false">
                <div class="rowclass"></div>
                <span class="titleclass">设备IP设置</span>
                <el-form :inline="true" style="margin-bottom:2px;margin-left: 40px;" autocomplete="on" ref="lan1form" :model="lan1form" :rules="lan1formrules">
                    <el-form-item label="LAN1 IP：" prop="firstlanip" class="basic_form">
                        <el-input autocomplete="on" v-model="lan1form.firstlanip" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="子网掩码：" prop="firstlanmask" class="basic_form">
                        <el-input v-model="lan1form.firstlanmask" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="LAN1 网关：" prop="firstlangateway" class="basic_form" style="margin-left:11px;">
                        <el-input v-model="lan1form.firstlangateway" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-button style="float:right;" type="warning" @click="restoreLan1">保存</el-button>
                </el-form>
                <el-form :inline="true" style="margin-bottom:2px;margin-left: 40px;" ref="lan2form" :model="lan2form" :rules="lan2formrules">
                    <el-form-item label="LAN2 IP：" prop="secondlanip" class="basic_form">
                        <el-input autocomplete="on" v-model="lan2form.secondlanip" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="子网掩码：" prop="secondlanmask" class="basic_form">
                        <el-input v-model="lan2form.secondlanmask" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="LAN2 网关：" prop="secondlangateway" class="basic_form" style="margin-left:11px;">
                        <el-input v-model="lan2form.secondlangateway" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-button style="float:right;" type="warning" @click="restoreLan2">保存</el-button>
                </el-form>
            </div>

            <div style="margin-bottom:24px;">
                <div class="rowclass"></div>
                <span class="titleclass">时间设置</span>
                <el-form :inline="true" style="margin-bottom:2px;margin-left: 43px;">
                    <el-form-item label="时间设置：">
                        <!-- <router-link to="/setTime"> -->
                            <el-date-picker
                                style="width: 203px;"
                                v-model="form.datetime"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                            <!-- <el-input v-model="form.datetime" placeholder="请输入"></el-input> -->
                        <!-- </router-link> -->
                    </el-form-item>
                    <el-form-item label="当前装置时间：" style="margin-left:15px;">
                        <span>{{sysData.time}}</span>
                    </el-form-item>
                    <el-button style="float:right;" type="warning" @click="restoretime">保存</el-button>
                </el-form>
            </div>

            <div style="margin-bottom:24px;">
                <div class="rowclass"></div>
                <span class="titleclass">时间同步服务器设置</span>
                <el-form :inline="true" style="margin-bottom:2px;margin-left:56px;" ref="synctimeform" :model="synctimeform" :rules="synctimeformrules">
                    <el-form-item label="IP地址：" prop="timesyncip">
                        <el-input v-model="synctimeform.timesyncip" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="当前装置时间：" style="margin-left:18px;">
                        <span>{{sysData.time}}</span>
                    </el-form-item>
                    <el-button style="float:right;" type="warning" @click="restoreiptime">保存</el-button>
                </el-form>
            </div>

            <div style="margin-bottom:24px;">
                <div class="rowclass"></div>
                <span class="titleclass">授权管理</span>
                <el-form :inline="true" style="margin-bottom:2px;margin-left: 10px;">
                    <el-form-item label="设备序列号：" >
                        <span class="authorized">{{sysData.SN}}</span>
                    </el-form-item>
                    <el-form-item label="软件版本号：" style="margin-left:40px;">
                        <span class="authorized">V1.0({{sysData.CurrentVersion}})</span>
                    </el-form-item>
                    <el-form-item label="有效期：" style="margin-left:40px;">
                        <span class="authorized">{{sysData && sysData.LicenseInfo && sysData.LicenseInfo.expireDate}}</span>
                    </el-form-item>
                    <el-form-item label="授权类型：" style="margin-left:40px;">
                        <span class="authorized" v-if="(sysData && sysData.LicenseInfo && sysData.LicenseInfo.licenseType === 2)">正式授权</span>
                        <span class="authorized" v-else-if="(sysData && sysData.LicenseInfo && sysData.LicenseInfo.licenseType === 1)">试用授权</span>
                        <span class="authorized" v-else-if="(sysData && sysData.LicenseInfo && sysData.LicenseInfo.licenseType === 3)">永久授权</span>
                    </el-form-item>
                </el-form>
                <div style="margin-left: 10px;">
                    <el-button type="warning" @click="doauth = true">导入授权文件</el-button>
                </div>
            </div>

            <div style="margin-top: 10px;">
                <div class="rowclass"></div>
                <span class="titleclass">授权功能</span>
                <el-form :inline="true" style="margin-bottom:2px;margin-left: 10px;">
                    <el-form-item style="margin-right: 40px;">
                        <img v-if='sysData.LicenseInfo && sysData.LicenseInfo.argsValue.basic == "2"' style="width: 20px;vertical-align: middle;margin-right: 4px;" :src='require("../../assets/usb_images/基础功能.png")'/>
                        <img v-else style="width: 20px;vertical-align: middle;margin-right: 4px;" :src='require("../../assets/usb_images/基础功能备份.png")'/>
                        <span style="color: #606266;">基础功能</span>
                    </el-form-item>
                    <el-form-item style="margin-right: 40px;">
                        <img v-if='sysData.LicenseInfo && sysData.LicenseInfo.argsValue.upgradeVirusDb == "2"' style="width: 20px;vertical-align: middle;margin-right: 4px;" :src='require("../../assets/usb_images/病毒库升级.png")'/>
                        <img v-else style="width: 20px;vertical-align: middle;margin-right: 4px;" :src='require("../../assets/usb_images/病毒库升级备份.png")'/>
                        <span style="color: #606266;">病毒库升级</span>
                    </el-form-item>
                    <el-form-item style="margin-right: 40px;">
                        <img v-if='sysData.LicenseInfo && sysData.LicenseInfo.argsValue.updateSoftware == "2"' style="width: 20px;vertical-align: middle;margin-right: 4px;" :src='require("../../assets/usb_images/软件升级.png")'/>
                        <img v-else style="width: 20px;vertical-align: middle;margin-right: 4px;" :src='require("../../assets/usb_images/软件升级备份.png")'/>
                        <span style="color: #606266;">软件升级</span>
                    </el-form-item>
                    <el-form-item >
                        <img v-if='sysData.LicenseInfo && sysData.LicenseInfo.argsValue.encrypt == "2"' style="width: 20px;vertical-align: middle;margin-right: 4px;" :src='require("../../assets/usb_images/文件传输.png")'/>
                        <img v-else style="width: 20px;vertical-align: middle;margin-right: 4px;" :src='require("../../assets/usb_images/文件传输备份.png")'/>
                        <span style="color: #606266;">文件加密传输</span>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 授权功能 -->
            <div style="margin-top: 10px;">
                <div class="rowclass"></div>
                <span class="titleclass">开放端口配置</span>
                <div style="margin-left: 10px;line-height: 36px;overflow: hidden;">
                    <el-checkbox v-model="openPort">开放端口</el-checkbox>
                    <el-button style="float:right;" type="warning" @click="restorePortConfig">保存</el-button>
                </div>
            </div>
            <!-- usb模式设置 -->
            <div v-if="radioMode != '3'" style="margin-top: 10px;">
              <div class="rowclass"></div>
              <span class="titleclass">液晶屏配置</span>
              <div style="margin-left: 10px;line-height: 36px;overflow: hidden;">
                <el-form-item style="margin-bottom:2px;margin-left: 56px;" label="授权模式：">
                  <el-radio v-model="radioMode" label="2">需授权模式</el-radio>
                  <el-radio v-model="radioMode" label="1">无授权模式</el-radio>
                </el-form-item>
                <el-button style="float:right;" type="warning" @click="restoreUSBMode">保存</el-button>
              </div>
            </div>
        </el-form>

        <el-dialog
            title="产品授权"
            width="35%"
            :visible.sync="doauth"
            @opened="showCode"
            :before-close="closeAuthDialog">
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
                    <div v-if="sysData.LicenseInfo">
                        <span style="font-weight: 600;font-size: 15px;">设备序列号: </span>
                        <span style="font-weight: 600;font-size: 15px;">{{sysData.LicenseInfo.sn }}     </span>
                        <el-button plain size="small" type="warning" class="exportLicenseBtn"
                                v-clipboard:copy="sysData.LicenseInfo.sn"
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
                            <el-input v-model="fileName" />
                        </el-col>
                        <el-col :span="6">
                            <el-upload
                                class="uploadDemo"
                                action="#"
                                :multiple="false"
                                :before-upload="beforeUpload"
                                :http-request="uploadHttpRequest"
                                :on-remove="fileRemove"
                                :on-change="fileChange"
                                :show-file-list="false"
                                style="float: left;">
                                <el-button style="background-color: #fff;color: #606266;">选择文件</el-button>
                            </el-upload>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="exportLicenseDialogWrapper" style="padding: 50px 30px 30px;color: #17243E;font-size: 20px;" v-if="active == 2">
                <p style="font-weight: 600;font-size: 20px;margin: 0;margin-bottom: 10px;">授权成功，欢迎使用USB安全隔离装置！</p>
                <p class="success_line">设备序列号：<span>{{sysData.SN}}</span><span style="margin-left: 10px;">软件版本号：V1.0({{sysData.CurrentVersion}})</span></p>
                <p class="success_line">有效期：<span>{{sysData.LicenseInfo.expireDate}}</span></p>
                <p class="success_line">授权类型：<span v-if="sysData.LicenseInfo.licenseType === 1">试用授权</span><span v-else-if="sysData.LicenseInfo.licenseType == 2">正式授权</span><span v-else>永久授权</span></p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="func_button" @click="closeAuthDialog()">取消</el-button>
                <el-button class="authbutton" size="small" type="warning" v-if="active == 0" @click="next()">
                    下一步
                </el-button>
                <el-button class="authbutton" size="small" type="warning" v-if="active == 1" @click="sureAuthorityFunc()">
                    授 权
                </el-button>
                <el-button class="authbutton" size="small" type="warning" v-if="active == 2" @click="enterProductLicenseDialog()">
                    确 定
                </el-button>
            </span>
        </el-dialog>

        <!-- <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog> -->
        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>
    </div>
</template>

<script>
import { getBasicInfo, putInfo, putLan, putTime, putIpTime, ifDanger} from '@/api/systemsetting'
import { updateAuth } from '@/api/login'
import QRCode from 'qrcodejs2'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'
// import  DiskDialog  from '@/components/USB/DiskDialog/index'

const reg_ip = /^((25[0-5]|2[0-4]\d|[0-1]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[0-1]?\d\d?)$|^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*(|\/(3[0-2]|[1-2]\d|\d))$/

export default{
  name: 'BasicSystem',
  components: {
    // DiskDialog
    TimeoutDialog

  },
  data () {
    return {
      componentcount: 0,
      radio: '1',
      radioMode: '1',
      form: {},
      synctimeform: {
        timesyncip: ''
      },
      synctimeformrules: {
        timesyncip: [
          { pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/, message: '请输入正确格式的ip地址', trigger: 'blur'}
        ]
      },
      lan1form: {},
      lan1formrules: {
        firstlanip: [
          { pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/, message: '请输入正确格式的ip地址', trigger: 'blur'}
        ],
        firstlanmask: [
          { pattern: /^((128|192)|2(24|4[08]|5[245]))(\.(0|(128|192)|2((24)|(4[08])|(5[245])))){3}$/, message: '请输入正确格式的子网掩码', trigger: 'blur'}
        ],
        firstlangateway: [
          { pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/, message: '请输入正确格式的网关', trigger: 'blur'}
        ]
      },
      lan2form: {},
      lan2formrules: {
        secondlanip: [
          { pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/, message: '请输入正确格式的ip地址', trigger: 'blur'}
        ],
        secondlanmask: [
          { pattern: /^((128|192)|2(24|4[08]|5[245]))(\.(0|(128|192)|2((24)|(4[08])|(5[245])))){3}$/, message: '请输入正确格式的子网掩码', trigger: 'blur'}
        ],
        secondlangateway: [
          { pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/, message: '请输入正确格式的网关', trigger: 'blur'}
        ]
      },
      basicform: {},
      basicformrules: {
        devicename: [
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,20}$/, message: '设备名称支持20位以内中文、英文或数字', trigger: 'blur'}
        ],
        devicetype: [
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,20}$/, message: '设备类型支持20位以内中文、英文或数字', trigger: 'blur'}
        ],
        secleader: [
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,20}$/, message: '安全负责人支持20位以内中文、英文或数字', trigger: 'blur'}
        ]
      },
      impform: {},
      impformrules: {
        importance: [
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,20}$/, message: '重要程度支持20位以内中文、英文或数字', trigger: 'blur'}
        ],
        location: [
          { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]{1,20}$/, message: '所处位置支持20位以内中文、英文或数字', trigger: 'blur'}
        ]
      },
      sysData: [],
      doauth: false,
      active: 0,
      qrcode: '',
      fileList: [],
      fileName: '',
      customFile: '',
      licenseData: [],
      rules: {
        ip: [
          { pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/, message: '请输入正确格式的ip地址', trigger: 'blur'}
        ]
      },
      licensetype: 0,
      expireType: 0, // 1未授权
      timeOut: false, // 正式授权到期
      openPort: false
    }
  },
  created () {
    this.findData()
  },
  methods: {
    findData () {
      getBasicInfo().then(res => {
        console.log(res)
        if (res.code == 200) {
          if (res.data.LicenseInfo.licenseType === 2 && res.data.time >= res.data.LicenseInfo.expireDate) {
            this.timeOut = true
          } else {
            this.timeOut = false
          }
          this.licensetype = res.data.LicenseInfo.licenseType
          this.expireType = res.data.LicenseInfo.expireType
          this.sysData = res.data
          this.radio = this.sysData.TrustIpStatus
          this.form = {
            ipname: this.sysData.ControlIp
          }
          this.synctimeform.timesyncip = this.sysData.TimeSyncIp
          this.lan1form = {
            firstlanip: this.sysData.NetworkInfo.lan1.lanIp,
            firstlanmask: this.sysData.NetworkInfo.lan1.lanMask,
            firstlangateway: this.sysData.NetworkInfo.lan1.lanGateway
          }
          this.lan2form = {
            secondlanip: this.sysData.NetworkInfo.lan2.lanIp,
            secondlanmask: this.sysData.NetworkInfo.lan2.lanMask,
            secondlangateway: this.sysData.NetworkInfo.lan2.lanGateway
          }
          this.basicform = {
            devicename: this.sysData.DeviceName,
            devicetype: this.sysData.DeviceType,
            secleader: this.sysData.SecLeader
          }
          this.impform = {
            importance: this.sysData.Importance,
            location: this.sysData.Location
          }
          this.openPort = this.sysData.PortSetting == '1'
          this.radioMode = this.sysData.UsbMode
        }
      })
    },
    restoremaip () {
      let dangerdata = {
        'apiId': '11-1'
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
                h('span', { style: 'color: #F56C6C' }, '管理IP设置, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdata = {
                'controlIp': this.form.ipname,
                'trustIpStatus': this.radio, // 开关值
                'groupId': 2
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
              'controlIp': this.form.ipname,
              'trustIpStatus': this.radio, // 开关值
              'groupId': 2
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
    restoreLan1 () {
      let dangerdata = {
        'apiId': '11-3'
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
                h('span', { style: 'color: #F56C6C' }, '设备IP设置, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdata = {
                'lanGateway': this.lan1form.firstlangateway,
                'lanIp': this.lan1form.firstlanip,
                'lanMask': this.lan1form.firstlanmask,
                'lanName': 'lan1'
              }
              putLan(tmpdata).then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.findData()
                }
              })
            }).catch(() => {})
          } else {
            let tmpdata = {
              'lanGateway': this.lan1form.firstlangateway,
              'lanIp': this.lan1form.firstlanip,
              'lanMask': this.lan1form.firstlanmask,
              'lanName': 'lan1'
            }
            putLan(tmpdata).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.findData()
              }
            })
          }
        }
      })
    },
    restoreLan2 () {
      let dangerdata = {
        'apiId': '11-3'
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
                h('span', { style: 'color: #F56C6C' }, '设备IP设置, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdata = {
                'lanGateway': this.lan2form.secondlangateway,
                'lanIp': this.lan2form.secondlanip,
                'lanMask': this.lan2form.secondlanmask,
                'lanName': 'lan2'
              }
              putLan(tmpdata).then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.findData()
                }
              })
            }).catch(() => {})
          } else {
            let tmpdata = {
              'lanGateway': this.lan2form.secondlangateway,
              'lanIp': this.lan2form.secondlanip,
              'lanMask': this.lan2form.secondlanmask,
              'lanName': 'lan2'
            }
            putLan(tmpdata).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.findData()
              }
            })
          }
        }
      })
    },
    restoredevice () {
      let dangerdata = {
        'apiId': '11-2'
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
                h('span', { style: 'color: #F56C6C' }, '设备信息修改, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdata = {
                'deviceName': this.basicform.devicename,
                'deviceType': this.basicform.devicetype,
                'importance': this.impform.importance,
                'location': this.impform.location,
                'secLeader': this.basicform.secleader,
                'groupId': 3
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
              'deviceName': this.basicform.devicename,
              'deviceType': this.basicform.devicetype,
              'importance': this.impform.importance,
              'location': this.impform.location,
              'secLeader': this.basicform.secleader,
              'groupId': 3
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
    restoretime () {
      let dangerdata = {
        'apiId': '11-4'
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
                h('span', { style: 'color: #F56C6C' }, '时间设置, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdata = {
                'serverTime': this.form.datetime
              }
              putTime(tmpdata).then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.findData()
                }
              })
            }).catch(() => {})
          } else {
            let tmpdata = {
              'serverTime': this.form.datetime
            }
            putTime(tmpdata).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.findData()
              }
            })
          }
        }
      })
    },
    restoreiptime () {
      let dangerdata = {
        'apiId': '11-5'
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
                h('span', { style: 'color: #F56C6C' }, '时间同步服务器设置, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdata = {
                'ntpIp': this.synctimeform.timesyncip
              }
              putIpTime(tmpdata).then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.findData()
                }
              })
            }).catch(() => {})
          } else {
            let tmpdata = {
              'ntpIp': this.synctimeform.timesyncip
            }
            putIpTime(tmpdata).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.findData()
              }
            })
          }
        }
      })
    },
    restorePortConfig () {
      console.log(this.openPort)
      let dangerdata = {
        'apiId': '11-11'
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
                h('span', { style: 'color: #F56C6C' }, '开放端口配置, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdata = {
                'portSetting': this.openPort ? '1' : '2',
                'groupId': 11
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
              'portSetting': this.openPort ? '1' : '2',
              'groupId': 11
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
    restoreUSBMode () {
      let dangerdata = {
        'apiId': '12-4'
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
                h('span', { style: 'color: #F56C6C' }, '修改使用场景, 请谨慎操作！')
              ])
            }).then(() => {
              let tmpdata = {
                'usbMode': this.radioMode,
                'groupId': 13
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
              'usbMode': this.radioMode,
              'groupId': 13
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
        this.$message.error('上传文件只能是license格式！')
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
    sureAuthorityFunc () {
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
      this.makeQrcode(this.sysData.LicenseInfo.data)
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
    closeAuthDialog () {
      this.doauth = false
      this.fileName = ''
      this.fileList = []
      this.active = 0
    },
    enterProductLicenseDialog () {
      this.closeAuthDialog()
      this.findData()
    }
  }
}
</script>

<style scoped>
.el-button{
    background-color: #F26521;
    color:#fff;
}
/* /deep/.el-form--inline .el-form-item__label{
    width: 85px ;
    text-align: end;
    padding: 0;
} */
/deep/.basic_form label{
    width: 85px ;
    text-align: end;
    padding: 0;
}
.rowclass{
    width: 4px;
    height: 18px;
    border: 1px;
    background-color: #F26521;
    display: inline-block;
    margin-right: 3px;
    vertical-align:middle;
}
.titleclass{
    display: inline-block;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
}
.authorized{
    color: #F26521;
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
/* .FirstQrcode {
display: inline-block;
} */
.qrcode{
width: 144px;
height: 139px;
}
.func_button {
    background-color: #fff !important;
    /* border-color: #17243E!important; */
    color:#17243E !important
}
.func_button:hover {
    background-color: #F26521 !important;
    border-color: #F26521 !important;
    color: #fff !important
}
.authbutton{
    width: 70px;
    height: 36px;
}
.success_line{
    font-weight: 400;
    font-size: 16px;
    color: #677184;
    height: 24px;
    line-height: 24px;
    margin: 1px;
  }

/* .FirstNum {
    display: inline-block;
    float: right;
    padding-top: 34px;
    padding-right: 112px;
} */
/deep/.el-radio__input.is-checked + .el-radio__label {
    color: #303133 ;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #F26521;
    background: #FFF;
}
/deep/.el-radio__inner::after {
    width: 7px;
    height: 7px;
    background-color: #F26521;
}
/deep/.el-form--inline .el-form-item {
    margin-right: 16px;
}
</style>

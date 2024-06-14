<template>
    <div style="width: 100%;">
        <div style="background-color: #fff;margin-left: 24px;margin-right:24px;height: 836px;">
            <div
                style="line-height: 24px;font-size:16px;padding: 11px 0 13px 24px;font-weight: 500;color: #000;font-family:PingFang SC;">
                资源库</div>
            <div style="border:1px solid #E4E7ED"></div>
            <div style="position: relative;">
                <div class="lefttree"
                    style="position: absolute;display: inline-block;width:18%;margin-top:8px;">
                    <el-tree style="height:719px;padding-left: 19px;" class="lazy_tree" ref="tree" :data="treedata" :props="defaultProps"
                        :load="loadNode" node-key="id" highlight-current :check-on-click-node="true"
                        :current-node-key="currentNodeKey" @node-click="handleNodeClick" lazy>
                    </el-tree>
                    <div style="color:#606266;margin-top:8px;font-size:12px;padding-left: 19px;">
                        <span style="margin-right:49px;">剩余磁盘空间:</span>
                        <span> {{ freesize }}G </span>

                        <!-- <el-progress :percentage="percentage" :color="customColor"></el-progress> -->
                    </div>
                </div>

                <el-divider direction="vertical" style="position: absolute;"></el-divider>

                <div style=" display: inline-block;width:79%; float:right;background-color: #fff;">
                    <el-form style="margin-top:14px;">
                        <el-form-item style="float:right;margin-right: 20px;">
                            <el-button v-if="filepermission.create" @click="addFile">新建文件夹</el-button>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 16px;">
                            <el-dropdown
                                v-if="filepermission.del || filepermission.copy || filepermission.move || filepermission.rename">
                                <el-button class="more">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="filepermission.del" @click.native="delFunc"><el-button
                                            class="more" type="text">删除</el-button></el-dropdown-item>
                                    <el-dropdown-item v-if="filepermission.copy" @click.native="copyFunc"><el-button
                                            class="more" type="text">复制</el-button></el-dropdown-item>
                                    <el-dropdown-item v-if="filepermission.move" @click.native="moveFunc"><el-button
                                            class="more" type="text">移动</el-button></el-dropdown-item>
                                    <el-dropdown-item v-if="filepermission.rename" @click.native="renameFunc"><el-button
                                            class="more" type="text">重命名</el-button></el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 16px;">
                            <el-button v-if="filepermission.download" @click="downSource">下载</el-button>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 16px;">
                            <el-button v-if="filepermission.upload" @click="upSource">上传</el-button>
                        </el-form-item>
                    </el-form>

                    <div class="detail_table">
                        <el-table style="overflow:auto" max-height='711px' :data="tableData" tooltip-effect="dark"
                            @selection-change="handleSelectionChange" v-loading="tableloading" stripe>
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column class="infinite-list-item" prop="name" label="文件名">
                                <template slot-scope="scope">
                                    <img v-if='(scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "doc" || scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "docx" || scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "DOCX" || scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "DOC")'
                                        :src='require("../../assets/usb_images/docx.png")' />
                                    <img v-else-if='(scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "txt")'
                                        :src='require("../../assets/usb_images/text.png")' />
                                    <img v-else-if='(scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "pdf")'
                                        :src='require("../../assets/usb_images/pdf.png")' />
                                    <img v-else-if='(scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "ppt")'
                                        :src='require("../../assets/usb_images/p p t.png")' />
                                    <img v-else-if='(scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "xlsx")'
                                        :src='require("../../assets/usb_images/Excel.png")' />
                                    <img v-else-if='(scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "zip" || scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "rar")'
                                        :src='require("../../assets/usb_images/压缩包.png")' />
                                    <img v-else-if='(scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "png" || scope.row.name.substring(scope.row.name.lastIndexOf(".") + 1, scope.row.name.length) == "gif")'
                                        :src='require("../../assets/usb_images/图片.png")' />
                                    <img v-else-if="scope.row.isParent"
                                        :src='require("../../assets/usb_images/img_file.png")' />
                                    <img v-else :src='require("../../assets/usb_images/未知.png")' />
                                    <el-button type="text" style="color:#606266;" @click="preview(scope.row)"
                                        @dblclick.native="todetail(scope.row)">{{ scope.row.name }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>

        <!-- 新建文件夹弹窗 -->
        <el-dialog title="新建" :visible.sync="addVisible" width="30%" :before-close="closeAdd">
            <div style="margin-bottom: 10px;">文件夹名称</div>
            <el-form ref="addform" :model="addform" :rules="rules">
                <el-form-item prop="addinput">
                    <el-input v-model="addform.addinput" placeholder="请输入中文，英文，数字"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAdd">取 消</el-button>
                <el-button type="warning" @click="addSure">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 重命名弹窗 -->
        <el-dialog title="重命名" :visible.sync="renameVisible" width="30%" :before-close="closeRename">
            <div style="margin-bottom: 10px;">新文件夹名</div>
            <el-form ref="renameform" :model="renameform" :rules="rules"></el-form>
            <el-input v-model="renameform.renameinput"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeRename">取 消</el-button>
                <el-button type="warning" @click="renameSure">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 复制移动弹窗 -->
        <el-dialog class="copy_dialog" :title="dialogTitle" :visible.sync="copyVisible" width="508px"
            :before-close="closeDialog">
            <el-checkbox v-if="todisk" v-model="secret" style="margin-bottom: 5px;" :disabled='disable'>加密</el-checkbox>
            <el-tree v-if="refreshTable" class="dialogtree" style="height:271px;width: 480px;" ref="tree"
                :data="treedata" :props="defaultProps" :load="loadNode" node-key="id" :default-expand-all="isExpand"
                highlight-current :current-node-key="currentNodeKey" @node-click="handletoNodeClick" lazy>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="warning" @click="entercopy" :loading="copyLoading">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 上传弹窗 -->
        <el-dialog title="上传" class="uploaddialog" :visible.sync="dialogVisible" :before-close="closeuploadDialog" width="508px">
            <el-checkbox v-if="todisk" v-model="secret" style="margin-bottom: 5px;" :disabled='disable'>加密</el-checkbox>
            <el-form ref="importDialogForm" :model="importForm">
                <el-form-item>
                    <el-row :gutter="8">
                        <el-col :span="18" style="text-align: right;">
                            <el-input v-model="fileName" />
                        </el-col>
                        <el-col :span="6">
                            <el-upload class="uploadDemo" action="#" :multiple="true" :limit=10 :file-list="List"
                                :http-request="uploadHttpRequest" :on-remove="fileRemove" :on-change="fileChange"
                                style="float: left;">
                                <el-button>选择文件</el-button>
                                <div slot="tip" style="color:#F26521;margin-left: -29em;font-size: 12px;">一次最多上传10个文件
                                </div>
                            </el-upload>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeuploadDialog">取 消</el-button>
                    <el-button type="warning" @click="uploadSure" :loading="uploadLoading">确 定</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 预览 -->
        <el-dialog :title="previewtitle" :visible.sync="previewVisible" append-to-body :before-close="previewClose" class="file-dialog">
            <div v-if="docFile" style="height:80vh;">
                <div ref="docxfile"></div>
            </div>
            <div v-else style="width: 100%;height: 100%;" >
                <iframe ref="docxiframe" :src="pdfUrl" frameborder="0" style="width: 100%;height: 100%;min-height: 80vh;"></iframe>
            </div>

        </el-dialog>

        <!-- <DiskDialog ref="diskdialog" :componentcount="componentcount"></DiskDialog> -->
        <TimeoutDialog ref="timeoutdialog"></TimeoutDialog>

        <el-dialog title="修改密码" :visible.sync="repopassdialog" :before-close="repopassClose" :append-to-body='true' :close-on-click-modal="false" width="30%">
          <ModifyPassword  @closeAddEmit="closeModifyPassword" />
        </el-dialog>

    </div>
</template>

<script>
import { getleftList, delList, ifuploadList, uploadList, ifdownList, downList, copyList, moveList, renameList, addList, getfreesize, getAccess, previewAll, previewDetail, previewDoc, previewTxt } from '@/api/source'
import { ifDanger, getBasicInfo } from '@/api/systemsetting'
import TimeoutDialog from '@/components/USB/TimeoutDialog/index'
import ModifyPassword from '@/views/usblogin/components/modifyPassword.vue'

const fileTypeMap = {
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'doc': 'application/msword;charset=utf-8',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8',
  'pdf': 'application/pdf',
  'ppt': 'application/pdf',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'png': 'image/png',
  'gif': 'image/gif',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'txt': 'text/plain'
}
export default {
  name: 'Source',
  components: {
    TimeoutDialog, ModifyPassword
  },
  data () {
    return {
      componentcount: 0,
      licensetype: 1,
      treedata: [],
      currentNodeKey: '',
      defaultProps: {
        children: 'dirList',
        label: 'name'
      },
      isExpand: false,
      refreshTable: true,
      dialogTitle: '',
      defKeys: [],
      tableData: [],
      deleteList: [],
      downList: [],
      renamingList: [],
      parentList: [], // 判断是否有文件夹
      path: '',
      dialogVisible: false,
      addVisible: false,
      importForm: {},
      fileList: [],
      fileName: '',
      renameVisible: false,
      copyVisible: false,
      renameform: {
        renameinput: ''
      },
      List: [],
      customFile: [],
      totalsize: 0,
      currentpath: '',
      notcopypath: '',
      addform: {
        addinput: ''
      },
      rules: {
        addinput: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9].{1,20}$/, message: '文件夹名称支持20位以内中文、英文或数字', trigger: 'blur' }
        ]
      },
      topath: '',
      frompath: '',
      uploadLoading: false,
      tableloading: false,
      copyLoading: false,
      todisk: false,
      secret: false,
      freesize: '',
      encryption: '',
      addfilepath: '',
      partitions: false, // 单分区
      ifallow: true, // U盘根目录和多分区一级目录不允许操作
      copyudiskallow: false,
      curnode: undefined,
      copytonode: undefined,
      filepermission: {}, // 用户所有权限
      curid: null,
      wordURL: '', // 文件地址
      renamename: '',
      pdfUrl: '',
      previewVisible: false,
      previewtitle: '',
      docFile: false,
      timeOut: false,
      expiretype: 0,
      disable: false,
      percentage: 0,
      customColor: '#409eff',
      imgType: ['bmp', 'jpg', 'jpeg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp', 'avif', 'apng'],
      videoType: ['wmv', 'asf', 'asx', 'rm', 'rmvb', 'mp4', '3gp', 'mov', 'm4v', 'avi', 'dat', 'mkv', 'flv', 'vob'],
      wordType: ['text', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rar', 'zip', '7z', 'apz', 'ar', 'bz', 'car', 'dar', 'cpgz', 'f', 'ha', 'hbc', 'hbc2', 'hbe', 'hpk', 'hyp'],
      repopassdialog: false
    }
  },
  watch: {
    currentNodeKey (id) {
      // console.log(id);
      // Tree 内部使用了 Node 类型的对象来包装用户传入的数据，用来保存目前节点的状态。可以用 $refs 获取 Tree 实例
      if (id !== null) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(id)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(null)
        })
      }
    }
  },
  created () {
    if (this.$store.getters.r !== '/ResourceLibrary') {
      this.$router.push(this.$store.getters.r)
    } else {
      this.findDetail()
      this.findAccess()
    }
    console.log(localStorage.getItem('showModifyPasswordFlag'))
    if (localStorage.getItem('showModifyPasswordFlag') == 'true') {
      this.repopassdialog = true
    } else {
      this.repopassdialog = false
    }
  },
  methods: {
    // 右侧展示文件名
    findDetail () {
      let temdata = {
        'path': this.path
      }
      getleftList(temdata).then(res => {
        if (res.code == 200) {
          this.currentpath = res.data.currentPath
          this.treedata = res.data.dirList
          this.path = res.data.path
        }
      })
      getfreesize().then((res) => {
        if (res.code == 200) {
          this.freesize = res.data
          this.percentage = Number(Number(this.freesize) / 39 * 100)
        }
      })
      getBasicInfo().then((res) => {
        if (res.code == 200) {
          if (res.data.LicenseInfo.licenseType === 2 && res.data.time >= res.data.LicenseInfo.expireDate) {
            this.timeOut = true
          } else {
            this.timeOut = false
          }
          // this.expiretype = res.data.LicenseInfo.ExpireType
          // 到期或未授权 加密框置灰
          this.disable = !(!this.timeOut && res.data.LicenseInfo.argsValue.encrypt == '2')
        }
      })
    },
    // 获得权限
    findAccess () {
      getAccess().then((res) => {
        if (res.code == 200) {
          this.filepermission = res.data.filePermission
        }
      })
    },
    publicDetail () {
      let temdata = {
        'path': this.currentNodeKey
      }
      getleftList(temdata).then(res => {
        if (res.code == 200) {
          this.currentpath = res.data.currentPath
          this.path = res.data.path
          let tableArr = []
          for (let i = 0; i < res.data.dirList.length; i++) {
            tableArr.push({ name: res.data.dirList[i].name, path: res.data.dirList[i].path, isParent: res.data.dirList[i].isParent })
          }
          for (let i = 0; i < res.data.fileList.length; i++) {
            tableArr.push({ name: res.data.fileList[i].name, path: res.data.fileList[i].path, isParent: false })
          }
          this.tableData = tableArr
        }
      })
    },
    refreshNodeBy (id) {
      if (!this.dialogVisible) {
        let node = this.$refs.tree.getNode(this.curnode) // 通过节点id找到对应树节点对象
        this.curnode.loaded = false
        this.curnode.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点

        let copytonode = this.$refs.tree.getNode(this.copytonode) // 通过节点id找到对应树节点对象
        // this.copytonode.loaded = false;
        // this.copytonode.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
      }
    },

    // 双击进入下一级
    todetail (row) {
      if (row.isParent) {
        let tempdata = {
          'path': row.path
        }
        this.currentpath = row.path
        this.currentNodeKey = row.path
        getleftList(tempdata).then((res) => {
          if (res.code == 200) {
            let tableArr = []
            for (let i = 0; i < res.data.dirList.length; i++) {
              tableArr.push({ name: res.data.dirList[i].name, path: res.data.dirList[i].path, isParent: res.data.dirList[i].isParent })
            }
            for (let i = 0; i < res.data.fileList.length; i++) {
              tableArr.push({ name: res.data.fileList[i].name, path: res.data.fileList[i].path, isParent: false })
            }
            this.tableData = tableArr
          }
        })
        this.handleNodeClick(row)
      }
    },
    // 单击预览
    preview (row) {
      if (!row.isParent) {
        let tmpdata = {
          'path': row.path
        }
        previewAll(tmpdata).then(res => {
          if (res.code == 200) {
            let previewdata = {
              'path': decodeURIComponent(res.data)
            }

            this.previewtitle = row.name
            this.previewVisible = true
            // 获取文件类型 文件名最后一个点后面的就是文件类型
            const index = row.name.lastIndexOf('.')
            if (index === -1) {
              // 没有文件类型的处理
              this.$message.warning('不支持预览')
            }
            let fileType = row.name.substring(index + 1)
            // 统一小写
            fileType = fileType.toLowerCase()
            const type = fileTypeMap[fileType]

            if (fileType == 'pdf') {
              downList(previewdata).then((res) => {
                const blobUrl = new Blob([res.data], { type })
                this.pdfUrl = window.URL.createObjectURL(blobUrl)
              })
            } else if (fileType == 'txt') {
              previewTxt(previewdata).then((res) => {
                const blobUrl = new Blob([res.data], { type })
                this.pdfUrl = window.URL.createObjectURL(blobUrl)
              })
            } else if (fileType == 'docx') {
              this.docFile = true
              downList(previewdata).then((res) => {
                // const blobUrl = new Blob([res.data], { type });
                // this.pdfUrl = window.URL.createObjectURL(blobUrl)
                let docx = require('docx-preview')
                this.$nextTick(() => {
                  docx.renderAsync(res.data, this.$refs.docxfile).then(x => console.log('docx: finished')).catch(() => {
                    this.docFile = false
                    this.$message.warning('文件暂不支持预览')
                  })
                })
              })
            } else if (this.imgType.includes(fileType)) {
              downList(previewdata).then((res) => {
                const blobUrl = new Blob([res.data], { type })
                this.pdfUrl = window.URL.createObjectURL(blobUrl)
              })
            } else {
              this.previewVisible = false
              this.$message.warning('不支持预览')
            }
          };
        })
      }
    },
    previewClose () {
      this.previewVisible = false
      this.docFile = false
      this.pdfUrl = ''
      this.previewtitle = ''
    },
    // 重命名
    renameFunc () {
      if (this.deleteList.length > 0) {
        let str = this.deleteList[0]
        let arr = str.split('/')
        this.ifallow = !(arr.length == 5 && arr[4].indexOf('分区') > -1)
      }
      if (!this.ifallow) {
        this.$message.warning('不允许操作该目录')
        return
      }
      let dangerdata = {
        'apiId': '1-6'
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
                h('span', { style: 'color: #F56C6C' }, '资源库文件目录重命名, 请谨慎操作！')
              ])
            }).then(() => {
              if (this.renamingList.length > 1 || this.renamingList.length == 0) {
                this.$message.warning('请选择一个文件进行重命名')
                return
              }
              this.renameVisible = true
              this.renameform.renameinput = this.renamename
            })
          } else {
            if (this.renamingList.length > 1 || this.renamingList.length == 0) {
              this.$message.warning('请选择一个文件进行重命名')
              return
            }
            this.renameVisible = true
            this.renameform.renameinput = this.renamename
          }
        }
      })
    },
    renameSure () {
      let tempdata = {
        pathList: [{
          'src': this.renamingList[0],
          'dst': this.renamingList[0].slice(0, this.renamingList[0].lastIndexOf('/')) + '/' + this.renameform.renameinput
        }]
      }
      renameList(tempdata).then(ret => {
        if (ret.code == 200) {
          this.$message.success('重命名成功')
          this.publicDetail()
          this.closeRename()
          this.refreshNodeBy(this.curnode.id)
        }
      })
    },

    closeRename () {
      this.renameform.renameinput = ''
      this.renameVisible = false
    },

    // 复制
    copyFunc () {
      if (this.deleteList.length > 0) {
        this.todisk = false
        let str = this.deleteList[0]
        let arr = str.split('/')
        this.ifallow = !(arr.length == 5 && arr[4].indexOf('分区') > -1)
      }
      if (!this.ifallow) {
        this.$message.warning('不允许操作该目录')
        return
      }
      let dangerdata = {
        'apiId': '1-1'
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
                h('span', { style: 'color: #F56C6C' }, '资源库文件目录复制, 请谨慎操作！')
              ])
            }).then(() => {
              if (this.deleteList.length == 0) {
                this.$message.warning('请选择要复制的文件')
                return
              }
              this.dialogTitle = '复制文件'
              this.copyVisible = true
            })
          } else {
            if (this.deleteList.length == 0) {
              this.$message.warning('请选择要复制的文件')
              return
            }
            this.dialogTitle = '复制文件'
            this.copyVisible = true
          }
        }
      })
    },
    // 移动
    moveFunc () {
      this.todisk = false
      if (this.deleteList.length > 0) {
        let str = this.deleteList[0]
        let arr = str.split('/')
        this.ifallow = !(arr.length == 5 && arr[4].indexOf('分区') > -1)
      }
      if (!this.ifallow) {
        this.$message.warning('不允许操作该目录')
        return
      }
      let dangerdata = {
        'apiId': '1-2'
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
                h('span', { style: 'color: #F56C6C' }, '资源库文件目录移动, 请谨慎操作！')
              ])
            }).then(() => {
              if (this.deleteList.length == 0) {
                this.$message.warning('请选择要移动的文件')
                return
              }
              this.dialogTitle = '移动文件'
              this.copyVisible = true
            })
          } else {
            if (this.deleteList.length == 0) {
              this.$message.warning('请选择要移动的文件')
              return
            }
            this.dialogTitle = '移动文件'
            this.copyVisible = true
          }
        }
      })
    },
    closeDialog () {
      this.dialogTitle = ''
      this.copyVisible = false
      // this.refreshNodeBy(this.curnode.id)
      this.todisk = false// 是否到U盘
      this.secret = false// 加密
      this.refreshTable = false
      this.isExpand = false
      this.$nextTick(() => {
        this.refreshTable = true
      })
      this.currentpath = this.notcopypath
      this.ifallow = this.copyudiskallow
    },
    // 确定移动/复制
    entercopy () {
      // let str = this.deleteList[0]
      // let arr = str.split('/')
      // this.ifallow =  arr.length == 5 && arr[4].indexOf('分区')>-1 ? false:true
      if (!this.ifallow) {
        this.$message.warning('不允许操作该目录')
      } else {
        this.copyLoading = true
        if (this.secret) {
          this.encryption = '2'// 加密
        } else if (this.deleteList[0].indexOf('udisks') > -1 && !this.topath.includes('udisks')) {
          this.encryption = '3'// 非U盘到U盘解密
        } else {
          this.encryption = '1'// 原样
        }

        let pathList = []
        for (let i = 0; i < this.deleteList.length; i++) {
          let list = this.deleteList[i]
          pathList.push({ src: this.deleteList[i], dst: this.topath + list.slice(list.lastIndexOf('/')) })
        }

        let tempdata = {
          'pathList': pathList,
          encryption: this.encryption
        }
        if (this.dialogTitle == '复制文件') {
          if (this.topath == '') {
            this.copyLoading = false
            this.$message.warning('请选择要复制的地址')
          } else {
            copyList(tempdata).then(ret => {
              if (ret.code == 200) {
                this.copyLoading = false
                this.$message({
                  type: 'success',
                  message: '复制成功',
                  showClose: true
                })
                this.closeDialog()
                this.refreshNodeBy(this.curnode.id)
                this.refreshNodeBy(this.copytonode.id)
              }
            })
          }
        } else if (this.dialogTitle == '移动文件') {
          if (this.topath == '') {
            this.copyLoading = false
            this.$message.warning('请选择要移动的地址')
          } else {
            moveList(tempdata).then(ret => {
              if (ret.code == 200) {
                this.copyLoading = false
                this.$message({
                  type: 'success',
                  message: '移动成功',
                  showClose: true
                })
                this.closeDialog()
                this.refreshNodeBy(this.curnode.id)
                this.publicDetail()
              }
            })
          }
        }
      }
    },

    // 新建文件夹
    addFile () {
      // let str = this.deleteList[0]
      // let arr = str.split('/')
      // this.ifallow =  arr.length == 5 && arr[4].indexOf('分区')>-1 ? false:true
      let dangerdata = {
        'apiId': '1-7'
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
                h('span', { style: 'color: #F56C6C' }, '资源库新建目录, 请谨慎操作！')
              ])
            }).then(() => {
              if (!this.ifallow) {
                this.$message.warning('不允许操作该目录')
              } else {
                if (this.currentpath == '') {
                  this.$message.warning('请选择新建文件夹的位置')
                } else {
                  this.addfilepath = this.currentpath
                  this.addVisible = true
                }
              }
            })
          } else {
            if (!this.ifallow) {
              this.$message.warning('不允许操作该目录')
            } else {
              if (this.currentpath == '') {
                this.$message.warning('请选择新建文件夹的位置')
              } else {
                this.addfilepath = this.currentpath
                this.addVisible = true
              }
            }
          }
        }
      })
    },
    closeAdd () {
      this.addform.addinput = ''
      this.addform = {}
      this.addVisible = false
      this.$refs.addform.resetFields()
    },
    addSure () {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          let tempdata = {
            pathList: [{ 'dst': this.currentpath + '/' + this.addform.addinput }]
          }
          addList(tempdata).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '新建成功',
                showClose: true
              })
              this.publicDetail()
              this.closeAdd()
              this.refreshNodeBy(this.curnode.id)
            } else {
              this.$message({
                type: 'error',
                message: '新建失败',
                showClose: true
              })
            }
          })
        }
      })
    },

    // 上传准备
    fileRemove (file, List) {
      this.totalsize = 0
      this.customFile = this.customFile.filter(item => item !== file.raw)
      for (let i = 0; i < List.length; i++) {
        this.totalsize += List[i].size
      }
    },
    fileChange (file, List) {
      // console.log(List);
      //   this.filename = file.name
      this.List = List
      //   this.fileName = List.map( v=> v.name)
    },
    uploadHttpRequest (param) {
      this.totalsize = 0
      this.customFile.push(param.file)
      for (let i = 0; i < this.customFile.length; i++) {
        this.totalsize += this.customFile[i].size
      }
    },
    closeuploadDialog () {
      this.List = []
      this.customFile = []
      this.dialogVisible = false
      this.totalsize = 0
      // this.todisk = false
      this.secret = false
      this.uploadLoading = false
    },
    upSource () {
      let dangerdata = {
        'apiId': '1-3'
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
                h('span', { style: 'color: #F56C6C' }, '资源库文件上传, 请谨慎操作！')
              ])
            }).then(() => {
              if (!this.ifallow) {
                this.$message.warning('不允许操作该目录')
              } else {
                if (this.currentpath == '') {
                  this.$message.warning('请选择上传的位置')
                } else {
                  this.dialogVisible = true
                  if (this.currentNodeKey == 'udisk') {
                    this.todisk = true
                  }
                }
              }
            })
          } else {
            if (!this.ifallow) {
              this.$message.warning('不允许操作该目录')
            } else {
              if (this.currentpath == '') {
                this.$message.warning('请选择上传的位置')
              } else {
                this.dialogVisible = true
                if (this.currentNodeKey == 'udisk') {
                  this.todisk = true
                }
              }
            }
          }
        }
      })
    },
    // 上传
    async uploadSure () {
      var data = new FormData()
      if (!this.List || this.List.length <= 0) {
        this.$message.warning('请选择所需要上传的文件')
      } else if (this.List.length > 10) {
        this.$message.warning('超出上传文件数上限10个')
      } else if (this.totalsize > 1073741824) {
        this.$message.warning('超出上传文件大小上限1G')
      } else {
        this.uploadLoading = true
        let ifdatalist = {
          'fileNameList': this.List.map((d) => d.name),
          'path': this.currentpath,
          'totalFileSize': this.totalsize
        }

        if (this.secret) {
          this.encryption = '2'// 加密
        } else {
          this.encryption = '1'// 原样
        }

        await ifuploadList(ifdatalist).then(ret => {
          if (ret.data) {
            for (let i = 0; i < this.customFile.length; i++) {
              let fileUps = this.customFile[i]
              data.append('files', fileUps)
              data.append('dst', this.currentpath)
              data.append('encryption', this.encryption)
            }
            uploadList(data).then(response => {
              if (response.code == 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功',
                  showClose: true
                })
                this.closeuploadDialog()
                this.publicDetail()
              } else {
                this.$message({
                  type: 'error',
                  message: response.msg,
                  showClose: true
                })
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: ret.msg,
              showClose: true
            })
            this.closeuploadDialog()
          }
        })
      }
    },

    // 下载
    downSource () {
      if (this.downList.length > 0) {
        let str = this.downList[0]
        let arr = str.split('/')
        this.ifallow = !(arr.length == 5 && arr[4].indexOf('分区') > -1)
      }

      if (this.downList.length == 0) {
        this.$message.warning('请选择要下载的文件')
        return
      }
      if (this.parentList.indexOf(true) > -1) {
        this.$message.warning('文件夹不可下载')
        return
      }
      let dangerdata = {
        'apiId': '1-4'
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
                h('span', { style: 'color: #F56C6C' }, '资源库文件下载, 请谨慎操作！')
              ])
            }).then(() => {
              for (let i = 0; i < this.downList.length; i++) {
                let downdata = {
                  'path': this.downList[i]
                }
                ifdownList(downdata).then(res => {
                  if (res.code == 200) {
                    this.path = res.data
                    if (i == this.downList.length - 1) {
                      this.$message({
                        type: 'success',
                        message: '下载成功'
                      })
                    }
                  }
                  let tempdata = {
                    'path': decodeURIComponent(this.path)
                  }
                  downList(tempdata).then(res => {
                    let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
                    const blob = new Blob([res.data])
                    let link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.setAttribute('download', window.decodeURI(filename))
                    link.click()
                    link = null
                  })
                  this.downList = []
                  this.publicDetail()
                })
              }
            })
          } else {
            for (let i = 0; i < this.downList.length; i++) {
              let downdata = {
                'path': this.downList[i]
              }
              ifdownList(downdata).then(res => {
                if (res.code == 200) {
                  this.path = res.data
                  if (i == this.downList.length - 1) {
                    this.$message({
                      type: 'success',
                      message: '下载成功'
                    })
                  }
                }
                let tempdata = {
                  'path': decodeURIComponent(this.path)
                }
                downList(tempdata).then(res => {
                  let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
                  const blob = new Blob([res.data])
                  let link = document.createElement('a')
                  link.href = URL.createObjectURL(blob)
                  link.setAttribute('download', window.decodeURI(filename))
                  link.click()
                  link = null
                })
                this.downList = []
                this.publicDetail()
              })
            }
          }
        }
      }).catch(() => { })
    },
    // 删除
    delFunc () {
      if (this.deleteList.length > 0) {
        let str = this.deleteList[0]
        let arr = str.split('/')
        this.ifallow = !(arr.length == 5 && arr[4].indexOf('分区') > -1)
      }
      if (!this.ifallow) {
        this.$message.warning('不允许操作该目录')
        return
      }
      if (this.deleteList.length == 0) {
        this.$message.warning('请选择要删除的文件')
        // return
      }
      if (this.deleteList && this.deleteList.length > 0) {
        let dangerdata = {
          'apiId': '1-5'
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
                  h('span', { style: 'color: #F56C6C' }, '资源库文件目录删除, 请谨慎操作！')
                ])
              }).then(async () => {
                let pathList = []
                for (let i = 0; i < this.deleteList.length; i++) {
                  pathList.push({ src: this.deleteList[i] })
                }
                let tmpdata = {
                  'pathList': pathList
                }
                let res = await delList(tmpdata)
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  this.publicDetail()
                  this.refreshNodeBy(this.curnode.id)
                  this.deleteList = []
                }
              }).catch(() => { })
            } else {
              let pathList = []
              for (let i = 0; i < this.deleteList.length; i++) {
                pathList.push({ src: this.deleteList[i] })
              }
              let tmpdata = {
                'pathList': pathList
              }
              delList(tmpdata).then((res) => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  this.publicDetail()
                  this.refreshNodeBy(this.curnode.id)
                  this.deleteList = []
                }
              })
            }
          }
        })
      }
    },
    handleSelectionChange (val) {
      if (val.length > 0) {
        let str = val[0].path
        this.currentpath = str.slice(0, str.lastIndexOf('/'))
      }
      let tmpDeleteList = []
      let tempName = []
      let tempIsparent = []
      if (val) {
        tmpDeleteList = val.map(v => v.path)// 对应ID
        tempName = val.map(v => v.name)
        tempIsparent = val.map(v => v.isParent)
      }
      this.deleteList = tmpDeleteList
      this.downList = tmpDeleteList
      this.parentList = tempIsparent
      this.renamingList = tmpDeleteList
      this.renamename = tempName[0]
      // this.renameform.renameinput = tempName[0]
    },
    // 列表懒加载
    async loadNode (node, resolve) {
      let that = this
      // 第一层的数据
      if (node.level == 0) {
        // 将父级数据放到 resolve中
        return resolve(that.treedata)
      }
      // 子节点之后的数据
      if (node.level >= 1) {
        if (node.level == 1) {
          var params = {
            'path': node.data.path
          }
        } else {
          // 拿到参数
          var params = {
            // subjectId: that.subjectId,
            // parentId: node.data.path,
            'path': node.data.id
          }
        }
        // 发请求 拿到子节点的数据
        let res = await getleftList(params)
        this.currentpath = res.data.currentPath
        if (!this.copyVisible) {
          this.notcopypath = this.currentpath
        }
        let resArr = []
        res.data.dirList.forEach(item => {
          resArr.push({
            name: item.name,
            id: item.path,
            children: item.children,
            leaf: item.isParent == false
            // subjectId: item.subjectId,
          })
        })
        // 将拿到的数据 使用updateKeyChildren的方法设置给其父节点
        that.$refs.tree.updateKeyChildren(node.data.id, resArr)
        // 将数据丢进 resolve
        resolve(resArr)
      }
    },
    // 弹窗
    // async loadtoNode(node, resolve) {
    //     console.log(node);
    //     let that = this
    //     // 第一层的数据
    //     if (node.level == 0) {
    //         // 将父级数据放到 resolve中
    //         return resolve(that.treedata)
    //     }
    //     // 子节点之后的数据
    //     if (node.level >= 1) {
    //         if(node.level == 1){
    //             var params={
    //                 'path': node.data.path
    //             }
    //         }else{
    //             // 拿到参数
    //             var params = {
    //                 // subjectId: that.subjectId,
    //                 // parentId: node.data.path,
    //                 'path': node.data.id
    //             }
    //         }
    //         // 发请求 拿到子节点的数据
    //         let res = await getleftList(params)
    //         this.currentpath = res.data.currentPath
    //         let resArr = []
    //         res.data.dirList.forEach(item => {
    //         resArr.push({
    //             name: item.name,
    //             id: item.path,
    //             children: item.children,
    //             leaf: item.isParent == false,
    //             subjectId: item.subjectId,
    //         })
    //         })
    //         // 将拿到的数据 使用updateKeyChildren的方法设置给其父节点
    //         that.$refs.tree.updateKeyChildren(node.data.id, resArr)
    //         // 将数据丢进 resolve
    //         resolve(resArr)
    //     }
    // },
    handleNodeClick (data, node, prop) {
      this.tableloading = true
      if (!this.dialogVisible) {
        this.curnode = node
      }
      this.frompath = data.id

      if (data.id == undefined) {
        this.currentNodeKey = data.path
      } else {
        this.currentNodeKey = data.id
      }
      let tempdata = {
        'path': this.currentNodeKey
      }
      getleftList(tempdata).then(res => {
        if (res.code == 200) {
          this.tableloading = false
          // U盘根目录 多分区U盘 不显示tabledata 不允许操作
          if (this.currentNodeKey == 'udisk') {
            this.tableData = []
            this.ifallow = false
          } else {
            let str = this.currentNodeKey
            let arr = str.split('/')
            this.todisk = arr.indexOf('udisks') > -1

            // 判断是否为多分区一级目录
            this.ifallow = !(arr.length == 4 && arr[2] == 'udisks')
            if (this.copyVisible == false) {
              let tableArr = []
              for (let i = 0; i < res.data.dirList.length; i++) {
                tableArr.push({ name: res.data.dirList[i].name, path: res.data.dirList[i].path, isParent: res.data.dirList[i].isParent })
              }
              for (let i = 0; i < res.data.fileList.length; i++) {
                tableArr.push({ name: res.data.fileList[i].name, path: res.data.fileList[i].path, isParent: false })
              }
              this.tableData = tableArr
              this.currentpath = res.data.currentPath
              this.tableloading = false
            }
          }
        }
      })
    },
    // 复制移动弹窗
    handletoNodeClick (data, node) {
      this.copyudiskallow = this.ifallow
      this.copytonode = node
      if (data.id == undefined) {
        if (data.path == 'user') {
          this.todisk = false
          this.ifallow = true
          let temdata = {
            'path': data.path
          }
          getleftList(temdata).then(res => {
            if (res.code == 200) {
              this.topath = res.data.currentPath
            }
          })
        } else if (data.path == 'udisk') {
          this.todisk = !(this.deleteList[0].indexOf('udisks') > -1)
          this.topath = '/data/resource_library/' + data.path
          this.ifallow = false
        } else {
          this.todisk = false
          this.topath = '/data/resource_library/' + data.path
          this.ifallow = true
        }
      } else {
        this.topath = data.id
        let str = data.id
        let arr = str.split('/')
        if ((arr.length == 4 && arr[2] == 'udisks')) {
          this.ifallow = false
        } else {
          this.ifallow = true
        }
        if (this.deleteList[0].indexOf('udisks') == -1) {
          this.todisk = arr.indexOf('udisks') > -1
        } else {
          this.todisk = false
        }
      }
      // this.ifallow = allow
    },

    repopassClose () {
      this.repopassdialog = false
    },

    closeModifyPassword () {
      this.repopassClose()
      localStorage.setItem('showModifyPasswordFlag', 'false')
    }
  }

}
</script>

<style scoped>
img {
    width: 16px;
    margin-right: 3px;
    text-align: center;
}

/deep/.el-upload-list {
    padding: 0;
    list-style: none;
    margin-left: -25em;
    margin-top: -1em;
    width: 33em;
}

/* 去掉旋转效果 */
.el-tree>>>.el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
}

/* /deep/.el-tree { */
/* width: 100%; */
/* overflow: scroll; */
/* } */
/deep/.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #F0F2F5;
}

/deep/.el-tree>.el-tree-node {
    display: inline-block;
    min-width: 100%;
}

/* 未展开父节点 */
.el-tree>>> :not(.is-leaf).el-icon-caret-right:before {
    background: url("../../assets/usb_images/close_file.png") no-repeat;
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    font-size: 18px;
    background-size: 100% 100%;
}

.el-tree .el-icon svg {
    display: inline-block !important;
    height: 2px;
    width: 2px;
}

/* 已展开父节点 */
.el-tree>>>.el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    background: url("../../assets/usb_images/open_file.png") no-repeat;
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    font-size: 18px;
    background-size: 100% 100%;
    z-index: -1;
}

/* 子节点 */
.el-tree>>>.is-leaf.el-icon-caret-right:before {
    background: url("../../assets/usb_images/close_file.png") no-repeat;
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    font-size: 14px;
    background-size: 100% 100%;
}

.more {
    color: #606266
}

.copy_dialog {
    /* height: 476px */
    height: 497px
}

/deep/.file-dialog .el-dialog{
    height: 80% !important;
}
/deep/ .docx{
    padding: 0 !important;
    width: 50vw !important;
    height: 80vh !important;
    overflow: auto !important;
    margin-bottom: 0 !important;
    box-shadow: none !important;
    min-height: 0 !important;
}
/deep/.docx-wrapper{
    padding: 0 !important;
}
.uploaddialog .dialog-footer{
    padding-right: 13px;
}

.el-checkbox__input.disabled .el-checkbox__inner {
    color: #FFFFFF;
    background-color: #1890ff;
    border-color: #1890ff;
    -webkit-box-shadow: -1px 0 0 0 #74bcff;
    box-shadow: -1px 0 0 0 #74bcff;
}

#col-line {
    width: 1px;
    height: 200px;
    background: blueviolet;
    border: 1px solid #E4E7ED;
    float: left;
}

.detail_table{
    margin-right: 20px;
}
.detail_table img {
    width: 11px;
}

/deep/.el-progress__text {
    display: none;
}

/deep/.el-progress-bar {
    margin: 0 auto
}

/deep/.el-progress-bar__outer {
    width: 146px;
}

/deep/.el-divider--vertical {
    height: 49em;
    /* left: 16em; */
    left: 19%
}

.lazy_tree {
    overflow: auto;
}

:deep(.el-tree-node > .el-tree-node__children) {
    overflow: visible;
}

.lazy_tree::-webkit-scrollbar {
    width: 2px !important;
    height: 10px;
}

.lazy_tree::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 10px !important;
}

.dialogtree {
    overflow: auto;
}

.dialogtree::-webkit-scrollbar {
    width: 4px;
    height: 10px;
}

.dialogtree::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 10px;
}
</style>

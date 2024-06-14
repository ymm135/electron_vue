<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!-- 没有子菜单 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">

        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <div class='rowclass' v-if="(meta.title == onlyOneChild.meta.title)"></div>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "资源库" && path !== "/ResourceLibrary"' :src='require("../../../assets/usb_images/首页-常规.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "资源库" && path == "/ResourceLibrary"' :src='require("../../../assets/usb_images/首页.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "白名单" && path !== "/WhiteList"' :src='require("../../../assets/usb_images/白名单-常规.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "白名单" && path == "/WhiteList"' :src='require("../../../assets/usb_images/白名单.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "黑名单" && path !== "/BlackList"' :src='require("../../../assets/usb_images/黑名单-常规.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "黑名单" && path == "/BlackList"' :src='require("../../../assets/usb_images/黑名单.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "隔离区" && path !== "/Isolation"' :src='require("../../../assets/usb_images/隔离区-常规.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "隔离区" && path == "/Isolation"' :src='require("../../../assets/usb_images/隔离区.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "U盘管理" && path !== "/UsbManagement"' :src='require("../../../assets/usb_images/u盘管理-常规.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "U盘管理" && path == "/UsbManagement"' :src='require("../../../assets/usb_images/u.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "主机管理" && path !== "/HostManagement"' :src='require("../../../assets/usb_images/主机管理-常规.png")'/>
          <img class="itemimg" v-if='onlyOneChild.meta && onlyOneChild.meta.title == "主机管理" && path == "/HostManagement"' :src='require("../../../assets/usb_images/主机管理.png")'/>
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 有子菜单 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body :style="{ backgroundColor: '#000c17' }">
      <template slot="title">
        <img class="itemimg" v-if='item.meta && item.meta.title == "日志管理"' :src='require("../../../assets/usb_images/日志管理-常规.png")'/>
        <img class="itemimg" v-if='item.meta && item.meta.title == "用户管理"' :src='require("../../../assets/usb_images/用户管理-常规.png")'/>
        <img class="itemimg" v-if='item.meta && item.meta.title == "系统设置"' :src='require("../../../assets/usb_images/系统管理-常规.png")'/>
        <img class="itemimg" v-if='item.meta && item.meta.title == "网络管理"' :src='require("../../../assets/usb_images/networkManagement.png")'/>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      path: '',
      meta: ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.path = route.path
        this.meta = route.meta
      },
      immediate: true
    }
  },
  methods: {
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
.itemimg{
  margin-right: 14px;
  width: 26px;
  margin-left: 9px;
}
.rowclass{
    width: 4px;
    height: 40px;
    border: 1px;
    background-color: #F26521;
    display: inline-block;
    vertical-align:middle;
    // margin-left: -17px;
    // margin-right: 13px;
    position: absolute;
    left: 0px;
    top: 7px;
}
</style>

<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" :style="{ backgroundColor: $store.state.settings.themeStyle === 'dark' ? variables.menuBg : variables.menuLightBg }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img :src='require("../../../assets/usb_images/logo.png")' style="width: 24px; margin-top: 14px;margin-right: 8px;"/>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div class="logo_title">
            <img :src='require("../../../assets/usb_images/logo.png")'/>
            <span>USB安全隔离装置</span>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>

import variables from '@/styles/variables.scss'
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'appInfo'
    ]),
    variables () {
      return variables
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  background: #ffba00;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 1px;
      border-radius: 3px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 80px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: center;
    }
  }

  .logo_title {
        display: inline-block;
    }

    .logo_title img {
        width: 31px;
        vertical-align: middle;
        padding-right: 10px;
    }

    .logo_title span {
        font-size: 16px;
        color: #FFFFFF;
        vertical-align: middle;
    }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
      border-radius: 3px;
    }
  }
}
</style>

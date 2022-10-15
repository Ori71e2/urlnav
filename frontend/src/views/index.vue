
<template>
  <div style="height: 100%; width:100%">
    <el-container class="background">
      <el-header>
        <navbar class="navbar" />
      </el-header>
      <el-main>
        <navi />
      </el-main>
    </el-container>
    <cfooter class="cfooter" />
    <!-- <div v-show="showArrowUp" :style="{ zIndex: tipZIndex }" class="arrow-up">
      <span><svg-icon icon-class="arrow-up" class="arrow-up-svg" /></span>
      <span class="tiptext">向上滚动鼠标</span>
    </div> -->
    <div id="bgbox" class="bgbox" style="display: block; opacity: 1;" />
    <div id="cover" class="cover" style="opacity: 1;" />
    <leftsidebar class="leftsidebar" />
    <operate v-if="operateShow" class="operate" />
    <notify />
    <el-dialog class="navi-dialog" :visible="dialogVisible" width="100%" :append-to-body="true" :show-close="false">
      <router-view />
    </el-dialog>
  </div>
</template>

<script>
import navbar from './navi/components_layout/navbar'
import leftsidebar from './navi/components_layout/leftsidebar'
import notify from './navi/components_layout/notify'
import operate from './navi/components_edit/operate'
import cfooter from './navi/components_layout/cfooter'
import navi from './navi'
export default {
  components: {
    operate, navbar, notify, navi, cfooter, leftsidebar
  },
  data() {
    return {
    }
  },
  computed: {
    operateShow() {
      return this.$store.state.user.isLogin && (this.$store.state.user.vip || this.$store.state.user.admin)
    },
    dialogVisible: {
      get() {
        // return true
        return this.$store.state.user.dialogVisible
      },
      set(val) {
        this.$store.dispatch('user/setDialogVisible', val)
      }
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
  },
  destoryed() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
$headerHeight: 60px;
$gradient-start: #bfc7d0;
$gradient-end: #9da8b6;

.background {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
}
.cover {
  z-index: -1;
  opacity: 0;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%), radial-gradient(rgba(0,0,0,0) 33%, rgba(0,0,0,0.3) 166%);
  transition: all 0.25s;
}
.bgbox {
  display: none;
  opacity: 0;
  z-index: -3;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: linear-gradient(33deg, $gradient-start, $gradient-end);
  background: url(images/bg.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transition: opacity 1s, transform 0.25s, filter 0.25s;
  backface-visibility: hidden;
}
.el-header {
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $headerHeight !important;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  // z-index: 99;
  // background: rgba(0,0,0,.2);
  line-height: $headerHeight - 20px;
  .navbar {
    width: 100%;
    height: 100%;
  }
}
.background ::v-deep .el-main {
  margin-top: $headerHeight;
  width: 100%;
  height: 100%;
  padding: 0px!important;
  padding-top: 0px!important;
  padding-right: 0px!important;
  padding-bottom: 40px!important;
}
.leftsidebar {
  z-index: 100;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 10px;
}
.operate {
  z-index: 1;
  position: fixed;
  // top: calc((100vh - #{$headerHeight})/2);
  bottom: 20px;
  right: 24px;
  // margin-right: 10px;
  width: 54px;
  height: 600px;
}
.navi-dialog {
  width: 100%;
  & ::v-deep .el-dialog__header {
    display: none;
  }
  & ::v-deep .el-dialog {
    background-color: rgba(255, 255, 255, 0);
    height: calc(100% - 140px);
  }
  & ::v-deep .el-dialog__body {
    width: 100%!important;
    height: 100%!important;
    display: flex!important;
    & > div {
      margin: 0 auto;
      border-radius: 6px;
      background-color: white;
    }
  }
}
.cfooter {
  position: fixed;
  bottom: 10px;
  left: 0;
  width: 100%;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  text-align: center;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-iteration-count: 1;
  animation-delay: 0s;
}
</style>

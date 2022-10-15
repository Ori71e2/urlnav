<template>
  <div class="navibar">
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="hover" :show-timeout="showTimeout" :hide-timeout="hideTimeout">
        <div class="avatar-wrapper">
          <span><i class="el-icon-s-custom" /></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link v-show="!isLogin" to="/navi/login">
            <el-dropdown-item>登录</el-dropdown-item>
          </router-link>
          <router-link v-show="!isLogin" to="/navi/register">
            <el-dropdown-item>注册</el-dropdown-item>
          </router-link>
          <!-- <router-link v-show="isLogin && isAdmin" to="/navi/admin">
            <el-dropdown-item>Admin</el-dropdown-item>
          </router-link> -->
          <router-link v-show="isLogin" to="/navi/vip">
            <el-dropdown-item>会员</el-dropdown-item>
          </router-link>
          <router-link v-show="isLogin" to="/navi/config">
            <el-dropdown-item>设置</el-dropdown-item>
          </router-link>
          <el-dropdown-item v-show="isLogin" divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item divided>
            <span style="display:block;" @click="post">Post</span>
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import Search from '@/components/HeaderSearch'

export default {
  // components: {
  //   Search
  // },
  data() {
    return {
      showTimeout: 50,
      hideTimeout: 50
    }
  },
  computed: {
    dialogVisible: {
      get() {
        // return true
        return this.$store.state.user.dialogVisible
      },
      set(val) {
        this.$store.dispatch('user/setDialogVisible', val)
      }
    },
    isLogin() {
      return this.$store.getters.isLogin
    },
    isVip() {
      return this.$store.state.user.vip
    },
    isAdmin() {
      return this.$store.state.user.role >= 3
    }
  },
  methods: {
    async logout() {
      try {
        const res = await this.$store.dispatch('user/logout')
        if (res.code === 20000) {
          this.$store.dispatch('url/clearUrl')
          this.$store.dispatch('operate/setLock', true)
          this.$store.dispatch('url/getUrltmpPublished')
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.$router.go(-1)
    },
    post() {
      this.$store.dispatch('user/getInfo')
    }
  }
}
</script>

<style lang="scss" scoped>
$headerHeight: 60px;
$gradient-start: #bfc7d0;
$gradient-end: #9da8b6;
.navibar {
  height: 100%;
  overflow: hidden;
  position: relative;
  .right-menu {
    float: right;
    height: 100%;
    line-height: 100%;
    margin-right: 40px;
    margin-top: 24px;
    .avatar-container {
      .avatar-wrapper {
        // margin-top: 10px;
        // margin-right: 40px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        span {
          height: 100%;
          width: 24px;
          font-weight: 400;
          font-size: 24px;
          margin: auto;
          &:hover {
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
    }
  }
}
.label {
  width: 60px;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  font-family: 'Microsoft Yahei', sans-serif;
  color: black;
}
</style>

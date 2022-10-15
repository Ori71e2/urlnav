
<template>
  <div class="container">
    <div class="log-close">
      <a href="javascript:;" @click="skipToMain">
        <i class="el-icon-close close" />
      </a>
    </div>
    <div class="log-card">
      <el-tabs tab-position="left" style="height: 240px;">
        <!-- <el-tab-pane label="搜索引擎"><search-src /></el-tab-pane>
        <el-tab-pane label="配置管理">配置管理</el-tab-pane> -->
        <el-tab-pane label="操作码"><setOpcode /></el-tab-pane>
        <el-tab-pane label="密码重置"><setNewPassword /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import searchSrc from './searchSrc'
import setNewPassword from './setNewPassword'
import setOpcode from './setOpcode'
export default {
  name: 'Config',
  components: { setNewPassword, setOpcode },
  data() {
    return {
    }
  },
  computed: {
    isVip() {
      return this.$store.state.user.vip
    },
    vipExpiretime() {
      const time = this.$store.state.user.vipExpiretime
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      return year + '年' + month + '月' + day + '日'
    }
  },
  methods: {
    skipToMain() {
      // this.dialogVisible = false
      this.$router.push('/navi')
    },
    countDown(long) {
      this.timer = long
      const interval = setInterval(() => {
        // 获取当前时间，同时得到活动结束时间数组
        if (this.timer > 0) {
          this.timer--
        } else {
          clearInterval(interval)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  height: 310px;
}
.header {
  width: 100%;
  height: 40px;
}
.log-close {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row-reverse;
}
.close {
  height: 16px;
  width: 16px;
  margin: 10px 10px 0px 0px;
}
.log-card {
  width: 100%;
}
</style>

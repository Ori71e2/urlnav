//登录

<template>
  <div class="container">
    <div class="log-close">
      <a href="javascript:;" @click="skipToMain">
        <i class="el-icon-close close" />
      </a>
    </div>
    <div class="main">
      <div class="sidebar">
        <sidebar />
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import sidebar from './components/sidebar.vue'
export default {
  name: 'Login',
  components: {
    sidebar
  },
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
    skipToMain() {
      this.$router.push('/navi')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 200px;
  height: 100%;
  overflow-y: hidden;
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

.main {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100% - 80px);
}

.sidebar {
  width: 200px;
  height: 100%;
}

.content {
  width: calc(100% - 200px);
  height: 100%;
}
</style>

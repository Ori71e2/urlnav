<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :router="true"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="/navi/admin/user">
        <i class="el-icon-user" />
        <span slot="title">用户</span>
      </el-menu-item>
      <el-menu-item index="/navi/admin/card">
        <i class="el-icon-goods" />
        <span slot="title">卡号</span>
      </el-menu-item>
      <el-menu-item index="/navi/admin/url">
        <i class="el-icon-document" />
        <span slot="title">Url</span>
      </el-menu-item>
      <el-menu-item index="/navi/admin/emailToken">
        <i class="el-icon-orange" />
        <span slot="title">EmailToken</span>
      </el-menu-item>
      <el-menu-item index="/navi/admin/emailTran">
        <i class="el-icon-orange" />
        <span slot="title">EmailTran</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

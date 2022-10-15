<template>
  <div class="leftsidebar" @mousemove="showDrawer = true">
    <el-drawer class="drawer" :visible.sync="showDrawer" direction="ltr" :with-header="false" append-to-body>
      <website class="website" />
    </el-drawer>
  </div>
</template>

<script>
import website from './_components/website'
export default {
  components: {
    website
  },
  data() {
    return {
      showDrawer: false
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  updated() {
  },
  destroyed() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .drawer {
    height: 100%!important;
    // & ::v-deep .el-drawer {
    //   height: 100%;
    //   background: rgba(255,255,255,.7)!important;
    // }
  }
  // .leftsidebar {
  //   // background: rgba(255,255,255,.7);
  // }
  .website {
    margin: 20px;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
  }
</style>

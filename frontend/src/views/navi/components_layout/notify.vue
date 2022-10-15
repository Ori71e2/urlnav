// loading效果组件

<template>
  <div />
</template>

<script>
export default {
  name: 'Notify',
  props: {
    marginTop: {
      type: String,
      default: '50%'
    }
  },
  data() {
    return {
      listNotification: null,
      siteNotification: null,
      groupNotification: null
    }
  },
  computed: {
    isUrlListSizeOver() {
      const size = new Blob([this.$store.state.url.list]).size
      const isSizeOver = size > this.GLOBLE.URLSIZE.maxListSize
      return isSizeOver
    },
    isUrlSiteTransferSizeOver() {
      const size = new Blob([this.$store.state.url.siteTransfer]).size
      const isSizeOver = size > this.GLOBLE.URLSIZE.maxSiteTransferSize
      return isSizeOver
    },
    isUrlGroupTransferSizeOver() {
      const size = new Blob([this.$store.state.url.groupTransfer]).size
      const isSizeOver = size > this.GLOBLE.URLSIZE.maxGroupTransferSize
      return isSizeOver
    }
  },
  watch: {
    isUrlListSizeOver: {
      handler: function(newVal, oldVal) {
        if (newVal && this.listNotification === null) {
          this.listNotification = this.$notify({
            title: '警告',
            message: '网站数量已超过，无法保存，请删除部分!',
            type: 'warning',
            offset: 100,
            duration: 0,
            showClose: false
          })
        }
        if (!newVal && this.listNotification) {
          this.listNotification.close()
          this.listNotification = null
        }
      },
      immediate: true,
      deep: true
    },
    isUrlSiteTransferSizeOver: {
      handler: function(newVal, oldVal) {
        if (newVal && this.siteNotification === null) {
          this.siteNotification = this.$notify({
            title: '警告',
            message: '网站中转区数量已超过，无法保存，请删除部分!',
            type: 'warning',
            offset: 100,
            duration: 0,
            showClose: false
          })
        }
        if (!newVal && this.siteNotification) {
          this.siteNotification.close()
          this.siteNotification = null
        }
      },
      immediate: true,
      deep: true
    },
    isUrlGroupTransferSizeOver: {
      handler: function(newVal, oldVal) {
        if (newVal && this.groupNotification === null) {
          this.groupNotification = this.$notify({
            title: '警告',
            message: '小组中转区数量已超过，无法保存，请删除部分!',
            type: 'warning',
            offset: 100,
            duration: 0,
            showClose: false
          })
        }
        if (!newVal && this.groupNotification) {
          this.groupNotification.close()
          this.groupNotification = null
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

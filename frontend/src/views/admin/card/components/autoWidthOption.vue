<template>
  <div class="main">
    <div class="name">
      <div class="text">Cell Auto-Width:</div>
    </div>
    <el-radio-group v-model="autoWidth">
      <el-radio :label="true" border style="margin-right: 4px;">
        True
      </el-radio>
      <el-radio :label="false" border>
        False
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    autoWidth: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  display:inline-block;
  min-width: 330px;
  height: 40px;
  padding: 2px 4px;
  display: flex;
  flex-wrap: nowrap;
}
.name {
  width: 120px;
  height: 16px;
  margin: auto;
}
.text {
  height: 16px;
  text-align: center;
}
</style>

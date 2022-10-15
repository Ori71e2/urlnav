<template>
  <div class="main">
    <div class="name">
      <div class="text">Book Type: </div>
    </div>
    <el-select v-model="bookType" style="width:120px;">
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'xlsx'
    }
  },
  data() {
    return {
      options: ['xlsx', 'csv', 'txt']
    }
  },
  computed: {
    bookType: {
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
  min-width: 150px;
  height: 40px;
  padding: 2px 4px;
  display: flex;
  flex-wrap: nowrap;
}
.name {
  width: 80px;
  height: 16px;
  margin: auto;
}
.text {
  height: 16px;
  text-align: center;
}
</style>

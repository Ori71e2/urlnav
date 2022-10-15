<template>
  <div class="main">
    <div class="name">
      <div class="text">{{ name }}</div>
    </div>
    <el-select v-model="option" placeholder="" style="width:160px;">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [{
        value: 0,
        label: 'HUMAN'
      }, {
        value: 1,
        label: 'REGISTER'
      }, {
        value: 2,
        label: 'VIP'
      }, {
        value: 3,
        label: 'DEVELOPE'
      }, {
        value: 4,
        label: 'ADMIN'
      }, {
        value: 5,
        label: 'SUPER_ADMIN'
      }]
    }
  },
  computed: {
    option: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', parseInt(val))
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

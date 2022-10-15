<template>
  <div class="main">
    <div class="name">
      <div class="text">{{ name }}</div>
    </div>
    <el-select v-model="option" clearable placeholder="" style="width:70px;">
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
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }]
    }
  },
  computed: {
    option: {
      get() {
        return this.value
      },
      set(val) {
        if (val === 0 || val === 1) {
          this.$emit('input', parseInt(val))
        } else {
          this.$emit('input', null)
        }
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

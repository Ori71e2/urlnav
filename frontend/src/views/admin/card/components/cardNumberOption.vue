<template>
  <div style="display:inline-block;">
    <!-- <label class="radio-label">{{ name }}</label> -->
    <el-select v-model="option" clearable placeholder="" style="width:80px;">
      <el-option v-for="item in options" :key="item" :label="item" :value="item" />
    </el-select>
    <slot />
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
      options: [100, 200, 300, 400, 500]
    }
  },
  computed: {
    option: {
      get() {
        return this.value
      },
      set(val) {
        if (val) {
          this.$emit('input', parseInt(val))
        } else {
          this.$emit('input', null)
        }
      }
    }
  }
}
</script>

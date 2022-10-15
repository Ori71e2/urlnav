<template>
  <div class="main">
    <div class="name">
      <div class="text">{{ name }}</div>
    </div>
    <el-input v-model="input" :placeholder="placeholder" class="c-input" :style="{width: width + 'px'}" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 240
    }
  },
  computed: {
    input: {
      get() {
        return this.value
      },
      set(val) {
        if (val !== '') {
          this.$emit('input', val)
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
.c-input {
  height: 100%;
}
</style>

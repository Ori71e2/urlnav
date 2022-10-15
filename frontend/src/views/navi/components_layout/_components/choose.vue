<template>
  <div class="choose">
    <div class="tip" @click="showMin" />
    <div class="tip" @click="showCUrl" />
    <div class="tip" @click="showUrlNav" />
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    step: {
      get() {
        return this.$store.state.scroll.step
      },
      set(val) {
        this.$store.dispatch('scroll/setStep', val)
      }
    }
  },
  methods: {
    showUrlNav() {
      this.step = this.$store.state.scroll.NAV
    },
    showCUrl() {
      this.step = this.$store.state.scroll.COMMON
    },
    showMin() {
      this.step = this.$store.state.scroll.MIN
    }
  }
}
</script>

<style lang="scss" scoped>
.choose {
  height: 30px;
  // width: 100px;
  // background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.tip {
  height: 6px;
  width: 70px;
  margin: 0 20px;
  border-radius: 4px;
  // background-color: yellow;
  background: rgba(255,255,255,.25);
  &:hover {
    background: rgba(255,255,255,.4);
    transition: color 0.25s, background-color 0.25s, box-shadow 0.25s, left 0.25s, opacity 0.25s, height 1s;
  }
  transition: color 0.25s, background-color 0.4s, box-shadow 0.25s, left 0.25s, opacity 0.25s, height 1s;
}
</style>

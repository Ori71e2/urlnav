
<template>
  <div style="height: 100%; width:100%">
    <div ref="searchNav" class="flex-s-u">
      <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
        <search v-show="showUrlNav" class="search" />
      </transition>
      <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown" @beforeEnter="beforeEnter" @enter="enter" @afterLeave="beforeLeave">
        <div v-if="navCompiled" v-show="showUrlNav" ref="navi" class="url-navi">
          <transition>
            <div class="search-site" :class="[showSearchSiteOperate ? activeClass : inactiveClass]">
              <searchEdit />
            </div>
          </transition>
          <div class="url-navi-panel">
            <div class="pagenav"><pagenav /></div>
            <div class="url"><url ref="url" /></div>
          </div>
          <transition>
            <div :class="[showUrlNavOperate ? activeClass : inactiveClass]" class="url-navi-operate">
              <transfer />
            </div>
          </transition>
        </div>
      </transition>
    </div>
    <div ref="searchCNav" class="flex-s-c">
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <!-- <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp"> -->
        <div v-show="!showUrlNav" class="clock">
          <clock />
        </div>
      </transition>
      <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
        <search v-show="!showUrlNav" class="search" />
      </transition>
      <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
        <div v-if="commonCompiled" v-show="showfrequrl" class="c-url">
          <frequrl />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import frequrl from './components_layout/frequrl'
import search from './components_layout/search'
import clock from './components_layout/clock'
import transfer from './components_edit/transfer'
import searchEdit from './components_edit/searchEdit'
import pagenav from './components_edit/pagenav'
import url from './components_edit/url'
export default {
  components: {
    url, frequrl, pagenav, search, clock, transfer, searchEdit
  },
  data() {
    return {
      activeClass: 'active',
      inactiveClass: 'inactive'
    }
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin
    },
    urlList: {
      get() {
        return JSON.parse(this.$store.state.url.list)
      },
      set(val) {
        this.$store.dispatch('url/setList', JSON.stringify(val))
      }
    },
    isDrag() {
      return this.$store.state.operate.drag
    },
    isSearch() {
      return this.$store.state.operate.search
    },
    showUrlNavOperate() {
      return this.isDrag
    },
    showSearchSiteOperate() {
      return this.isSearch
    },
    scrollState: {
      get() {
        return this.$store.state.scroll.scrollState
      },
      set(val) {
        this.$store.dispatch('scroll/setScrollState', val)
      }
    },
    step: {
      get() {
        return this.$store.state.scroll.step
      },
      set(val) {
        this.$store.dispatch('scroll/setStep', val)
      }
    },
    commonCompiled() {
      return this.$store.state.scroll.commonCompiled
    },
    navCompiled() {
      return this.$store.state.scroll.navCompiled
    },
    showUrlNav() {
      return this.$store.state.scroll.NAV === this.step
    },
    showfrequrl() {
      return this.$store.state.scroll.COMMON === this.step
    },
    showArrowUp() {
      return this.$store.state.scroll.MIN === this.step
    },
    tipZIndex: {
      get() {
        return this.$store.state.scroll.tipZIndex
      },
      set(val) {
        this.$store.state.scroll.tipZIndex = val
      }
    }
  },
  watch: {

  },
  created() {

  },
  mounted() {
    window.addEventListener('mousewheel', this.debounce(this.handleScroll, 200), true) || window.addEventListener('DOMMouseScroll', this.debounce(this.handleScroll, 200), false)
    this.init()
  },
  destoryed() {
    window.removeEventListener('mousewheel', this.debounce(this.handleScroll, 200)) || window.removeEventListener('DOMMouseScroll', this.debounce(this.handleScroll, 200))
  },
  methods: {
    async init() {
      try {
        const res = await this.$store.dispatch('user/isLogin')
        if (res.code === 20000) {
          try {
            await this.$store.dispatch('url/getUrl', { opcode: '' })
            this.setComplied()
          } catch (error) {
            this.$message.error('获取网址信息失败')
          }
        } else {
          try {
            this.$store.dispatch('url/getUrltmpPublished')
            this.setComplied()
          } catch (error) {
            this.$message.error('获取网址信息失败')
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    setComplied() {
      this.$store.dispatch('scroll/setAllCompliedTrue')
    },
    beforeEnter(el) {
      this.$refs.searchCNav.style.zIndex = -1
      this.$refs.searchNav.style.zIndex = 1
    },
    enter() {
      this.$refs.url.computeSitesWidth()
    },
    beforeLeave(el) {
      this.$refs.searchCNav.style.zIndex = 1
      this.$refs.searchNav.style.zIndex = -1
    },
    // 判断滚动方向
    handleScroll(e) {
      const dis = e.detail !== undefined && e.detail !== 0 ? e.detail : e.deltaY
      const exist = e.path.some(pathItem => {
        return pathItem.className === 'url-navi'
      })
      const direction = dis > 0 ? 'down' : 'up'
      if (this.scrollState) {
        this.scrollState = false
      } else {
        if (direction === 'down' && !exist) {
          this.step -= 1
        } else {
          this.step += 1
        }
      }
    },
    debounce(func, wait) {
      let timeout
      return function() {
        const context = this
        const args = arguments
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$headerHeight: 60px;
$gradient-start: #bfc7d0;
$gradient-end: #9da8b6;

.flex-s-u {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.flex-s-c {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;
  transition: 1s linear;
  .search {
    margin-top: calc(15px);
  }
}

.url-navi {
  margin: 0 auto;
  width: calc(100% - 400px);
  height: 20px;
  // margin-top: 0px;
  background: rgba(255,255,255,.70);
  border-radius: 4px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .search-site {
    // height: 100px;
    width: 100%;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }
  .url-navi-panel {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    width: 100%;
    height: calc(100% - 120px);
    transition: height 2s;
  }
  .url-navi-operate {
    width: 100%;
    // height: 120px;
    // margin-bottom: 10px;
  }
}
@media screen and (max-width: 650px) {
  .url-navi {
    width: calc(100% - 40px);
  }
}
.active {
  // height: calc(100%);
  height: 120px;
  margin-bottom: 10px;
  transition: color 0.25s, background-color 0.25s, box-shadow 0.25s, left 0.25s, opacity 0.25s, height 1s;
}
.inactive {
  // height: calc(100% - 100px);
  height: 0px;
  margin-bottom: 0px;
  transition: color 0.25s, background-color 0.25s, box-shadow 0.25s, left 0.25s, opacity 0.25s, height 1s;
}
.clock {
  width: 100%;
  height: 60px;
  margin-top: calc(50vh - 120px - 100px);
}
.search {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 30px;
  // flex-grow: 1;
}
.c-url {
  width: 100%;
  min-height: 100px;
  margin-top: 0px;
  transition: 1s linear;
  // background-color: black;
}
.only {
  padding-bottom: 150px;
}
.arrow-up {
  top: calc(50vh - 100px + 40px);
  z-index: 1;
  left: calc(50vw - 50px);
  opacity: 0;
  position: fixed;
  width: 100px;
  min-height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 1;
    transition: all 1.3s;
    color: #FFC300;
    font-size: 20px;
  }
  transition: all 1.3s;
}

.tiptext {
  margin-top: 6px;
  font-size: 14px;
  opacity: 0.6;
  text-shadow: 0 0 20px rgba(0,0,0,0.35);
}
.arrow-up-svg {
  font-weight: 400;
  font-size: 14px;
  color: white;
  opacity: 0.55;
}
.url {
  margin-left: 0px;
  width: 200px;
  height: calc(100% - 26px);
  padding: 10px 0px 10px 0px;
  box-sizing: content-box;
  flex-grow: 1;
}

.pagenav {
  padding: 4px 0px 0px 10px;
  width: 200px;
  height: calc(100% - 10px);
  // background: rgba(255,255,255,.85);
  // border-radius: 6px;
  box-sizing: content-box;
}
.operate {
  z-index: 1;
  position: fixed;
  // top: calc((100vh - #{$headerHeight})/2);
  bottom: 20px;
  right: 24px;
  // margin-right: 10px;
  width: 54px;
  height: 600px;
}

</style>

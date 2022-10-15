<template>
  <div ref="search" :class="[showOption ? rootActiveClass : rootInactiveClass]" class="container">
    <el-input v-model="input" placeholder="Search" class="input-with-select" @keyup.enter.native="searchEnterFun" @focus="focus" @blur="blur" @input="sendSug" />
    <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
      <div v-show="showOption" class="search-select" animate-delay="1s">
        <div v-for="(item) in searchSite" :key="item.searchUrl" :class="[(sId === item.id) ? activeClass : inactiveClass]" :label="item.name" class="option" @click="handleClick(item.id)" @mousedown="handleInputFocus()">
          {{ item.name }}
        </div>
      </div>
    </transition>
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <div v-show="showOption && showSug" class="search-sugmsg" animate-delay="1s">
        <div v-for="(item) in sugMsgs" :key="item" :label="item" class="sugmsgItem" @click="selectSug(item)" @mousedown="handleInputFocus()">
          {{ item }}
        </div>
      </div>
    </transition>
    <choose />
  </div>
</template>

<script>
import choose from './_components/choose'
export default {
  components: { choose },
  data() {
    return {
      input: '',
      showOption: false,
      showSearch: false,
      sugMsgs: [],
      timestamp: 0,
      rootActiveClass: 'rootActive',
      rootInactiveClass: 'rootInactive',
      activeClass: 'active',
      inactiveClass: 'inactive'
    }
  },
  computed: {
    searchSite() {
      return JSON.parse(this.$store.state.url.searchSite).filter((item) => { return item.level > 0 })
    },
    tipZIndex: {
      get() {
        return this.$store.state.scroll.tipZIndex
      },
      set(val) {
        this.$store.state.scroll.tipZIndex = val
      }
    },
    sSearch() {
      let sItem = null
      this.searchSite.forEach((item, index) => {
        if (item.id === this.sId) {
          sItem = item
        }
      })
      return sItem
    },
    showSug() {
      return this.input !== '' && this.sugMsgs.length !== 0
    },
    sId: {
      get() {
        return this.$store.state.url.sId
      },
      set(val) {
        this.$store.state.url.sId = val
      }
    }
  },
  watch: {
    searchSite(newV, oldV) {
      newV.some((item, index) => {
      if (item.level === 2) {
        this.sId = item.id
        return true
      }
    })
    }
  },
  mounted() {
    window.sogou = {
      sug: (res) => {
        this.handleSugMsg(res)
        console.log(this.sugMsgs)
      }
    }
  },
  methods: {
    search() {
      let src = 'https://www.baidu.com/s?wd='
      this.searchSite.forEach((item, index) => {
        if (item.id === this.sId) {
          src = item.searchUrl
        }
      })
      src = src + this.input
      window.open(src, '_blank')
    },
    searchEnterFun(e) {
      const keyCode = window.event ? e.keyCode : e.which
      //  console.log('回车搜索',keyCode,e);
      if (keyCode === 13 && this.input) {
        this.search()
      }
    },
    handleClick(id) {
      this.sId = id
      this.sendSug()
    },
    handleInputFocus(e) {
      if (e && e.preventDefault) {
        e.preventDefault()
      } else {
        window.event.returnValue = false
      }
    },
    focus() {
      this.showOption = true
      this.tipZIndex = -1
    },
    blur() {
      this.showOption = false
      this.tipZIndex = 1
    },
    beforeEnter(el) {
      this.showSearch = true
    },
    leaveCancelled(el) {
      this.showSearch = false
    },
    selectSug(sugMsg) {
      this.input = sugMsg
      this.search()
    },
    async sendSug() {
      const content = this.input
      if (content !== null && content !== '') {
        let sugUrl = this.sSearch.sugUrl
        const callbackQuery = this.sSearch.callbackQuery
        const callbackName = this.sSearch.callbackName
        const timestamp = new Date().getTime()
        this.timestamp = timestamp
        sugUrl = sugUrl.replace('#content#', content)
        try {
          const res = await this.$jsonp(sugUrl, { callbackQuery, callbackName }, 500)
          if (timestamp === this.timestamp) {
            this.handleSugMsg(res)
          }
        } catch (err) {
          // console.log(err)
          if (timestamp === this.timestamp && this.sSearch.ename !== 'sogou') {
            this.sugMsgs = []
          }
        }
      }
    },
    handleSugMsg(data) {
      console.log(data)
      if (data) {
        switch (this.sSearch.ename) {
          case 'baidu':
            this.sugMsgs = data.s
            break
          case 'bing':
            this.sugMsgs = data.AS.FullResults ? data.AS.Results[0].Suggests.map((item) => { return item.Txt }) : []
            break
          case 'so':
            this.sugMsgs = data.result.map((item) => { return item.word })
            break
          case 'sogou':
            this.sugMsgs = JSON.parse(JSON.stringify(data[1]))
            break
          case 'google':
            this.sugMsgs = data[1].map((item) => { return item[0] })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  @media screen and (max-width: 650px) {
    .search-select {
      width: calc(100% - 30px)!important;
      margin: 0!important;
      height: 60px;
    }
  }
  @media screen and (max-width: 424px) {
    .search-select {
      width: calc(100% - 30px)!important;
      margin: 0!important;
      height: 70px!important;
      bottom: -50px!important;
    }
  }
  .search-select {
    position: absolute;
    bottom: -20px;
    margin-left: calc(50% - 300px);
    width: 600px;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, 0%);
    height: 30px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .option {
      width: 80px;
      height: 30px;
      padding: 8px 12px;
      border-radius: 6px;
      margin: 0 auto;
      background: rgba(0,0,0,.2);
      padding: 6px 10px 4px 10px;
      color: white;
      font-size: 14px;
      border-radius: 10px;
      transition: all 0.25s;
      cursor: pointer;
      text-align: center;
    }
  }
  @media screen and (max-width: 650px) {
    .search-sugmsg {
      width: calc(100% - 30px)!important;
      margin: 0 auto!important;
      height: 70px!important;
      bottom: -50px!important;
    }
  }
  .search-sugmsg {
    z-index: 99;
    position: absolute;
    height: 300px;
    bottom: -60px;
    margin-left: calc(50% - 300px);
    width: 600px;
    height: 30px;
    // border-radius: 10px 10px 0px 0px;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
    div:first-child {
      // border-radius: 10px 10px 0px 0px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    div:last-child {
      // border-radius: 0px 0px 10px 10px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    .sugmsgItem {
      z-index: 10;
      height: 30px!important;
      width: 100%;
      margin: 0 auto;
      background: rgba(0,0,0,.6);
      padding: 6px 10px 6px 10px;
      color: white;
      font-size: 14px;
      transition: all 0.25s;
      cursor: pointer;
      &:hover {
        background-color: rgba(0,0,0,.85);
        &:before { content: "\00a0\00a0"; }
        // font-size: 15px;
      }
    }
  }
  .active {
    background: rgba(0,0,0,.45)!important;
  }
  .inactive {
    background: rgba(0,0,0,.2);
  }
  .rootActive {
    height: 70px!important;
    height: 90px!important;
    margin-bottom: 25px;
    transition: color 0.25s, background-color 0.25s, box-shadow 0.25s, left 0.25s, opacity 0.25s, height 1s;
 }
 .rootInactive {
    height: 70px;
    // height: 50px;
    margin-bottom: 6px!important;
    transition: color 0.25s, background-color 0.25s, box-shadow 0.25s, left 0.25s, opacity 0.25s, height 1s;
 }

.input-with-select {
  margin: 0 auto;
  height: 45px!important;
  // width: 45%;
  // width: 600px;
  border-radius: 30px;
  max-width: 600px;
  min-width: 200px;
  display: block;
  // display: flex!important;
  // justify-content: center;
  @media screen and (max-width: 650px) {
    & ::v-deep input {
      width: calc(100% - 30px)!important;
      max-width: 360px!important;
      &:hover {
        width: calc(100% - 10px)!important;
        max-width: 360px!important;
      }
    }
  }
  & ::v-deep input {
    height: 100%;
    width: 360px;
    // flex-grow: 0;
    // margin: 0 auto;
    // position: absolute;
    // margin-top: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255,255,255,.0);
    border: none;
    border-radius: 30px;
    font-size: 15px!important;
    text-align: center;
    background: rgba(255,255,255,.25);
    transition: color 0.25s, background-color 0.25s, box-shadow 0.25s, left 0.25s, opacity 0.25s, top 0.25s, width 0.25s;
    &:hover {
      width: 600px;
      background-color: rgba(255,255,255,.6);
      box-shadow: rgba(0,0,0,0.3) 0 0 10px;
      &::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        color: #666;
      }
      &:-moz-placeholder, textarea:-moz-placeholder {
        color: #666;
      }
      &::-moz-placeholder, textarea::-moz-placeholder {
        color: #666;
      }
      &:-ms-input-placeholder, textarea:-ms-input-placeholder {
        color: #666;
      }
    }
    &:focus {
      width: 600px;
      color: black;
      background-color: rgba(255,255,255,0.8);
      box-shadow: rgba(0,0,0,0.2) 0 0 10px;
      &::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        opacity: 0;
      }
      &:-moz-placeholder, textarea:-moz-placeholder {
        opacity: 0;
      }
      &::-moz-placeholder, textarea::-moz-placeholder {
        opacity: 0;
      }
      &:-ms-input-placeholder, textarea:-ms-input-placeholder {
        opacity: 0;
      }
    }
    &::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: white;
    }
    &:-moz-placeholder, textarea:-moz-placeholder {
      color: white;
    }
    &::-moz-placeholder, textarea::-moz-placeholder {
      color: white;
    }
    &:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: white;
    }
  }

  & ::v-deep .el-input-group__prepend {
    background: rgba(255,255,255,.0);
    border: none;
    height: 42px!important;
    width: 48px!important;
    padding: 0px;
    display: flex!important;
  }
  & ::v-deep .el-input-group__append {
    background: rgba(255,255,255,.0);
    border: none;
    height: 42px!important;
    width: 48px!important;
    padding: 0px;
    display: flex!important;
  }
}

.prepend, .append {
  // width: 48px;
  // // height: 24px;
  margin: auto;
  i {
    font-weight: 400;
    font-size: 24px;
    color: #1088A3!important;
  }
}
</style>

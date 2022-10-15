<template>
  <div class="container">
    <div v-for="(urlSite) in cSites" :key="urlSite.id" class="url-site">
      <div class="urlSiteText">
        <a @click="open(urlSite.url)">
          <span>{{ urlSite.title }}</span>
        </a>
      </div>
    </div>
  </div>
</template>>

<script>
const URI = require('urijs')
export default {
  data() {
    return {
    }
  },
  computed: {
    urlList: {
      get() {
        return JSON.parse(this.$store.state.url.list)
      },
      set(val) {
        this.$store.dispatch('url/setList', JSON.stringify(val))
      }
    },
    cSites() {
      const cSites = []
      if (this.urlList.length !== 0 && this.urlList[0].groups.length !== 0) {
        this.urlList[0].groups[0].sites.forEach((siteItem) => {
          cSites.push(siteItem)
        })
      }
      return cSites
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  updated() {
  },
  destroyed() {
  },
  methods: {
    open(src) {
      try {
        window.open(this.addProtocol(src), '_blank')
      } catch (e) {
        this.$message.error({ message: '网址有错误，请修正！', center: true })
      }
    },
    addProtocol(src) {
      const uri = URI.parse(src)
      if (!uri.protocol || uri.protocol === '') {
        // 浏览器对未加protocol协议的网址默认按照80端口http访问
        src = 'http://' + src
      }
      return src
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding-top: 6px;
    background: rgba(0,0,0,.5);
    border-radius: 6px;
    width: 45%;
    height: 100%;
    max-width: 1200px;
    min-width: 200px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    overflow: hidden;
    &:hover {
      overflow-y: auto;
      overflow-x: hidden;
    }
    &::-webkit-scrollbar-track-piece
    {
      // box-shadow: inset 0 0 1px rgba(0,0,0,0.3);
      // border-radius: 10px;
      // // background-color: #F5F5F5;
      background-color: rgba(255, 255, 255, 0.0);
    }
    &::-webkit-scrollbar-track
    {
      // box-shadow: inset 0 0 1px rgba(0,0,0,0.0);
      border-radius: 10px;
      // background-color: rgba(255, 255, 255, 0.0);
      // background-color: black;
      opacity: 0;
    }
    &::-webkit-scrollbar
    {
      width: 8px;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.0);
    }
    &::-webkit-scrollbar-thumb
    {
      width: 8px;
      border-radius: 10px;
      background-color: rgba(96,98,102,0.3);
      &:hover {
        background-color: rgba(96,98,102,0.5);
      }
      &:active {
        background-color: rgba(96,98,102,0.8);
      }
    }
  }
  .url-site {
    box-sizing: content-box;
    box-sizing: border-box;
    border-radius: 4px;
    margin: 6px 0px;
    padding: 10px 10px 10px 10px;
    height: 50px;
    width: 110px;
    display: inline-block;
    position: relative;
    // 字体设置
    text-decoration: none;
    // line-height: 45px;
    line-height: 29px;
    font-size: 14px;
    text-align: center;
    font-family: 'Microsoft Yahei', sans-serif;
    color: white;
    // div内文字不溢出，溢出部分用...代替
    word-break: keep-all;
    white-space: nowrap;
    // overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      font-size: 110%;
      color: #ffffff;
      // background-color: #474a4d;
    }
    .urlSiteText {
      // div内文字不溢出，溢出部分用...代替
      word-break: keep-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>

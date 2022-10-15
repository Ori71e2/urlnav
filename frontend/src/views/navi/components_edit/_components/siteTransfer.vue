<template>
  <div>
    <div class="group-container">
      <div class="position">
        <span>网址中转站</span>
      </div>
      <div class="main">
        <div class="content">
          <draggable
            ref="urlSites"
            v-model="urlSites"
            v-bind="urlItemDragOptions"
            element="div"
            class="url-sites"
            draggable=".site-drag"
            :force-fallback="true"
            :group="{ name: 'urlSiteTransfer', pull: true, put: ['urlSite', 'urlSiteTransfer', 'rubbish'] }"
            ghost-class="sortable-site"
            chosen-class="sortable-site"
            drag-class="sortable-site"
          >
            <transition v-for="(urlSite) in urlSites" :key="urlSite.id" name="fade">
              <div class="url-site site-drag">
                <span>{{ urlSite.title }}</span>
              </div>
            </transition>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      id: ''
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
    urlSites: {
      get() {
        return JSON.parse(this.$store.state.url.siteTransfer)
      },
      set(val) {
        this.$store.dispatch('url/setSiteTransfer', JSON.stringify(val))
      }
    },
    isDrag: {
      get() {
        return this.$store.state.operate.drag
      },
      set(val) {
        this.$store.dispatch('operate/setDrag', val)
      }
    },
    urlItemDragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.isDrag,
        ghostClass: 'ghost'
      }
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.group-container {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  box-sizing: content-box;
  display: flex;
  flex-direction: row;
}
.position {
  width: 32px;
  height: 100%;
  margin-left: 5px;
  margin-right: 5px;
  background-color: rgba(210,218,218,.85);
  border-radius: 4px;
  // border-bottom: solid #808080 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  span {
    width: 16px;
    letter-spacing: 4px;
    text-align: center;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
.main {
  flex-grow: 1;
  height: 100%;
  border-radius: 4px;
  display: flex;
  .content {
    height: 100%;
    width: calc(100%);
  }
}
.url-sites {
  box-shadow: 0 3px 8px 0 rgba(0,0,0,.08);
  border-radius: 6px;
  width: calc(100%);
  height: 100%;
  background-color: rgba(210,218,218,.85);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
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
.sortable-site {
  background-color: #474a4d;
  a {
    color: #ffffff;
    font-size: 16px!important;
  }
  span {
    color: #ffffff;
    font-size: 16px!important;
  }
  .tooltiptext {
    // display: none;
    visibility: hidden!important;
  }
}
.url-site {
  box-sizing: content-box;
  border-radius: 4px;
  margin: 6px 10px;
  padding: 10px;
  height: 30px;
  width: 110px;
  display: block;
  position: relative;
  // 字体设置
  text-decoration: none;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  font-family: 'Microsoft Yahei', sans-serif;
  color: #474a4d;
  // div内文字不溢出，溢出部分用...代替
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    font-size: 110%;
    color: #ffffff;
    background-color: #474a4d;
  }
}
</style>

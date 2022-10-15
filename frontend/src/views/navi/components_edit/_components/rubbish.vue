<template>
  <div class="container">
    <div class="position">
      <span>回收站</span>
    </div>
    <div class="main">
      <div class="content">
        <draggable
          ref="urlSites"
          v-model="rubbish"
          v-bind="itemDragOptions"
          element="div"
          class="rubbish-items"
          :group="{ name: 'rubbish', pull: true, put: ['urlSite', 'urlGroup', 'urlPage', 'urlSiteTransfer', 'urlGroupTransfer', 'searchSite'] }"
          @change="change"
        />
      </div>
    </div>
    <el-dialog :visible="dialogVisible" width="400px" :append-to-body="true" :show-close="false">
      <span><b>是否删除</b></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button type="info" @click="cancle">取消</el-button>
      </span>
    </el-dialog>
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
      rubbish: [],
      id: '',
      dialogVisible: false,
      preUrlList: '',
      preSearchSite: ''
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
    searchSite: {
      get() {
        return JSON.parse(this.$store.state.url.searchSite)
      },
      set(val) {
        this.$store.dispatch('url/setSearchSite', JSON.stringify(val))
      }
    },
    preList() {
      return this.$store.state.url.preList
    },
    isDrag: {
      get() {
        return this.$store.state.operate.drag
      },
      set(val) {
        this.$store.dispatch('operate/setDrag', val)
      }
    },
    isSearch: {
      get() {
        return this.$store.state.operate.search
      },
      set(val) {
        this.$store.dispatch('operate/setSearch', val)
      }
    },
    itemDragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.isDrag && !this.isSearch,
        ghostClass: 'ghost'
      }
    }
  },
  watch: {
    rubbish: {
      handler: function(newVal, oldVal) {
        this.dialogVisible = true
      }
    }
  },
  mounted() {
  },
  destroyed() {
    window.removeEventListener('mousemove', this.mousemove)
  },
  methods: {
    change(e) {
      // console.log(this.removedInfo)
    },
    confirm() {
      this.dialogVisible = false
    },
    cancle() {
      this.$store.dispatch('url/cancelDelete')
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  // box-sizing: content-box;
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
    height: 60px;
    letter-spacing: 4px;
    writing-mode: vertical-rl;
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
  // flex-grow: 1;
  width: calc(100% - 32px);
  height: 100%;
  border-radius: 4px;
  display: flex;
  .content {
    // padding-left: 5px;
    height: 100%;
    width: calc(100%);
  }
}

.rubbish-items {
  box-shadow: 0 3px 8px 0 rgba(0,0,0,.08);
  background-color: rgba(210,218,218,.85);
  border-radius: 6px;
  width: 100%;
  height: 100%;
  display: flex;
}
.rubbish-site {
  box-sizing: content-box;
  border-radius: 4px;
  margin: 0 auto;
  // padding: 10px;
  height: 30px;
  width: 60px;
  display: block;
  position: relative;
  // 字体设置
  text-decoration: none;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  font-family: 'Microsoft Yahei', sans-serif;
  color: #474a4d;
}

</style>


<template>
  <div class="url-page-navi" @scroll.passive="handleScroll">
    <draggable
      v-model="urlList"
      v-bind="dragOptions"
      :move="onMove"
      element="div"
      draggable=".drag"
      :group="{ name: 'urlPage', pull: true, put: ['urlPage'] }"
      :force-fallback="true"
      ghost-class="sortable-page"
      chosen-class="sortable-page"
      drag-class="sortable-page"
      @end="dragend"
    >
      <transition v-for="(page) in urlList" :key="page.id" name="fade">
        <div class="url-page-title drag">
          <div v-show="!isEdit" @click="handlePosition(page.id)">
            <svg-icon v-show="!isLock && page.lock !== undefined && page.lock === true" icon-class="lock" class-name="lock-noedit-icon" />
            <span>{{ page.title }}</span>
          </div>
          <div v-show="isEdit" @click="handlePosition(page.id)" @dblclick="handleEdit(page)">
            <svg-icon v-show="!isLock && page.lock !== undefined && page.lock === true" icon-class="lock" class-name="lock-icon lock-edit-icon" @click="setLockValve(page.id)" />
            <svg-icon v-show="!isLock && isEdit && page.lock !== undefined && page.lock === false" icon-class="unlock" class-name="lock-icon unlock-edit-icon" @click="setLockValve(page.id)" />
            <span>{{ page.title }}</span>
          </div>
        </div>
      </transition>
      <div v-show="isEdit" class="url-page-add url-page-title">
        <div @click="addPage">
          <span>Add</span>
        </div>
      </div>
    </draggable>
    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :append-to-body="true">
      <span>这是一段信息</span>
      <el-input v-model="item.title" placeholder="请输入内容">
        <template slot="prepend">Title</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>>

<script>
// import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data() {
    return {
      item: {
        pageId: '',
        title: ''
      },
      dialogVisible: false
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
    isLock: {
      get() {
        return this.$store.state.operate.lock
      },
      set(val) {
        this.$store.dispatch('operate/setLock', val)
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
    isEdit: {
      get() {
        return this.$store.state.operate.edit
      },
      set(val) {
        this.$store.dispatch('url/setEdit', val)
      }
    },
    pageId: {
      get() {
        return this.$store.state.operate.position
      },
      set(val) {
        this.$store.dispatch('operate/setPosition', val)
      }
    },
    scroll: {
      get() {
        return this.$store.state.operate.scroll
      },
      set(val) {
        this.$store.dispatch('operate/setScroll', val)
      }
    },
    scrollState: {
      get() {
        return this.$store.state.scroll.scrollState
      },
      set(val) {
        this.$store.dispatch('scroll/setScrollState', val)
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.isDrag,
        ghostClass: 'ghost'
      }
    }
  },
  watch: {
  },
  methods: {
    handleScroll() {
      this.scrollState = true
    },
    setLockValve(pageId) {
      this.urlList.forEach((page, index) => {
        if (page.id === pageId) {
          this.urlList[index].lock = !this.urlList[index].lock
        }
      })
      this.urlList = JSON.parse(JSON.stringify(this.urlList))
    },
    onMove({ relatedContext, draggedContext }) {
      // const relatedElement = relatedContext.element
      // const draggedElement = draggedContext.element
      // return (
      //   (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      // )
    },
    dragend() {
      // this.urlList = JSON.parse(JSON.stringify(this.urlList))
    },
    handlePosition(pageId) {
      this.pageId = pageId
      this.scroll = !this.scroll
    },
    handleEdit(page) {
      this.item.pageId = page.id
      this.item.title = page.title
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleConfirm() {
      this.urlList.forEach((page, index) => {
        if (page.id === this.item.pageId) {
          this.urlList[index].title = this.item.title
        }
      })
      this.urlList = JSON.parse(JSON.stringify(this.urlList))
      this.dialogVisible = false
    },
    addPage() {
      this.urlList.push({
        id: this.generatePageId(),
        lock: false,
        title: '页面',
        groups: []
      })
      this.urlList = JSON.parse(JSON.stringify(this.urlList))
    },
    generatePageId() {
      let newId = -1
      if (this.urlList.length === 0) {
        newId = 0
      } else {
        this.urlList.map((item) => {
          return item.id
        }).sort((a, b) => {
          return a - b
        }).some((id, index) => {
          if (id !== index) {
            newId = index
            return true
          }
        })
        if (newId === -1) {
          newId = this.urlList.length
        }
      }
      console.log(newId)
      return newId
    }
  }
}
</script>

<style lang="scss" scoped>
.url-page-navi {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  height: calc(100% - 10px);
  box-sizing: content-box;
  margin: 5px 0px;
  overflow: hidden;
  &:hover {
    overflow: auto;
  }
  @include scrollBar;
}
.sortable-page {
  font-size: 16px;
  background-color: #565a5f!important;
  span { color: #ffffff; }
  a { color: #ffffff; }
}
.url-page-title {
  // border: 1px solid #d8dce5;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);
  box-sizing: content-box;
  border-radius: 4px;
  margin: 3px 1px;
  width: calc(100% - 10px);
  height: 45px;
  // 字体设置
  text-decoration: none;
  line-height: 45px;
  font-size: 18px;
  text-align: center;
  font-family: 'Microsoft Yahei', sans-serif;
  color: #474a4d;
  color: #336699;
  // font-weight: bold;
  // div内文字不溢出，溢出部分用...代替
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  div {
    width: 100%;
    height: 100%;
  }
  &:hover {
    font-size: 110%;
    color: #ffffff;
    background-color: #474a4d;
    cursor: pointer;
  }
}
.lock-icon {
  &:hover {
    font-size: 140%;
    color: #409EFF;
    // background-color: #474a4d;
    cursor: pointer;
  }
}
.unlock-edit-icon {
  color: #909399;
}
.lock-edit-icon {
  color: #F56C6C;
}
</style>

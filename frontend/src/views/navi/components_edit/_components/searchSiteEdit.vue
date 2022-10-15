<template>
  <div>
    <div class="container">
      <div class="position">
        <span>搜索引擎在用</span>
      </div>
      <div class="main">
        <div class="content">
          <draggable
            ref="searchSite"
            v-model="searchSite"
            v-bind="searchItemDragOptions"
            element="div"
            class="url-sites"
            draggable=".site-drag"
            :force-fallback="true"
            :group="{ name: 'searchSite', pull: true, put: ['searchSite'] }"
            ghost-class="sortable-site"
            chosen-class="sortable-site"
            drag-class="sortable-site"
          >
            <transition v-for="(item) in searchSite" :key="item.id" name="fade">
              <div v-if="!isEdit" :class="itemClass(item.level)" class="url-site site-drag">
                <span>{{ item.name }}</span>
              </div>
              <div v-else :class="itemClass(item.level)" class="url-site site-drag" @dblclick="handleEdit(item)">
                <span>{{ item.name }}</span>
              </div>
            </transition>
            <div v-show="isEdit" class="url-site url-site-add">
              <div @click="addSearchItem">
                <span>Add</span>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :append-to-body="true">
      <el-form ref="form" :model="editSite" label-width="100px">
        <el-form-item label="名称(中文)">
          <el-input v-model="editSite.name" />
        </el-form-item>
        <el-form-item label="名称(英文)">
          <el-input v-model="editSite.ename" />
        </el-form-item>
        <el-form-item label="搜索接口">
          <el-input v-model.number="editSite.searchUrl" />
        </el-form-item>
        <el-form-item label="搜索预览接口">
          <el-input v-model="editSite.sugUrl" />
        </el-form-item>
        <el-form-item label="回调接口">
          <el-input v-model="editSite.callback" />
        </el-form-item>
        <el-form-item label="回调形式">
          <el-input v-model="editSite.callbackQuery" />
        </el-form-item>
        <el-form-item label="回调名称">
          <el-input v-model="editSite.callbackName" />
        </el-form-item>
        <el-form-item label="选择">
          <el-radio-group v-model.number="editSite.level">
            <el-radio :label="0" border>
              隐藏
            </el-radio>
            <el-radio :label="1" border>
              显示
            </el-radio>
            <el-radio :label="2" border>
              默认
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
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
      editSite: {
        name: '引擎',
        ename: '',
        searchUrl: '',
        sugUrl: '',
        callback: '',
        callbackQuery: '',
        callbackName: '',
        level: 0
      },
      dialogVisible: false
    }
  },
  computed: {
    searchSite: {
      get() {
        return JSON.parse(this.$store.state.url.searchSite)
      },
      set(val) {
        this.$store.dispatch('url/setSearchSite', JSON.stringify(val))
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
    isEdit: {
      get() {
        return this.$store.state.operate.edit
      },
      set(val) {
        this.$store.dispatch('url/setEdit', val)
      }
    },
    searchItemDragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.isSearch,
        ghostClass: 'ghost'
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
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: this.isDrag,
        ghostClass: 'ghost'
      }
    }
  },
  mounted() {
  },
  methods: {
    setLockValve(pageId) {
      this.searchSite.forEach((page, index) => {
        if (page.id === pageId) {
          this.searchSite[index].lock = !this.searchSite[index].lock
        }
      })
      this.searchSite = JSON.parse(JSON.stringify(this.searchSite))
    },
    itemClass(level) {
      const classArr = ['item-hidden', 'item-show', 'item-default']
      return classArr[level]
    },
    onMove({ relatedContext, draggedContext }) {
      // const relatedElement = relatedContext.element
      // const draggedElement = draggedContext.element
      // return (
      //   (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      // )
    },
    dragend() {
      // this.searchSite = JSON.parse(JSON.stringify(this.searchSite))
    },
    handleEdit(site) {
      this.editSite = JSON.parse(JSON.stringify(site))
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleConfirm() {
      this.searchSite.forEach((page, index) => {
        if (this.editSite.level === 2 && page.level === 2) {
          this.searchSite[index].level = 1
        }
        console.log(this.editSite)
        if (page.id === this.editSite.id) {
          this.searchSite[index] = JSON.parse(JSON.stringify(this.editSite))
        }
      })
      this.searchSite = JSON.parse(JSON.stringify(this.searchSite))
      this.dialogVisible = false
    },
    addSearchItem() {
      this.searchSite.push({
        id: this.generateSearchItemId(),
        name: '引擎',
        ename: '',
        searchUrl: '',
        sugUrl: '',
        callback: '',
        callbackQuery: '',
        callbackName: '',
        level: 0
      })
      this.searchSite = JSON.parse(JSON.stringify(this.searchSite))
    },
    generateSearchItemId() {
      let newId = -1
      if (this.searchSite.length === 0) {
        newId = 0
      } else {
        this.searchSite.map((item) => {
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
          newId = this.searchSite.length
        }
      }
      return newId
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
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
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  .content {
    height: 100%;
    width: calc(100%);
  }
}
.item-hidden {
  background-color: rgba(96,98,102, .3)!important;
  &:hover {
    // font-size: 110%;
    // color: #ffffff;
    background-color: rgba(96,98,102, .7)!important;
  }
}
.item-show {
  background-color: rgba(95,174,227, .7)!important;
  &:hover {
    // font-size: 110%;
    // color: #ffffff;
    background-color: rgba(95,174,227, 1.0)!important;
  }
}
.item-default {
  background-color: rgba(241,148,138, .7)!important;
  &:hover {
    // font-size: 110%;
    // color: #ffffff;
    background-color: rgba(241,148,138, 1.0)!important;
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
  justify-content: center;
  align-items: center;
  // overflow: hidden;
  overflow: auto;
  &::-webkit-scrollbar-track-piece
  {
    background-color: rgba(255, 255, 255, 0.0);
  }
  &::-webkit-scrollbar-track
  {
    border-radius: 10px;
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
  height: 30px;
  width: 110px;
  display: block;
  position: relative;
  // 字体设置
  text-decoration: none;
  line-height: 30px;
  font-family: 'Microsoft Yahei', sans-serif;
  // div内文字不溢出，溢出部分用...代替
  word-break: keep-all;
  white-space: nowrap;
  margin: 10px 20px;
  background: rgba(0,0,0,.3);
  padding: 6px 10px 4px 10px;
  color: white;
  font-size: 14px;
  border-radius: 10px;
  transition: all 0.25s;
  cursor: pointer;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    // font-size: 110%;
    color: #ffffff;
    background-color: #474a4d;
  }
  .url-site-add {
    // border: 1px solid #d8dce5;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    &:hover {
      font-size: 110%;
      color: #ffffff;
      background-color: #54585c;
      cursor: pointer;
    }
  }
}
</style>

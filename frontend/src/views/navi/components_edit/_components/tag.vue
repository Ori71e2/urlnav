<template>
  <el-dialog title="标签管理" :visible.sync="siteTagDialogVisible" width="70%" append-to-body class="dialog-custom" @open="openTagDialog">
    <!-- <div><span>标签管理</span></div> -->
    <div class="main">
      <div class="tag-selected">
        <div class="delete">
          <div class="icon"><i class="el-icon-delete" /></div>
          <draggable v-model="tagSelectedDeleted" v-bind="dragOptions" element="div" :group="{name: 'tag', put: ['tagSelected']}" class="drag" />
        </div>
        <draggable v-model="tagsSelected" v-bind="dragOptions" element="div" :group="{name: 'tagSelected', put: ['tagStore']}" :move="onMove" class="dragarea">
          <transition v-for="tagSelected in tagsSelected" :key="tagSelected.id" name="fade">
            <div class="tag-item">
              <el-tag class="item" :style="{ backgroundColor: tagSelected.color, borderColor: tagSelected.color }"> {{ tagSelected.title }}</el-tag>
            </div>
          </transition>
        </draggable>
      </div>
      <div style="text-align: right;padding: 10px 20px 10px;">
        <el-button @click="cancelItemTagChange">取 消</el-button>
        <el-button type="primary" @click="confirmTagProp">保 存</el-button>
      </div>
      <div class="tag-search">
        <el-input v-model="search" placeholder="请输入内容" class="input-with-select">
          <el-button slot="prepend" icon="el-icon-search" />
        </el-input>
      </div>
      <div class="tag-store">
        <div class="operate">
          <div class="add">
            <div class="icon" @click="tagStoreAdd"><i class="el-icon-circle-plus-outline" /></div>
          </div>
          <div class="delete">
            <div class="icon"><i class="el-icon-delete" /></div>
            <draggable v-model="tagDeleted" v-bind="dragOptions" element="div" :group="{name: 'tagStoreDelete', put: ['tagStore']}" class="drag" />
          </div>
        </div>
        <!-- search 功能，选择结果只能编辑无法进行排序 -->
        <draggable v-if="search" v-model="tagsSearched" v-bind="dragOptions" element="div" :group="{ name: 'tagStore', pull: 'clone', put: ['tagStore'] }" :clone="clone" :move="onMove" class="dragarea">
          <transition v-for="tagSearched in tagSearched" :key="tagSearched.id" name="fade">
            <div class="tagSearched-item" @dblclick="tagStoreEdit(tagSearched.id)">
              <el-tag class="item" :style="{ backgroundColor: tagSearched.color, borderColor:tagSearched.color }"> {{ tagSearched.title }}</el-tag>
            </div>
          </transition>
        </draggable>
        <!-- 原始数据，可进行编辑与排序 -->
        <draggable v-else v-model="urlTag" v-bind="dragOptions" element="div" :group="{ name: 'tagStore', pull: 'clone', put: ['tagStore'] }" :clone="clone" :move="onMove" class="dragarea">
          <transition v-for="tagOrigin in urlTag" :key="tagOrigin.id" name="fade">
            <div class="tag-item" @dblclick="tagStoreEdit(tagOrigin.id)">
              <el-tag class="item" :style="{ backgroundColor: tagOrigin.color, borderColor:tagOrigin.color }"> {{ tagOrigin.title }}</el-tag>
            </div>
          </transition>
        </draggable>
      </div>
      <div class="tag-tip">
        <el-tag effect="dark">将标签库里标签拖拽到上方可进行添加</el-tag>
        <el-tag type="success" effect="dark">双击标签进行编辑</el-tag>
        <el-tag type="info" effect="dark">点击新增按钮进行添加</el-tag>
        <el-tag type="danger" effect="dark">拖拽标签至回收站删除</el-tag>
        <el-tag type="warning" effect="dark">拖拽标签可进行排序</el-tag>
      </div>
    </div>
    <!-- 嵌套dialog -->
    <el-dialog :title="tagEditDialogTitle" :visible.sync="tagEditDialogVisible" width="30%" :append-to-body="true" :before-close="closeTagDialog">
      <el-input v-model="editTag.title" placeholder="请输入内容">
        <template slot="prepend">标签名称</template>
      </el-input>
      <div v-show="isTagDuplicate && tagEditDialogVisible" style="color: red; margin-left: 50%;">存在重复标签</div>
      <el-input v-model="editTag.color" placeholder="请输入内容">
        <el-color-picker slot="prepend" v-model="editTag.color" :predefine="predefineColors" size="small" style="margin-top: 4px;" />
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelTagChanged">关 闭</el-button>
        <el-button :disabled="isTagDuplicate" type="primary" @click="confirmTagAddEdit">保 存</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
// import { url } from 'inspector';
export default {
  components: {
    draggable
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    tag: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      search: '',
      // tagsIdSelected: ['T15860802459600'],
      // 用来存放Tag的，数据无实际意义
      tagSelectedDeleted: [],
      tagDeleted: [],
      propTag: [],
      // dialog变量
      tagEditDialogTitle: '',
      tagEditDialogVisible: false,
      // 新增与变更临时存储变量使用
      editTag: {
        type: '',
        id: '',
        title: '',
        color: '#409EFF'
      },
      // 颜色选择器预选颜色
      predefineColors: [
        '#409EFF',
        '#67c23a',
        '#E6A23C',
        '#F56C6C',
        '#909399',
        '#8040FF',
        '#FC40FF'
      ]
    }
  },
  computed: {
    siteTagDialogVisible: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    },
    urlTag: {
      get() {
        return JSON.parse(this.$store.state.url.tag)
      },
      set(val) {
        this.$store.dispatch('url/setTag', JSON.stringify(val))
      }
    },

    tagsSearched: {
      get() {
        const urlTag = this.urlTag
        return urlTag.filter(tag => { return this.search === '' || tag.title.toLowerCase().includes(this.search.toLowerCase()) })
      },
      set(val) {
        this.$message({ message: '搜索结果不可拖拽排序', center: true, duration: '1000' })
      }
    },
    tagsIdSelected: {
      get() {
        return this.propTag
      },
      set(val) {
        this.propTag = val
      }
    },
    tagsSelected: {
      get() {
        if (this.tagsIdSelected.length === 0 || this.urlTag.length === 0) {
          return []
        } else {
          const tag = this.tagsIdSelected.map((id, index) => {
            const filterTags = this.urlTag.filter(tag => { return tag.id === id })
            return filterTags.length > 0 ? filterTags[0] : []
          })
          return tag
        }
      },
      set(val) {
        if (val) {
          this.tagsIdSelected = val.map(tag => { return tag.id })
        }
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    isTagDuplicate() {
      let result = false
      if (this.urlTag.length === 0) {
        result = false
      } else {
        if (this.editTag.type === 'edit') {
          this.urlTag.forEach((tag) => {
            if (tag.title === this.editTag.title && tag.id !== this.editTag.id) {
              result = true
            }
          })
        }
        if (this.editTag.type === 'add') {
          this.urlTag.forEach((tag) => {
            if (tag.title === this.editTag.title) {
              result = true
            }
          })
        }
      }
      return result
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    openTagDialog() {
      this.propTag = JSON.parse(JSON.stringify(this.tag))
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    clone(e) {
      const cloneTag = { ...e }
      if (this.tagsIdSelected.length === 0) {
        return cloneTag
      } else if (this.tagsIdSelected.every(id => { return id !== cloneTag.id })) {
        return cloneTag
      }
    },
    tagStoreAdd() {
      this.tagEditDialogTitle = '新增'
      this.editTag = {
        type: 'add',
        id: '',
        title: '',
        color: '#409EFF'
      }
      this.tagEditDialogVisible = true
    },
    generateTagId() {
      let newId = -1
      if (this.urlTag.length === 0) {
        newId = 0
      } else {
        const tagIds = this.urlTag.map((item) => {
          return item.id
        }).sort((a, b) => {
          return a - b
        })
        newId = tagIds[tagIds.length - 1] + 1
      }
      return newId
    },
    tagStoreEdit(tagId) {
      // 获取要修改的tag信息
      this.tagEditDialogTitle = '修改'
      this.editTag.type = 'edit'
      this.urlTag.forEach((tag, index) => {
        if (tag.id === tagId) {
          this.editTag.id = tagId
          this.editTag.title = tag.title
          this.editTag.color = tag.color
        }
      })
      this.tagEditDialogVisible = true
    },
    confirmTagAddEdit() {
      const urlTag = JSON.parse(JSON.stringify(this.urlTag))
      if (this.editTag.type === 'add') {
        urlTag.push({
          id: this.generateTagId(),
          title: this.editTag.title,
          color: this.editTag.color
        })
      }
      if (this.editTag.type === 'edit') {
        urlTag.forEach((tag, index) => {
          if (tag.id === this.editTag.id) {
            urlTag[index].title = this.editTag.title
            urlTag[index].color = this.editTag.color
          }
        })
      }
      this.urlTag = JSON.parse(JSON.stringify(urlTag))
      this.tagEditDialogVisible = false
    },
    closeTagDialog(done) {
      done()
    },
    cancelTagChanged() {
      this.tagEditDialogVisible = false
    },
    cancelTagProp() {
    },
    confirmTagProp() {
      this.$emit('update:tag', JSON.parse(JSON.stringify(this.tagsIdSelected)))
      this.siteTagDialogVisible = false
    },
    cancelItemTagChange() {
      this.siteTagDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
$searchHeight: 50px;
$tagSelectedHeight: 100px;
$operateWidth: 60px;
$tipHeight: 60px;
@mixin icon-drag {
  .icon {
    position: relative;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    display: flex;
    i {
      font-weight: 400;
      font-size: 30px;
      color: #409EFF;
      margin: auto;
    }
  }
  .drag {
    position: relative;
    width: 100%;
    height: 100%;
    left: 0px;
    top: -100%;
  }
}
.dialog-custom {
  height: 90%;
}
.main {
  width: 99%!important;
  // height: calc(100% - 50px);
  height: 500px;
  margin-bottom: 20px!important;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  // align-items: center;
}
.tag-selected {
  width: 100%;
  height: $tagSelectedHeight;
  // border: solid 1px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  .delete {
    width: 60px;
    margin-right: 4px;
    height: 100%;
    border: 1px solid #d8dce5;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    @include icon-drag;
  }
  .dragarea {
    width: calc(100% - 60px - 4px);
    height: 100%;
    border: 1px solid #d8dce5;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    overflow: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .tag-item {
      margin: 2px 4px;
      height: 32px;
      cursor: pointer;
      .item {
        color: white;
      }
    }
  }
}
.tag-search {
  width: 100%;
  height: $searchHeight;
  // border: solid 1px;
}
.tag-store {
  width: 100%;
  height: calc(100% - #{$searchHeight} - #{$tagSelectedHeight} - #{$tipHeight} - 10px);
  padding-bottom: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  .operate {
    width: $operateWidth;
    margin-right: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: flex-start;
    div {
      width: 100%;
      height: 49%;
      border: 1px solid #d8dce5;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);
      @include icon-drag;
    }
    .add {
      cursor: pointer;
      &:hover {
        background-color: #54585c;
      }
    }
  }
  .dragarea {
    width: calc(100% - #{$operateWidth} - 4px);
    height: 100%;
    border: 1px solid #d8dce5;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    overflow: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .tag-item {
      margin: 2px 4px;
      height: 32px;
      cursor: pointer;
      .item {
        color: white;
      }
    }
  }
}
</style>

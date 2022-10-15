<template>
  <!-- <div class="container"> -->
  <div id="urlList" ref="urlList" class="url-list" @scroll.passive="handleScroll">
    <div v-for="(urlPage) in urlList" :key="urlPage.id" :ref="urlPage.id" class="url-page">
      <div class="url-page-title">
        <p class="title">{{ urlPage.title }}</p>
        <svg-icon v-show="!isLock && urlPage.lock !== undefined && urlPage.lock === true" icon-class="lock" class-name="lock-icon lock-edit-icon" />
        <svg-icon v-show="!isLock && isEdit && urlPage.lock !== undefined && urlPage.lock === false" icon-class="unlock" class-name="lock-icon unlock-edit-icon" />
      </div>
      <draggable
        v-model="urlPage.groups"
        v-bind="urlGroupDragOptions"
        class="url-group-container"
        :move="onMove"
        element="div"
        draggable=".group-drag"
        :group="{ name: 'urlGroup', pull: true, put: ['urlGroup', 'urlGroupTransfer'] }"
        :force-fallback="true"
        ghost-class="sortable-group"
        chosen-class="sortable-group"
        drag-class="sortable-group"
        @end="urlGroupDragEnd"
        @add="urlGroupDragEnd"
      >
        <div v-for="(urlGroup) in urlPage.groups" :key="urlGroup.id" class="url-group group-drag">
          <div class="group">
            <div class="url-group-title">
              <span v-if="!isEdit" class="title">{{ urlGroup.title }}</span>
              <span v-if=" isEdit" class="title edit" @dblclick="handleGroupEdit(urlPage, urlGroup)">&nbsp;{{ urlGroup.title }}&nbsp;</span>
            </div>
            <draggable
              ref="urlSites"
              v-model="urlGroup.sites"
              v-bind="urlItemDragOptions"
              element="div"
              draggable=".site-drag"
              class="url-sites"
              :move="siteMove"
              :force-fallback="true"
              ghost-class="sortable-site"
              chosen-class="sortable-site"
              drag-class="sortable-site"
              :group="{ name: 'urlSite', pull: true, put: ['urlSite', 'urlSiteTransfer'] }"
              @start="urlItemDragStart"
              @end="urlItemDragEnd"
              @add="urlItemDragEnd"
            >
              <transition v-for="(urlSite) in urlGroup.sites" :key="urlSite.id" name="fade">
                <div :style="urlSiteStyle" class="url-site site-drag" @mouseover.self="curOverflowOver($event)" @mouseleave.self="curOverflowLeave($event)">
                  <div class="urlSiteText">
                    <a v-if="!isEdit" @click="open(urlSite.url)">
                      <span>{{ urlSite.title }}</span>
                    </a>
                    <a v-if="isEdit">
                      <span @click="open(urlSite.url)" @dblclick="handleSiteEdit(urlPage, urlGroup, urlSite)">{{ urlSite.title }}</span>
                    </a>
                  </div>
                  <span class="tooltiptext"><a>{{ urlSite.title }}</a></span>
                  <!-- <div class="tooltiptext"><a>{{ urlSite.title }}</a></div> -->
                </div>
              </transition>
              <div v-if="isEdit" :style="urlSiteStyle" class="url-site url-site-add" @click.stop="addSite(urlPage, urlGroup)" @mouseover.self="setGroupDrag(true)" @mouseleave.self="setGroupDrag(false)">
                <div>
                  <span><i class="el-icon-plus" />&nbsp;添加网站</span>
                </div>
              </div>
            </draggable>
          </div>
        </div>
        <div v-if="isEdit" class="url-group-add url-group" @click="addGroup(urlPage)">
          <span><i class="el-icon-plus" />&nbsp;添加小组</span>
        </div>
      </draggable>
    </div>

    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :before-close="boforeClose">
      <el-input v-model="editType.title" placeholder="请输入内容" style="margin-bottom: 6px">
        <template slot="prepend">名称</template>
      </el-input>
      <el-popover v-if="dialogVisible" v-model="popoverVisible" placement="left" trigger="manual" :open-delay="0" :close-delay="0" class="popover">
        <div>
          <div style="text-align: center; font-weight: bold; font-size: 16px;">相似网站</div>
          <el-table :data="duplicateSite" style="width: 100%; margin-top: 20px;">
            <el-table-column prop="page" label="页面" width="80" />
            <el-table-column prop="group" label="小组" width="80" />
            <el-table-column prop="site" label="网张" width="120" />
            <el-table-column prop="siteUrl" label="地址" width="200" />
          </el-table>
        </div>
        <el-input v-if="editType.type === 'site'" slot="reference" v-model="editType.url" placeholder="请输入内容" style="margin-bottom: 6px">
          <template slot="prepend">网址</template>
        </el-input>
      </el-popover>
      <!-- {{ editType }} -->
      <!-- <div v-if="editType.type === 'site'" class="tag">
        <el-button type="primary" @click="handleUrlItemTagEdit">标签</el-button>
        <el-tooltip class="tag-list" effect="dark" content="点击左边便签进行编辑" placement="bottom">
          <draggable v-model="editType.tags" v-bind="dragOptions" element="div" :group="{ name: 'editTagStore', pull: false, put: ['editTagStore'] }" class="tag-list">
            <transition v-for="tagId in editType.tags" :key="tagId" name="fade">
              <div class="tag-item">
                <el-tag class="item" :style="{ backgroundColor: itemTagStyle(tagId).color, borderColor:itemTagStyle(tagId).color, color: 'white' }"> {{ itemTagStyle(tagId).title }}</el-tag>
              </div>
            </transition>
          </draggable>
        </el-tooltip>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <tag :show.sync="isTagShow" :tag.sync="editType.tags" type="select" /> -->
  </div>
  <!-- </div> -->
</template>>

<script>
import draggable from 'vuedraggable'
import { debounce } from 'lodash'
// import tag from './_components/tag'
const URI = require('urijs')
export default {
  components: {
    draggable
  },
  // prop: {
  //   width: {
  //     type: Number,
  //     default: 0
  //   },
  // },
  data() {
    return {
      sitesWidth: 0,
      dialogVisible: false,
      editType: {
        type: '',
        pageId: '',
        groupId: '',
        siteId: '',
        title: '',
        url: '',
        tags: []
      },
      disableGroupDrag: false,
      // isTagShow: false,
      popoverVisible: false,
      duplicateSite: [],
      relatedEl: null,
      draggedEl: null,
      draggedContext: null,
      relatedContext: null,
      dragStartData: null,
      timer: null
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
    urlTag: {
      get() {
        return JSON.parse(this.$store.state.url.tag)
      },
      set(val) {
        this.$store.dispatch('url/setTag', JSON.stringify(val))
      }
    },
    siteTransfer: {
      get() {
        return JSON.parse(this.$store.state.url.siteTransfer)
      },
      set(val) {
        this.$store.dispatch('url/setSiteTransfer', JSON.stringify(val))
      }
    },
    groupTransfer: {
      get() {
        return JSON.parse(this.$store.state.url.groupTransfer)
      },
      set(val) {
        this.$store.dispatch('url/setGroupTransfer', JSON.stringify(val))
      }
    },
    editItemTag: {
      get() {
        if (this.editType.tags.length === 0 || this.urlTag.length === 0) {
          return []
        } else {
          const tag = this.editType.tags.map((id, index) => {
            const filterTags = this.urlTag.filter(tag => { return tag.id === id })
            return filterTags.length > 0 ? filterTags[0] : []
          })
          return tag
        }
      },
      set(val) {
        if (val) {
          this.editType.tags = val.map(tag => { return tag.id })
        }
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
        this.$store.dispatch('operate/setEdit', val)
      }
    },
    scroll() {
      return this.$store.state.operate.scroll
    },
    scrollState: {
      get() {
        return this.$store.state.scroll.scrollState
      },
      set(val) {
        this.$store.dispatch('scroll/setScrollState', val)
      }
    },
    distance: {
      get() {
        const index = this.$store.state.operate.position
        if (this.$refs[index]) {
          const length = this.$refs[index][0].offsetTop - 140
          return length
        }
        return 0
      }
    },
    urlSiteStyle() {
      const num = Math.floor(this.sitesWidth / 150)
      const percent = (this.sitesWidth / num) / this.sitesWidth * 100
      return { width: percent - 0.001 + '%' }
    },
    urlItemDragOptions() {
      return {
        animation: 0,
        group: 'description',
        filter: '.url-box-add',
        disabled: !this.isDrag
      }
    },
    urlGroupDragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.isDrag || this.disableGroupDrag
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false
      }
    }
  },
  watch: {
    scroll: function() {
      // window.scrollTo(0, this.distance)
      const length = 30
      document.getElementById('urlList').scrollTop = this.distance !== length ? this.distance - 10 : 0
    },
    editType: {
      handler: function(newVal, oldVal) {
        this.popoverVisible = false
        this.siteDuplicateCheck()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.computeSitesWidth()
    window.addEventListener('resize', this.handleWindowResize, false)
  },
  updated() {
    // if (this.$refs.urlSites && this.$refs.urlSites[0]) {
    //   this.sitesWidth = this.$refs.urlSites[0].$el.offsetWidth
    // }
    this.computeSitesWidth()
  },
  destroyed() {
     window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleScroll() {
      this.scrollState = true
    },
    setGroupDrag(val) {
      this.disableGroupDrag = val
    },
    open(src) {
      const that = this
      clearTimeout(that.timer)
      const interval = this.isEdit ? 300 : 0
      that.timer = setTimeout(() => {
        try {
          window.open(this.addProtocol(src), '_blank')
        } catch (e) {
          this.$message.error({ message: '网址有错误，请修正！', center: true })
        }
      }, interval)
    },
    addProtocol(src) {
      const uri = URI.parse(src)
      if (!uri.protocol || uri.protocol === '') {
        // 浏览器对未加protocol协议的网址默认按照80端口http访问
        src = 'http://' + src
      }
      return src
    },
    handleWindowResize() {
      this.computeSitesWidth()
    },
    computeSitesWidth() {
      // if (this.$refs.urlSites && this.$refs.urlSites[0]) {
      //   this.sitesWidth = this.$refs.urlSites[0].$el.offsetWidth
      // }
      if (this.$refs.urlList) {
        this.sitesWidth = this.$refs.urlList.offsetWidth - 40
      }
    },
    groupChange(event) {
      if (event.removed) {
        this.$store.dispatch('url/setSearchTrigger')
      }
    },
    itemChange(event) {
      if (event.removed) {
        this.$store.dispatch('url/setSearchTrigger')
      }
    },
    curOverflowOver(event) {
      const el = event.target
      this.handleOverflowOver(el)
    },
    curOverflowLeave(event) {
      const el = event.target
      this.handleOverflowLeave(el)
    },
    handleOverflowOver(el) {
      const elLastChild = el.lastChild
      const elFirstChild = el.firstChild
      const curOverflow = elFirstChild.style.overflow
      if (!curOverflow || curOverflow === 'visible') {
        elFirstChild.style.overflow = 'hidden'
      }
      const isOverflowing = elFirstChild.clientWidth < elFirstChild.scrollWidth // || elFirstChild.clientHeight < elFirstChild.scrollHeight
      elFirstChild.style.overflow = curOverflow
      if (isOverflowing && elLastChild) {
        elLastChild.style.visibility = 'visible'
      }
    },
    handleOverflowLeave(el) {
      const elLastChild = el.lastChild
      if (elLastChild) {
        elLastChild.style.visibility = 'hidden'
      }
    },
    onMove({ relatedContext, draggedContext }) {
      // Add div 区域由于未设置任何数据，无法获取相关数据内容，若要使用这个函数，做好空判断
      // const relatedElement = relatedContext.element
      // const draggedElement = draggedContext.element
      // return (
      //   (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      // )
    },
    siteMove(evt) {
      this.relatedEl = evt.related
      this.draggedEl = evt.dragged
      this.draggedContext = evt.draggedContext
      this.relatedContext = evt.relatedContext
    },
    urlGroupDragEnd(event) {
      this.urlList = JSON.parse(JSON.stringify(this.urlList))
    },
    urlItemDragStart(event) {
      this.dragStartData = JSON.stringify(this.urlList)
    },
    checkElOverflowOver(el) {
      const curFontSize = el.style.fontSize
      el.style.fontSize = '110%'
      const elFirstChild = el.firstChild
      const curOverflow = elFirstChild.style.overflow
      if (!curOverflow || curOverflow === 'visible') {
        elFirstChild.style.overflow = 'hidden'
      }
      const isOverflowing = elFirstChild.clientWidth < elFirstChild.scrollWidth // || elFirstChild.clientHeight < elFirstChild.scrollHeight
      elFirstChild.style.overflow = curOverflow
      el.style.fontSize = curFontSize
      return isOverflowing
    },
    setElStyleVisible(el) {
      const elLastChild = el.lastChild
      elLastChild.style.visibility = 'visible'
    },
    urlItemDragEnd(event) {
      if (this.dragStartData !== JSON.stringify(this.urlList)) {
        if (this.checkElOverflowOver(this.draggedEl)) {
          this.setElStyleVisible(this.relatedEl)
        }
      } else if (this.dragStartData === JSON.stringify(this.urlList)) {
        if (this.checkElOverflowOver(this.draggedEl)) {
          this.setElStyleVisible(this.draggedEl)
        }
      }
      // ！！！注意end，add事项不会同时触发，但是remove等与end会同时触发，再做数据更新时要注意不要重复触发某些逻辑，不要复用函数
      this.urlList = JSON.parse(JSON.stringify(this.urlList))
    },
    handleGroupEdit(page, group) {
      this.editType.type = 'group'
      this.editType.pageId = page.id
      this.editType.groupId = group.id
      this.editType.title = group.title
      this.dialogVisible = true
    },
    handleSiteEdit(page, group, site) {
      clearTimeout(this.timer)
      this.editType.type = 'site'
      this.editType.pageId = page.id
      this.editType.groupId = group.id
      this.editType.siteId = site.id
      this.editType.title = site.title
      this.editType.url = site.url
      this.editType.tags = JSON.parse(JSON.stringify(site.tags))
      this.dialogVisible = true
      this.siteDuplicateCheck()
    },
    initEditType() {
      this.editType = {
        type: '',
        pageId: '',
        groupId: '',
        siteId: '',
        title: '',
        url: '',
        tags: []
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.popoverVisible = false
    },
    boforeClose(done) {
      this.popoverVisible = false
      done()
    },
    handleConfirm() {
      const type = this.editType.type
      const pageId = this.editType.pageId
      const groupId = this.editType.groupId
      const siteId = this.editType.siteId
      const title = this.editType.title
      const url = this.editType.url
      const tags = JSON.parse(JSON.stringify(this.editType.tags))
      if (type === 'group') {
        this.urlList.forEach((pageItem, pageIndex) => {
          if (pageItem.id === pageId) {
            pageItem.groups.forEach((groupItem, groupIndex) => {
              if (groupItem.id === groupId) {
                this.urlList[pageIndex].groups[groupIndex].title = title
              }
            })
          }
        })
      }
      if (type === 'site') {
        this.urlList.forEach((pageItem, pageIndex) => {
          if (pageItem.id === pageId) {
            pageItem.groups.forEach((groupItem, groupIndex) => {
              if (groupItem.id === groupId) {
                groupItem.sites.forEach((siteItem, siteIndex) => {
                  if (siteItem.id === siteId) {
                    this.urlList[pageIndex].groups[groupIndex].sites[siteIndex].title = title
                    this.urlList[pageIndex].groups[groupIndex].sites[siteIndex].url = url
                    this.urlList[pageIndex].groups[groupIndex].sites[siteIndex].tags = tags
                  }
                })
              }
            })
          }
        })
      }
      this.urlList = JSON.parse(JSON.stringify(this.urlList))
      this.dialogVisible = false
      this.initEditType()
    },
    handleUrlItemTagEdit() {
      this.isTagShow = true
    },
    addSite(page, group) {
      this.urlList.forEach((pageItem, pageIndex) => {
        if (pageItem.id === page.id) {
          this.urlList[pageIndex].groups.forEach((groupItem, groupIndex) => {
            if (groupItem.id === group.id) {
              this.urlList[pageIndex].groups[groupIndex].sites.push({
                id: this.generateSiteId(),
                title: '网站',
                url: '',
                tags: []
              })
            }
          })
        }
      })
      this.urlList = JSON.parse(JSON.stringify(this.urlList))
    },
    addGroup(page) {
      this.urlList.forEach((item, index) => {
        if (item.id === page.id) {
          this.urlList[index].groups.push({
            id: this.generateGroupId(),
            title: '小组',
            sites: []
          })
        }
      })
      this.urlList = JSON.parse(JSON.stringify(this.urlList))
    },
    generateGroupId() {
      const groupIds = []
      this.urlList.forEach((pageItem) => {
        pageItem.groups.forEach((groupItem) => {
          groupIds.push(groupItem.id)
        })
      })
      this.groupTransfer.forEach((item) => {
        groupIds.push(item.id)
      })
      let newId = -1
      if (groupIds.length === 0) {
        newId = 0
      } else {
        groupIds.sort((a, b) => {
          return a - b
        }).some((id, index) => {
          if (id !== index) {
            newId = index
            return true
          }
        })
        if (newId === -1) {
          newId = groupIds.length
        }
      }
      return newId
    },
    generateSiteId() {
      const siteIds = []
      this.urlList.forEach((pageItem) => {
        pageItem.groups.forEach((groupItem) => {
          groupItem.sites.forEach((siteItem) => {
            siteIds.push(siteItem.id)
          })
        })
      })
      this.siteTransfer.forEach((item) => {
        siteIds.push(item.id)
      })
      let newId = -1
      if (siteIds.length === 0) {
        newId = 0
      } else {
        siteIds.sort((a, b) => {
          return a - b
        }).some((id, index) => {
          if (id !== index) {
            newId = index
            return true
          }
        })
        if (newId === -1) {
          newId = siteIds.length
        }
      }
      return newId
    },
    itemTagStyle(tagId) {
      const style = {
        title: '',
        style: ''
      }
      this.urlTag.forEach((tag) => {
        if (tag.id === tagId) {
          style.title = tag.title
          style.color = tag.color
        }
      })
      return style
    },
    getUrlHostname(url) {
      return (new URI(this.addProtocol(url))).hostname()
    },
    siteDuplicateCheck: debounce(
      function() {
        const duplicateSite = []
        this.urlList.forEach((pageItem) => {
          pageItem.groups.forEach((groupItem) => {
            groupItem.sites.forEach((siteItem) => {
              const urlHostname = this.getUrlHostname(siteItem.url)
              const newUrlHostname = this.getUrlHostname(this.editType.url)
              if (urlHostname === newUrlHostname && siteItem.id !== this.editType.siteId) {
                duplicateSite.push({ page: pageItem.title, group: groupItem.title, site: siteItem.title, siteUrl: siteItem.url })
              }
            })
          })
        })

        this.duplicateSite = duplicateSite
        if (duplicateSite.length === 0) {
          this.popoverVisible = false
        } else {
          this.popoverVisible = true
        }
      },
      // 这是用户停止输入操作后所等待的毫秒数
      // 500毫秒之内，用户继续输入，则重新计时
      500
    )
  }
}
</script>

<style lang="scss" scoped>
  $urlItemDivPaddingLR: 1px;
  $urlItemDivBorder: 1px;
  $urlItemDivMarginLR: 1px;
  $urlItemColumnGutter: 50px;
  .container {
    padding-top: 6px;
    background: rgba(255,255,255,.85);
    border-radius: 6px;
  }
  .url-list {
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    & > div:first-child {
      margin-top: 0px!important;
    }
    &:hover {
      overflow-y: auto;
    }
    @include scrollBar;
  }
  .url-page {
    flex-shrink: 0;
    width: calc(100% - 40px);
    margin-left: 20px;
    min-height: 80px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    .url-page-title {
      box-sizing: content-box;
      width: calc(100% - 8px);
      margin: 0px 4px 10px 0px;
      height: 30px;
      border-radius: 4px;
      // display: block;
      // position: relative;
      // float: left;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      .title {
        height: 100%;
        margin: 0px 0px 0px 0px;
        width: 100px;
        padding: 4px;
        border-radius: 4px;
        // 字体设置
        text-decoration: none;
        line-height: 30px;
        font-size: 14px;
        font-size: 18px;
        letter-spacing: 2px;
        text-align: center;
        font-family: 'Microsoft Yahei', sans-serif;
        color: #474a4d;
        color: #336699;
        // color: #b45b3e;
        &::first-letter {
          // font-size: 20px;
          letter-spacing: 2px;
        }
      }
    }
  }
  .url-group-container {
    width: 100%;
    box-shadow: 1px 3px 6px 2px rgba(0,0,0,.08);
    // box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px 1px rgba(0,0,0,.08);
    border-radius: 6px;
    box-sizing: content-box;
  }
  .url-group {
    margin: 10px 20px;
    width: calc(100% - 60px);
    // box-shadow: 0 3px 8px 0 rgba(0,0,0,.08);
    // border-radius: 12px;
    box-sizing: content-box;
    padding: 0px 10px 0px 10px;
    .url-group-title {
      width: calc(100% - 8px);
      box-sizing: content-box;
      margin: 2px 4px;
      height: 20px;
      border-radius: 4px;
      display: block;
      position: relative;
      float: left;
      .title {
        height: 100%;
        padding: 4px;
        border-radius: 4px;
        // 字体设置
        text-decoration: none;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
        font-family: 'Microsoft Yahei', sans-serif;
        color: #b45b3e;
        // color: #336699;
      }
      .edit:hover {
        font-size: 100%;
        color: #ffffff;
        background-color: #474a4d;
        cursor: pointer;
      }
    }
  }
  .url-group-add {
    min-height: 45px;
    line-height: 45px;
    font-size: 16px;
    text-align: center;
    font-family: 'Microsoft Yahei', sans-serif;
    color: #474a4d;
    &:hover {
      font-size: 110%;
      color: #ffffff;
      background-color: #54585c;
      cursor: pointer;
    }
  }
  .url-sites {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    // justify-content: space-around;
  }
  .sortable-group {
    font-size: 14px;
    font-family: 'Microsoft Yahei', sans-serif;
    span { color: #ffffff; }
    a { color: #ffffff; }
    background-color: #565a5f;
    // background: rgba(255,255,255,.85);
    .tooltiptext {
      display: none!important;
    }
  }
  .sortable-site {
    background-color: #474a4d;
    a {
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
    box-sizing: border-box;
    border-radius: 4px;
    margin: 6px 0px;
    padding: 19px 16px 15px 16px;
    // height: 45px;
    height: 65px;
    // width: 110px;
    display: inline-block;
    position: relative;
    // 字体设置
    text-decoration: none;
    // line-height: 45px;
    line-height: 29px;
    font-size: 14px;
    text-align: center;
    font-family: 'Microsoft Yahei', sans-serif;
    color: #474a4d;
    // div内文字不溢出，溢出部分用...代替
    word-break: keep-all;
    white-space: nowrap;
    // overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      font-size: 110%;
      color: #ffffff;
      background-color: #474a4d;
    }
    // &:hover .tooltiptext {
    //   visibility: visible;
    //   position: absolute;
    // }
    .urlSiteText {
      // div内文字不溢出，溢出部分用...代替
      word-break: keep-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .url-site .tooltiptext {
    height: 40px !important;
    width: 600px;
    visibility: hidden;
    // visibility: visible;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    word-break: keep-all;
    white-space: nowrap;
    color: white;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: calc(100% + 10px);
    left: 50%;
    margin-left: -300px;
    a {
      // display: table-cell;
      vertical-align: middle;
      font-size: 14px!important;
      padding: 2px 15px;
      background-color: black;
      text-align: center;
      border-radius: 6px;
    }
  }

  .url-site .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    z-index: 1;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    opacity: 0;
  }
  .tag {
    width: 100%;
    min-height: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: flex-start;
  }
  .tag-list {
    width: calc(100% - 68px);
    min-height: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    white-space: nowrap;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    font-weight: 500;
    padding: 4px 6px;
    font-size: 14px;
    border-radius: 4px;
    .tag-item {
      margin: 0px 4px;
    }
  }
  .popover {
    & ::v-deep .el-popover {
      width: 320px!important;
    }
  }
  .unlock-edit-icon {
    color: #909399;
  }
  .lock-edit-icon {
    color: #F56C6C;
  }
</style>

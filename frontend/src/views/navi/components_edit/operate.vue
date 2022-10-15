
<template>
  <div v-show="showPanel" class="operate">
    <div class="lock">
      <svg-icon v-show="isLock" icon-class="lock" class-name="lock-icon" class="lock-1" @click="openLock" />
      <svg-icon v-show="!isLock && !isSave" icon-class="unlock" class-name="lock-icon" class="lock-2" @click="closeLock" />
      <el-tooltip :disabled="!isSave" class="item" effect="dark" content="请先保存或取消" placement="left">
        <svg-icon v-show="!isLock && isSave" icon-class="unlock" class="caret disabled" />
      </el-tooltip>
    </div>
    <div v-show="isAdmin && isVerified" slot="reference" class="button-popover">
      <router-link to="/navi/admin">
        <span><i class="el-icon-monitor caret" /></span>
      </router-link>
    </div>
    <div v-show="!popoverVisible && isVerified" slot="reference" class="button-popover" @click="popOver">
      <span><i class="el-icon-caret-top caret" /></span>
    </div>
    <div v-show="popoverVisible && isVerified" slot="reference" class="button-popover" @click="popOver">
      <span><i class="el-icon-caret-bottom caret" /></span>
    </div>
    <div v-if="popoverVisible" class="content box animated fadeInUp operate-button">
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="内容编辑" placement="left">
        <span><i :class="[isEdit ? activeClass : inactiveClass]" class="el-icon-edit" @click="setEdit" /></span>
      </el-tooltip>
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="导航设置" placement="left">
        <span><i :class="[isDrag ? activeClass : inactiveClass]" class="el-icon-notebook-2" @click="setDrag" /></span>
      </el-tooltip>
      <el-tooltip :disabled="disabled" class="item" effect="dark" content="搜索设置" placement="left">
        <span><i :class="[isSearch ? activeClass : inactiveClass]" class="el-icon-search" @click="setSearch" /></span>
      </el-tooltip>
      <el-popover v-model="confirmPopoverVisible" placement="left" width="160">
        <p>确定保存？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="confirmPopoverVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmSaveList()">确定</el-button>
        </div>
        <el-tooltip slot="reference" :disabled="disabled && !confirmPopoverVisible" class="item" effect="dark" content="保存" placement="left">
          <i :class="[isSave ? activeClass : inactiveClass]" class="el-icon-circle-check" />
        </el-tooltip>
      </el-popover>
      <el-popover v-model="cancelPopoverVisible" placement="left" width="160">
        <p>确定取消？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="cancelPopoverVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="cancelSaveUrl()">确定</el-button>
        </div>
        <el-tooltip slot="reference" :disabled="disabled && !cancelPopoverVisible" class="item" effect="dark" content="取消" placement="left">
          <i :class="[isSave ? activeClass : inactiveClass]" class="el-icon-circle-close" />
        </el-tooltip>
      </el-popover>
    </div>
    <div v-else class="content" />
    <el-dialog :visible="dialogVisible" width="400px" :append-to-body="true" :before-close="closeDialog">
      <!-- <div class="hidden-input"><input type="text" class="form-control"></div>
      <div class="hidden-input"><input type="password" class="form-control"></div> -->
      <el-input v-model="opcode" placeholder="请输入操作码" class="no-autofill-pwd">
        <template slot="prepend">操作码</template>
      </el-input>
      <div style="margin-top: 20px; width:100%;">
        <el-button type="primary" style="width: 100%" @click="verifyOpcode">验&nbsp;&nbsp;&nbsp;&nbsp;证</el-button>
        <p>提示: 操作码初始为空，可在设置中修改</p>
      </div>
    </el-dialog>
    <!-- <tag :show.sync="isTag" /> -->
  </div>
</template>

<script>
// import draggable from 'vuedraggable'
// import tag from './tag'
import { verifyOpcode, clearOpcode } from '@/api/user'
export default {
  // components: {
  //   tag
  // },
  data() {
    return {
      popoverVisible: false,
      activeClass: 'active',
      inactiveClass: 'inactive',
      timer: null,
      disabled: true,
      // isTag: false,
      // isLock: true,
      confirmPopoverVisible: false,
      cancelPopoverVisible: false,
      operatetime: 0,
      dialogVisible: false,
      opcode: '',
      isVerified: false
    }
  },
  computed: {
    urlList: {
      get() {
        return this.$store.state.url.list
      },
      set(val) {
        this.$store.dispatch('url/setList', JSON.stringify(val))
      }
    },
    urlOldList: {
      get() {
        return this.$store.state.url.oldList
      }
    },
    urlTag: {
      get() {
        return this.$store.state.url.tag
      }
    },
    urlOldTag: {
      get() {
        return this.$store.state.url.oldTag
      }
    },
    urlUpdatetime() {
      return this.$store.state.url.updatetime
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
    pageIndex: {
      get() {
        return this.position
      },
      set(val) {
        this.$emit('update:position', val)
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
    isActive() {
      return this.$store.state.url.active
    },
    isSearch: {
      get() {
        return this.$store.state.operate.search
      },
      set(val) {
        this.$store.dispatch('operate/setSearch', val)
      }
    },
    isCurrentTmp() {
      return this.$store.state.url.tmp
    },
    isOperate() {
      return this.isEdit || this.isDrag || this.isSearch
    },
    isSave() {
      return this.isEdit || this.isDrag || this.isSearch
    },
    step() {
        return this.$store.state.scroll.step
    },
    showPanel() {
      return this.$store.state.scroll.NAV === this.step
    },
    isAdmin() {
      return this.$store.state.user.role >= 3
    }
  },
  watch: {
    isOperate(newVal) {
      console.log(newVal)
    },
    dialogVisible(newVal, oldVal) {
      if (!oldVal) {
        this.opcode = ''
      }
    }
  },
  created() {
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    getUpdateTime() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('url/getUrlUpdateTime').then(res => {
          if (res.code === 20000 && res.data.updatetime === this.urlUpdatetime) {
            resolve(res)
          } else {
            this.$message.warning({ message: '当前网页数据与服务器不一致，请先刷新页面', center: true })
            resolve(null)
          }
        }).catch(error => {
          console.log(error)
          reject(null)
        })
      })
    },
    popOver() {
      this.popoverVisible = !this.popoverVisible
      // 500时间要与动画一致
      if (this.popoverVisible) {
        this.timer = setTimeout(() => { this.disabled = false }, 500)
      } else {
        window.clearTimeout(this.timer)
        this.disabled = true
      }
    },
    async setDrag() {
      const interval = new Date().getTime() - this.operatetime
      if (this.isDrag === false && interval >= 10 * 60 * 1000) {
        const res = await this.getUpdateTime()
        if (res.data.updatetime === this.urlUpdatetime) {
          this.isDrag = !this.isDrag
          this.operatetime = new Date().getTime()
        }
      } else {
        this.isDrag = !this.isDrag
      }
    },
    async setEdit() {
      const interval = new Date().getTime() - this.operatetime
      if (this.isDrag === false && interval >= 10 * 60 * 1000) {
        const res = await this.getUpdateTime()
        if (res && res.data.updatetime === this.urlUpdatetime) {
          this.isEdit = !this.isEdit
          this.operatetime = new Date().getTime()
        }
      } else {
        this.isEdit = !this.isEdit
      }
    },
    setSearch() {
      this.isSearch = !this.isSearch
    },
    async confirmSaveList() {
      const res = await this.getUpdateTime()
      if (res && res.data.updatetime === this.urlUpdatetime) {
        this.$store.dispatch('url/saveUrl').then(() => {
          this.$message.success('保存成功')
          this.isEdit = false
          this.isDrag = false
          this.isSearch = false
          this.confirmPopoverVisible = false
        }).catch((e) => {
          console.log(e)
          this.$message.error('保存失败')
        })
      }
    },
  cancelSaveUrl() {
      this.$store.dispatch('url/cancelSaveUrl')
      this.isEdit = false
      this.isDrag = false
      this.isSearch = false
      this.cancelPopoverVisible = false
    },
    setTag() {
      this.isTag = !this.isTag
    },
    openLock() {
      // this.isLock = false
      if (this.isCurrentTmp) {
        this.isVerified = true
        this.dialogVisible = false
        this.isLock = false
      } else {
        this.isVerified = false
        this.dialogVisible = true
      }
    },
    async closeLock() {
      try {
        await clearOpcode()
        this.isLock = true
        this.isVerified = false
        this.popoverVisible = false
        if (!this.isCurrentTmp) {
          this.$store.dispatch('url/getUrl', { opcode: '' })
        }
      } catch(error) {

      }
    },
    async verifyOpcode() {
      try {
        await verifyOpcode({ opcode: this.opcode })
        // 用户状态编辑，数据要重新获取
        if (!this.isCurrentTmp) {
          this.isLock = false
          await this.$store.dispatch('url/getUrl', { opcode: this.opcode })
        }
        this.isLock = false
        this.dialogVisible = false
        this.isVerified = true
      } catch (error) {
        this.$message.error('验证失败！')
      }
    },
    closeDialog(done) {
      this.dialogVisible = !this.dialogVisible
      this.isLock = true
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
.operate {
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.operate-button {
  // background: rgba(255,255,255,.7);
  background: rgba(0,0,0,.5);
  border-radius: 4px;
  // padding: 15px;
}
.button-popover {
  // background: rgba(255,255,255,.7);
  margin: 10px 0px 10px 0px;
  background: rgba(0,0,0,.5);
  border-radius: 4px;
  height: 50px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  span {
    margin: auto;
  }
  a {
    margin: auto;
  }
}
.content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 20px auto;
  width: 100%;
  height: 280px;
  overflow: auto;
  span {
    margin: auto;
  }
  i {
    margin: auto;
    // width: 100%;
    height: 24px;
    font-weight: 400;
    font-size: 24px;
    // &:hover {
    //   color: rgba(0, 0, 0, 0.6);
    // }
  }
}
.inactive {
  &:hover {
    color: rgba(255, 255, 255, 0.75);
  }
}
.active {
  &:hover {
    font-size: 28px;
  }
}
.lock {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 20px;
  margin-left: 15px;
  width: 100%;
  height: 60px;
  font-size: 28px;
  &:hover {
    cursor: pointer;
    color: #1088A3;
  }
  .lock-1 {
    color: #1088A3;
  }
  .lock-2 {
    color: #1088A3;
  }
}
.active {
  color: #1088A3;
}
.inactive {
  color: #909399;
}
.hidden {
  visibility: hidden;
}
.show {
  visibility: visible;
}
.caret {
  font-weight: 400;
  font-size: 30px;
  color: #1088A3;
}
.disabled {
  color: #909399;
}
.hidden-input{
  position: relative;
  width: 0;
  height: 0;
  overflow: hidden;
}
/*让input看不见，而不是直接display: none，如果直接display: none，则不生效*/
.hidden-input .form-control{
  position: absolute;
  left: -1000px;
}

.no-autofill-pwd {
  ::v-deep .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>

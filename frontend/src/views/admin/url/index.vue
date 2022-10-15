<template>
  <div class="container">
    <el-tabs v-model="activeName" type="border-card" class="tabs">
      <el-tab-pane label="搜索" name="first">
        <div class="option">
          <inputCustom v-model="query.mark" name="备注" />
          <booleanSelect v-model="query.publish" name="是否发布" />
          <el-button type="primary" class="c-button" @click="search">搜索</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="编辑" name="second">
        <div class="operate">
          <el-button type="warning" class="c-button" @click="edit">编辑</el-button>
          <el-button type="primary" class="c-button" @click="setPublished">发布</el-button>
          <el-button type="success" class="c-button" @click="create">新建</el-button>
          <el-button type="success" class="c-button" @click="copy">复制</el-button>
          <el-button type="danger" class="c-button" @click="remove">删除</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Raw" name="third">
        <div class="operate">
          <el-button type="warning" class="c-button" @click="editRaw">编辑原始数据</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="table">
      <el-table :data="tableData" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed label="序号" type="index" width="120" :index="indexMethod" />
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="createtime" label="createtime" width="200">
          <template slot-scope="scope">
            {{ formatDate(parseInt(scope.row.createtime)) }}
          </template>
        </el-table-column>
        <el-table-column prop="publishtime" label="publishtime" width="200">
          <template slot-scope="scope">
            {{ formatDate(parseInt(scope.row.publishtime)) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatetime" label="updatetime" width="200">
          <template slot-scope="scope">
            {{ formatDate(parseInt(scope.row.updatetime)) }}
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="mark" width="200" />
        <el-table-column prop="tmp" label="tmp" width="120">
          <template slot-scope="scope">
            {{ scope.row.tmp ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="publish" label="publish" width="120">
          <template slot-scope="scope">
            {{ scope.row.publish ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="user_id" label="user_id" width="120" />
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        :current-page="parseInt(meta.currentPage)"
        :page-sizes="[15, 30, 45, 500]"
        :page-size="parseInt(meta.itemsPerPage)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="meta.totalItems"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" append-to-body>
      <span>list</span>
      <el-input v-model="urldetail.list" type="textarea" autosize placeholder="请输入内容" class="list-input" />
      <span>tag</span>
      <el-input v-model="urldetail.tag" type="textarea" autosize placeholder="请输入内容" class="tag-input" />
      <span>group_transfer</span>
      <el-input v-model="urldetail.group_transfer" type="textarea" autosize placeholder="请输入内容" class="transfer-input" />
      <span>site_transfer</span>
      <el-input v-model="urldetail.site_transfer" type="textarea" autosize placeholder="请输入内容" class="transfer-input" />
      <span>search_site</span>
      <el-input v-model="urldetail.search_site" type="textarea" autosize placeholder="请输入内容" class="list-input" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUrl">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUrlList, createUrlTmp, setUrlTmpPusblish, copyUrlTmp, removeUrlTmp, saveUrl, getUrldetail } from '@/api/admin/url'

import inputCustom from '../components/inputCustom'
import booleanSelect from '../components/booleanSelect'
export default {
  components: { inputCustom, booleanSelect },
  data() {
    return {
      tableData: [],
      multSelection: [],
      downloadLoading: false,
      number: 100,
      meta: {
        totalItems: 1500,
        itemCount: 15,
        itemsPerPage: 15,
        totalPages: 100,
        currentPage: 1
      },
      query: {
        page: 1,
        limit: 15,
        sorttype: 'ASC',
        mark: null,
        publish: null
      },
      urldetail: {
        id: -1,
        list: '[]',
        tag: '[]',
        group_transfer: '[]',
        site_transfer: '[]',
        search_site: '[]'
      },
      activeName: 'first',
      dialogVisible: false
    }
  },
  computed: {
  },
  mounted() {
    this.getUrlList()
  },
  methods: {
    search() {
      this.query.page = 1
      this.getUrlList()
    },
    async edit() {
      if (this.multSelection.length !== 1) {
        this.$message({
          message: '请确保仅且选择一条记录',
          type: 'info'
        })
      } else {
        const urltmpId = this.multSelection[0].id
        const tmp = this.multSelection[0].tmp
        if (tmp) {
          try {
            this.$store.dispatch('url/getUrlTmpdetail', { id: urltmpId })
            this.$router.push('/navi')
          } catch (error) {
            console.log(error)
            this.$message.error('获取网址信息失败')
          }
        } else {
          this.$message.error('请勿编辑用户资料!')
        }
      }
    },
    async setPublished() {
      if (this.multSelection.length !== 1) {
        this.$message({
          message: '请确保仅且选择一条记录',
          type: 'info'
        })
      } else {
        const urltmpId = this.multSelection[0].id
        try {
          await setUrlTmpPusblish({ id: urltmpId })
          this.getUrlList()
        } catch (error) {
          console.log(error)
        }
      }
    },
    async create() {
      try {
        await createUrlTmp()
        this.search()
      } catch (error) {
        console.log(error)
      }
    },
    async copy() {
      if (this.multSelection.length !== 1) {
        this.$message({
          message: '请确保仅且选择一条记录',
          type: 'info'
        })
      } else {
        const utltmpId = this.multSelection[0].id
        try {
          await copyUrlTmp({ id: utltmpId })
          this.search()
        } catch (error) {
          console.log(error)
        }
      }
    },
    async remove() {
      if (this.multSelection.length !== 1) {
        this.$message({
          message: '请确保仅且选择一条记录',
          type: 'info'
        })
      } else {
        const utltmpId = this.multSelection[0].id
        try {
          await removeUrlTmp({ id: utltmpId })
          this.search()
        } catch (error) {
          console.log(error)
        }
      }
    },
    async editRaw() {
      if (this.multSelection.length !== 1) {
        this.$message({
          message: '请确保仅且选择一条记录',
          type: 'info'
        })
      } else {
        const utltmpId = this.multSelection[0].id
        try {
          const res = await getUrldetail({ id: utltmpId })
          this.urldetail.id = res.data.id
          this.urldetail.list = res.data.list
          this.urldetail.tag = res.data.tag
          this.urldetail.group_transfer = res.data.group_transfer
          this.urldetail.site_transfer = res.data.site_transfer
          this.urldetail.search_site = res.data.search_site
          this.dialogVisible = true
        } catch (error) {
          console.log(error)
        }
      }
    },
    async saveUrl() {
      try {
        await saveUrl(this.urldetail)
        this.dialogVisible = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
      }
    },
    handleSizeChange(limit) {
      this.query.limit = limit
      this.query.page = 1
      this.getUrlList()
    },
    handleCurrentChange(page) {
      this.query.page = page
      this.getUrlList()
    },
    handleSelectionChange(val) {
      this.multSelection = val
    },
    formatDate(createtime) {
      const time = new Date(createtime)
      const year = time.getFullYear()
      const month = time.getMonth() + 1
      const day = time.getDate()
      const hour = time.getHours()
      const minute = time.getMinutes()
      const second = time.getSeconds()
      const date = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second
      return date
    },
    indexMethod(index) {
      return (parseInt(this.meta.currentPage) - 1) * parseInt(this.meta.itemsPerPage) + index + 1
    },
    async getUrlList() {
      try {
        const res = await getUrlList(this.query)
        this.tableData = res.data.items
        this.meta = { ...res.data.meta }
      } catch (error) {
        console.log(error)
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  margin: 20px;
  width: calc(100% - 40px);
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tabs {
  width: 100%;
  height: 110px;
  flex-grow: 0;
  & ::v-deep .el-tab-pane {
    width: 100%;
    height: 50px!important;
    overflow-x: auto;
    overflow-y: hidden;
  }
  // overflow: auto;
}
.option {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.operate {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.table {
  width: 100%;
  height: 20px;
  flex-grow: 1;
}
.table ::v-deep .el-table .el-table__body-wrapper {
  @include scrollBar;
}
.pagination {
  width: 100%;
  height: 32px;
  flex-grow: 0;
  display: flex;
  & ::v-deep .el-pagination {
    margin: 0 auto;
  }
}
.list-input {
  max-height: 200px;
  resize: none;
  overflow: auto;
}
.tag-input {
  max-height: 200px;
  resize: none;
  overflow: auto;
}
.transfer-input {
  max-height: 120px;
  resize: none;
  overflow: auto;
}
.c-button {
  height: 40px!important;
  margin-left: 4px;
  margin-right: 4px;
}
</style>

<template>
  <div class="website">
    <div class="tabs">
      <el-form :inline="true" :model="formInline" class="operate">
        <el-form-item label="">
          <el-input v-model="formInline.content" placeholder="输入搜索内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" height="100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="序号" type="index" width="100" :index="indexMethod" />
        <!-- <el-table-column prop="id" label="id" width="100" /> -->
        <el-table-column prop="url" label="网址" width="200" />
        <el-table-column prop="rank" label="Rank" width="100" />
        <!-- <el-table-column prop="createtime" label="录入时间" width="170">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createtime) }}
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-if="isVip"
        :total="meta.totalItems"
        :current-page="parseInt(meta.currentPage)"
        :page-sizes="[15, 30, 45, 500]"
        :page-size="parseInt(meta.itemsPerPage)"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-pagination
        v-else
        :total="meta.totalItems"
        :current-page="parseInt(meta.currentPage)"
        :page-sizes="[15, 30, 45, 200]"
        :page-size="parseInt(meta.itemsPerPage)"
        layout="total, sizes, prev, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getWebsiteList } from '@/api/website'
const URI = require('urijs')
export default {
  data() {
    return {
      formInline: {
        content: ''
      },
      tableData: [],
      multSelection: [],
      downloadLoading: false,
      number: 100,
      meta: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: 0,
        totalPages: 0,
        currentPage: 1
      },
      query: {
        page: 1,
        limit: 15,
        sorttype: 'DESC',
        like: null
      },
      activeName: 'first'
    }
  },
  computed: {
    isVip() {
      return this.$store.state.user.role >= 2
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
    },
    search() {
      this.query.page = 1
      this.query.like = this.formInline.content
      this.getWebsiteList()
    },
    add() {

    },
    handleSizeChange(limit) {
      this.query.limit = limit
      this.query.page = 1
      this.getWebsiteList()
    },
    handleCurrentChange(page) {
      this.query.page = page
      this.getWebsiteList()
    },
    handleSelectionChange(val) {
      this.multSelection = val
    },
    indexMethod(index) {
      return (parseInt(this.meta.currentPage) - 1) * parseInt(this.meta.itemsPerPage) + index + 1
    },
    async getWebsiteList() {
      try {
        const res = await getWebsiteList(this.query)
        this.tableData = []
        res.data.items.forEach((item) => {
          const data = { ...item }
          data.status = false
          this.tableData.push(data)
        })
        this.meta = { ...res.data.meta }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.website {
  display: flex;
  flex-direction: column;
}

.tabs {
  width: 100%;
  height: 60px;
  flex-grow: 0;
  overflow: auto;
  @include scrollBar;
}

.operate {
  // width: 100%;
  height: 100%;
  display: inline-block;
  // overflow: auto;
  display: flex;
  & > div {
    flex-shrink: 0;
  }
}
.table {
  width: 100%;
  height: 20px;
  flex-grow: 1;
  margin: 0px;
}
.table ::v-deep .el-table .el-table__body-wrapper {
  @include scrollBar;
}
// .table ::v-deep .el-table {
//   background: rgba(255,255,255, 0)!important;
//   // opacity: 0;
// }
// .table ::v-deep tr {
//   background: rgba(255,255,255, 0)!important;
// }
// .table ::v-deep th {
//   background: rgba(255,255,255, 0)!important;
// }
// .table ::v-deep .el-table {
//   background: rgba(255,255,255, 0)!important;
//   & * {
//     background: rgba(255,255,255, 0)!important;
//   }
// }
.pagination {
  width: 100%;
  height: 40px;
  flex-grow: 0;
  display: flex;

  & ::v-deep .el-pagination {
    width: 100%;
    overflow: auto;
    @include scrollBar;
  }
}
</style>

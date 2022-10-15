<template>
  <div class="container">
    <el-tabs v-model="activeName" type="border-card" class="tabs">
      <el-tab-pane label="搜索" name="first">
        <div class="option">
          <inputCustom v-model="query.email" name="邮箱" />
          <el-button type="primary" class="c-button" @click="search">搜索</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="编辑" name="second">
        <div class="operate" />
      </el-tab-pane>
    </el-tabs>
    <div class="table">
      <el-table :data="tableData" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed label="序号" type="index" width="100" :index="indexMethod" />
        <el-table-column fixed prop="id" label="id" width="100" />
        <el-table-column fixed prop="email" label="email" width="200" />
        <el-table-column prop="emailToken" label="emailToken" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.emailToken }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="trytimes" label="trytimes" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.trytimes }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="createtime" label="createtime" width="170">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createtime) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        :total="meta.totalItems"
        :current-page="parseInt(meta.currentPage)"
        :page-sizes="[15, 30, 45, 500]"
        :page-size="parseInt(meta.itemsPerPage)"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { getEmailTokenList } from '@/api/admin/emailToken'
import inputCustom from '../components/inputCustom'

export default {
  components: { inputCustom },
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
        email: null,
        vip: null,
        active: null
      },
      activeName: 'first'
    }
  },
  computed: {
  },
  mounted() {
    this.getEmailTokenList()
  },
  methods: {
    search() {
      this.query.page = 1
      this.getEmailTokenList()
    },
    dateToTime(index, row) {
      this.tableData[index].vip_expiretime = new Date(row.vip_expiretime).getTime()
    },
    handleSizeChange(limit) {
      this.query.limit = limit
      this.query.page = 1
      this.getEmailTokenList()
    },
    handleCurrentChange(page) {
      this.query.page = page
      this.getEmailTokenList()
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
    async getEmailTokenList() {
      try {
        const res = await getEmailTokenList(this.query)
        this.tableData = res.data.items
        this.meta = { ...res.data.meta }
      } catch (error) {
        console.log(error)
      }
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
.c-button {
  height: 40px!important;
  margin-left: 4px;
  margin-right: 4px;
}
</style>

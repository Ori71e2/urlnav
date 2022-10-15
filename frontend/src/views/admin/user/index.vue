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
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="email" label="email" width="200" />
        <el-table-column prop="createtime" label="createtime" width="170">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createtime) }}
          </template>
        </el-table-column>
        <el-table-column prop="vip" label="vip" width="80">
          <template slot-scope="scope">
            {{ scope.row.vip_expiretime >= new Date().getTime() ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column fixed prop="vip_expiretime" label="vip_expiretime" width="170">
          <template slot-scope="scope">
            <el-date-picker v-if="scope.row.status" v-model="scope.row.vip_expiretime" type="datetime" placeholder="选择日期" @change="dateToTime(scope.$index, scope.row)" />
            <span v-else>{{ formatDate(scope.row.vip_expiretime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="active" label="active" width="120">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.status" v-model="scope.row.active" active-text="是" inactive-text="否" />
            <span v-else>{{ scope.row.active ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="role" width="140">
          <template slot-scope="scope">
            <roleSelect v-if="scope.row.status" v-model="scope.row.role" />
            <span v-else>{{ roleToText(scope.row.role) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleSave(scope.$index, scope.row)">保存</el-button>
            <el-button size="mini" type="primary" @click="cancleEdit(scope.$index, scope.row)">取消</el-button>
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
import { getUserList, saveUser } from '@/api/admin/user'
import inputCustom from '../components/inputCustom'
import roleSelect from '../components/roleSelect'

export default {
  components: { inputCustom, roleSelect },
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
        email: null
      },
      activeName: 'first'
    }
  },
  computed: {
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    search() {
      this.query.page = 1
      this.getUserList()
    },
    handleEdit(index, row) {
      this.tableData[index].status = true
    },
    handleSave(index, row) {
      const user = this.tableData[index]
      saveUser(user).then(res => {
        if (res.code === 20000) {
          this.getUserList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    cancleEdit() {
      this.getUserList()
    },
    dateToTime(index, row) {
      this.tableData[index].vip_expiretime = new Date(row.vip_expiretime).getTime()
    },
    roleToText(role) {
      const roles = ['HUMAN', 'REGISTER', 'VIP', 'DEVELOP', 'ADMIN', 'SUPER_ADMIN']
      return roles[role]
    },
    handleSizeChange(limit) {
      this.query.limit = limit
      this.query.page = 1
      this.getUserList()
    },
    handleCurrentChange(page) {
      this.query.page = page
      this.getUserList()
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
    async getUserList() {
      try {
        const res = await getUserList(this.query)
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

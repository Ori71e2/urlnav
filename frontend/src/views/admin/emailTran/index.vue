<template>
  <div class="container">
    <el-tabs v-model="activeName" type="border-card" class="tabs">
      <el-tab-pane label="搜索" name="first">
        <div class="option">
          <inputCustom v-model="query.email" name="HOST" />
          <el-button type="primary" class="c-button" @click="search">搜索</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="编辑" name="second">
        <div class="operate">
          <el-button type="success" class="c-button" @click="create">新建</el-button>
          <el-button type="primary" class="c-button" @click="setActived">激活</el-button>
          <el-button type="info" class="c-button" @click="setInactived">取消激活</el-button>
          <el-button type="danger" class="c-button" @click="remove">删除</el-button>
          <el-button type="warning" class="c-button" @click="test">测试</el-button>
          <inputCustom v-model="testEmailReceiver" name="测试邮箱" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="table">
      <el-table :data="tableData" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed label="序号" type="index" width="100" :index="indexMethod" />
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="name" label="name" width="200">
          <template slot-scope="scope">
            <el-input v-if="scope.row.status" v-model="scope.row.name" />
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="host" label="host" width="200">
          <template slot-scope="scope">
            <el-input v-if="scope.row.status" v-model="scope.row.host" />
            <span v-else>{{ scope.row.host }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="port" label="port" width="200">
          <template slot-scope="scope">
            <el-input v-if="scope.row.status" v-model="scope.row.port" />
            <span v-else>{{ scope.row.port }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user" label="user" width="200">
          <template slot-scope="scope">
            <el-input v-if="scope.row.status" v-model="scope.row.user" />
            <span v-else>{{ scope.row.user }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pass" label="pass" width="200">
          <template slot-scope="scope">
            <el-input v-if="scope.row.status" v-model="scope.row.pass" />
            <span v-else>{{ scope.row.pass }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="active" label="active" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.active ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="createtime" width="170">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createtime) }}
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
    <el-dialog
      title="新建"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Host">
          <el-input v-model="form.host" />
        </el-form-item>
        <el-form-item label="Port">
          <el-input v-model.number="form.port" />
        </el-form-item>
        <el-form-item label="User">
          <el-input v-model="form.user" />
        </el-form-item>
        <el-form-item label="Pass">
          <el-input v-model="form.pass" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getEmailTranList, emailTranTest, createEmailTran, setEmailTranActived, setEmailTranInactived, deleteEmailTran, saveEmailTran } from '@/api/admin/emailTran'
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
        email: null
      },
      form: {
        name: '',
        host: '',
        port: '',
        user: '',
        pass: ''
      },
      testEmailReceiver: '',
      activeName: 'first',
      dialogVisible: false
    }
  },
  computed: {
  },
  mounted() {
    this.getEmailTranList()
  },
  methods: {
    async getEmailTranList() {
      try {
        const res = await getEmailTranList(this.query)
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
    },
    async create() {
      this.dialogVisible = true
    },
    async onSubmit() {
      try {
        await createEmailTran(this.form)
        this.getEmailTranList()
        this.dialogVisible = false
        this.form.name = ''
        this.form.host = ''
        this.form.port = ''
        this.form.user = ''
        this.form.pass = ''
      } catch (error) {
        console.log(error)
      }
    },
    async test() {
      if (this.testEmailReceiver.length === 0) {
        this.$message({
          message: '请先输入测试邮件收件邮箱',
          type: 'info'
        })
      } else {
        if (this.multSelection.length !== 1) {
          this.$message({
            message: '请确保仅且选择一条记录',
            type: 'info'
          })
        } else {
          const emailTranId = this.multSelection[0].id
          try {
            await emailTranTest({ id: emailTranId, 'testEmailReceiver': this.testEmailReceiver })
          } catch (error) {
            console.log(error)
          }
        }
      }
    },
    async setActived() {
      if (this.multSelection.length !== 1) {
        this.$message({
          message: '请确保仅且选择一条记录',
          type: 'info'
        })
      } else {
        const emailTranId = this.multSelection[0].id
        try {
          await setEmailTranActived({ id: emailTranId })
          this.getEmailTranList()
        } catch (error) {
          console.log(error)
        }
      }
    },
    async setInactived() {
      if (this.multSelection.length !== 1) {
        this.$message({
          message: '请确保仅且选择一条记录',
          type: 'info'
        })
      } else {
        const emailTranId = this.multSelection[0].id
        try {
          await setEmailTranInactived({ id: emailTranId })
          this.getEmailTranList()
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
        const emailTranId = this.multSelection[0].id
        try {
          await deleteEmailTran({ id: emailTranId })
          this.getEmailTranList()
        } catch (error) {
          console.log(error)
        }
      }
    },
    search() {
      this.query.page = 1
      this.getEmailTranList()
    },
    handleEdit(index, row) {
      this.tableData[index].status = true
    },
    async handleSave(index, row) {
      const emailTran = this.tableData[index]
      try {
        await saveEmailTran(emailTran)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getEmailTranList()
      } catch (error) {
        console.log(error)
      }
    },
    cancleEdit() {
      this.getEmailTranList()
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
      this.getEmailTranList()
    },
    handleCurrentChange(page) {
      this.query.page = page
      this.getEmailTranList()
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
.c-button {
  height: 40px!important;
  margin-left: 4px;
  margin-right: 4px;
}
</style>

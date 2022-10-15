<template>
  <div id="config">
    <el-form id="toolbar" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchForm.order_number" placeholder="请输入订单编号" @keyup.enter.native="find" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchant_number" type="text" placeholder="请输入商户编号" @keyup.enter.native="find" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchant_name" type="text" placeholder="请输入商户名称" @keyup.enter.native="find" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="请选择订单状态">
          <el-option label="未发" value="1" />
          <el-option label="已发未完" value="2" />
          <el-option label="已发完" value="3" />
        </el-select>

      </el-form-item>
      <el-form-item>
        <el-button plain @click="find()">查询</el-button>
        <el-button type="info" plain @click="findReset()">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="datagrid">
      <div v-permission="['orders.store']" class="toolbar">
        <el-row>
          <el-col :span="6">
            <el-button v-permission="['orders.store']" plain icon="el-icon-plus" @click="add()">添加订单信息</el-button>
          </el-col>
          <el-col :span="18">
            <p class="tips" v-html="summary" />
          </el-col>
        </el-row>
        <el-alert
          title="通过v-permission指令，在普通用户角色下，订单的删除按钮被删除，因为普通用户没有删除操作的权限，请注意查看前端代码的书写格式"
          type="error"
        />
      </div>
      <!-- 信息表 -->
      <el-table
        v-contextmenu:contextmenu
        v-loading="loading"
        size="mini"
        :data="tableData"
        :row-class-name="tableRowClassName"
        :row-style="selectedHighlight"
        border
        @row-contextmenu="contextHandle"
        @row-dblclick="dblHandle"
        @row-click="rowHandle"
        @select-all="selectChange"
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="订单编号" prop="order_number" width="150" />
        <el-table-column label="商户编号" prop="merchant_number" width="150" />
        <el-table-column label="商户名称" prop="merchant_name" width="200" />
        <el-table-column label="购买时间" width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.order_time|filterOrderTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===3" type="success">{{ scope.row.status|filterStatus }}</el-tag>
            <el-tag v-if="scope.row.status===1" type="danger">{{ scope.row.status|filterStatus }}</el-tag>
            <el-tag v-if="scope.row.status===2" type="info">{{ scope.row.status|filterStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="100" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="right-end" effect="light">
              <el-button v-permission="['orders.show']" plain icon="el-icon-edit" type="primary" size="small" @click="edit(scope.row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="right-end" effect="light">
              <el-button v-permission="['orders.destory']" plain icon="el-icon-delete" type="danger" size="small" @click="del(scope.row,'删除订单，将删除订单对应的所有产品和包裹信息，是否继续')" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row class="page">
        <el-col :span="2" :offset="1">
        <!-- <el-button type="danger" plain @click="delAll()">删除选择</el-button> -->
        </el-col>
        <el-col :span="20">
          <el-pagination background :current-page.sync="current_page" :page-sizes="[10,20,25,50]" layout="total,sizes,prev, pager, next" :page-size.sync="pageSize" :total="total" @current-change="pagination" @size-change="sizeChange" />
        </el-col>
      </el-row>
    </div>

    <el-dialog title="订单管理" center :visible.sync="editDialogFormVisible" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单编号" prop="order_number">
              <el-input v-model="form.order_number" :disabled="isEdit===true" placeholder="请输入订单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户编号" prop="merchant_number">
              <el-input v-model="form.merchant_number" placeholder="请输入商户编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户名称">
              <el-input v-model="form.merchant_name" placeholder="请输入商户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单日期">
              <el-date-picker
                v-model="form.order_time"
                type="datetime"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="add">新增订单</v-contextmenu-item>
      <v-contextmenu-item :divider="true" />
      <v-contextmenu-item @click="editMenuHandle">修改订单</v-contextmenu-item>
      <v-contextmenu-item @click="deleteHandle">删除定单</v-contextmenu-item>
      <v-contextmenu-item :divider="true" />
    </v-contextmenu>

  </div>
</template>

<script>
import CURD from '@/minix/curd'
import UPLOAD from '@/minix/upload'
import {
  getInfo,
  getInfoById,
  updateInfo,
  addInfo,
  deleteInfoById,
  deleteAll,
  getSummaryById
} from '@/api/order'

import {
  Model,
  SearchModel,
  Rules
} from '@/model/order'
import {
  config
} from '@/config/index'
import {
  Tools
} from '@/views/utils/Tools'

export default {
  name: 'OrderIndex',
  filters: {
    filterOrderTime(value) {
      const tempDate = new Date(value)
      return tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds()
    },
    filterStatus(value) {
      const status = ['', '未发', '已发未完', '已发完']
      return status[value]
    }
  },
  mixins: [CURD],
  data() {
    return {
      searchForm: new SearchModel(),
      form: new Model(),
      rules: Rules,
      searchModel: SearchModel,
      model: Model,
      tools: Tools,
      showMenu: false,
      curd: {
        getInfo: getInfo || function() {},
        getInfoById: getInfoById || function() {},
        updateInfo: updateInfo || function() {},
        addInfo: addInfo || function() {},
        deleteInfoById: deleteInfoById || function() {},
        deleteAll: deleteAll || function() {}
      },
      searchSelect: 'order_number',
      searchContent: '',
      types: ['无'],
      templateFile: config.site + '/xls/config.xlsx',
      goods: [],
      getIndex: null,
      editDialogFormVisible: false,
      currentRecord: null,
        product_count: 0,
        sum_amount: 0,
        sum_remain: 0
      // item: new Single()
    }
  },
  computed: {
    summary() {
      if (this.product_count) {
        return `当前订单有产品 <span>${this.product_count} </span>类,  合计 <span>${this.sum_amount} </span>件商品,  已经发送 <span>${this.sum_amount - this.sum_remain} </span>件,  还剩<span>${this.sum_remain}</span>件未发送`
      } else {
        return ''
      }
    }
  },

  created() {
    this.fetchData()
  },
  methods: {
    showContent(id) {
      this.$router.push({ path: '/order/' + id + '/products' })
    },
    showPackage(id) {
      this.$router.push({ path: '/order/' + id + '/package' })
    },
    editMenuHandle(id) {
      this.edit({ id: this.currentRecord })
    },
    deleteHandle() {
      this.del({ id: this.currentRecord }, '删除订单，将删除订单对应的所有产品和包裹信息，是否继续')
    },
    find(event) {
      this.$nextTick()
        .then(() => {
          this.fetchData()
        })
    },
    dblHandle(row, column, event) { // 双击编辑
      this.edit(row)
    },
    rowHandle(row, column, event) { // 单击行
      this.getIndex = row.index // index
      this.getSummary(row.id)
    },
    getSummary(id) {
      getSummaryById(id).then(response => {
        const { product_count, sum_amount, sum_remain } = response.data
        this.product_count = product_count
        this.sum_amount = sum_amount
        this.sum_remain = sum_remain
      })
    },
    contextHandle(row, column, event) { // 右键单击
      this.getIndex = row.index
      this.currentRecord = row.id
      this.getSummary(row.id)
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      // 把每一行的索引放进row
      row.index = rowIndex // row.id rowIndex;
    },
    selectedHighlight({
      row,
      rowIndex
    }) {
      if ((this.getIndex) === (rowIndex)) {
        return {
          'background-color': '#CAE1ff'
        }
      }
    },
    testMenu() {
      console.log('test')
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/app-main.scss";
#config .el-input {
    // width: 200px;
    // margin-left: 10px;
}
#datagrid {
    .toolbar {
        margin-bottom: 10px;
        .tips{
           line-height: 40px;
           height: 40px;
           margin:0px;
           padding:0px 10px;
        }
    }
    .page {
        margin-top: 10px;
    }
}
.el-button--mini.is-round,
.toolbar-config .el-button--mini {
    padding: 10px;
}
.toolbar-config .el-button+.el-button {
    margin-left: 5px;
}
.tips span{
  color: #f44;
}

</style>

<template>
  <div class="container">
    <el-tabs v-model="activeName" type="border-card" class="tabs">
      <el-tab-pane label="搜索" name="first">
        <div class="option">
          <inputCustom v-model="query.cardno" name="卡号" />
          <inputCustom v-model="query.cardpwd" name="卡密" />
          <booleanSelect v-model="query.created" name="新建" />
          <booleanSelect v-model="query.waited" name="待导出" />
          <booleanSelect v-model="query.exported" name="是否导出" />
          <booleanSelect v-model="query.used" name="是否使用" />
          <el-button type="primary" class="c-button" @click="search">搜索</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设置" name="second">
        <div class="operate">
          <cardNumberOption v-model="number">
            <el-button type="warning" @click="generate">生成卡号卡密</el-button>
          </cardNumberOption>
          <el-button type="primary" class="c-button" @click="setWaiting">加入待导出池</el-button>
          <el-button type="success" class="c-button" @click="setExported">设置为已导出</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="导出" name="third">
        <div class="operate">
          <inputCustom v-model="filename" name="Filename" />
          <autoWidthOption v-model="autoWidth" />
          <bookTypeOption v-model="bookType" />
          <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" class="c-button" type="primary" icon="el-icon-document" @click="handleDownload">
            Export Excel
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="table">
      <el-table :data="tableData" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed label="序号" type="index" width="120" :index="indexMethod" />
        <el-table-column fixed prop="id" label="id" width="100" />
        <el-table-column prop="createtime" label="createtime" width="200">
          <template slot-scope="scope">
            {{ formatDate(parseInt(scope.row.createtime)) }}
          </template>
        </el-table-column>
        <el-table-column prop="cardno" label="cardno" width="200" />
        <el-table-column prop="cardpwd" label="cardpwd" width="200" />
        <el-table-column prop="step" label="step" width="120">
          <template slot-scope="scope">
            {{ transformStep(scope.row.step) }}
          </template>
        </el-table-column>

        <el-table-column prop="user_id" label="user_id" width="120" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-popover placement="bottom" class="popover" trigger="click">
              <div style="display: flex;flex-direction: column;">
                <el-tag class="tag">Emial: {{ userDetail.email }}</el-tag>
                <el-tag class="tag">VipExpiretime: {{ userDetail.vip_expiretime }}</el-tag>
              </div>
              <el-button slot="reference" type="text" size="small" @click="getUserDetail(scope.row.user_id)">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
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
  </div>
</template>
<script>
import { getCardList, generateCardList, setCardsWaiting, setCardsExported } from '@/api/admin/card'
import { getUserDetail } from '@/api/admin/user'
import bookTypeOption from './components/bookTypeOption'
import autoWidthOption from './components/autoWidthOption'
import cardNumberOption from './components/cardNumberOption'
import inputCustom from '../components/inputCustom'
import booleanSelect from '../components/booleanSelect'
export default {
  components: { autoWidthOption, bookTypeOption, cardNumberOption, inputCustom, booleanSelect },
  data() {
    return {
      tableData: [],
      multSelection: [],
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
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
        cardno: null,
        cardpwd: null,
        created: null,
        waited: null,
        exported: null,
        used: null
      },
      userDetail: {
        email: '',
        vip_expiretime: ''
      },
      activeName: 'first'
    }
  },
  computed: {
  },
  mounted() {
    this.getCardList()
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'createtime', 'cardno', 'cardpwd', 'step', 'user_id']
        const filterVal = ['id', 'createtime', 'cardno', 'cardpwd', 'step', 'user_id']
        const list = this.multSelection
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return this.parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    search() {
      this.query.page = 1
      this.getCardList()
    },
    async generate() {
      try {
        await generateCardList({ 'number': this.number })
        this.search()
      } catch (error) {
        console.log(error)
      }
    },
    async setWaiting() {
      const cards = []
      this.multSelection.forEach((outerItem) => {
        this.tableData.forEach(innerItem => {
          if (innerItem.id === outerItem.id) {
            const item = { ...innerItem }
            item.exported = true
            cards.push(item)
          }
        })
      })
      try {
        await setCardsWaiting(cards)
        this.getCardList()
      } catch (error) {
        console.log(error)
      }
    },
    async setExported() {
      const cards = []
      this.multSelection.forEach((outerItem) => {
        this.tableData.forEach(innerItem => {
          if (innerItem.id === outerItem.id) {
            const item = { ...innerItem }
            item.exported = true
            cards.push(item)
          }
        })
      })
      try {
        await setCardsExported(cards)
        this.getCardList()
      } catch (error) {
        console.log(error)
      }
    },
    setUsed() {},
    handleSizeChange(limit) {
      this.query.limit = limit
      this.query.page = 1
      this.getCardList()
    },
    handleCurrentChange(page) {
      this.query.page = page
      this.getCardList()
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
    transformStep(step) {
      return ['新建', '待导出', '已导出', '已使用'][step]
    },
    indexMethod(index) {
      return (parseInt(this.meta.currentPage) - 1) * parseInt(this.meta.itemsPerPage) + index + 1
    },
    async getCardList() {
      try {
        const res = await getCardList(this.query)
        this.tableData = res.data.items
        this.meta = { ...res.data.meta }
      } catch (error) {
        console.log(error)
      }
    },
    async getUserDetail(id) {
      this.userDetail = { email: '', vip_expiretime: '' }
      try {
        const res = await getUserDetail()
        this.userDetail.email = res.data.email
        this.userDetail.vip_expiretime = res.data.vip_expiretime
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
.popover {
  & ::v-deep .el-popover {
    width: 320px!important;
  }
}
.c-button {
  height: 40px!important;
  margin-left: 4px;
  margin-right: 4px;
}
</style>

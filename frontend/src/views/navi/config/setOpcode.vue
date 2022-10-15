//登录
<template>
  <div class="container">
    <el-input key="set-opcode-password" v-model="input1" placeholder="请输入内容" class="no-autofill-pwd">
      <template slot="prepend">&nbsp;密&nbsp;&nbsp;码</template>
    </el-input>
    <el-input key="set-opcode" v-model="input2" placeholder="请输入内容" class="no-autofill-pwd" style="margin-top: 20px">
      <template slot="prepend">操作码</template>
    </el-input>
    <div class="button">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { setOpcode } from '@/api/user'
export default {
  name: 'SearchSrc',
  data() {
    return {
      input1: '',
      input2: ''
    }
  },
  computed: {
    isVip() {
      return this.$store.state.user.vip
    }
  },
  methods: {
    // 登录逻辑
    save() {
      setOpcode({ password: this.input1, opcode: this.input2 }).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: '操作码重置成功',
            type: 'success'
          })
        }
      })
      .catch(() => {
        this.$message({
          message: '操作码重置失败',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: calc(100% - 60px)!important;
  height: 180px!important;
  padding-left: 30px;
}

.button {
  float: right;
  margin-top: 20px;
}
.no-autofill-pwd {
  ::v-deep .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>

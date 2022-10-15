//登录
<template>
  <div class="container">
    <el-input v-model="input" placeholder="请输入内容" class="no-autofill-pwd">
      <template slot="prepend">旧&nbsp;密&nbsp;码&nbsp;</template>
    </el-input>
    <el-input v-model="input1" placeholder="请输入内容" class="no-autofill-pwd" style="margin-top: 20px">
      <template slot="prepend">新&nbsp;密&nbsp;码&nbsp;</template>
    </el-input>
    <el-input v-model="input2" placeholder="请输入内容" class="no-autofill-pwd" style="margin-top: 20px">
      <template slot="prepend">重新输入</template>
    </el-input>
    <div class="button">
      <el-button v-if="isEqual" type="primary" @click="save">保存</el-button>
      <el-button v-else type="primary" disabled @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { setNewPassword } from '@/api/user'
export default {
  name: 'SearchSrc',
  data() {
    return {
      input: '',
      input1: '',
      input2: ''
    }
  },
  computed: {
    isVip() {
      return this.$store.state.user.vip
    },
    isEqual() {
      return this.input1 !== '' && this.input1 === this.input2
    }
  },
  methods: {
    // 登录逻辑
    save() {
      setNewPassword({ oldPassword: this.input, newPassword: this.input1 }).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: '密码重置成功',
            type: 'success'
          })
        }
      })
      .catch(() => {
        this.$message({
          message: '密码重置失败',
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

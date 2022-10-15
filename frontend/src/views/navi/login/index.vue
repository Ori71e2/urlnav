//登录

<template>
  <div id="login" class="login">
    <div class="log-close">
      <span class="log-close">
        <i class="el-icon-close close" @click="skipToMain" />
      </span>
    </div>
    <div class="log-email">
      <input key="login-email" v-model="email" type="text" placeholder="邮箱" :class="'log-input' + (email === '' ? ' log-input-empty' : ' log-input-not-empty')">
      <input key="login-password" v-model="password" type="password" placeholder="密码" :class="'log-input' + (password === '' ? ' log-input-empty' : ' log-input-not-empty ')">
      <a href="javascript:;" class="log-btn" @click="login">登录</a>
    </div>
    <div class="forget-password">
      <router-link to="/navi/resetPassword">
        忘记密码
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    dialogVisible: {
      get() {
        // return true
        return this.$store.state.user.dialogVisible
      },
      set(val) {
        this.$store.dispatch('user/setDialogVisible', val)
      }
    }
  },
  methods: {
    // 登录逻辑
    login() {
      if (this.email !== '' && this.password !== '') {
        this.toLogin()
      }
    },
    // 登录请求
    async toLogin() {
      // 设置在登录状态
      try {
        await this.$store.dispatch('user/login', { email: this.email, password: this.password })
        try {
          await this.$store.dispatch('url/getUrl', { opcode: '' })
        } catch (error) {
          this.$message.error('获取网址信息失败')
        }
        this.skipToMain()
      } catch (error) {
        this.$message.error('登录失败')
      }
    },
    skipToMain() {
      // this.dialogVisible = false
      this.$router.push('/navi')
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 500px;
  height: 280px;
}
.log-close {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row-reverse;
}
.log-close:hover .icons {
  transform: rotate(180deg);
}
.log-close .icons {
  opacity: 1;
  transition: all 0.3s;
}

.close {
  height: 16px;
  width: 16px;
  margin: 10px 10px 0px 0px;
  &:hover {
    cursor: pointer;
  }
}
.login-email {
  height: 17px;
  width: 29px;
  background-position: -117px 0;
}

.log-btns {
  padding: 15px 0;
  margin: 0 auto;
}
.log-btn {
  width: 402px;
  display: block;
  text-align: left;
  line-height: 50px;
  margin: 0 auto 15px;
  height: 50px;
  color: #fff;
  font-size: 16px;
  background-color: #3b5999;
  border-radius: 5px;
  position: relative;
}
.log-btn.tw {
  background-color: #13b4e9;
}
.log-btn.email {
  background-color: #50e3ce;
}
.log-btn:hover,
.log-btn:focus {
  color: #fff;
  opacity: 0.8;
}

.log-email {
  text-align: center;
  margin-top: 20px;
}
.log-email .log-btn {
  background-color: #50e3ce;
  text-align: center;
}
.log-input-empty {
  border: 1px solid #f37474 !important;
}
.log-input-not-empty {
  background-color: #E3FDFF;
}

.log-btn .icons {
  margin-left: 30px;
  vertical-align: middle;
}
.log-btn .text {
  left: 95px;
  line-height: 50px;
  text-align: left;
  position: absolute;
}
.log-input {
  width: 370px;
  overflow: hidden;
  padding: 0 15px;
  font-size: 13px;
  border: 1px solid #ebebeb;
  margin: 0 auto 15px;
  height: 48px;
  line-height: 48px;
  border-radius: 5px;
}
.log-input.warn {
  border: 1px solid #f88787;
}
.forget-password {
  width: 100%;
  a {
    float: right;
    margin-right: 50px;
  }
}
</style>

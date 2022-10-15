//登录

<template>
  <div id="login" class="login">
    <div class="log-close">
      <span class="log-close">
        <i class="el-icon-close close" @click="skipToMain" />
      </span>
    </div>
    <div class="log-email">
      <input v-model="email" type="text" placeholder="邮箱" :class="'log-input' + (email === '' ? ' log-input-empty' : ' log-input-not-empty')">
      <input v-model="password" placeholder="密码" class="no-autofill-pwd" :class="'log-input' + (password === '' ? ' log-input-empty' : ' log-input-not-empty')">
      <input v-model="token" type="text" placeholder="验证码" :class="'log-input' + (token === '' ? ' log-input-empty' : ' log-input-not-empty')">
      <!-- <v-if> -->
      <a v-if="timer === 0" href="javascript:;" class="log-btn" @click="getEmailToken">获取验证码</a>
      <a v-if="timer === -1" href="javascript:;" class="log-btn timer-btn">获取验证码</a>
      <a v-if="timer > 0" href="javascript:;" class="log-btn timer-btn">{{ timer }}</a>
      <a href="javascript:;" class="log-btn" @click="resetPassword">重&nbsp;&nbsp;&nbsp;置</a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ResetPassword',
  data() {
    return {
      email: '',
      password: '',
      token: '',
      timer: 0
    }
  },
  computed: {

  },
  methods: {
    // 登录逻辑
    async resetPassword() {
      this.isLoging = true
      if (this.email !== '' && this.password !== '') {
        try {
          await this.$store.dispatch('user/resetPassword', { email: this.email, password: this.password, token: this.token })
          this.$router.push('/navi/login')
        } catch (error) {
          console.log(error)
        }
      }
    },
    async getEmailToken() {
      // this.countDown(120)
      this.timer = -1
      try {
        await this.$store.dispatch('user/getEmailToken', this.email)
        this.countDown(120)
      } catch (error) {
        this.timer = 0
        console.log(error)
      }
    },
    skipToMain() {
      this.$router.push('/navi')
    },
    countDown(long) {
      this.timer = long
      const interval = setInterval(() => {
        // 获取当前时间，同时得到活动结束时间数组
        if (this.timer > 0) {
          this.timer--
        } else {
          clearInterval(interval)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 500px;
  height: 380px;
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
.timer-btn {
  background-color: #909399!important;
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
.no-autofill-pwd {
  ::v-deep.el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>

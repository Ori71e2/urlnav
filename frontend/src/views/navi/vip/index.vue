//登录
<template>
  <div id="vip" class="vip">
    <div class="log-close">
      <a href="javascript:;" @click="skipToMain">
        <i class="el-icon-close close" />
      </a>
    </div>
    <div class="log-card">
      <div v-show="isVip" style="margin-bottom: 10px"><span>VIP到期时间：{{ vipExpiretime }}</span></div>
      <div v-show="!isVip" style="margin-bottom: 10px"><span>您不是VIP</span></div>
      <div style="margin-bottom: 10px">
        <span>输入卡号及卡密成为或者续期VIP，购买链接:</span>
        <a href="" target="_blank">
          <i class="el-icon-shopping-cart-full shopping-cart" />
        </a>
      </div>
      <input v-model="cardno" type="text" placeholder="卡号" :class="'log-input' + (cardno === '' ? ' log-input-empty' : ' log-input-not-empty')">
      <input v-model="cardpwd" type="cardpwd" placeholder="卡密" :class="'log-input' + (cardpwd === '' ? ' log-input-empty' : ' log-input-not-empty')">
      <a v-loading="loading" href="javascript:;" class="log-btn" @click="verify">验&nbsp;&nbsp;&nbsp;证</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Vip',
  components: {
  },
  data() {
    return {
      loading: false,
      cardno: '',
      cardpwd: '',
      timer: 0
    }
  },
  computed: {
    isVip() {
      return this.$store.state.user.vip
    },
    vipExpiretime() {
      const time = this.$store.state.user.vipExpiretime
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      return year + '年' + month + '月' + day + '日'
    }
  },
  methods: {
    // 登录逻辑
    async verify() {
      this.loading = true
      if (this.cardno !== '' && this.cardpwd !== '') {
        try {
          await this.$store.dispatch('user/verify', { cardno: this.cardno, cardpwd: this.cardpwd })
          this.loading = false
          this.$message({
            message: '验证成功',
            type: 'success'
          })
        } catch (error) {
          this.loading = false
          this.$message({
            message: '验证失败',
            type: 'error'
          })
        }
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

.vip {
  width: 500px;
  height: 320px;
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
}
.login-cardno {
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
.log-btn.cardno {
  background-color: #50e3ce;
}
.log-btn:hover,
.log-btn:focus {
  color: #fff;
  opacity: 0.8;
}

.log-card {
  text-align: center;
  margin-top: 20px;
}
.log-card .log-btn {
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
.shopping-cart {
  color: #409EFF;
  font-size: 30px;
}
</style>

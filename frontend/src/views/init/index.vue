//登录

<template>
  <div class="init">
    <div v-if="result" class="setRoot">
      <p>root用户已设置</p>
    </div>
    <div v-else>
      <div class="setRoot">
        <p>设置root用户</p>
      </div>
      <div class="init-email">
        <input key="root-email" v-model="email" type="text" placeholder="邮箱" :class="'init-input' + (email === '' ? ' init-input-empty' : ' init-input-not-empty')">
        <input key="root-password1" v-model="password1" type="password" placeholder="密码" :class="'init-input' + (password1 === '' ? ' init-input-empty' : ' init-input-not-empty ')">
        <input key="root-password2" v-model="password2" type="password" placeholder="密码" :class="'init-input' + (password2 === '' ? ' init-input-empty' : ' init-input-not-empty ')">
        <p :class="[isEqual ? 'errorClass' : 'activeClass']">密码不一致</p>
        <a href="javascript:;" class="init-btn" @click="setRoot">设置</a>
      </div>
    </div>
  </div>
</template>

<script>
import { setRoot, isRootSet } from '@/api/init'
export default {
  name: 'Init',
  data() {
    return {
      email: '',
      password1: '',
      password2: '',
      result: true
    }
  },
  computed: {
    isEqual() {
      return this.password1 === this.password2
    }
  },
  async mounted() {
    try {
      await isRootSet()
      this.result = true
      // 下面跳转是后加的，你也可以去掉下面的跳转，单独显示提示。若加上该语句，v-if那里其实是多余的，本处先保留
      this.$router.push('/navi')
    } catch (error) {
      this.result = false
    }
  },
  methods: {
    // 登录逻辑
    setRoot() {
      if (this.email !== '' && this.password1 !== '') {
        this.toSetRoot()
      }
    },
    // 登录请求
    async toSetRoot() {
      // 设置在登录状态
      try {
        // await this.$store.dispatch('init/setRoot', { email: this.email, password: this.password1 })
        await setRoot({ email: this.email, password: this.password1 })
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
      } catch (error) {
        this.$message.error('设置失败')
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.init {
  width: 500px;
  height: 280px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.setRoot {
  text-align: center;
  font-size: 20px;
}
.login-email {
  height: 17px;
  width: 29px;
  background-position: -117px 0;
}

.init-btns {
  padding: 15px 0;
  margin: 0 auto;
}
.init-btn {
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
.init-btn.tw {
  background-color: #13b4e9;
}
.init-btn.email {
  background-color: #50e3ce;
}
.init-btn:hover,
.init-btn:focus {
  color: #fff;
  opacity: 0.8;
}

.init-email {
  text-align: center;
  margin-top: 20px;
}
.init-email .init-btn {
  background-color: #50e3ce;
  text-align: center;
}
.init-input-empty {
  border: 1px solid #f37474 !important;
}
.init-input-not-empty {
  background-color: #E3FDFF;
}

.init-btn .icons {
  margin-left: 30px;
  vertical-align: middle;
}
.init-btn .text {
  left: 95px;
  line-height: 50px;
  text-align: left;
  position: absolute;
}
.init-input {
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
.init-input.warn {
  border: 1px solid #f88787;
}
.activeClass {
  display: block;
}
.errorClass {
  display: none;
}
</style>

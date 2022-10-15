import { isLogin, login, register, logout, getEmailToken, getInfo, verify, resetPassword } from '@/api/user'
// import router, { resetRouter } from '@/router'

const state = {
  vip: 0,
  role: 0,
  isLogin: false,
  name: '',
  introduction: '',
  dialogVisible: false,
  vipExpiretime: 0
}

const mutations = {
  SET_VIP: (state, vip) => {
    state.vip = vip
  },
  SET_ROLES: (state, role) => {
    state.role = role
  },
  SET_ISLOGIN: (state, isLogin) => {
    state.isLogin = isLogin
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_DIALOG_VISIBLE: (state, visible) => {
    state.dialogVisible = visible
  },
  SET_VIP_EXPIRETIME: (state, val) => {
    state.vipExpiretime = val
    if (val > new Date().getTime()) {
      state.vip = 1
    } else {
      state.vip = 0
    }
  }
}

const actions = {
  setVip({ commit }, vip) {
    commit('SET_VIP', vip)
  },
  // user login
  async login({ commit }, userInfo) {
    const { email, password } = userInfo
    const res = await login({ email: email.trim(), password: password })
    commit('SET_ISLOGIN', true)
    commit('SET_ROLES', res.data.role)
    commit('SET_VIP_EXPIRETIME', res.data.vip_expiretime)
    commit('SET_VIP', res.data.vip)
    return res
  },
  async isLogin({ commit }) {
    const res = await isLogin()
    if (res.code === 20000) {
      commit('SET_ISLOGIN', true)
      commit('SET_ROLES', res.data.role)
      commit('SET_VIP_EXPIRETIME', res.data.vip_expiretime)
      commit('SET_VIP', res.data.vip)
    }
    return res
  },
  // user logout
  async logout({ commit, state }) {
    const res = await logout()
    commit('SET_ISLOGIN', false)
    commit('SET_ROLES', 0)
    commit('SET_VIP', false)
    commit('SET_NAME', '')
    return res
  },
  async register({ commit }, userInfo) {
    const { email, password, token } = userInfo
    return await register({ email: email.trim(), password: password, token: token })
  },
  async resetPassword({ commit }, userInfo) {
    const { email, password, token } = userInfo
    return await resetPassword({ email: email.trim(), password: password, token: token })
  },
  async getEmailToken({ commit }, email) {
    return await getEmailToken(email)
  },
  async verify({ commit, state }, card) {
    const res = await verify(card)
    commit('SET_VIP', 1)
    commit('SET_VIP_EXPIRETIME', parseInt(res.data.vip_expiretime))
    return res
  },
  // get user info
  async getInfo({ commit, state }) {
    const res = await getInfo()
    commit('SET_NAME', res.data.name)
    commit('SET_INTRODUCTION', res.data.introduction)
    return res
  },

  setDialogVisible({ commit }, visible) {
    commit('SET_DIALOG_VISIBLE', visible)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

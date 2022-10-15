
const state = {
    scrollState: false,
    tipZIndex: true,
    commonCompiled: false,
    navCompiled: false,
    step: 0,
    MIN: 0,
    SEARCH: 0,
    OPTION: 1,
    COMMON: 1,
    NAV: 2,
    MAX: 2
  }
  const mutations = {
    SET_SCROLL_STATE: (state, val) => {
      state.scrollState = val
    },
    SET_TIP_ZINDEX: (state, val) => {
      state.tipZIndex = val
    },
    SET_STEP: (state, val) => {
      if (val >= state.MIN && val <= state.MAX) {
        state.step = val
        switch (val) {
          case state.COMMON:
            state.commonCompiled = true
            break
          case state.NAV:
            state.navCompiled = true
            break
          default:
        }
      }
    },
    SET_ALL_COMPILED_TRUE: (state) => {
      state.commonCompiled = true
      state.navCompiled = true
    }
   }

  const actions = {
    setScrollState({ commit }, val) {
      commit('SET_SCROLL_STATE', val)
    },
    setTipZIndex({ commit }, val) {
      commit('SET_TIP_ZINDEX', val)
    },
    setStep({ commit }, val) {
      commit('SET_STEP', val)
    },
    setAllCompliedTrue({ commit }) {
      commit('SET_ALL_COMPILED_TRUE')
    }
   }

  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }

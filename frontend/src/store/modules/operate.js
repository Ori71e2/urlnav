
const state = {
  edit: false,
  drag: false,
  lock: true,
  search: false,
  tagPopover: false,
  position: '',
  scroll: false
}
const mutations = {
  SET_TAG_POPOVER: (state, val) => {
    state.tagPopover = val
  },
  SET_LOCK: (state, val) => {
    state.lock = val
  },
  // 编辑操作
  SET_DRAG: (state, val) => {
    state.drag = val
  },
  SET_EDIT: (state, val) => {
    state.edit = val
  },
  SET_SEARCH: (state, val) => {
    state.search = val
  },
  SET_POSITION: (state, val) => {
    state.position = val
  },
  SET_SCROLL: (state, val) => {
    state.scroll = val
  }
 }

const actions = {
  setLock({ commit }, val) {
    commit('SET_LOCK', val)
  },
  setDrag({ commit }, val) {
    commit('SET_DRAG', val)
  },
  setEdit({ commit }, val) {
    commit('SET_EDIT', val)
  },
  setSearch({ commit }, val) {
    commit('SET_SEARCH', val)
  },
  setPosition({ commit }, val) {
    commit('SET_POSITION', val)
  },
  setScroll({ commit }, val) {
    commit('SET_SCROLL', val)
  },
  setTagPopover({ commit }, val) {
    commit('SET_TAG_POPOVER', val)
  }
 }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

import { getUrl, saveUrl, getUrlUpdateTime, getUrltmpPublished } from '@/api/url'
import { saveUrlTmp, getUrlTmpUpdatetime, getUrlTmpdetail } from '@/api/admin/url'
// function JSONcopy(data) {
//   return JSON.parse(JSON.stringify(data))
// }
function handleUrl({ commit }, res) {
  let { list, tag, group_transfer, site_transfer, search_site } = res.data
  const { id, updatetime, tmp, active } = res.data
  if (list === '') {
    list = JSON.stringify([])
  }
  if (tag === '') {
    tag = JSON.stringify([])
  }
  if (group_transfer === '') {
    group_transfer = JSON.stringify([])
  }
  if (site_transfer === '') {
    site_transfer = JSON.stringify([])
  }
  if (search_site === '') {
    search_site = JSON.stringify([])
  }
  commit('INIT_LIST', list)
  commit('INIT_TAG', tag)
  commit('INIT_SEARCH_SITE', search_site)
  commit('INIT_SITE_TRANSFER', site_transfer)
  commit('INIT_GROUP_TRANSFER', group_transfer)
  commit('INIT_ID', id)
  commit('INIT_TMP', tmp)
  commit('INIT_ACTIVE', active)
  commit('SET_UPDATETIME', updatetime)
}
const state = {
  id: '',
  tmp: false,
  active: false,
  list: JSON.stringify([]),
  tag: JSON.stringify([]),
  searchSite: JSON.stringify([]),
  groupTransfer: JSON.stringify([]),
  siteTransfer: JSON.stringify([]),
  oldList: JSON.stringify([]),
  oldTag: JSON.stringify([]),
  oldSearchSite: JSON.stringify([]),
  oldGroupTransfer: JSON.stringify([]),
  oldSiteTransfer: JSON.stringify([]),
  preList: JSON.stringify([]),
  preTag: JSON.stringify([]),
  preSearchSite: JSON.stringify([]),
  preGroupTransfer: JSON.stringify([]),
  preSiteTransfer: JSON.stringify([]),
  updatetime: 0,
  cancelEl: '',
  sId: -1
}
const mutations = {
  CLEAR_ALL: (state) => {
    state.id = ''
    state.tmp = false
    state.active = false
    state.list = JSON.stringify([])
    state.tag = JSON.stringify([])
    state.searchSite = JSON.stringify([])
    state.groupTransfer = JSON.stringify([])
    state.siteTransfer = JSON.stringify([])
    state.oldList = JSON.stringify([])
    state.oldTag = JSON.stringify([])
    state.oldSearchSite = JSON.stringify([])
    state.oldGroupTransfer = JSON.stringify([])
    state.oldSiteTransfer = JSON.stringify([])
    state.preList = JSON.stringify([])
    state.preTag = JSON.stringify([])
    state.preSearchSite = JSON.stringify([])
    state.preGroupTransfer = JSON.stringify([])
    state.preSiteTransfer = JSON.stringify([])
    state.updatetime = 0
  },
  INIT_ID: (state, id) => {
    state.id = id
  },
  INIT_TMP: (state, tmp) => {
    state.tmp = tmp
  },
  INIT_ACTIVE: (state, active) => {
    state.active = active
  },
  // list 操作
  INIT_LIST: (state, list) => {
    state.list = list
    state.oldList = list
    state.preList = list
  },
  SET_LIST: (state, list) => {
    state.preList = state.list
    state.list = list
    state.cancelEl = 'list'
  },
  SAVE_LIST: (state) => {
    state.oldList = state.list
    state.preList = state.list
  },
  CANCEL_SAVE_LIST: (state) => {
    state.list = state.oldList
    state.preList = state.oldList
  },
  // search_site 操作
  INIT_SEARCH_SITE: (state, search_site) => {
    state.searchSite = search_site
    state.oldSearchSite = search_site
    state.preSearchSite = search_site
  },
  SET_SEARCH_SITE: (state, search_site) => {
    state.preSearchSite = state.searchSite
    state.searchSite = search_site
    state.cancelEl = 'searchSite'
  },
  SAVE_SEARCH_SITE: (state) => {
    state.oldSearchSite = state.searchSite
    state.preSearchSite = state.searchSite
  },
  CANCEL_SAVE_SEARCH_SITE: (state) => {
    state.searchSite = state.oldSearchSite
    state.preSearchSite = state.oldSearchSite
  },
  // tag操作
  INIT_TAG: (state, tag) => {
    state.tag = tag
    state.oldTag = tag
    state.preTag = tag
  },
  SET_TAG: (state, tag) => {
    state.preTag = state.tag
    state.tag = tag
    state.cancelEl = 'tag'
  },
  SAVE_TAG: (state) => {
    state.oldTag = state.tag
    state.preTag = state.tag
  },
  CANCEL_SAVE_TAG: (state) => {
    state.tag = state.oldTag
    state.tag = state.oldTag
  },

  // group操作
  INIT_GROUP_TRANSFER: (state, val) => {
    state.groupTransfer = val
    state.oldGroupTransfer = val
    state.preGroupTransfer = val
  },
  SET_GROUP_TRANSFER: (state, val) => {
    state.preGroupTransfer = state.groupTransfer
    state.groupTransfer = val
    state.cancelEl = 'groupTransfer'
  },
  SAVE_GROUP_TRANSFER: (state) => {
    state.oldGroupTransfer = state.groupTransfer
    state.preGroupTransfer = state.groupTransfer
  },
  CANCEL_SAVE_GROUP_TRANSFER: (state) => {
    state.groupTransfer = state.oldGroupTransfer
    state.preGroupTransfer = state.oldGroupTransfer
  },

  // site操作
  INIT_SITE_TRANSFER: (state, val) => {
    state.siteTransfer = val
    state.oldSiteTransfer = val
    state.preSiteTransfer = val
  },
  SET_SITE_TRANSFER: (state, val) => {
    state.preSiteTransfer = state.siteTransfer
    state.siteTransfer = val
    state.cancelEl = 'siteTransfer'
  },
  SAVE_SITE_TRANSFER: (state) => {
    state.oldSiteTransfer = state.siteTransfer
    state.preSiteTransfer = state.siteTransfer
  },
  CANCEL_SAVE_SITE_TRANSFER: (state) => {
    state.siteTransfer = state.oldSiteTransfer
    state.preSiteTransfer = state.oldSiteTransfer
  },
  CANCEL_DELETE: (state) => {
    switch (state.cancelEl) {
      case 'list':
        state.list = state.preList
        break
      case 'tag':
        state.tag = state.preTag
        break
      case 'searchSite':
        state.searchSite = state.preSearchSite
        break
      case 'siteTransfer':
        state.siteTransfer = state.preSiteTransfer
        break
      case 'groupTransfer':
        state.groupTransfer = state.preGroupTransfer
        break
      default:
    }
  },
  SET_UPDATETIME: (state, val) => {
    state.updatetime = val
  },
  SET_TAG_POPOVER: (state, val) => {
    state.tagPopover = val
  },
  SET_SID: (state, val) => {
    state.sId = val
  }
 }

const actions = {
  clearUrl({ commit }) {
    commit('CLEAR_ALL')
  },
  // list 部分
  setList({ commit }, list) {
    commit('SET_LIST', list)
  },
  // tag 部分
  setTag({ commit }, val) {
    commit('SET_TAG', val)
  },
  setSiteTransfer({ commit }, val) {
    commit('SET_SITE_TRANSFER', val)
  },
  setGroupTransfer({ commit }, val) {
    commit('SET_GROUP_TRANSFER', val)
  },
  setSearchSite({ commit }, val) {
    commit('SET_SEARCH_SITE', val)
  },
  setsId({ commit }, val) {
    commit('SET_SID', val)
  },
  cancelSaveUrl({ commit }) {
    commit('CANCEL_SAVE_LIST')
    commit('CANCEL_SAVE_SEARCH_SITE')
    commit('CANCEL_SAVE_GROUP_TRANSFER')
    commit('CANCEL_SAVE_SITE_TRANSFER')
    commit('CANCEL_SAVE_TAG')
  },
  cancelDelete({ commit }) {
    commit('CANCEL_DELETE')
  },
  async getUrlUpdateTime({ state }) {
    if (!state.tmp) {
      return await getUrlUpdateTime()
    } else {
      return await getUrlTmpUpdatetime({ id: state.id })
    }
  },
  async getUrl({ commit }, { opcode }) {
    const res = await getUrl({ opcode })
    handleUrl({ commit }, res)
    return res
  },
  async getUrltmpPublished({ commit }) {
    const res = await getUrltmpPublished()
    handleUrl({ commit }, res)
    return res
  },
  async getUrlTmpdetail({ commit }, { id }) {
    const res = await getUrlTmpdetail({ id })
    handleUrl({ commit }, res)
    return res
  },
  async saveUrl({ commit, state }) {
    let save
    const url = {
      id: state.id,
      list: state.list,
      tag: state.tag,
      group_transfer: state.groupTransfer,
      site_transfer: state.siteTransfer,
      search_site: state.searchSite
    }
    if (!state.tmp) {
      save = saveUrl
    } else {
      save = saveUrlTmp
    }
    const res = await save(url)
    commit('SAVE_LIST')
    commit('SAVE_TAG')
    commit('SAVE_SEARCH_SITE')
    commit('SAVE_SITE_TRANSFER')
    commit('SAVE_GROUP_TRANSFER')
    commit('SET_UPDATETIME', res.data.updatetime)
    return res
  }
 }
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

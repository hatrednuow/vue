const state = {
  currentMenuCode: null,
  menuCodeNameList: [],
  menuList: [],
  headerOpen: true,
};

const getters = {
  menuList: (state) => {
    return state.menuList
  },
  currentMenuCode: (state) => {
    return {
      currentMenuCode: state.currentMenuCode,
    };
  },
  menuCodeNameList: (state) => {
    return state.menuCodeNameList
  },
  headerOpen: (state) => {
    return state.headerOpen
  }
};

const mutations = {
  SET_MENULIST(state, param) {
    state.menuList = param
  },
  SET_MENUCODENAMELIST(state, param) {
    state.menuCodeNameList = param
  },
  SET_CURRENTMENUCODE(state, param) {
    state.currentMenuCode = param
  },
  RESET_CURRENTMENUCODE(state) {
    state.currentMenuCode = null
  },
  SET_HEADEROPEN(state, param) {
    state.headerOpen = param
  }
};

const actions = {
  setMenuList({ commit }, param) {
    commit("SET_MENULIST", param)
  },
  setMenuCodeNameList({ commit }, param) {
    commit("SET_MENUCODENAMELIST", param)
  },
  setCurrentMenuCode({ commit }, param) {
    commit("SET_CURRENTMENUCODE", param)
  },
  resetCurrentMenuCode({ commit }) {
    commit("RESET_CURRENTMENUCODE")
  },
  setHeaderOpen( {commit}, param ) {
    commit("SET_HEADEROPEN", param)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

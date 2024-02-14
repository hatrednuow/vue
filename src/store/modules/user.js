const state = {
  id: "",
  name: "",
  groupCode: "",
};

const getters = {
  userInfo: (state) => {
    return {
      id: state.id,
      name: state.name,
      groupCode: state.groupCode,
    };
  },
};

const mutations = {
  SET_USER(state, param) {
    state.id = param.userId;
    state.name = param.userName;
    state.groupCode = param.userGroupCode;
  },
  LOGOUT(state) {
    state.id = "";
    state.name = "";
    state.groupCode = "";
  },
};

const actions = {
  setUser({ commit }, param) {
    commit("SET_USER", param);
  },
  logout({ commit }) {
    commit("LOGOUT");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

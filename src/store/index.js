import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import api from "./modules/api";
import user from "./modules/user";
import menu from "./modules/menu";

//새로고침 후에도 데이터를 유지하도록 세션에 정보를 저장해둔다.
const storeState = createPersistedState({
  paths: ["user", "menu"],
  storage: window.sessionStorage,
});

export default createStore({
  modules: { api, user, menu },
  plugins: [storeState],
});

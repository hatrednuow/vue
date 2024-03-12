// import "devextreme/dist/css/dx.softblue.css";
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import { createApp } from "vue";
import router from "./router";
import Store from "./store";
import themes from "devextreme/ui/themes";

import App from "./App";
import appInfo from "./app-info";
import mitt from "mitt";

const emitter = mitt();
// 문자열 안에 값 모두 바꾸기 위해 사용
String.prototype.replaceAll = function (org, dest) {
  return this.split(org).join(dest);
};

themes.initialized(() => {
  const app = createApp(App);
  app.use(router);
  app.use(Store);
  app.config.globalProperties.emitter = emitter;
  app.config.globalProperties.$appInfo = appInfo;
  app.mount("#app");
});

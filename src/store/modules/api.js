import axios from "axios"; // eslint-disable-line no-unused-vars
import authUtil from "../../utils/security";
const state = {};

const getters = {};

const actions = {
  async kcfemsAPI(context, payload) {
    const params = {
      tocken: "1234567890",
    };
    const userId = "root";
    if (payload.needUser === true) {
      params.procedureName = payload.api;
      params.procedureParams = [...payload.params, userId];
      params.req_user_id = userId;
    } else {
      params.procedureName = payload.api;
      params.procedureParams = payload.params;
      params.req_user_id = userId;
    }
    const strParams = JSON.stringify(params);
    const encParams = authUtil.encryptstring(strParams);
    try {
      // const resultAxios = await axios.post("http://localhost:4000/api/executeFunction.do", {
      const resultAxios = await axios.post("/api/executeFunction.do", {
        params: encParams,
      });
      if (resultAxios.status == 200) {
        return resultAxios.data;
      } else {
        return {
          SUC: resultAxios.status,
          MSG: resultAxios.statusText,
          CONT: [],
        };
      }
    } catch {
      return { SUC: "0", MSG: "에러발생", CONT: [] };
    }
  },

  async edsAPI(context, payload) {
    let urlName = payload.urlName;
    delete payload.urlName;

    try {
      let requstParams = "";
      let keys = Object.keys(payload);
      if (keys.length != 0) {
        for (let i = 0; i < keys.length; i++) {
          requstParams = requstParams + "&" + keys[i] + "=" + payload[keys[i]];
        }
      }
      const keyType = "serviceKey=4do0evj8jup63s1d4p8a&returnType=02";
      let url =
        "https://opm.kepco.co.kr:11080/OpenAPI/" +
        urlName +
        keyType +
        requstParams;
      console.log(url);
      const resultAxios = await axios(url);
      console.log("resultAxios", resultAxios);
      if (resultAxios.status == 200) {
        return resultAxios.data;
      } else {
        return {
          SUC: resultAxios.status,
          MSG: resultAxios.statusText,
          CONT: [],
        };
      }
    } catch {
      return { SUC: "0", MSG: "에러발생", CONT: [] };
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
};

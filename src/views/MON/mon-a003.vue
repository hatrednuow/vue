<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div class="mona3Layout wrap">
      <ul class="tabnav">
        <li><a class="active" href="javascript:void(0);">전력</a></li>
        <li><a href="javascript:void(0);" @click="tabClick()">공조</a></li>
      </ul>
      <div class="layout-inner">
        <div class="inner-div">
          <h2>
            <i class="dx-icon-event"></i>성서
            <img
              v-if="data.statusSS == '정상'"
              src="../../assets/green.svg"
              style="height: 10px"
            />
            <img
              v-else-if="data.statusSS != '정상' && data.statusSS != null"
              src="../../assets/red.svg"
              style="height: 10px"
              class="statusErr blink-statusErr"
            />
          </h2>
          <div class="table-grid">
            <div>
              <mon3tableTop type="SS"></mon3tableTop>
            </div>
            <div>
              <mon3tableMid type="SS"></mon3tableMid>
            </div>
            <div style="border: 1px solid red">
              <mon3tableBottom type="SS"></mon3tableBottom>
            </div>
          </div>
        </div>
        <div class="inner-div">
          <h2>
            <i class="dx-icon-event"></i>현풍
            <img
              v-if="data.statusHP == '정상'"
              src="../../assets/green.svg"
              style="height: 10px"
            />
            <img
              v-else-if="data.statusHP != '정상' && data.statusSS != null"
              src="../../assets/red.svg"
              style="height: 10px"
              class="statusErr blink-statusErr"
            />
          </h2>
          <div class="table-grid">
            <div>
              <mon3tableTop type="HP"></mon3tableTop>
            </div>
            <div>
              <mon3tableMid type="HP"></mon3tableMid>
            </div>

            <mon3tableBottom type="HP"></mon3tableBottom>
          </div>
        </div>
        <!-- <div class="inner-div">
          <h2><i class="dx-icon-event"></i>샤시</h2>
          <div class="table-grid"></div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { onMounted, reactive, getCurrentInstance, onBeforeUnmount } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilTimer } from "@/utils/utilTimer.js";
import mon3tableTop from "@/components/MON/mon3-tableTop.vue";
import mon3tableMid from "@/components/MON/mon3-tableMid.vue";
import mon3tableBottom from "@/components/MON/mon3-tableBottom.vue";
import monComm from "@/components/MON/mon-comm.vue";

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const router = useRouter();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getGroupData: [],
      statusSS: null,
      statusHP: null,
    });

    onMounted(() => {
      getMainData();
      utilTimer.resetTimer(60);
      utilTimer.setCallback(callTimerfunc);
      utilTimer.backTimer();
    });

    onBeforeUnmount(() => {
      utilTimer.clearTimer();
    });

    function callTimerfunc() {
      const remainingTime = utilTimer.getRemainingTime();
      if (remainingTime == 0) {
        utilTimer.resetTimer(60);
        getMainData();
      }
    }

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA003_DATA#1",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      data.statusSS = result.resultSet[0][3].THISDAY_POWER;
      data.statusHP = result.resultSet[1][3].THISDAY_POWER;
      data.getGroupData.push(result.resultSet[0]);
      data.getGroupData.push(result.resultSet[1]);

      emitter.emit("sendScadaMon3#1", data.getGroupData);

      const apiParams1 = {
        api: "PKG_MANAGER_MONA.GET_MONA003_DATA#2",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result1 = await store.dispatch("api/kcfemsAPI", apiParams1);
      if (result1.result != true) {
        errorAlert(result1.errmsg);
        return;
      }
      emitter.emit("sendScadaMon3#2", result1.resultSet);

      const apiParams2 = {
        api: "PKG_MANAGER_MONA.GET_MONA003_DATA#3",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result2 = await store.dispatch("api/kcfemsAPI", apiParams2);
      if (result2.result != true) {
        errorAlert(result2.errmsg);
        return;
      }
      emitter.emit("sendScadaMon3#3", result2.resultSet);
    }

    function tabClick() {
      router.push("/MONA003-1");
    }

    return { data, tabClick };
  },
  components: {
    TitleName,
    mon3tableTop,
    mon3tableMid,
    mon3tableBottom,
    monComm,
  },
};
</script>
<style scoped>
.mona3Layout {
  height: calc(100vh - 144px);
}
.layout-inner {
  display: grid;
  /* grid-template-columns: repeat(3, minmax(0, 1fr)); */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 10px;
  padding: 5px 10px;
}

.inner-div h2,
.inner-div h2 i {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}

.table-grid div {
  padding-bottom: 5px;
}
.tabnav {
  font-size: 0;
  border-bottom: 1px solid #ddd;
}
.tabnav li {
  display: inline-block;
  height: 30px;
  text-align: center;
  border-right: 1px solid #ddd;
}
.tabnav li:first-child {
  border-left: 1px solid #ddd;
}
.tabnav li a:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0px;
  width: 100%;
  height: 3px;
}
.tabnav li a.active:before {
  background: #1d4980;
}
.tabnav li a.active {
  border-bottom: 1px solid #fff;
}
.tabnav li a {
  position: relative;
  display: block;
  background: #f8f8f8;
  color: #000;
  padding: 0 30px;
  line-height: 30px;
  text-decoration: none;
  font-size: 14px;
}
.tabnav li a:hover,
.tabnav li a.active {
  background: #fff;
  color: #1d4980;
}
</style>

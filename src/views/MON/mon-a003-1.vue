<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div class="mona3Layout wrap">
      <ul class="tabnav">
        <li><a href="javascript:void(0);" @click="tabClick()">전력</a></li>
        <li><a class="active" href="javascript:void(0);">공조</a></li>
      </ul>
      <div class="layout-inner">
        <div class="inner-div">
          <h2><i class="dx-icon-event"></i>성서</h2>
          <div class="table-grid">
            <mon3_1SSTable></mon3_1SSTable>
          </div>
        </div>
        <div class="inner-div">
          <h2><i class="dx-icon-event"></i>현풍</h2>
          <div class="table-grid">
            <mon3_1HPTable></mon3_1HPTable>
          </div>
        </div>
        <!-- <div class="inner-div">
          <h2><i class="dx-icon-event"></i>샤시</h2>
          <div class="table-grid"></div>
        </div> -->

        <!-- <div class="inner-left">
          <h2><i class="dx-icon-event"></i>성서</h2>
          <div class="table-grid">
            <mon3_1SSTable></mon3_1SSTable>
          </div>
        </div>
        <div class="inner-right">
          <h2><i class="dx-icon-event"></i>현풍</h2>
          <div class="table-grid">
            <mon3_1HPTable></mon3_1HPTable>
          </div>
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
import mon3_1SSTable from "@/components/MON/mon3_1SS-table.vue";
import mon3_1HPTable from "@/components/MON/mon3_1HP-table.vue";
import monComm from "@/components/MON/mon-comm.vue";

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const router = useRouter();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getSSDataList: [],
      getHPDataList: [],
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
        api: "PKG_MANAGER_MONA.GET_MONA003#1_DATA",
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
      const ssGroup = result.resultSet[0].reduce((acc, current) => {
        acc[current.CONTROLGROUP] = acc[current.CONTROLGROUP] || [];
        acc[current.CONTROLGROUP].push(current);
        return acc;
      }, {});
      let ssList = [];
      ssList.push(ssGroup);
      data.getSSDataList = ssList;
      emitter.emit("sendScadaSS", data.getSSDataList);

      const hpGroup = result.resultSet[1].reduce((acc, current) => {
        acc[current.CONTROLGROUP] = acc[current.CONTROLGROUP] || [];
        acc[current.CONTROLGROUP].push(current);
        return acc;
      }, {});

      let hpList = [];
      hpList.push(hpGroup);
      data.getHPDataList = hpList;
      emitter.emit("sendScadaHP", data.getHPDataList);
    }

    function tabClick() {
      router.push("/MONA003");
    }

    return { data, tabClick };
  },
  components: {
    TitleName,
    mon3_1SSTable,
    mon3_1HPTable,
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
.table-grid {
  height: calc(100vh - 210px);
  display: grid;
  gap: 10px;
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
/* .tr-table ul li {
  float: left;
  margin: 5px;
} */
</style>

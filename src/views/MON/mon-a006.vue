<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div class="mona6Layout wrap">
      <!-- <div class="layout-inner"> -->
      <div class="inner-left">
        <h2><i class="dx-icon-event"></i>성서</h2>
        <div class="table-grid">
          <accuraTable type="SS"></accuraTable>
        </div>
      </div>
      <div class="inner-right">
        <h2><i class="dx-icon-event"></i>현풍</h2>
        <div class="table-grid">
          <accuraTable type="HP"></accuraTable>
        </div>
      </div>
      <!-- </div> -->
      <div class="chartBox">
        <div style="padding-bottom: 10px">
          <DxSelectBox
            class="devBox"
            :items="selectRoom"
            display-expr="name"
            value-expr="code"
            :value="data.selectCode"
            @value-changed="selectRoomType"
            :width="150"
            :height="30"
            stylingMode="outlined"
          />
        </div>
        <DxChart id="chart" :data-source="data.chartData">
          <DxSeries
            value-field="LOADFACTOR"
            argument-field="READTIME"
            type="bar"
            color="#e3b94d"
            name="부하율"
            axis="loadfactor"
          />
          <DxSeries
            value-field="STANDWONINIT"
            argument-field="READTIME"
            type="line"
            color="#f5564a"
            name="표준원단위"
            axis="standWonUnit"
          />
          <DxSeries
            value-field="REALWONUNIT"
            argument-field="READTIME"
            type="line"
            color="#4287f5"
            name="실시간원단위"
            axis="standWonUnit"
          />
          <DxValueAxis
            position="left"
            name="standWonUnit"
            axis="standWonUnit"
          />
          <DxValueAxis position="right" name="loadfactor" axis="loadfactor" />
          <DxLegend
            :visible="true"
            position="outside"
            horizontal-alignment="right"
            vertical-alignment="top"
          />
          <DxTooltip :enabled="true" />
        </DxChart>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, reactive, getCurrentInstance, onBeforeUnmount } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import accuraTable from "@/components/MON/mon6-accuraTable.vue";
import { utilTimer } from "@/utils/utilTimer.js";
import monComm from "@/components/MON/mon-comm.vue";
import {
  DxChart,
  DxSeries,
  DxTooltip,
  DxLegend,
  DxValueAxis,
} from "devextreme-vue/chart";
import DxSelectBox from "devextreme-vue/select-box";
export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getSSGroupList: [],
      getHPGroupList: [],
      getDataList: [],
      chartData: [],
      selectCode: "GCP00002",
      statusCheck: [],
    });

    const selectRoom = [
      {
        name: "성서 1룸",
        code: "GCP00005",
      },
      {
        name: "성서 2룸",
        code: "GCP00006",
      },
      {
        name: "성서 3룸",
        code: "GCP00007",
      },
      {
        name: "현풍 1룸",
        code: "GCP00002",
      },
      {
        name: "현풍 2룸",
        code: "GCP00003",
      },
    ];
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
        api: "PKG_MANAGER_MONA.GET_MONA006_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
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
      const SSstatus = result.resultSet[2].reduce((acc, current) => {
        if (!acc[current.CPGROUPNAME1ST]) {
          acc[current.CPGROUPNAME1ST] = {
            CPGROUPNAME1ST: current.CPGROUPNAME1ST,
            STATUSCHECK: current.STATUSCHECK,
          };
        } else if (current.STATUSCHECK != "정상") {
          acc[current.CPGROUPNAME1ST].STATUSCHECK = current.STATUSCHECK;
        }
        return acc;
      }, {});
      const ssResult = Object.values(SSstatus).sort((a, b) => {
        return a.CPGROUPNAME1ST.localeCompare(b.CPGROUPNAME1ST);
      });

      const HPstatus = result.resultSet[3].reduce((acc, current) => {
        if (!acc[current.CPGROUPNAME1ST]) {
          acc[current.CPGROUPNAME1ST] = {
            CPGROUPNAME1ST: current.CPGROUPNAME1ST,
            STATUSCHECK: current.STATUSCHECK,
          };
        } else if (current.STATUSCHECK != "정상") {
          acc[current.CPGROUPNAME1ST].STATUSCHECK = current.STATUSCHECK;
        }
        return acc;
      }, {});
      const HPResult = Object.values(HPstatus).sort((a, b) => {
        return a.CPGROUPNAME1ST.localeCompare(b.CPGROUPNAME1ST);
      });
      data.statusCheck = [ssResult, HPResult];
      emitter.emit("sendMon6", result.resultSet);

      const apiParams1 = {
        api: "PKG_MANAGER_MONA.GET_MONA006_CHART",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: data.selectCode },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result1 = await store.dispatch("api/kcfemsAPI", apiParams1);
      data.chartData = result1.resultSet[0];
    }
    function selectRoomType(e) {
      data.selectCode = e.value;
      getMainData();
    }

    return { data, selectRoom, selectRoomType };
  },
  components: {
    TitleName,
    accuraTable,
    monComm,
    DxChart,
    DxSeries,
    DxTooltip,
    DxLegend,
    DxValueAxis,
    DxSelectBox,
  },
};
</script>
<style scoped>
.mona6Layout {
  height: calc(100vh - 144px);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: 1fr 0.5fr;
  column-gap: 10px;
  row-gap: 3em;
  padding: 5px 10px;
}
.layout-inner {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 10px;
  padding: 5px 10px;
}
.inner-left,
.inner-right {
  grid-row: 1 / 2;
  height: 100%;
  /* height: calc(100vh - 550px); */
}
.chartBox {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
}
#chart {
  height: 25vh;
}
.inner-left h2,
.inner-right h2,
.inner-left h2 i,
.inner-right h2 i {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}
.table-grid {
  height: 100%;
}
</style>

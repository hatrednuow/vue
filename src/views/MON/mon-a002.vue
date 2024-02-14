<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="mona2Layout wrap">
      <div class="search-box">
        <DxSelectBox
          class="devBox"
          :data-source="data.gatewayList"
          display-expr="GATEWAYNAME"
          value-expr="GATEWAYID"
          v-model:value="data.gatewayId"
          stylingMode="outlined"
          @value-changed="selectGateway"
          label="게이트웨이"
          height="30px"
        />
        <DxSelectBox
          class="devBox"
          :data-source="data.controlpointList"
          display-expr="CONTROLPOINTNAME"
          value-expr="CONTROLPOINTID"
          v-model:value="data.controlpointId"
          stylingMode="outlined"
          @value-changed="selectControl"
          label="컨트롤포인트"
          height="30px"
        />
        <div class="seach-boxText">기간</div>
        <DxDateBox
          class="devBox"
          type="datetime"
          :value="data.startDate"
          display-format="yyyy-MM-dd HH:mm:ss"
          @value-changed="changeStartDate"
          applyButtonText="선택"
          cancelButtonText="취소"
          height="30px"
        />
        <div class="seach-boxText">~</div>
        <DxDateBox
          class="devBox"
          type="datetime"
          :value="data.endDate"
          display-format="yyyy-MM-dd HH:mm:ss"
          @value-changed="changeEndDate"
          applyButtonText="선택"
          cancelButtonText="취소"
          height="30px"
        />
        <DxButton
          class="search-btn"
          :width="150"
          :height="40"
          text="조회"
          type="default"
          :disabled="data.btnDisabled"
          @click="searchButton()"
        />
      </div>
      <div class="grid-box">
        <DxDataGrid
          id="abnormalTypeGrid"
          :data-source="data.abnormalType"
          :show-borders="true"
          :show-column-lines="true"
          :show-row-lines="false"
          :column-auto-width="true"
          :column-hiding-enabled="true"
          :rowAlternationEnabled="true"
        >
          <DxLoadPanel :enabled="true" />
          <DxScrolling mode="virtual" />
          <DxSelection mode="single" />
          <DxColumn
            data-field="ABNORMALTYPE"
            caption="이상관제구분"
            :allow-sorting="false"
          />
          <DxColumn data-field="PERIOD" caption="기간" :allow-sorting="false" />
          <DxColumn data-field="MAXVALUE" caption="최대값" />
          <DxColumn data-field="MINVALUE" caption="최소값" />
          <DxColumn data-field="AVGVALUE" caption="평균값" />
        </DxDataGrid>
      </div>
      <div class="chartBox">
        <div class="chartTitle"><span>이상 관제포인트차트</span></div>
        <DxChart id="chart" :data-source="data.chartData">
          <DxSeries
            value-field="CPVALUE"
            argument-field="DATATIMEKEY"
            type="line"
          />
          <DxLegend :visible="false" />
          <DxTooltip :enabled="true" />
        </DxChart>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { extra } from "@/utils/extra.js";

import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxScrolling,
  DxLoadPanel,
} from "devextreme-vue/data-grid";
import { DxChart, DxSeries, DxTooltip, DxLegend } from "devextreme-vue/chart";
import DxDateBox from "devextreme-vue/date-box";
import DxSelectBox from "devextreme-vue/select-box";
import DxButton from "devextreme-vue/button";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      gatewayList: [],
      controlpointList: [],
      gatewayId: null,
      controlpointId: null,
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(),
      btnDisabled: true,
      abnormalType: [],
      chartData: [],
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA002_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      data.gatewayList = result.resultSet[0];
    }

    function selectGateway(e) {
      data.gatewayId = e.value;
      getControlList(data.gatewayId);
    }

    //컨트롤포인트리스트
    async function getControlList(id) {
      const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA002_DATA1",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: id }, //게이트웨이id
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      data.controlpointList = result.resultSet[0];
    }
    //컨트롤포인트변경
    function selectControl(e) {
      data.controlpointId = e.value;
      if (data.controlpointId != null) {
        data.btnDisabled = false;
      }
    }

    function changeStartDate(e) {
      data.startDate = e.value;
    }

    function changeEndDate(e) {
      data.endDate = e.value;
    }
    //조회
    async function searchButton() {
      const startDate = extra.dataTimeToStr(data.startDate);
      const endDate = extra.dataTimeToStr(data.endDate);
      const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA002_DATA2",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: data.controlpointId }, //A_CONTROLPOINTID
          { dir: "in", val: startDate }, //A_STARTTIME
          { dir: "in", val: endDate }, //A_ENDTIME
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
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
      data.abnormalType = result.resultSet[0];

      const apiParams1 = {
        api: "PKG_MANAGER_MONA.GET_MONA002_DATA3",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: data.controlpointId }, //A_CONTROLPOINTID
          { dir: "in", val: startDate }, //A_STARTTIME
          { dir: "in", val: endDate }, //A_ENDTIME
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
      data.chartData = result1.resultSet[0];
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('.mona2Layout')
      if(n == false) {
        layout.style.height = '91vh'
      } else {
        layout.style.height = '85vh'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })

    return {
      data,
      selectGateway,
      selectControl,
      changeStartDate,
      changeEndDate,
      searchButton,
    };
  },
  components: {
    TitleName,
    DxSelectBox,
    DxDateBox,
    DxButton,
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxScrolling,
    DxLoadPanel,
    DxChart,
    DxSeries,
    DxTooltip,
    DxLegend,
  },
};
</script>
<style scoped>
.mona2Layout {
  height: 91vh;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 0.1fr 1fr 1fr;
}
#abnormalTypeGrid {
  height: 100%;
}
#abnormalTypeGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
  position: relative;
}

.search-box {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  align-items: center;
  grid-column: 1 / 3;
}
.seach-boxText {
  width: 60px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
}
.devBox {
  flex: 1 1;
}
.chartTitle {
  font-size: 1rem;
  font-weight: bold;
  padding: 5px;
}
.grid-box,
.chartBox {
  grid-column: 1 / 3;
}

#chart {
  height: 35vh;
}
.result-box {
  height: calc(100vh - 230px);
  /* display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.1fr 1fr; */
}
</style>

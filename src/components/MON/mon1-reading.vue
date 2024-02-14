<template>
  <div>
    <div v-if="data.selected.CONTROLPOINTID" class="attrWrap">
      <div class="title">컨트롤포인트 속성</div>
      <ul class="gridcpgrouppoint">
        <li class="item">
          <div class="keybox">관제포인트ID</div>
          <div class="txtbox">{{ data.selected.CONTROLPOINTID }}</div>
        </li>
        <li class="item">
          <div class="keybox">관제포인트명</div>
          <div class="txtbox">{{ data.selected.NAME }}</div>
        </li>
        <li class="item">
          <div class="keybox">게이트웨이명</div>
          <div class="txtbox">{{ data.selected.GATEWAYNAME }}</div>
        </li>
        <li class="item">
          <div class="keybox">공간명</div>
          <div class="txtbox">{{ data.selected.SPACENAME }}</div>
        </li>
        <li class="item">
          <div class="keybox">포인트IP</div>
          <div class="txtbox">{{ data.selected.POINTIP }}</div>
        </li>
      </ul>
    </div>
    <div v-else  class="attrWrap">
      <div class="title">그룹 속성</div>
      <ul class="gridcpgrouppoint">
        <li class="item">
          <div class="keybox">관제포인트그룹ID</div>
          <div class="txtbox">{{ data.selected.CODE }}</div>
        </li>
        <li class="item">
          <div class="keybox">관제포인트그룹명</div>
          <div class="txtbox">{{ data.selected.NAME }}</div>
        </li>
        <li class="item">
          <div class="keybox">관제포인트그룹명</div>
          <div class="txtbox">{{ data.selected.CPGROUPTYPENAME }}</div>
        </li>
        <li class="item">
          <div class="keybox">공간명</div>
          <div class="txtbox">{{ data.selected.SPACENAME }}</div>
        </li>
        <li class="item">
          <div class="keybox">에너지원</div>
          <div class="txtbox">{{ data.selected.ENERGYTYPENAME }}</div>
        </li>
      </ul>
    </div>
    <div class="readingwrap">
      <div class="title">검침</div>
      <ul class="condition">
        <li class="timeSeletor">
          <span>조회시작시간</span>
          <DxDateBox
            :value="fromNow24h"
            :disabled="disableChk()"
            :input-attr="{ 'aria-label': 'Date And Time' }"
            type="datetime"
            @value-changed="onValueChanged"
            display-format="yyyy-MM-dd HH:mm:ss"
            height="30px"
          />
        </li>
        <li class="periodSelector">
          <span>주기</span>
          <div>
            <label for="1mi">
              <input :disabled="disableChk()" type="radio" name="term" id="1mi" @click="data.selectPeriod = '1mi'" checked>
              1분
            </label>
            <label for="10mi">
              <input :disabled="disableChk()" type="radio" name="term" id="10mi" @click="data.selectPeriod = '10mi'">
              10분
            </label>
          </div> 
        </li>
        <li class="intervalSelector">
          <span>조회간격(초)</span>
          <DxNumberBox
            :width="100"
            :value="data.updateInterval != null ? data.updateInterval : data._timeInterval"
            :min="1"
            :max="600"
            :step="1"
            :show-spin-buttons="true"
            :disabled="disableChk()"
            @value-changed="intervalChange"
            height="30px"
          />
        </li>
        <li class="searchBtn">
          <DxButton
          :width="60"
          :height="30"
          text="조회"
          type="default"
          :disabled="disableChk()"
          @click="btnClick()"
        />
        </li>
      </ul>
        <DxChart v-if="dataSource.chartData[0]"
          id="chart"
          ref="chartRef"
          :data-source="dataSource.chartData"
          @initialized="saveChartInstance"
          >
          <DxZoomAndPan
            argument-axis="both"
            value-axis="both"
          /> <!-- or "zoom" | "pan" | "none" -->
          <template v-if="data.selectPeriod == '1mi'">
            <DxSeries
              argument-field="EVENTTIMEKEY"
              value-field="CPVALUE"
              type="line"
              color="#038cfc"
              >
            </DxSeries>
          </template>
          <template v-else-if="data.selectPeriod == '10mi'">
            <DxSeries
              argument-field="SUMTIMEKEY"
              value-field="AVGVALUE"
              type="line"
              color="#038cfc"
              >
            </DxSeries>
          </template>
          <DxTooltip
            :enabled="true"
            :customize-tooltip="customizeTooltip"
          />
          <DxLegend :visible="false"/>
        </DxChart>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { reactive, onMounted, onBeforeUnmount, getCurrentInstance, ref, watch } from "vue";
import errorAlert from "@/components/error-alert.vue";
import DxDateBox from 'devextreme-vue/date-box';
import DxButton from "devextreme-vue/button";
import { extra } from '@/utils/extra.js';
import { utilTimer } from '@/utils/utilTimer.js';
import { DxNumberBox } from 'devextreme-vue/number-box';
import { DxChart,
  DxSeries,
  /* DxLabel,
  DxValueAxis, */
  DxTooltip,
  DxZoomAndPan,
  DxLegend} from 'devextreme-vue/chart';

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const now = ref(new Date());
    const fromNow24h = ref(new Date(now.value.getTime() - (22 * 60 + 60) * 60 * 1000)); // 23시간 59분전 : (23 * 60 + 60) * 60 * 1000

    const data = reactive({
      selected: {},
      selectStartTime: extra.dataTimeToStr(fromNow24h.value),
      selectPeriod: "1mi",
      utilRemainingTime: utilTimer.getRemainingTime(),
      _timeInterval: 60,
      updateInterval: null,
      period1miDataList: [],
      period10miDataList: [],
    })

    let dataSource = reactive({
      chartData: []
    });

    let dataChartInstance = reactive(null);

    const saveChartInstance = (e) => {
      dataChartInstance = e.component;
    }

    onMounted(() => {
      emitter.on("sendSelectedCpgrouppoint", (item) => {
        data.selected = item
      });
      utilTimer.resetTimer(data.updateInterval != null ? data.updateInterval : data._timeInterval);
      utilTimer.pauseTimer();
    });

    onBeforeUnmount(() => {
      emitter.off("sendSelectedCpgrouppoint");
      utilTimer.clearTimer();
    });

    function callTimerfunc() {
      const remainingTime = utilTimer.getRemainingTime()
      if(remainingTime == 0) {
        utilTimer.resetTimer(data.updateInterval != null ? data.updateInterval : data._timeInterval);
        getChartData();	
      }
    }

    async function getChartData() {
      const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "MONA001" }, // 메뉴코드
          { dir: "in", val: data.selected.CONTROLPOINTID }, // 컨트롤포인트id
          { dir: "in", val: data.selectStartTime }, // 조회시작시간
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
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
      data.period1miDataList = result.resultSet[0];
      data.period10miDataList = result.resultSet[1];
      if(data.selectPeriod == '1mi') {
        dataSource.chartData = data.period1miDataList;
      } else if(data.selectPeriod == '10mi') {
        dataSource.chartData = data.period10miDataList;
      }

      if(!dataSource.chartData[0]) {
        errorAlert("데이터가 없습니다.");
      }
    }

    function onValueChanged(e) {
      const now = new Date();
      var timeDifference = now - e.value;

      // 시간 차이가 24시간(86400000밀리초) 이내에 있는지 확인
      if (timeDifference <= 86400000) {
          const startTimeStr =  extra.dataTimeToStr(e.value)
          data.selectStartTime = startTimeStr
          btnClick();
      } else {
          errorAlert("조회범위는 24시간을 초과할 수 없습니다.")
      }
    }

    function btnClick() {
      utilTimer.resetTimer(data.updateInterval != null ? data.updateInterval : data._timeInterval);
      utilTimer.setCallback(callTimerfunc);
      utilTimer.backTimer();
      getChartData();
    }

    function disableChk() {
      return data.selected.CONTROLPOINTID ? false : true
    }

    function intervalChange(e) {
      // e.previousValue
      utilTimer.updateTimeperiod(e.value)
      data.updateInterval = e.value
    }

    const customizeTooltip = ({ valueText }) => ({
      text: `${valueText}${'&#176C'}`,
    });

    watch(() => data.selectPeriod, (newValue, /* oldValue */) => {
      if(newValue == "1mi") {
        dataSource.chartData = data.period1miDataList;
      } else if (newValue == "10mi") {
        dataSource.chartData = data.period10miDataList;
      }
      // dataChartInstance.refresh();
    })

    return {
      data, 
      fromNow24h, 
      dataSource, 
      getChartData, 
      onValueChanged, 
      btnClick, 
      dataChartInstance, 
      disableChk, 
      saveChartInstance,
      customizeTooltip,
      intervalChange
    }
  },
  components: {
    DxDateBox, DxButton, DxNumberBox,
    DxChart, DxSeries, /* DxLabel, DxValueAxis, */ DxTooltip, DxLegend, DxZoomAndPan
  }
}
</script>

<style scoped>
.attrWrap{
  position: relative;
  border: 2px solid #e3e3e3;
  border-radius: 5px;
  font-size: 16px;
}
.attrWrap .title{
  position: absolute;
  top: -10px;
  left: 5px;
  background-color: #fff;
}
.gridcpgrouppoint{
  margin-right: 20px;
  list-style: none;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr
}
.item{
  display: flex;
  gap: 10px;
}
.item:nth-child(4){
  grid-column: 1 / 3;
}
.keybox{
  width: 130px;
  text-align: right;
}
.condition{
  justify-content: flex-end;
  list-style: none;
  display: flex;
}
.txtbox{
  flex-grow: 1;
  border: 1px solid #333;
  background-color: #eee;
}
.readingwrap{
  margin-top: 20px;
  position: relative;
  border: 2px solid #e3e3e3;
  border-radius: 5px;
}
.readingwrap .title{
  position: absolute;
  top: -10px;
  left: 5px;
  background-color: #fff;
}
.timeSeletor, .periodSelector, .intervalSelector{
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 16px;
  margin-right: 12px;
}
.periodSelector > div{
  padding: 2px 3px;
  border: 1px solid #e3e3e3;
  background-color: #f7f6f6;
  height: 30px;
}
.intervalSelector > input{
  width: 60px;
  padding: 10px 3px;
  border: 1px solid #e3e3e3;
  background-color: #f7f6f6;
}
.searchBtn{
  margin-right: 20px;
  padding-top: 0px;
}
#chart{
  margin: 0 10px;
  height: 600px;
  /* width: 1400px; */
}
</style>
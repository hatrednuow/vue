<template>
  <div class="boxWrap">
    <div class="controlbox">
      <table class="ess-table">
        <template v-if="essData.controlData[0]">
          <tr>
            <th>제어모드</th>
            <td>{{ essData.controlData[0]['CODEVALUE'] }}</td>
          </tr>
          <tr>
            <th>제어상태</th>
            <td>{{ essData.controlData[0]['CONTROL_TYPE'] }}</td>
          </tr>
          <tr>
            <th>제어시작시간</th>
            <td>{{ essData.controlData[0]['CONTROL_TIME'] }}</td>
          </tr>
          <tr>
            <th>제어출력</th>
            <td>{{ essData.controlData[0]['CONTROL_POWER'] }} kW</td>
          </tr>
        </template>
      </table>
    </div>
    <div class="chargebox">
      <table class="ess-table">
        <template v-if="essData.chargeData[0]">
          <tr class="tableheader-h60">
            <th>충/방전 
              <img
                v-if="essData.chargeData[0].STATUSCHECK == '정상'"
                src="../../assets/green.svg"
                style="height: 10px"
              />
              <img
                v-else-if="essData.chargeData[0].STATUSCHECK != '정상' && essData.chargeData[0].STATUSCHECK != null"
                src="../../assets/red.svg"
                style="height: 10px"
                class="statusErr blink-statusErr"
              />
            </th>
            <th>금일(kWh)</th>
            <th>금월(kWh)</th>
            <th>금일(원)</th>
            <th>금월(원)</th>
            <th>금일 절감금액 <br>({{ essData.chargeData[0]['TODAY'] }})</th>
            <th>금월 절감금액 <br>({{ essData.chargeData[0]['TOMONTH'] }})</th>
          </tr>
          <tr>
            <th>충전</th>
            <td>{{ thousandcomma(essData.chargeData[0]['TODAY_CHARGE']) }}kWh</td>
            <td>{{ thousandcomma(essData.chargeData[0]['MONTH_CHARGE']) }}kWh</td>
            <td>{{ thousandcomma(essData.chargeData[0]['TODAY_CHARGEPRICE']) }}원</td>
            <td>{{ thousandcomma(essData.chargeData[0]['MONTH_CHARGEPRICE']) }}원</td>
            <td rowspan="2">{{ thousandcomma(essData.chargeData[0]['TODAY_DISCOUNT']) }}원</td>
            <td rowspan="2">{{ thousandcomma(essData.chargeData[0]['MONTH_DISCOUNT']) }}원</td>
          </tr>
          <tr>
            <th>방전</th>
            <td>{{ thousandcomma(essData.chargeData[0]['TODAY_DISCHARGE']) }}kWh</td>
            <td>{{ thousandcomma(essData.chargeData[0]['MONTH_DISCHARGE']) }}kWh</td>
            <td>{{ thousandcomma(essData.chargeData[0]['TODAY_DISCHARGEPRICE']) }}원</td>
            <td>{{ thousandcomma(essData.chargeData[0]['MONTH_DISCHARGEPRICE']) }}원</td>
          </tr>
        </template>
      </table>
    </div>
    <div class="socbox">
      <table class="ess-table">
        <template v-if="essData.socData[0]">
          <tr class="socheader">
            <th>SOC 평균치 (%)</th>
          </tr>
          <tr class="socbody">
            <td>{{ essData.socData[0]['BAT_SOC'] }} %</td>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
export default {
  props: {
    type: String,
  },

  setup(props) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const essData = reactive({
      controlData: [],
      chargeData: [],
      socData: []
    })

    onMounted(() => {
      emitter.on("sendElectronData", (item) => {
        if (props.type == "SS") {
          // 성서 데이터 처리
          essData.controlData = item[0]
          essData.chargeData = item[1]
          essData.socData = item[2]
        }
        console.log(essData) 
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendElectronData");
    });

    // TODO 최종적으로는 thousandcomma 다 걷어내기
    function thousandcomma(val) {
      let num = val;
      if(typeof val == 'string') {
        num = parseFloat(val)
      }
      return num.toLocaleString();
    }

    return {
      essData, thousandcomma
    }
  }
}
</script>

<style scoped>
.boxWrap{
  display: flex;
  gap: 10px;
}
.controlbox{
  width: 300px;
  margin-top: 3px;
}
.chargebox{
  flex-grow: 1;
}
.socbox{
  width: 300px;
}
.ess-table {
  width: 100%;
  height: 20vh;
  border-collapse: collapse;
  color: #333;
  border-radius: 0.4em;
  overflow: hidden;
  margin-bottom: 5px;
}
.ess-table tr > th {
  background: #dbe2e9;
  color: #080808;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}
.ess-table tr th {
  border-right: 1px solid #ebebeb;
}
.ess-table tr {
  border: 1px solid #ebebeb;
}
.ess-table tr > td {
  padding: 0.2em;
  text-align: center;
}
.chargebox tr.tableheader-h60{
  height: 60px;
}
.socheader{
  height: 60px;
}
.socbody{
  font-size: 50px;
}
</style>
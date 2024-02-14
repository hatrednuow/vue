<template>
  <table class="electron-table">
    <template v-if="electronData.data.usageAndPrice">
      <tr>
        <th></th>
        <th colspan="2">당일</th>
        <th colspan="2">당월</th>
      </tr>
      <tr>
        <th rowspan="2">사용량</th>
      </tr>
      <tr>
        <td colspan="2">{{ thousandcomma(electronData.data.usageAndPrice[0].POWER_DEMAND) }} kWh</td>
        <td colspan="2">{{ thousandcomma(electronData.data.usageAndPrice[2].POWER_DEMAND) }} kWh</td>
      </tr>
      <tr>
        <th rowspan="2">요금</th>
      </tr>
      <tr>
        <td colspan="2">{{ thousandcomma(electronData.data.usageAndPrice[0].SUM_PRICE) }} 원</td>
        <td colspan="2">{{ thousandcomma(electronData.data.usageAndPrice[2].SUM_PRICE) }} 원</td>
      </tr>
      <tr>
        <th ></th>
        <th colspan="2">전일</th>
        <th colspan="2">전월</th>
      </tr>
      <tr>
        <th rowspan="2">사용량</th>
      </tr>
      <tr>
        <td colspan="2">{{ thousandcomma(electronData.data.usageAndPrice[1].POWER_DEMAND) }} kWh</td>
        <td colspan="2">{{ thousandcomma(electronData.data.usageAndPrice[3].POWER_DEMAND) }} kWh</td>
      </tr>
      <tr>
        <th rowspan="2">요금</th>
      </tr>
      <tr>
        <td colspan="2">{{ thousandcomma(electronData.data.usageAndPrice[1].SUM_PRICE) }} 원</td>
        <td colspan="2">{{ thousandcomma(electronData.data.usageAndPrice[3].SUM_PRICE) }} 원</td>
      </tr>
    </template>
  </table>
  <table class="electron-table">
    <tr>
      <th rowspan="2">피크</th>
      <th>목표전력</th>
      <th>기준전력</th>
      <th>예측전력</th>
      <th>현재전력</th>
      <th>일 피크 <br>(시간)</th>
      <th>월 피크 <br>(시간)</th>
    </tr>
    <template v-for="pea in electronData.data.peak" :key="pea">
      <tr>
        <td>{{pea.TARGETKW}}kW</td>
        <td>{{pea.STANDKW}}kW</td>
        <td>{{pea.PREDICTKW}}kW</td>
        <td>{{pea.CURRKW}}kW</td>
        <td>{{pea.DAYPOWERDEMAND}}kW <br>({{pea.DAYTIME}})</td>
        <td>{{pea.MONTHPOWERDEMAND}}kW <br>({{pea.MONTHTIME}})</td>
      </tr>
    </template>
  </table>
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

    const electronData = reactive({
      data: [],
    })

    onMounted(() => {
      emitter.on("sendElectronData", (item) => {
        if (props.type == "SS") {
          electronData.data = item[0]
        } else if(props.type == "HP") {
          // 현풍 데이터 처리
          electronData.data = item[1]
        } else if(props.type == "CS") {
          // 샤시 데이터 처리
        }
        // console.log(electronData.data)
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
      electronData, thousandcomma
    }
  }
}
</script>

<style scoped>
.electron-table {
  width: 100%;
  height: 12vh;
  border-collapse: collapse;
  color: #333;
  border-radius: 0.4em;
  overflow: hidden;
  margin-bottom: 5px;
}
.electron-table tr > th {
  background: #dbe2e9;
  color: #080808;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}
.electron-table tr th {
  border-right: 1px solid #ebebeb;
}
.electron-table tr {
  border: 1px solid #ebebeb;
}
.electron-table tr > td {
  padding: 0.2em;
  text-align: center;
}
</style>
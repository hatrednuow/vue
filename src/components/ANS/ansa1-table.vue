<template>
  <div class="tablebox">
    <table class="table">
      <template v-if="data.list[0]">
        <tr>
          <th colspan="2">전 력 사 용 정 보</th>
        </tr>
        <tr>
          <th class="w300">선택 기간</th>
          <td>{{ strDateDivDash(data.selectedDate.start) }} ~ {{ strDateDivDash(data.selectedDate.end) }}</td>
        </tr>
        <tr>
          <th class="w300">선택기간 전력사용량</th>
          <td>{{thousandcomma(data.list[0].SUMUSEPOWER)}}kWh</td>
        </tr>
        <tr>
          <th class="w300">사용량 요금</th>
          <td>{{thousandcomma(data.list[0].SUMUSEPOWER_PRICE)}}원</td>
        </tr>
      </template>
    </table>
    <table class="table">
      <template  v-if="data.list[0]">
        <tr>
          <th colspan="4">편 익 사 항</th>
        </tr>
        <tr>
          <th class="w240">ESS 충전량</th>
          <td>{{thousandcomma(data.list[0].SUMCHARGE)}}kWh</td>
          <th class="w240">충전 금액</th>
          <td>{{thousandcomma(data.list[0].SUMCHARGE_PRICE)}}원</td>
        </tr>
        <tr>
          <th class="w240">ESS 방전량</th>
          <td>{{thousandcomma(data.list[0].SUMDISCHARGE)}}kWh</td>
          <th class="w240">방전 금액</th>
          <td>{{thousandcomma(data.list[0].SUMDISCHARGE_PRICE)}}원</td>
        </tr>
        <tr>
          <th colspan="2">편익 금액(방전 금액 - 충전 금액)</th>
          <td colspan="2">{{thousandcomma(data.list[0].SUB_PRICE)}}원</td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import { reactive, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { extra } from "@/utils/extra";


export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const data = reactive({
      list: [],
      selectedDate: {}
    })

    onMounted(() => {
      emitter.on("sendAnsa1TableData", (item) => {
        data.list = item
      });
      emitter.on("sendAnsaSelectedDateData", (item) => {
        data.selectedDate = item
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendAnsa1TableData");
      emitter.off("sendAnsaSelectedDateData");
    });

    function thousandcomma(val) {
      let num = val;
      if(typeof val == 'string') {
        num = parseFloat(val)
      }
      return num.toLocaleString();
    }

    function strDateDivDash(strdate) {
      if(strdate.length > 8) {
        const strdate8length = strdate.slice(0, 8)
        return extra.appendStringDate(strdate8length)
      }
    }

    return {
      data, thousandcomma, strDateDivDash
    }
  }
}
</script>

<style scoped>
.tablebox{
  table-layout: fixed;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}
.table {
  width: 100%;
  height: 12vh;
  border-collapse: collapse;
  color: #333;
  border-radius: 0.4em;
  overflow: hidden;
  margin-bottom: 5px;
}
.table tr > th {
  background: #dbe2e9;
  color: #080808;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}
.table tr th {
  border-right: 1px solid #ebebeb;
}
.table tr {
  border: 1px solid #ebebeb;
}
.table tr > td {
  padding: 0.2em;
  text-align: center;
}
.w300{
  width: 300px;
}
.w240{
  width: 240px;
}
</style>
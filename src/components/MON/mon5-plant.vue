<template>
  <div >
    <table class="sun-table">
      <tr>
        <th class="tableheader headercom">일</th>
        <td>{{ powerPlant.data.TODAYPOWER }}</td>
        <th class="tableheader">예상비용</th>
        <td>{{ powerPlant.data.TODAYPRICE }}</td>
      </tr>
      <tr>
        <th class="tableheader headercom">월</th>
        <td>{{ powerPlant.data.MONTHPOWER }}</td>
        <th class="tableheader">예상비용</th>
        <td>{{ powerPlant.data.MONTHPRICE }}</td>
      </tr>
      <tr>
        <th class="tableheader headercom">년</th>
        <td>{{ powerPlant.data.YEARPOWER }}</td>
        <th class="tableheader">예상비용</th>
        <td>{{ powerPlant.data.YEARPRICE }}</td>
      </tr>
      <tr>
        <th class="tableheader">운량</th>
        <td>{{ powerPlant.data.CLOUDPERCENT }}</td>
      </tr>
    </table>
    <table class="sun-table inverter-table">
      <template v-for="inverter in powerPlant.data.inverterData" :key="inverter.CPGROUPNAME">
        <tr>
          <th rowspan="2" class="tableheader invertername headercom">
            <div :class="inverter.STATUSCHECK != '정상' && 'statusErr blink-statusErr'">{{ inverter.CPGROUPNAME.slice(-4) }}</div>
          </th>
          <th class="wd53">편차<br><span class="textsmall">(GV/PV)</span></th>
          <th class="wd41">PV<br><span class="textsmall">(kW)</span></th>
          <th class="wd41">GV<br><span class="textsmall">(kW)</span></th>
          <th class="wd53">전류</th>
          <th class="wd53">전압</th>
          <th class="wd53">온도</th>
          <th class="wd93">일발전량<br><span class="textsmall">(kWh)</span></th>
          <th class="wd93">예상비용<br><span class="textsmall">(원)</span></th>
        </tr>
        <tr>
          <td class="wd53">{{ inverter.GAP }}%</td>
          <td class="wd41">{{ inverter.PVPOWER }}</td>
          <td class="wd41">{{ inverter.GRIDPOWER }}</td>
          <td class="wd53">{{ inverter.PVCURRENT }}</td>
          <td class="wd53">{{ inverter.PVVOLTAGE }}</td>
          <td class="wd53">{{ inverter.TEMPERATURE }}</td>
          <td class="wd93">{{ inverter.TODAYPOWER }}</td>
          <td class="wd93">{{ inverter.TODAYPRICE }}</td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import { reactive, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";

export default {
  props : {
    plant: String
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const powerPlant = reactive({
      data: []
    })

    onMounted(() => {
      emitter.on("sendSunPowerData", (item) => {
        // db 프로시져 에서 발전소이름으로 order by 해서 주었음
        if (props.plant == "1발전소") {
          powerPlant.data = item.dataList[0];
        } else if (props.plant == "2발전소") {
          powerPlant.data = item.dataList[1];
        } else if (props.plant == "3발전소") {
          powerPlant.data = item.dataList[2];
        }
        // console.log(powerPlant.data)
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendSunPowerData");
    });

    return {
      powerPlant
    }
  }
}
</script>
<style scoped>
.flex-inverter{
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
}

.sun-table {
  table-layout: fixed;
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  color: #333;
  border-radius: 0.4em;
  overflow: hidden;
}
.sun-table tr > th {
  background: #dbe2e9;
  color: #080808;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  padding: 0.3em;
}
.sun-table tr th {
  border-right: 1px solid #ebebeb;
}
.sun-table tr {
  border: 1px solid #ebebeb;
  /* background-color: #f9fafc; */
}
.sun-table tr > td {
  padding: 0.5em;
  text-align: center;
}
.sun-table tr > td.inverterTd {
  padding: 0;
}
.sun-table tr > td.inverterId .flex{
  flex-grow: 1;
}
.tableheader{
  width: 100px;
}
.tableheader.headercom{
  width: 70px;
}
.flex{
  display: flex;
  flex-wrap: wrap;
}
.flex table{
  flex-basis: 49%;
  /* flex-grow: 1; */
}

.inverter-table{
  table-layout: fixed;
}
.inverter-table tr th.invertername{
  width: 55px;
  padding: 0;
  font-size: 15px;
}
.inverter-table th.wd53,
.inverter-table td.wd53 {
  width: 49px;
}
.inverter-table th.wd41,
.inverter-table td.wd41 {
  width: 41px;
}
.inverter-table th.wd93,
.inverter-table td.wd93 {
  width: 63px;
}
.inverter-table th.wd53,
.inverter-table th.wd41,
.inverter-table th.wd93{
  font-size: 16px;
}
.inverter-table th.wd93{
  font-size: 14px;
}
.textsmall{
  display: block;
  font-size: 12px;
}
</style>
<template>
  <div>
    <table class="chiller-table">
      <!-- 240123 현재 외부온도로 보여줌 나중에 공장별로 온도계 설치하면 공장별로 보이기 필요 -->
      <tr>
        <th>외부온도</th>
        <td colspan="1" class="textTemp">{{tempData.outTemp}}&#176;C</td>
      </tr>
      <tr v-for="e in tempData.data" :key="e.CONTROLPOINTID">
        <template v-if="e.LASTDATA != 0">
          <th>{{ nameDisplay(e.CONTROLPOINTID) }}</th>
          <td colspan="1" class="textTemp">{{ e.LASTDATA }}{{ e.UNITDISP }}</td>
        </template>
      </tr>
    </table>
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
    const tempData = reactive({
      data: [],
      outTemp: "",
    });

    onMounted(() => {
      emitter.on("sendChillerData", (item) => {
        if (props.type == "SS") {
          tempData.data = sortControlPoints(item[0]);
        } else if (props.type == "HP") {
          tempData.data = sortControlPoints(item[1]);
        }
      });

      emitter.on("sendOutTempData", (item) => {
        tempData.outTemp = item[0].LASTDATA;
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendChillerData");
      emitter.off("sendOutTempData");
    });

    // 입수온도 / 출수온도 글자 넣기
    function nameDisplay(id) {
      if (id.includes("Inlet_temp")) {
        return "입수온도";
      } else if (id.includes("sply_temp")) {
        return "출수온도";
      }
    }

    function sortControlPoints(data) {
      const order = ["Inlet_temp", "sply_temp", "low_alarm", "high_alarm"];

      const sortedData = order.map((id) => {
        const controlIdWithoutPrefix = `_${id}`;
        return data.find((item) =>
          item.CONTROLPOINTID.includes(controlIdWithoutPrefix)
        );
      });
      return sortedData;
    }

    return {
      tempData,
      nameDisplay,
    };
  },
};
</script>

<style scoped>
.chiller-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  color: #333;
  border-radius: 0.4em;
  overflow: hidden;
}
.chiller-table tr > th {
  background: #dbe2e9;
  color: #080808;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  padding: 0.3em;
}
.chiller-table tr th {
  border-right: 1px solid #ebebeb;
}
.chiller-table tr {
  border: 1px solid #ebebeb;
}
.chiller-table tr > td {
  padding: 0.5em;
  text-align: center;
}
.chiller-table tr:nth-child(2) {
  color: #fc4903;
}
.chiller-table tr:nth-child(3) {
  color: #038cfc;
}
.chiller-table .textTemp{
  font-size: 24px;
  font-weight: bold;
}
</style>

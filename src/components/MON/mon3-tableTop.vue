<template>
  <table class="scada-table">
    <template v-if="scadaData.data.length != 0">
      <tr>
        <th rowspan="2">전력량KWH</th>
        <th colspan="2">일</th>
        <th colspan="2">월</th>
      </tr>
      <tr>
        <td colspan="2">{{ scadaData.data[0].THISDAY_POWER }}kwh</td>
        <td colspan="2">{{ scadaData.data[1].THISDAY_POWER }}kwh</td>
      </tr>
      <tr>
        <th>요금</th>
        <td colspan="2">{{ scadaData.data[0].THISDAY_PRICE }}원</td>
        <td colspan="2">{{ scadaData.data[1].THISDAY_PRICE }}원</td>
      </tr>

      <tr>
        <th>피크</th>
        <td>{{ scadaData.data[2].THISDAY_POWER }}kw</td>
        <th>피크일자</th>
        <td>{{ scadaData.data[2].THISDAY_PRICE }}</td>
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

    const scadaData = reactive({
      data: [],
    });

    onMounted(() => {
      emitter.on("sendScadaMon3#1", (item) => {
        if (props.type == "SS") {
          scadaData.data = item[0];
        } else if (props.type == "HP") {
          scadaData.data = item[1];
        }
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendScadaMon3#1");
    });

    return {
      scadaData,
    };
  },
};
</script>
<style scoped>
.scada-table {
  width: 100%;
  height: 12vh;
  border-collapse: collapse;
  color: #333;
  border-radius: 0.4em;
  overflow: hidden;
}
.scada-table tr > th {
  background: #dbe2e9;
  color: #080808;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}
.scada-table tr th {
  border-right: 1px solid #ebebeb;
}

.scada-table tr:first-child th:not(:nth-child(1)) {
  width: 150px;
  max-width: 150px;
}
.scada-table tr {
  border: 1px solid #ebebeb;
  /* background-color: #f9fafc; */
}
.scada-table tr > td {
  padding: 0.2em;
  text-align: center;
}
</style>

<template>
  <table class="mid-table">
    <template v-if="scadaData.useData.length != 0">
      <tr>
        <th rowspan="2">총사용량</th>
        <th>380</th>
        <th>440</th>
        <th>220</th>
        <th>3300</th>
        <th>합계</th>
      </tr>
      <tr>
        <td>{{ scadaData.useData[3]["380"] }}kw</td>
        <td>{{ scadaData.useData[3]["440"] }}kw</td>
        <td>{{ scadaData.useData[3]["220"] }}kw</td>
        <td>{{ scadaData.useData[3]["3300"] }}kw</td>
        <td>{{ scadaData.useData[3]["TOTAL"] }}kw</td>
      </tr>
      <tr>
        <th>공장</th>
        <td>{{ scadaData.useData[1]["380"] }}%</td>
        <td>{{ scadaData.useData[1]["440"] }}%</td>
        <td>{{ scadaData.useData[1]["220"] }}%</td>
        <td>{{ scadaData.useData[1]["3300"] }}%</td>
        <td>{{ scadaData.useData[1]["TOTAL"] }}%</td>
      </tr>
      <tr>
        <th>콤프</th>
        <td>{{ scadaData.useData[2]["380"] }}%</td>
        <td>{{ scadaData.useData[2]["440"] }}%</td>
        <td>{{ scadaData.useData[2]["220"] }}%</td>
        <td>{{ scadaData.useData[2]["3300"] }}%</td>
        <td>{{ scadaData.useData[2]["TOTAL"] }}%</td>
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
      useData: [],
    });

    onMounted(() => {
      emitter.on("sendScadaMon3#2", (item) => {
        if (props.type == "SS") {
          scadaData.useData = item[0];
        } else if (props.type == "HP") {
          scadaData.useData = item[1];
        }
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendScadaMon3#2");
    });

    return {
      scadaData,
    };
  },
};
</script>
<style scoped>
.mid-table {
  width: 100%;
  height: 12vh;
  border-collapse: collapse;
  color: #333;
  border-radius: 0.4em;
  overflow: hidden;
}
.mid-table tr > th {
  background: #dbe2e9;
  color: #080808;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}
.mid-table tr th {
  border-right: 1px solid #ebebeb;
}
.mid-table tr {
  border: 1px solid #ebebeb;
  /* background-color: #f9fafc; */
}
.mid-table tr > td {
  padding: 0.2em;
  text-align: center;
}
</style>

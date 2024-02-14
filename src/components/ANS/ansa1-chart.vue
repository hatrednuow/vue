<template>
  <div>
    <DxChart
    id="chart"
    ref="chartRef"
    :data-source="data.dataSource"
    @initialized="saveChartInstance"
    default-pane="bottomPane"
    >
    <DxSeries
      pane="topPane"
      argument-field="DATE_KEY"
      value-field="SUMUSEPOWER"
      type="bar"
      color="#f59e42"
      name="전력사용량"
      axis="powerAxis" 
    >
    <!-- <DxLabel :visible="true" :customize-text="customizeText" >
    </DxLabel> -->
  </DxSeries>
  <DxSeries
    pane="topPane"
    argument-field="DATE_KEY"
    value-field="SUMUSEPOWER_PRICE"
    type="line"
    color="#4287f5"
    name="전력사용금액"
    axis="priceAxis"
    >
    <DxPoint :size="6" />
  </DxSeries>
  <DxValueAxis position="right" name="powerAxis" axis="powerAxis" pane="topPane" />
  <DxValueAxis position="left"  name="priceAxis" axis="priceAxis" pane="topPane" />
  <DxSeries
      argument-field="DATE_KEY"
      value-field="SUMCHARGE"
      type="bar"
      color="#757574"
      axis="chargeAxis"
      name="ESS충전량"
    >
  </DxSeries>
  <DxSeries
      argument-field="DATE_KEY"
      value-field="SUMDISCHARGE"
      type="bar"
      color="#e3b94d"
      axis="chargeAxis"
      name="ESS방전량"
    >
  </DxSeries>
  <DxValueAxis position="left"  name="chargeAxis" axis="chargeAxis" pane="bottomPane" />
  <DxPane name="topPane"/>
  <DxPane name="bottomPane"/>

    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
    <DxLegend
      :visible="true"
      position="outside"
      horizontal-alignment="right"
      vertical-alignment="top"
    />
  </DxChart>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { DxChart,
  DxSeries,
  DxPane,
  /* DxLabel, */
  DxValueAxis,
  DxTooltip,
  DxLegend,
  DxPoint} from 'devextreme-vue/chart';

  const chartRef = ref(null);

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    let dataChartInstance = reactive(null);

    const saveChartInstance = (e) => {
      dataChartInstance = e.component;
    }

    const data = reactive({
      dataSource: null
    });

    onMounted(() => {
      emitter.on("sendAnsa1ChartData", (item) => {
        data.dataSource = item;

        dataChartInstance.refresh();
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendAnsa1ChartData");
    });

    const customizeTooltip = ({ valueText }) => ({
      text: `${thousandcomma(valueText)}`,
    });

    function thousandcomma(val) {
      let num = val;
      if(typeof val == 'string') {
        num = parseFloat(val)
      }
      return num.toLocaleString();
    }


    return {
      data,
      chartRef,
      dataChartInstance,
      saveChartInstance,
      customizeTooltip,
    }
  },

  components: {
    DxChart,
    DxSeries,
    DxLegend,
    DxTooltip,
    DxPane,
    /* DxLabel, */
    DxValueAxis,
    DxPoint,
  },
}
</script>

<style scoped>
#chart {
  margin-top: 15px;
}
</style>
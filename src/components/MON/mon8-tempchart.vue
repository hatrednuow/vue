<template>
  <p class="chartTitle">
    <DxSelectBox class="selectBox"
      :items="simpleProducts"
      :input-attr="{ 'aria-label': 'Simple Product' }"
      display-expr="name"
      value-expr="code"
      :value="selected.code"
      @value-changed="onValueChanged"
    />
    시간대별 온도 그래프
  </p>
  <DxChart
    id="chart"
    ref="chartRef"
    :data-source="dataSource[0]"
    @initialized="saveChartInstance"
    >
    <DxZoomAndPan
      :drag-to-zoom="true"
      pan-key="ctrl"
      argument-axis="both"
      value-axis="both"
    /> <!-- or "zoom" | "pan" | "none" -->
    <DxScrollBar
      :visible="true"
    />
    <DxSeries
      argument-field="TIME"
      value-field="out"
      type="line"
      color="#038cfc"
      >
      <DxLabel :visible="true" :customize-text="customizeText" :vertical-offset=50 >
      </DxLabel>
    </DxSeries>
    <DxSeries
      argument-field="TIME"
      value-field="in"
      type="line"
      color="#fc4903"
      >
      <DxLabel :visible="true"  :customize-text="customizeText" >
      </DxLabel>
    </DxSeries>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
    <DxLegend :visible="false"/>
    <DxValueAxis :visual-range="[12.5, 32.5]" :tick-interval="2.5" />
  </DxChart>
</template>

<script>
import { onMounted, onBeforeUnmount, getCurrentInstance, reactive, watch, ref } from "vue";
import { DxChart,
  DxSeries,
  DxLabel,
  DxValueAxis,
  DxTooltip,
  DxZoomAndPan,
  DxScrollBar,
  DxLegend} from 'devextreme-vue/chart';
import DxSelectBox from 'devextreme-vue/select-box';
const chartRef = ref(null);

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const simpleProducts = [{
      name: "성서",
      code: "SS" 
    },{
      name: "현풍",
      code: "HP"
    }]
    const dataSource = reactive([]);
    const hourlyData = reactive({
      SSData: [],
      HPData: []
    });
    const selected = reactive({code: "SS"})

    let dataChartInstance = reactive(null);

    const saveChartInstance = (e) => {
      dataChartInstance = e.component;
    }

    onMounted(() => {
      emitter.on("sendChillerHourlyData", (item) => {
        for (let i = 0; i < item.length; i++) {
          if (item[i].SERIES === "성서") {
            hourlyData.SSData.push(item[i]);
          } else if (item[i].SERIES === "현풍") {
            hourlyData.HPData.push(item[i]);
          }
        }
        if(selected.code == "SS") {
          dataSource[0] = hourlyData.SSData;
        } else if(selected.code == "HP") {
          dataSource[0] = hourlyData.HPData;
        }
        dataChartInstance.refresh();
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendChillerHourlyData");
    });

    function onValueChanged(e) {
      selected.code = e.value
    }

    // const customizeText = ({ valueText }) => `${valueText}&#8451`;
    const customizeText = (e) => {
      const mi = e.argument.slice(-2)
      if(mi == '00') {
        return `${e.valueText}&#8451`
      }
    };

    const customizeTooltip = ({ argument, valueText }) => ({
      text: `${valueText}${'&#176C'} <br> ${argument}`,
    });

    watch(() => selected.code, (newValue, /* oldValue */) => {
      // console.log('selectedCode 의 변이가 감지되었을 때 ', {newValue, oldValue})
      if(newValue == "HP") {
        dataSource[0] = hourlyData.HPData;
      } else if (newValue == "SS") {
        dataSource[0] = hourlyData.SSData;
      }
      dataChartInstance.refresh();
    })

    return {
      dataSource,
      simpleProducts,
      selected,
      chartRef,
      customizeText,
      onValueChanged,
      saveChartInstance,
      customizeTooltip,
      dataChartInstance
    };
  },

  components: {
    DxChart,
    DxSeries,
    DxLabel,
    DxLegend,
    DxSelectBox,
    DxTooltip,
    DxValueAxis,
    DxZoomAndPan,
    DxScrollBar,
  },
}

</script>

<style scoped>
.chartTitle{
  font-size: 1.7rem;
}
#chart {
  height: 350px;
}
.selectBox{
  width: 150px;
  float: left;
  margin-right: 10px;
  margin-top: -5px;
}
</style>
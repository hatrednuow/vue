<template>
  <DxChart
    id="chart"
    :data-source="weatherData"
    default-pane="bottomPane"
    title="Weather in Glendale, CA"
  >
    <DxCommonSeriesSettings argument-field="month"/>
    <DxSeries
      pane="topPane"
      color="#b0daff"
      type="rangeArea"
      range-value1-field="minT"
      range-value2-field="maxT"
      name="Monthly Temperature Ranges, °C"
    />
    <DxSeries
      pane="topPane"
      value-field="avgT"
      name="Average Temperature, °C"
    >
      <DxLabel
        :visible="true"
        :customize-text="temperatureCustomizeText"
      />
    </DxSeries>
    <DxSeries
      type="bar"
      value-field="prec"
      name="prec, mm"
    >
      <DxLabel
        :visible="true"
        :customize-text="precipitationCustomizeText"
      />
    </DxSeries>

    <DxPane name="topPane"/>
    <DxPane name="bottomPane"/>

    <DxValueAxis pane="bottomPane">
      <DxGrid :visible="true"/>
      <DxTitle text="Precipitation, mm"/>
    </DxValueAxis>
    <DxValueAxis pane="topPane">
      <DxGrid :visible="true"/>
      <DxTitle text="Temperature, °C"/>
    </DxValueAxis>

    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script setup lang="ts">
import DxChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxPane,
  DxValueAxis,
  DxExport,
  DxLegend,
  DxLabel,
  DxTitle,
  DxGrid,
} from 'devextreme-vue/chart';

const temperatureCustomizeText = ({ valueText }) => `${valueText} °C`;
const precipitationCustomizeText = ({ valueText }) => `${valueText} mm`;

const weatherData = [{
  month: 'January',
  avgT: 9.8,
  minT: 4.1,
  maxT: 15.5,
  prec: 109,
}, {
  month: 'February',
  avgT: 11.8,
  minT: 5.8,
  maxT: 17.8,
  prec: 104,
}, {
  month: 'March',
  avgT: 13.4,
  minT: 7.2,
  maxT: 19.6,
  prec: 92,
}, {
  month: 'April',
  avgT: 15.4,
  minT: 8.1,
  maxT: 22.8,
  prec: 30,
}, {
  month: 'May',
  avgT: 18,
  minT: 10.3,
  maxT: 25.7,
  prec: 10,
}, {
  month: 'June',
  avgT: 20.6,
  minT: 12.2,
  maxT: 29,
  prec: 2,
}, {
  month: 'July',
  avgT: 22.2,
  minT: 13.2,
  maxT: 31.3,
  prec: 2,
}, {
  month: 'August',
  avgT: 22.2,
  minT: 13.2,
  maxT: 31.1,
  prec: 1,
}, {
  month: 'September',
  avgT: 21.2,
  minT: 12.4,
  maxT: 29.9,
  prec: 8,
}, {
  month: 'October',
  avgT: 17.9,
  minT: 9.7,
  maxT: 26.1,
  prec: 24,
}, {
  month: 'November',
  avgT: 12.9,
  minT: 6.2,
  maxT: 19.6,
  prec: 64,
}, {
  month: 'December',
  avgT: 9.6,
  minT: 3.4,
  maxT: 15.7,
  prec: 76,
}];
</script>
<style>
#chart {
  height: 440px;
}
</style>
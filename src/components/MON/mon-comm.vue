<template>
  <div class="monitoring-timer">
    <!-- <DxLinearGauge
      id="gauge"
      :value="monitoring.timer"
    >
      <DxScale
        :start-value="0"
        :end-value="60"
        :tick-interval="1"
        :minor-tick-interval="0.5"
      >
        <DxLabel :visible="false" />
        <DxTick :visible="false" />
        <DxMinorTick
          :visible="false"
        />
      </DxScale>
    </DxLinearGauge> -->
    <div>{{ monitoring.timer }}초 후 다시 조회됩니다</div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, reactive } from "vue";
import { utilTimer } from '@/utils/utilTimer.js';
/* import {
  DxLinearGauge, DxScale, DxMinorTick, DxLabel, DxTick
} from 'devextreme-vue/linear-gauge'; */

export default {
  setup() {
    const monitoring = reactive({
      timer: null
    });

    onMounted(() => {
      getMonitoringTime()
    });

    onBeforeUnmount(() => {
      // utilTimer.clearTimer();
    });

    function getMonitoringTime() {
      setTimeout(() => {
        monitoring.timer = utilTimer.getRemainingTime();
        getMonitoringTime()
      }, 1000);
    }

    return {
      monitoring
    }
  },

  components: {
    /* DxLinearGauge, DxScale, DxMinorTick, DxLabel, DxTick */
  }

}
</script>
<style scoped>
.monitoring-timer{
  position: absolute;
  right: 7%;
  top: 22px;
  font-size: 15px;
  display: flex;
  height: 60px;
}
#gauge {
  width: 150px;
}
</style>
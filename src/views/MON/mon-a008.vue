<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div>
      <div class="mona8Layout wrap">
        <div class="item ">
          <p class="title"><i class="dx-icon-event"></i>성서
            <img
              v-if="data.statusSS == '정상'"
              src="../../assets/green.svg"
              style="height: 10px"
            />
            <img
              v-else-if="data.statusSS != '정상' && data.statusSS != null"
              src="../../assets/red.svg"
              style="height: 10px"
              class="statusErr blink-statusErr"
            />
          </p>
          <mon8Temp type="SS" />
        </div>
        <div class="item">
          <p class="title"><i class="dx-icon-event"></i>현풍
            <img
              v-if="data.statusHP == '정상'"
              src="../../assets/green.svg"
              style="height: 10px"
            />
            <img
              v-else-if="data.statusHP != '정상' && data.statusHP != null"
              src="../../assets/red.svg"
              style="height: 10px"
              class="statusErr blink-statusErr"
            />
          </p>
          <mon8Temp type="HP" />
        </div>
        <div class="item">
          <mon8Tempchart />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, getCurrentInstance, onBeforeUnmount, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import mon8Temp from "@/components/MON/mon8-temp.vue";
import mon8Tempchart from '@/components/MON/mon8-tempchart.vue';
import errorAlert from "@/components/error-alert.vue";
import { utilTimer } from '@/utils/utilTimer.js';
import monComm from "@/components/MON/mon-comm.vue";

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      statusSS: null,
      statusHP: null
    })
    
    onMounted(() => {
      getMainData();
      utilTimer.resetTimer(60);
      utilTimer.setCallback(callTimerfunc);
      utilTimer.backTimer();
    });

    onBeforeUnmount(() => {
      utilTimer.clearTimer();
    });

    function callTimerfunc() {
      const remainingTime = utilTimer.getRemainingTime()
      if(remainingTime == 0) {
        utilTimer.resetTimer(60);
        getMainData();	
      }
    }

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA008_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }

      // TODO 202401223 경창 공장별 온도계 설치하면 외부온도 작업 필요 현재는 대구온도
      const outtemp = result.resultSet.pop();
      const hourlyDataList = result.resultSet.pop();

      for (let i = 0; i < hourlyDataList.length; i++) {
        // 날짜형식 재가공
        const tt = hourlyDataList[i].READTIME.split(' '); // 공백을 기준으로 나누기
        const dddd = tt[0].split('-'); // 날짜 부분을 '-'로 나누기

        // "01/18 00시" 형식으로 조합
        const newDateFormat = `${dddd[1]}/${dddd[2]} ${tt[1]}`;

        // // TODO 온도 소수점 한자리 보이도록 재가공
        // const originIntemp = hourlyDataList[i].in
        // const originOuttemp = hourlyDataList[i].out
        // const newIntempFormat = Number(originIntemp.toFixed(1))
        // const newOuttempFormat = Number(originOuttemp.toFixed(1))
        // console.log(newOuttempFormat)

        // 변경된 값을 데이터에 적용
        hourlyDataList[i].TIME = newDateFormat;
        // hourlyDataList[i].in = newIntempFormat;
        // hourlyDataList[i].out = newOuttempFormat;
      }

      emitter.emit("sendChillerData", result.resultSet);
      emitter.emit("sendChillerHourlyData", hourlyDataList);
      emitter.emit("sendOutTempData", outtemp);


      // 통신불량 체크
      data.statusSS = result.resultSet[0][0].STATUSCHECK
      data.statusHP = result.resultSet[1][0].STATUSCHECK
      console.log(data)
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('.mona8Layout')
      if(n == false) {
        layout.style.height = '91vh'
      } else {
        layout.style.height = '85vh'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })

   
    return {
      data,
    };
  },
  components: {
    TitleName,
    mon8Temp,
    mon8Tempchart,
    monComm,
  },
};
</script>
<style scoped>
.mona8Layout{
  display: grid;
  height: 91vh;
  padding: 10px 1% 10px 1%;
  gap: 5% 0;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}
.item:nth-child(1), .item:nth-child(2){
  margin-left: 5%;
  width: 85%;
}
.item:nth-child(3) {
	grid-column: 1 / 3;
	grid-row: 2 / 4;
}

.title,
.title i {
  color: #222;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: -0.5px;
  line-height: 44px;
}

</style>

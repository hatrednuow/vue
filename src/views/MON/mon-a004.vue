<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div class="mona4Layout wrap">
      <div class="layout-inner">
        <div class="inner-div">
          <h2><i class="dx-icon-event"></i>성서
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
          </h2>
          <mon4Electron type="SS" />
        </div>
        <div class="inner-div">
          <h2><i class="dx-icon-event"></i>현풍
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
          </h2>
          <mon4Electron type="HP" />
        </div>
        <div class="inner-div">
          <h2><i class="dx-icon-event"></i>샤시</h2>
          <!-- <mon4Electron type="CS" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, reactive, getCurrentInstance, onBeforeUnmount, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilTimer } from "@/utils/utilTimer.js";
import mon4Electron from "@/components/MON/mon4-electron.vue";
import monComm from "@/components/MON/mon-comm.vue";

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const SSData = reactive({
      type: 'SS',
      usageAndPrice: [],
      peak: [],
    })
    const HPData = reactive({
      type: 'HP',
      usageAndPrice: [],
      peak: [] 
    })
    const data = reactive({
      statusSS: "",
      statusHP: ""
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
      const remainingTime = utilTimer.getRemainingTime();
      if (remainingTime == 0) {
        utilTimer.resetTimer(60);
        getMainData();
      }
    }

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA004_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
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
      SSData.usageAndPrice = result.resultSet[0]
      HPData.usageAndPrice = result.resultSet[1]
      SSData.peak = result.resultSet[2]
      HPData.peak = result.resultSet[3]

      const totalData = [SSData, HPData]

      emitter.emit("sendElectronData", totalData);

      // 통신불량 체크
      for(let eachData of result.resultSet[4]) {
        if(eachData.TYPE == 'HP') {
          data.statusHP = eachData.STATUSCHECK
        } else if (eachData.TYPE == 'SS') {
          data.statusSS = eachData.STATUSCHECK
        }
      }
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('.mona4Layout')
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
      data
    };
  },
  components: {
    TitleName, mon4Electron, monComm
  },
};
</script>
<style scoped>
.mona4Layout {
  height: 91vh;
}
.layout-inner {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 10px;
  padding: 5px 10px;
}
.inner-div h2,
.inner-div h2 i {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}
</style>

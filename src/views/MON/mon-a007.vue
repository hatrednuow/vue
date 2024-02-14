<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <!-- mon7Ess -->
    <div class="mona7Layout wrap">
      <div class="layout-inner">
        <div class="inner-div">
          <mon7Ess type="SS" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, reactive, getCurrentInstance, onBeforeUnmount } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilTimer } from '@/utils/utilTimer.js';
import mon7Ess from "@/components/MON/mon7-ess.vue";
import monComm from "@/components/MON/mon-comm.vue";

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const essData = reactive({
      data: []
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
        api: "PKG_MANAGER_MONA.GET_MONA007_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
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

      essData.data = result.resultSet
      emitter.emit("sendElectronData", essData.data);
    }

    return {};
  },
  components: {
    TitleName, mon7Ess, monComm
  },
};
</script>
<style scoped>
.mona7Layout {
  height: calc(100vh - 144px);
}
.layout-inner {
  /* 성서만 있으므로 grid사용 X */
  /* display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)); 
  column-gap: 10px; */
  padding: 5px 10px;
}
.inner-div h2,
.inner-div h2 i {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}
</style>

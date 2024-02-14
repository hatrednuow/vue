<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap mona1Layout">
      <div class="leftside item">
        <template v-if="typeList.data[0]">
          <DxLookup
            :data-source="typeList.data"
            display-expr="CODEVALUE"
            :input-attr="{ 'aria-label': 'Simple lookup' }"
            @value-changed="setSelectedValue"
          >
            <DxDropDownOptions :show-title="false"/>
          </DxLookup>
        </template>
        <mon1Cpgroup />
      </div>
      <div class="item">
        <mon1Reading />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, reactive, onBeforeUnmount, getCurrentInstance, watch } from "vue";
import { DxLookup, DxDropDownOptions } from 'devextreme-vue/lookup';
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilTimer } from '@/utils/utilTimer.js';
import mon1Cpgroup from "@/components/MON/mon1-cpgroup.vue";
import mon1Reading from "@/components/MON/mon1-reading.vue";
import monComm from "@/components/MON/mon-comm.vue";

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const typeList = reactive({
      data: [],
      selectedType: "",
    })

    onMounted(() => {
      getMainData();
    });
    
    onBeforeUnmount(() => {
      utilTimer.clearTimer();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA001_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "MONA001" }, //메뉴코드
          { dir: "in", val: typeList.selectedType }, // 계측기 종류
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
      const cpgrouppointList = result.resultSet[0];
      if(typeList.selectedType == "") {
        typeList.data = result.resultSet[1];
      }
      emitter.emit("sendCpgrouppointList", cpgrouppointList);
    }

    function setSelectedValue(e) {
      typeList.selectedType = e.value.CODEDEF;
      getMainData();
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('.mona1Layout')
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
      typeList, setSelectedValue
    };
  },
  components: {
    TitleName, DxLookup, DxDropDownOptions, mon1Cpgroup, mon1Reading, monComm
  },
};
</script>
<style scoped>
.mona1Layout{
  display: grid;
  height: 91vh;
  padding: 10px 1% 10px 1%;
  gap: 5% 10px;
  grid-template-columns: 0.4fr 1.6fr;
  grid-template-rows: 1fr;
}
</style>

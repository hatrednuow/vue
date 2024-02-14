<template>
  <div>
    <h2 class="content-block">Home</h2>
    <!-- <DxButton
      text="한전고객"
      type="normal"
      styling-mode="outlined"
      @click="getCustNoData"
    />
    <div>{{ data.custNoInfoList }}</div>

    <DxButton
      text="전력"
      type="normal"
      styling-mode="outlined"
      @click="getElectricData"
    />
    <div>{{ data.dayLpDataInfoList }}</div> -->
  </div>
</template>
<script>
// import DxButton from "devextreme-vue/button";
// import axios from "axios";
import { useStore } from "vuex";
import { onMounted, reactive } from "vue";
export default {
  setup() {
    const store = useStore();
    const data = reactive({
      custNoInfoList: [],
      dayLpDataInfoList: [],
    });

    onMounted(() => {
      // getClientIP();
    });

    async function getCustNoData() {
      let apiParams = {
        urlName: "getCustNoList.do?",
      };
      const result = await store.dispatch("api/edsAPI", apiParams);
      if (result.custNoInfoList[1].returnCode == undefined) {
        data.custNoInfoList = result.custNoInfoList;
      }
    }

    async function getElectricData() {
      let apiParams = {
        urlName: "getDayLpData.do?",
        custNo: "0526313042",
        date: "20231205",
      };
      const result = await store.dispatch("api/edsAPI", apiParams);
      if (result.dayLpDataInfoList[1] == undefined) {
        data.dayLpDataInfoList = result.dayLpDataInfoList[0];
      }
    }
    // async function getClientIP() {
    //   try {
    //     const response = await axios.get("https://api.ipify.org?format=json");
    //     console.log(response);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    return {
      data,
      getCustNoData,
      getElectricData,
    };
  },
  components: {
    // DxButton,
  },
};
</script>

<style lang="scss"></style>

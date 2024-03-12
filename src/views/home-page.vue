<template>
  <div>
    <!-- <h2 class="content-block">Home</h2> -->
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

    <!-- factory flow 1 -->
    <div class="flow bg1">
      <div class="factory__title--1">{{ factory1 }}</div>
      <div class="factory__flow">
        <div class="factory__flow--line">
          <img class="line1" src="../assets/factory/straight-1.gif" alt="">
          <img class="line2" src="../assets/factory/top-right-1.gif" alt="">
          <img class="line3" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line4" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line5" src="../assets/factory/top-right-2.gif" alt="">
          <img class="line6" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line7" src="../assets/factory/top-right-2.gif" alt="">
          <img class="line8" src="../assets/factory/pertigaan-3.gif" alt="">
          <img class="line9" src="../assets/factory/pertigaan-1.gif" alt="">
          <img class="line10" src="../assets/factory/straight-1-IN.gif" alt="">
          <img class="line11" src="../assets/factory/pertigaan-1.gif" alt="">
          <img class="line12" src="../assets/factory/straight-1-IN.gif" alt="">
          <img class="line13" src="../assets/factory/down-right-1.gif" alt="">
          <img class="line14" src="../assets/factory/pertigaan-2.gif" alt="">
          <img class="line15" src="../assets/factory/down-left-1.gif" alt="">
          <img class="line16" src="../assets/factory/down-right-1.gif" alt="">
          <img class="line17" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line18" src="../assets/factory/straight-2.gif" alt="">
          <img class="line19" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line20" src="../assets/factory/straight-2.gif" alt="">
          <img class="line21" src="../assets/factory/straight-2-out.gif" alt="">
        </div>
        <div class="factory__flow--base">
          <img class="base1" src="../assets/factory/tile2.gif" alt="">
          <img class="base2" src="../assets/factory/tile1.gif" alt="">
          <img class="base3" src="../assets/factory/tile1.gif" alt="">
          <img class="base4" src="../assets/factory/tile1.gif" alt="">
          <img class="base5" src="../assets/factory/tile2.gif" alt="">
          <img class="base6" src="../assets/factory/tile2.gif" alt="">
          <img class="base7" src="../assets/factory/tile2.gif" alt="">
          <img class="base8" src="../assets/factory/tile1.gif" alt="">
          <img class="base9" src="../assets/factory/tile3.gif" alt="">
        </div>
        <div class="factory__flow--label">
          <div class="label line label1">{{ factory_label1 }}</div>
          <div class="label line label2">{{ factory_label2 }}</div>
          <div class="label line label3">{{ factory_label3 }}</div>
          <div class="label line label4">{{ factory_label4 }}</div>
          <div class="label line label5">{{ factory_label5 }}</div>
          <div class="label line label6">{{ factory_label6 }}</div>
          <div class="label line2 label7">{{ factory_label7 }}</div>
        </div>
        <div class="factory__flow--machine">
          <img class="mac1" src="../assets/factory/icon-solarpanel.gif" alt="">
          <img class="mac2" src="../assets/factory/icon-tower.gif" alt="">
          <img class="mac3" src="../assets/factory/icon-factory.gif" alt="">
          <img class="mac4" src="../assets/factory/icon-cloudmachine.gif" alt="">
          <img class="mac5" src="../assets/factory/icon-machine1.gif" alt="">
          <img class="mac6" src="../assets/factory/icon-machine2.gif" alt="">
          <img class="mac7" src="../assets/factory/icon-machine3.gif" alt="">
          <img class="mac8" src="../assets/factory/icon-train.gif" alt="">
          <img class="mac9" src="../assets/factory/icon-factory.gif" alt="">
          <img class="cloud1" src="../assets/factory/icon-cloud.gif" alt="">
          <img class="cloud2" src="../assets/factory/icon-cloud.gif" alt="">
        </div>
      </div>
    </div>
    <!-- factory flow 1 -->

    <!-- factory flow 2 -->
    <div class="flow bg2">
      <div class="factory__title--1">{{ factory2 }}</div>
      <div class="factory__flow">
        <div class="factory__flow--line">
          <img class="line1" src="../assets/factory/straight-1.gif" alt="">
          <img class="line2" src="../assets/factory/top-right-1.gif" alt="">
          <img class="line3" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line4" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line5" src="../assets/factory/top-right-2.gif" alt="">
          <img class="line6" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line7" src="../assets/factory/top-right-2.gif" alt="">
          <img class="line8" src="../assets/factory/pertigaan-3.gif" alt="">
          <img class="line9" src="../assets/factory/pertigaan-1.gif" alt="">
          <img class="line10" src="../assets/factory/straight-1-IN.gif" alt="">
          <img class="line11" src="../assets/factory/pertigaan-1.gif" alt="">
          <img class="line12" src="../assets/factory/straight-1-IN.gif" alt="">
          <img class="line13" src="../assets/factory/down-right-1.gif" alt="">
          <img class="line14" src="../assets/factory/pertigaan-2.gif" alt="">
          <img class="line15" src="../assets/factory/down-left-1.gif" alt="">
          <img class="line16" src="../assets/factory/down-right-1.gif" alt="">
          <img class="line17" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line18" src="../assets/factory/straight-2.gif" alt="">
          <img class="line19" src="../assets/factory/straight-2-out.gif" alt="">
          <img class="line20" src="../assets/factory/straight-2.gif" alt="">
          <img class="line21" src="../assets/factory/straight-2-out.gif" alt="">
        </div>
        <div class="factory__flow--base">
          <img class="base1" src="../assets/factory/tile2.gif" alt="">
          <img class="base2" src="../assets/factory/tile1.gif" alt="">
          <img class="base3" src="../assets/factory/tile1.gif" alt="">
          <img class="base4" src="../assets/factory/tile1.gif" alt="">
          <img class="base5" src="../assets/factory/tile2.gif" alt="">
          <img class="base6" src="../assets/factory/tile2.gif" alt="">
          <img class="base7" src="../assets/factory/tile2.gif" alt="">
          <img class="base8" src="../assets/factory/tile1.gif" alt="">
          <img class="base9" src="../assets/factory/tile3.gif" alt="">
        </div>
        <div class="factory__flow--label">
          <div class="label line label1">{{ factory_label1 }}</div>
          <div class="label line label2">{{ factory_label2 }}</div>
          <div class="label line label3">{{ factory_label3 }}</div>
          <div class="label line label4">{{ factory_label4 }}</div>
          <div class="label line label5">{{ factory_label5 }}</div>
          <div class="label line label6">{{ factory_label6 }}</div>
          <div class="label line2 label7">{{ factory_label7 }}</div>
        </div>
        <div class="factory__flow--machine">
          <img class="mac1" src="../assets/factory/icon-solarpanel.gif" alt="">
          <img class="mac2" src="../assets/factory/icon-tower.gif" alt="">
          <img class="mac3" src="../assets/factory/icon-factory.gif" alt="">
          <img class="mac4" src="../assets/factory/icon-cloudmachine.gif" alt="">
          <img class="mac5" src="../assets/factory/icon-machine1-alt.gif" alt="">
          <img class="mac6" src="../assets/factory/icon-machine2-alt.gif" alt="">
          <img class="mac7" src="../assets/factory/icon-machine3.gif" alt="">
          <img class="mac8" src="../assets/factory/icon-train-alt.gif" alt="">
          <img class="mac9" src="../assets/factory/icon-factory.gif" alt="">
          <img class="cloud1" src="../assets/factory/icon-cloud.gif" alt="">
          <img class="cloud2" src="../assets/factory/icon-cloud.gif" alt="">
        </div>
      </div>
      <!-- <div class="factory__flow--label">
        <div class="label1"></div>
      </div> -->
    </div>
    <!-- factory flow 2 -->
  </div>
</template>
<script>
// import DxButton from "devextreme-vue/button";
// import axios from "axios";
import { useStore } from "vuex";
import { onMounted, reactive } from "vue";
export default {
  data() {
    return {
    factory1: '성서',
    factory2: '현풍',
    factory_label1: '운량데이터',
    factory_label2: '총사용량데이터',
    factory_label3: '냉각수데이터',
    factory_label4: '데이터',
    factory_label5: '데이터',
    factory_label6: '보일러데이터',
    factory_label7: '공장 각동온도 데이터',
    factory_label8: '운량데이터',
    factory_station1: '데이터',
    factory_station2: '데이터',
    factory_station3: '데이터',
    factory_station4: '데이터',
    };
  },
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

<style lang="scss">
.flow {
  display: block;
  width: 100vw;
  height: 1080px;
  margin: 0 auto;
}
.bg1 {
  background-image: url('../assets/bg1.jpg');
  background-repeat: repeat;
  background-size: 204px 118px;
}
.bg2 {
  background-image: url('../assets/bg2.jpg');
  background-repeat: repeat;
  background-size: 204px 118px;
}
.factory__title--1 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 50px;
  background-color: #fff;
  font-size: 24px;
  font-weight: 600;
}
.factory__flow {
  position: relative;
  display: block;
  width: 1920px;
  height: fit-content;
  margin: 0 auto;
  top: -27px;
  &--line {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .line1 {
      position: absolute;
      top: 459px;
      left: 241px;
    }
    .line2 {
      position: absolute;
      top: 372px;
      left: 91px;
    }
    .line3 {
      position: absolute;
      top: 270px;
      left: 229px;
    }
    .line4 {
      position: absolute;
      top: 255px;
      left: 257px;
    }
    .line5 {
      position: absolute;
      top: 204px;
      left: 392px;
    }
    .line6 {
      position: absolute;
      top: 171px;
      left: 722px;
    }
    .line7 {
      position: absolute;
      top: 120px;
      left: 856px;
    }
    .line8 {
      position: absolute;
      top: 190px;
      left: 1006px;
    }
    .line9 {
      position: absolute;
      top: 272px;
      left: 1146px;
    }
    .line10 {
      position: absolute;
      top: 327px;
      left: 1274px;
    }
    .line11 {
      position: absolute;
      top: 416px;
      left: 1396px;
    }
    .line12 {
      position: absolute;
      top: 484px;
      left: 1546px;
    }
    .line13 {
      position: absolute;
      top: 586px;
      left: 1668px;
    }
    .line14 {
      position: absolute;
      top: 496px;
      left: 1251px;
    }
    .line15 {
      position: absolute;
      top: 467px;
      left: 1152px;
    }
    .line16 {
      position: absolute;
      top: 573px;
      left: 1341px;
    }
    .line17 {
      position: absolute;
      top: 531px;
      left: 952px;
    }
    .line18 {
      position: absolute;
      top: 580px;
      left: 1007px;
    }
    .line19 {
      position: absolute;
      top: 648px;
      left: 1168px;
    }
    .line20 {
      position: absolute;
      top: 696px;
      left: 1223px;
    }
    .line21 {
      position: absolute;
      top: 224px;
      left: 857px;
    }
  }
  &--base {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .base1 {
      position: absolute;
      top: 244px;
      left: 229px;
    }
    .base2 {
      position: absolute;
      top: 439px;
      left: 247px;
    }
    .base3 {
      position: absolute;
      top: 120px;
      left: 468px;
    }
    .base4 {
      position: absolute;
      top: 174px;
      left: 761px;
    }
    .base5 {
      position: absolute;
      top: 319px;
      left: 1022px;
    }
    .base6 {
      position: absolute;
      top: 478px;
      left: 1048px;
    }
    .base7 {
      position: absolute;
      top: 598px;
      left: 1256px;
    }
    .base8 {
      position: absolute;
      top: 564px;
      left: 1455px;
    }
    .base9 {
      position: absolute;
      top: 584px;
      left: 805px;
    }
  }
  &--machine {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .mac1 {
      position: absolute;
      top: 458px;
      left: 310px;
    }
    .mac2 {
      position: absolute;
      top: 6px;
      left: 269px;
    }
    .mac3 {
      position: absolute;
      top: 167px;
      left: 548px;
    }
    .mac4 {
      position: absolute;
      top: 218px;
      left: 816px;
    }
    .mac5 {
      position: absolute;
      top: 312px;
      left: 1063px;
    }
    .mac6 {
      position: absolute;
      top: 459px;
      left: 1071px;
    }
    .mac7 {
      position: absolute;
      top: 610px;
      left: 1297px;
    }
    .mac8 {
      position: absolute;
      top: 615px;
      left: 1523px;
    }
    .mac9 {
      position: absolute;
      top: 631px;
      left: 972px;
    }
    .cloud1 {
      position: absolute;
      top: 80px;
      left: 507px;
    }
    .cloud2 {
      position: absolute;
      top: 592px;
      left: 817px;
    }
  }
  &--label {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .label {
      background-color: #1A3159;
      font-size: 28px;
      display: block;
      padding: 10px 30px;
      color: #ffffff;
      position: absolute;
    }
    .line {
      
      &::after {
        display: block;
        position: absolute;
        content: '';
        background-color: #1A3159;
        width: 2px;
        height: 120px;
        left: 0;
        top: 0;
      }
    }
    
    .line2 {
      
      &::after {
        display: block;
        position: absolute;
        content: '';
        background-color: #1A3159;
        width: 2px;
        height: 120px;
        left: 0;
        bottom: 0;
      }
    }
    .label1 {
      top: 490px;
      left: 553px;
      border-top-right-radius: 20px;
    }
    .label2 {
      top: 148px;
      left: 862px;
      border-top-right-radius: 20px;
    }
    .label3 {
      top: 295px;
      left: 1181px;
      border-top-right-radius: 20px;
    }
    .label4 {
      top: 453px;
      left: 1224px;
      border-top-right-radius: 20px;
    }
    .label5 {
      top: 574px;
      left: 1408px;
      border-top-right-radius: 20px;
    }
    .label6 {
      top: 575px;
      left: 1607px;
      border-top-right-radius: 20px;
    }
    .label7 {
      top: 857px;
      left: 1041px;
      border-bottom-right-radius: 20px;
    }
  }
}
</style>

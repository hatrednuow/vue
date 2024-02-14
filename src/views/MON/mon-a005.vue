<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div class="doubleWrap wrap">
      <div class="openBtnWrap">
        <i class="dx-icon-money" @click="togglePopup"></i>
      </div>
      <div class="mona5Layout inner">
        <div 
          class="item"
          v-for="i in 3" :key="i"
          >
          <p class="title"><i class="dx-icon-event"></i>{{i}}발전소
            <template v-if="data.statusPlant[i - 1]">
              <img
                v-if="data.statusPlant[i - 1].STATUSCHECK == '정상'"
                src="../../assets/green.svg"
                style="height: 10px"
              />
              <img
                v-else-if="data.statusPlant[i - 1].STATUSCHECK != '정상' && data.statusPlant[i - 1].STATUSCHECK != null"
                src="../../assets/red.svg"
                style="height: 10px"
                class="statusErr blink-statusErr"
              />
            </template>
          </p>
          <powerPlant :plant="i + '발전소'" />
        </div>
      </div>
    </div>
    <!-- 비용 단가 팝업 화면 창 -->
    <DxPopup
      :height="320"
      :width="300"
      title="태양광 비용 단가"
      v-model:visible="isPopupVisible"
      content-template="popup-content"
      :hide-on-outside-click="true">
      <template #popup-content>
        <div>
          <div>REC 단가</div>
          <DxNumberBox
            ref="RecData"
            :disabled=option.valueDisabled
            :value="unitPrice.REC"
            format="#,##0.##"
          />
          <br><br>
          <div>SMP 단가</div>
          <DxNumberBox
            ref="SmpData"
            :disabled=option.valueDisabled
            :value="unitPrice.SMP"
            format="#,##0.##"
          />
          <br>
          <div class="btnFlex">
            <DxButton
              text="수정"
              type="normal"
              styling-mode="outlined"
              @click="changeValue"
            />
            <!-- <DxButton
              text="저장"
              type="normal"
              styling-mode="outlined"
              @click="saveValue"
            /> -->
            <DxButton
              text="닫기"
              type="normal"
              styling-mode="outlined"
              @click="togglePopup"
            />
          </div>
        </div>
    </template> 
    </DxPopup>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, reactive, ref, onBeforeUnmount, getCurrentInstance, watch } from "vue";
import { useRouter } from "vue-router";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import powerPlant from "@/components/MON/mon5-plant.vue";
import { DxButton } from "devextreme-vue/button";
import { DxPopup } from 'devextreme-vue/popup';
import { DxNumberBox } from "devextreme-vue/number-box";
import { utilTimer } from '@/utils/utilTimer.js';
import monComm from "@/components/MON/mon-comm.vue";


// db 로컬
import mon5dataLocal from '@/data/mon5data'

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const router = useRouter();
    const userInfo = store.getters["user/userInfo"];
    let isPopupVisible = ref(false);
    const unitPrice = reactive({
      REC: 0,
      SMP: 0
    })
    const option = reactive({
      valueDisabled: true,
    });
    const RecData = ref(null);
    const SmpData = ref(null);
    const totalPowerPlant = reactive({
      dataList: []
    })
    const data = reactive({
      statusPlant: []
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
      /* const apiParams = {
        api: "PKG_MANAGER_MONA.GET_MONA005_DATA",
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
      } */

      // db 로컬
      const result = {
        resultSet: mon5dataLocal
      }

      // 단가 바인딩
      bindingUnit(result.resultSet[0])
      // 발전소별 데이터 가공
      totalPowerPlant.dataList = result.resultSet[1];
      const inverterList = result.resultSet[2];
      for ( const solarData of totalPowerPlant.dataList ) {
        solarData['inverterData'] = []
        for (const inverter of inverterList) {
          if (solarData["UPCPGROUPNAME"] === inverter["UPCPGROUPNAME"]) {
            solarData['inverterData'].push(inverter);
          }
        }
      }
      emitter.emit("sendSunPowerData", totalPowerPlant);
      // 발전소별 통신체크 확인
      const timecheck = inverterList.reduce((acc, curr) => {
      if (!acc[curr.UPCPGROUPNAME]) {
          acc[curr.UPCPGROUPNAME] = {
            "UPCPGROUPNAME": curr.UPCPGROUPNAME,
            "STATUSCHECK": curr.STATUSCHECK
          };
        } else if (curr.STATUSCHECK !== "정상") {
            acc[curr.UPCPGROUPNAME].STATUSCHECK = curr.STATUSCHECK;
        }
        return acc;
      }, {});

      const finalResult = Object.values(timecheck).sort((a, b) => {
        return a.UPCPGROUPNAME.localeCompare(b.UPCPGROUPNAME);
      });

      data.statusPlant = finalResult;
    }

    function togglePopup() {
      isPopupVisible.value = !isPopupVisible.value
    }

    function changeValue() {
      // option.valueDisabled = false;
      router.push("/SYSA002");
    }
    
    // function saveValue() {
      //   // db 저장하기 추가 필요
    //   const RECData = Number(RecData.value.instance._changedValue)
    //   const SMPData = Number(SmpData.value.instance._changedValue)
    //   console.log(RECData, SMPData)
    //   // db 저장 완료 
    //   option.valueDisabled = true;
    // }

    function bindingUnit(arr) {
      unitPrice.REC = getConstantValue("REC", arr);
      unitPrice.SMP = getConstantValue("SMP", arr);
    }

    function getConstantValue(unittype, arr) {
      const item = arr.find(entry => entry.UNITTYPE === unittype);
      return item ? item.CONSTANTVALUE : null;
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('.mona5Layout')
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
      togglePopup, isPopupVisible, unitPrice, option, changeValue, /* saveValue, */ RecData, SmpData, data
    };
  },
  components: {
    TitleName,
    powerPlant,
    DxButton,
    DxPopup,
    DxNumberBox,
    monComm
  },
};
</script>
<style scoped>
.mona5Layout{
  display: grid;
  height: 91vh;
  padding: 10px 1% 10px 1%;
  gap: 1%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
}

.item{
  border-radius: 5px;
  padding: 0 7px;
  overflow-y: auto; 
}

.title,
.title i {
  color: #222;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: -0.5px;
  line-height: 44px;
  margin-bottom: 8px;
}
.doubleWrap{
  position: relative;
}
.openBtnWrap{
  position: absolute;
  right: 10px;
  top: 10px;
}
.openBtnWrap i {
  color: #222;
  font-size: 1.55rem;
  font-weight: bold;
  letter-spacing: -0.5px;
  line-height: 44px;
}
.btnFlex{
  display: flex;
  gap: 5px;
  justify-content: flex-end; 
}
</style>

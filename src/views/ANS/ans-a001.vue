<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="ansa1Layout wrap">
      <div class="borderBox item">
        <div class="title">조회 정보</div>
        <ul class="infolist">
          <li class="infoinnerflex">
            <div class="keybox">구분</div>
            <div class="smallbox">
              <label for="15minute">
                <input type="radio" name="gubun" id="15minute" @click="clickSelectPeriod('15minute')" checked>
                15분 단위
              </label>
              <label for="1hour">
                <input type="radio" name="gubun" id="1hour" @click="clickSelectPeriod('1hour')">
                시간 단위
              </label>
              <label for="1day">
                <input type="radio" name="gubun" id="1day" @click="clickSelectPeriod('1day')">
                일 단위
              </label>
              <label for="1month">
                <input type="radio" name="gubun" id="1month" @click="clickSelectPeriod('1month')">
                월 단위
              </label>
              <label for="1year">
                <input type="radio" name="gubun" id="1year" @click="clickSelectPeriod('1year')">
                년 단위
              </label>
            </div>
          </li>
          <li class="infoinnerflex">
            <div class="keybox">일자</div>
            <div class="dateboxWrap">
              <DxDateBox
                class="dateSelectBox"
                type="datetime"
                :value="data.startDate"
                display-format="yyyy-MM-dd"
                @value-changed="changeStartDate"
                applyButtonText="선택"
                cancelButtonText="취소"
              />
              <div class="dateTildeSign">~</div>
              <DxDateBox
                class="dateSelectBox"
                type="datetime"
                :value="data.endDate"
                display-format="yyyy-MM-dd"
                @value-changed="changeEndDate"
                applyButtonText="선택"
                cancelButtonText="취소"
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="item">
        <ansa1Chart />
      </div>
      <div class="borderBox item">
        <div class="title">전력사용 편익</div>
        <ansa1Table />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, reactive, onBeforeUnmount, getCurrentInstance } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import DxDateBox from "devextreme-vue/date-box";
import ansa1Table from '@/components/ANS/ansa1-table.vue';
import { extra } from "@/utils/extra";
import ansa1Chart from '@/components/ANS/ansa1-chart.vue';

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const data = reactive({
      selectPeriod: "",
      flag: "0",
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(),  
      startDateStr: extra.dataTimeToStr(new Date(new Date().setHours(0, 0, 0, 0))),
      endDateStr: extra.dataTimeToStr(new Date()),
    })
    
    onMounted(() => {
      emitter.emit("sendAnsaSelectedDateData", {start: data.startDateStr, end: data.endDateStr});
      getMainData();
    });
    
    onBeforeUnmount(() => {
    });
    
    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_ANSB.GET_ANSB002_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: data.startDateStr.slice(0, 8) },  // 검색일자 START 
          { dir: "in", val: data.endDateStr.slice(0, 8) },    // 검색일자 END
          { dir: "in", val: data.flag },                      // 기간 0: 15분 1: 시간 2: 일 3: 월 4: 년
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
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

      console.log('123456', result)
      const chartData = result.resultSet[0];
      const tableData = result.resultSet[1];
      emitter.emit("sendAnsa1ChartData", chartData);
      emitter.emit("sendAnsa1TableData", tableData);
    }

    function changeStartDate(e) {
      const startTimeStr =  extra.dataTimeToStr(e.value)
      data.startDateStr = startTimeStr
      getMainData();
      emitter.emit("sendAnsaSelectedDateData", {start: data.startDateStr, end: data.endDateStr});
    }

    function changeEndDate(e) {
      const endTimeStr =  extra.dataTimeToStr(e.value)
      data.endDateStr = endTimeStr
      getMainData();
      emitter.emit("sendAnsaSelectedDateData", {start: data.startDateStr, end: data.endDateStr});
    }

    function clickSelectPeriod(gubun) {
      data.selectPeriod = gubun

      switch (data.selectPeriod) {
        case '15minute':
          data.flag = 0;
          break;
        case '1hour':
          data.flag = 1;
          break;
        case '1day':
          data.flag = 2;
          break;
        case '1month':
          data.flag = 3;
          break;
        case '1year':
          data.flag = 4;
          break;
        default:
          data.flag = 0;
      }

      getMainData();
    }
   
    return {
      data,
      changeStartDate,
      changeEndDate,
      clickSelectPeriod,
    };
  },

  components: {
    TitleName, DxDateBox, ansa1Table, ansa1Chart
  },
};
</script>
<style scoped>
.ansa1Layout{
  display: grid;
  height: 85vh;
  padding: 10px 1% 10px 1%;
  gap: 3px 0;
  grid-template-columns: 1fr;
  grid-template-rows: 0.6fr 1.6fr 0.6fr;
}
.borderBox{
  position: relative;
  border: 2px solid #e3e3e3;
  border-radius: 5px;
  font-size: 16px;
}
.borderBox .title{
  position: absolute;
  top: -10px;
  left: 5px;
  background-color: #fff;
}
.infolist{
  list-style: none;
  display: flex;
  flex-direction: column; 
  gap: 10px;
}
.infolist .infoinnerflex{
  display: flex;
  gap: 10px;
  align-items: center;
}
.infolist .infoinnerflex .keybox{
  width: 50px;
  text-align: right;
}
.infolist .infoinnerflex .smallbox{
  border: 1px solid #e3e3e3;
  background-color: #f7f6f6;
  padding: 10px 3px;
}
.smallbox label{
  margin-right: 10px;
}
.dateboxWrap{
  display: flex;
}
.dateTildeSign {
  position: relative;
  top: 18px;
  width: 60px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
}
.dateSelectBox{
  width: 150px;
}
</style>

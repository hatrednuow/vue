<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div class="mona3Layout wrap">
      <ul class="tabnav">
        <li><a class="active" href="javascript:void(0);">전력</a></li>
        <li><a href="javascript:void(0);" @click="tabClick()">공조</a></li>
      </ul>
      <div class="layout-inner">
        <div class="inner-div">
          <div class="status"><span class="dot green"></span>성서</div>
            <table class="tabMain">
              <colgroup>
                <col width="30%">
                <col width="calc(35% / 2)">
                <col width="calc(35% / 2)">
                <col width="35%">
              </colgroup>
              <tr>
                <th rowspan="2">전력량KWH</th>
                <th colspan="2">일</th>
                <th>월</th>   
              </tr>
              <tr>
                <td colspan="2">180kwh</td>
                <td>4,208kwh</td>
              </tr>
              <tr>
                <th>요금</th>
                <td colspan="2">11,671,142원</td>
                <td>352,586,627원</td>
              </tr>
              <tr>
                <th>피크</th>
                <td>7,434kw</td>
                <th>피크일자</th>
                <td>02-07  04:30</td>
              </tr>
            </table>
            
            <table class="tabMain m30">
              <colgroup>
                <col width="30%">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
              </colgroup>
              <tr>
                <th rowspan="2">총사용량</th>
                <th>380</th>
                <th>440</th>   
                <th>220</th>  
                <th>3300</th> 
                <th>합계</th> 
              </tr>
              <tr>
                <td>180kw</td>
                <td>4,208kw</td>
                <td>1,081kw</td>
                <td>89kw</td>
                <td>5,557kw</td>
              </tr>
              <tr>
                <th>공장</th>
                <td>2.6%</td>
                <td>2.6%</td>
                <td>2.6%</td>
                <td>2.6%</td>
                <td>2.6%</td>
              </tr>
              <tr>
                <th>콤프</th>
                <td>0.0%</td>
                <td>0.0%</td>
                <td>0.0%</td>
                <td>0.0%</td>
                <td>0.0%</td>
              </tr>
            </table>

            <table class="tabMain m30">
              <!-- <colgroup>
                <col width="30%">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
              </colgroup> -->
              <tr>
                <th></th>
                <th>변압기</th>
                <th>유효전력</th>   
                <th>공장</th>  
                <th>콤프</th> 
                <th>피크</th> 
                <th>피크일자</th> 
                <th>예비율</th> 
              </tr>
              <!-- loop -->
              <tr>
                <th rowspan="6" class="bb">1수전실</th>
                <td>4410#1</td>
                <td>784kw</td>
                <td>11.5%</td>
                <td>4.2%</td>
                <td>1,003.30</td>
                <td>2024-02-02 14:29</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>324kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>324kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <!-- loop -->
              <!-- loop -->
              <tr>
                <th rowspan="6">2수전실</th>
                <td>4410#1</td>
                <td>784kw</td>
                <td>11.5%</td>
                <td>4.2%</td>
                <td>1,003.30</td>
                <td>2024-02-02 14:29</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>324kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>324kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <!-- loop -->
              <!-- loop -->
              <tr>
                <th rowspan="6" colspan="2" class="brbl10">합계</th>
                <td>5,557kw</td>
                <td>85%</td>
                <td>NaN%</td>
                <td>7,276.8kw</td>
                <th colspan="3"></th>
              </tr>
              
              <!-- loop -->
              
            </table>

          <!-- <h2>
            <i class="dx-icon-event"></i>성서
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
          </h2> -->
          <!-- <div class="table-grid">
            <div>
              <mon3tableTop type="SS"></mon3tableTop>
            </div>
            <div>
              <mon3tableMid type="SS"></mon3tableMid>
            </div>
            <div style="border: 1px solid red">
              <mon3tableBottom type="SS"></mon3tableBottom>
            </div>
          </div> -->
        </div>
        <div class="inner-div">
          <div class="status"><span class="dot red"></span>현풍</div>
            <table class="tabMain">
                <tr>
                  <th rowspan="2">전력량KWH</th>
                  <th colspan="2">일</th>
                  <th>월</th>   
                </tr>
                <tr>
                  <td colspan="2">180kwh</td>
                  <td>4,208kwh</td>
                </tr>
                <tr>
                  <th>요금</th>
                  <td colspan="2">11,671,142원</td>
                  <td>352,586,627원</td>
                </tr>
                <tr>
                  <th>피크</th>
                  <td>7,434kw</td>
                  <th>피크일자</th>
                  <td>02-07  04:30</td>
                </tr>
              </table>

              <table class="tabMain m30">
              <colgroup>
                <col width="30%">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
              </colgroup>
              <tr>
                <th rowspan="2">총사용량</th>
                <th>380</th>
                <th>440</th>   
                <th>220</th>  
                <th>3300</th> 
                <th>합계</th> 
              </tr>
              <tr>
                <td>180kw</td>
                <td>4,208kw</td>
                <td>1,081kw</td>
                <td>89kw</td>
                <td>5,557kw</td>
              </tr>
              <tr>
                <th>공장</th>
                <td>2.6%</td>
                <td>2.6%</td>
                <td>2.6%</td>
                <td>2.6%</td>
                <td>2.6%</td>
              </tr>
              <tr>
                <th>콤프</th>
                <td>0.0%</td>
                <td>0.0%</td>
                <td>0.0%</td>
                <td>0.0%</td>
                <td>0.0%</td>
              </tr>
            </table>

            <table class="tabMain m30">
              <!-- <colgroup>
                <col width="30%">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
                <col width="calc(70% / 6)">
              </colgroup> -->
              <tr>
                <th></th>
                <th>변압기</th>
                <th>유효전력</th>   
                <th>공장</th>  
                <th>콤프</th> 
                <th>피크</th> 
                <th>피크일자</th> 
                <th>예비율</th> 
              </tr>
              <!-- loop -->
              <tr>
                <th rowspan="6" class="bb">1수전실</th>
                <td>4410#1</td>
                <td>784kw</td>
                <td>11.5%</td>
                <td>4.2%</td>
                <td>1,003.30</td>
                <td>2024-02-02 14:29</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>324kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>324kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <!-- loop -->
              <!-- loop -->
              <tr>
                <th rowspan="6">2수전실</th>
                <td>4410#1</td>
                <td>784kw</td>
                <td>11.5%</td>
                <td>4.2%</td>
                <td>1,003.30</td>
                <td>2024-02-02 14:29</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>324kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>324kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <tr>
                <td>2209#1</td>
                <td>784kw</td>
                <td>4.3%</td>
                <td>0.0%</td>
                <td>370.71</td>
                <td>2024-02-08 07:09</td>
                <td>%</td>
              </tr>
              <!-- loop -->
              <!-- loop -->
              <tr>
                <th rowspan="6" colspan="2" class="brbl10">합계</th>
                <td>5,557kw</td>
                <td>85%</td>
                <td>NaN%</td>
                <td>7,276.8kw</td>
                <th colspan="3"></th>
              </tr>
              
              <!-- loop -->
              
            </table>
          <!-- <h2>
            <i class="dx-icon-event"></i>현풍
            <img
              v-if="data.statusHP == '정상'"
              src="../../assets/green.svg"
              style="height: 10px"
            />
            <img
              v-else-if="data.statusHP != '정상' && data.statusSS != null"
              src="../../assets/red.svg"
              style="height: 10px"
              class="statusErr blink-statusErr"
            />
          </h2> -->
          <!-- <div class="table-grid">
            <div>
              <mon3tableTop type="HP"></mon3tableTop>
            </div>
            <div>
              <mon3tableMid type="HP"></mon3tableMid>
            </div>

            <mon3tableBottom type="HP"></mon3tableBottom>
          </div> -->
        </div>
        <!-- <div class="inner-div">
          <h2><i class="dx-icon-event"></i>샤시</h2>
          <div class="table-grid"></div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { onMounted, reactive, getCurrentInstance, onBeforeUnmount } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilTimer } from "@/utils/utilTimer.js";
import mon3tableTop from "@/components/MON/mon3-tableTop.vue";
import mon3tableMid from "@/components/MON/mon3-tableMid.vue";
import mon3tableBottom from "@/components/MON/mon3-tableBottom.vue";
import monComm from "@/components/MON/mon-comm.vue";

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const router = useRouter();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getGroupData: [],
      statusSS: null,
      statusHP: null,
    });

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
        api: "PKG_MANAGER_MONA.GET_MONA003_DATA#1",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
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
      data.statusSS = result.resultSet[0][3].THISDAY_POWER;
      data.statusHP = result.resultSet[1][3].THISDAY_POWER;
      data.getGroupData.push(result.resultSet[0]);
      data.getGroupData.push(result.resultSet[1]);

      emitter.emit("sendScadaMon3#1", data.getGroupData);

      const apiParams1 = {
        api: "PKG_MANAGER_MONA.GET_MONA003_DATA#2",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result1 = await store.dispatch("api/kcfemsAPI", apiParams1);
      if (result1.result != true) {
        errorAlert(result1.errmsg);
        return;
      }
      emitter.emit("sendScadaMon3#2", result1.resultSet);

      const apiParams2 = {
        api: "PKG_MANAGER_MONA.GET_MONA003_DATA#3",
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
      const result2 = await store.dispatch("api/kcfemsAPI", apiParams2);
      if (result2.result != true) {
        errorAlert(result2.errmsg);
        return;
      }
      emitter.emit("sendScadaMon3#3", result2.resultSet);
    }

    function tabClick() {
      router.push("/MONA003-1");
    }

    return { data, tabClick };
  },
  components: {
    TitleName,
    mon3tableTop,
    mon3tableMid,
    mon3tableBottom,
    monComm,
  },
};
</script>
<style scoped>
.mona3Layout {
  /* height: calc(100vh - 144px); */
  height:fit-content;
  
}
.layout-inner {
  display: grid;
  /* grid-template-columns: repeat(3, minmax(0, 1fr)); */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 40px;
  padding: 0 40px;
}

.inner-div h2,
.inner-div h2 i {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}

.table-grid div {
  padding-bottom: 5px;
}
.tabnav {
  font-size: 0;
  border-bottom: 1px solid #ddd;
}
.tabnav li {
  display: inline-block;
  height: 30px;
  text-align: center;
  border-right: 1px solid #ddd;
}
.tabnav li:first-child {
  border-left: 1px solid #ddd;
}
.tabnav li a:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0px;
  width: 100%;
  height: 3px;
}
.tabnav li a.active:before {
  background: #1d4980;
}
.tabnav li a.active {
  border-bottom: 1px solid #fff;
}
.tabnav li a {
  position: relative;
  display: block;
  background: #f8f8f8;
  color: #000;
  padding: 0 30px;
  line-height: 30px;
  text-decoration: none;
  font-size: 14px;
}
.tabnav li a:hover,
.tabnav li a.active {
  background: #fff;
  color: #1d4980;
}
</style>

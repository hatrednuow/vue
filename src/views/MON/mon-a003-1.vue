<template>
  <div>
    <monComm />
    <div>
      <title-name></title-name>
    </div>
    <div class="mona3Layout wrap">
      <ul class="tabnav">
        <li><a href="javascript:void(0);" @click="tabClick()">전력</a></li>
        <li><a class="active" href="javascript:void(0);">공조</a></li>
      </ul>
      <div class="layout-inner">
        <div class="inner-div">
          <div class="status"><span class="dot green"></span>성서</div>
          <table class="tabMain">
            <colgroup>
              <col width="33.3%">
              <col width="33.3%">
              <col width="33.3%">
            </colgroup>
            <tr>
              <th>냉동기1</th>
              <th>냉동기2</th>
              <th>냉동기3</th>   
            </tr>
            <tr>
              <td>OFF</td>
              <td>OFF</td>
              <td>ON</td>
            </tr>
          </table>
          <!-- tab zebra -->
          <table class="tabMain zeb m30">
            <colgroup>
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
            </colgroup>
            <tr>
              <th colspan="3">냉수</th>
              <th colspan="3">냉각수</th> 
            </tr>
            <tr>
              <td>1 냉수공급</td>
              <td>2 냉수공급</td>
              <td>3 냉수공급</td>
              <td>1 냉수공급</td>
              <td>2 냉수공급</td>
              <td>3 냉수공급</td>
            </tr>
            <tr>
              <td>20.7℃</td>
              <td>25.5℃</td>
              <td>20.7℃</td>
              <td>20.7℃</td>
              <td>25.5℃</td>
              <td>20.7℃</td>
            </tr>
            <tr>
              <td>1 냉수공급</td>
              <td>2 냉수공급</td>
              <td>3 냉수공급</td>
              <td>1 냉수공급</td>
              <td>2 냉수공급</td>
              <td>3 냉수공급</td>
            </tr>
            <tr>
              <td>20.7℃</td>
              <td>25.5℃</td>
              <td>20.7℃</td>
              <td>20.7℃</td>
              <td>25.5℃</td>
              <td>20.7℃</td>
            </tr>
            <tr>
              <td colspan="6">
                <table class="inf">
                <colgroup>
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                </colgroup>
                <tr>
                  <td>펌프1</td>
                  <td>펌프2</td>
                  <td>펌프3</td>
                  <td>펌프4</td>
                  <td>펌프1</td>
                  <td>펌프2</td>
                  <td>펌프3</td>
                  <td>펌프4</td>
                </tr>
                <tr>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                </tr>
              </table>
              </td>
            </tr>
          </table>
          <!-- tab sebra -->
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
            </colgroup>
            <tr>
              <th>냉각탑휀1</th>
              <th>냉각탑휀2</th>
              <th>냉각탑휀3</th>
              <th>냉각탑휀4</th>
              <th>냉각탑휀5</th>
              <th>냉각탑휀6</th>
            </tr>
            <tr>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
            </tr>
          </table>
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
            </colgroup>
            <tr>
              <th>A동</th>
              <th>B동#1</th>
              <th>B동#2</th>
              <th>B동#3</th>
              <th>C동#1</th>
              <th>C동#2</th>
              <th>C동#3</th>
              <th>D동</th>
              <th>E동</th>
            </tr>
            <tr>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
            </tr>
          </table>
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="50%">
              <col width="50%">
            </colgroup>
            <tr>
              <th>보일러1</th>
              <th>보일러2</th>
            </tr>
            <tr>
              <td>OFF</td>
              <td>ON</td>
            </tr>
          </table>
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="25%">
              <col width="25%">
              <col width="25%">
              <col width="25%">
            </colgroup>
            <tr>
              <th>보일러1 공급온도</th>
              <th>보일러1 환수온도</th>
              <th>보일러2 공급온도</th>
              <th>보일러2 환수온도</th>
            </tr>
            <tr>
              <td>44.1℃</td>
              <td>44.1℃</td>
              <td>44.1℃</td>
              <td>44.1℃</td>
            </tr>
          </table>
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="33.3%">
              <col width="33.3%">
              <col width="33.3%">
            </colgroup>
            <tr>
              <th>온수펌프1</th>
              <th>온수펌프2</th>
              <th>온수펌프3</th>
            </tr>
            <tr>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
            </tr>
          </table>
          <table class="tabMain lasTab pad10 m30">
            <colgroup>
              <col width="20%">
              <col width="40%">
              <col width="40%">
            </colgroup>
            <tr>
              <th rowspan="2">가스</th>
              <th class="bb">일</th>
              <td>0.38계산</td>
            </tr>
            <tr>
              <th class="bb">일</th>
              <td>765035계산</td>
            </tr>
            <tr>
              <th rowspan="2" class="brbl10">가스</th>
              <th>일</th>
              <td>0.38계산</td>
            </tr>
            <tr>
              <th class="bb">일</th>
              <td>765035계산</td>
            </tr>
          </table>
          <!-- <h2><i class="dx-icon-event"></i>성서</h2>
          <div class="table-grid">
            <mon3_1SSTable></mon3_1SSTable>
          </div> -->
        </div>
        <div class="inner-div">
          <div class="status"><span class="dot red"></span>현풍</div>
          <table class="tabMain">
            <colgroup>
              <col width="50%">
              <col width="50%">
            </colgroup>
            <tr>
              <th>냉동기1</th>
              <th>냉동기2</th>
            </tr>
            <tr>
              <td>OFF</td>
              <td>OFF</td>
            </tr>
          </table>
          <!-- tab zebra -->
          <table class="tabMain zeb m30">
            <colgroup>
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
            </colgroup>
            <tr>
              <th colspan="3">냉수</th>
              <th colspan="3">냉각수</th> 
            </tr>
            <tr>
              <td>1 냉수공급</td>
              <td>2 냉수공급</td>
              <td>3 냉수공급</td>
              <td>1 냉수공급</td>
              <td>2 냉수공급</td>
              <td>3 냉수공급</td>
            </tr>
            <tr>
              <td>20.7℃</td>
              <td>25.5℃</td>
              <td>20.7℃</td>
              <td>20.7℃</td>
              <td>25.5℃</td>
              <td>20.7℃</td>
            </tr>
            <tr>
              <td>1 냉수공급</td>
              <td>2 냉수공급</td>
              <td>3 냉수공급</td>
              <td>1 냉수공급</td>
              <td>2 냉수공급</td>
              <td>3 냉수공급</td>
            </tr>
            <tr>
              <td>20.7℃</td>
              <td>25.5℃</td>
              <td>20.7℃</td>
              <td>20.7℃</td>
              <td>25.5℃</td>
              <td>20.7℃</td>
            </tr>
            <tr>
              <td colspan="6">
                <table class="inf">
                <colgroup>
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                  <col width="12.5%">
                </colgroup>
                <tr>
                  <td>펌프1</td>
                  <td>펌프2</td>
                  <td>펌프3</td>
                  <td>펌프4</td>
                  <td>펌프1</td>
                  <td>펌프2</td>
                  <td>펌프3</td>
                  <td>펌프4</td>
                </tr>
                <tr>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                  <td>OFF</td>
                </tr>
              </table>
              </td>
            </tr>
          </table>
          <!-- tab sebra -->
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
              <col width="16.6666666667%">
            </colgroup>
            <tr>
              <th>냉각탑휀1</th>
              <th>냉각탑휀2</th>
              <th>냉각탑휀3</th>
              <th>냉각탑휀4</th>
              <th>냉각탑휀5</th>
              <th>냉각탑휀6</th>
            </tr>
            <tr>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
            </tr>
          </table>
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
              <col width="11.1111111111%">
            </colgroup>
            <tr>
              <th>A동</th>
              <th>B동#1</th>
              <th>B동#2</th>
              <th>B동#3</th>
              <th>C동#1</th>
              <th>C동#2</th>
              <th>C동#3</th>
              <th>D동</th>
              <th>E동</th>
            </tr>
            <tr>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
              <td>16.6℃</td>
            </tr>
          </table>
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="50%">
              <col width="50%">
            </colgroup>
            <tr>
              <th>보일러1</th>
              <th>보일러2</th>
            </tr>
            <tr>
              <td>OFF</td>
              <td>ON</td>
            </tr>
          </table>
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="25%">
              <col width="25%">
              <col width="25%">
              <col width="25%">
            </colgroup>
            <tr>
              <th>보일러1 공급온도</th>
              <th>보일러1 환수온도</th>
              <th>보일러2 공급온도</th>
              <th>보일러2 환수온도</th>
            </tr>
            <tr>
              <td>44.1℃</td>
              <td>44.1℃</td>
              <td>44.1℃</td>
              <td>44.1℃</td>
            </tr>
          </table>
          <table class="tabMain pad10 m30">
            <colgroup>
              <col width="33.3%">
              <col width="33.3%">
              <col width="33.3%">
            </colgroup>
            <tr>
              <th>온수펌프1</th>
              <th>온수펌프2</th>
              <th>온수펌프3</th>
            </tr>
            <tr>
              <td>OFF</td>
              <td>OFF</td>
              <td>OFF</td>
            </tr>
          </table>
          <table class="tabMain lasTab pad10 m30">
            <colgroup>
              <col width="20%">
              <col width="40%">
              <col width="40%">
            </colgroup>
            <tr>
              <th rowspan="2">가스</th>
              <th class="bb">일</th>
              <td>0.38계산</td>
            </tr>
            <tr>
              <th class="bb">일</th>
              <td>765035계산</td>
            </tr>
            <tr>
              <th rowspan="2" class="brbl10">가스</th>
              <th>일</th>
              <td>0.38계산</td>
            </tr>
            <tr>
              <th class="bb">일</th>
              <td>765035계산</td>
            </tr>
          </table>
          <!-- <h2><i class="dx-icon-event"></i>현풍</h2>
          <div class="table-grid">
            <mon3_1HPTable></mon3_1HPTable>
          </div> -->
        </div>
        <!-- <div class="inner-div">
          <h2><i class="dx-icon-event"></i>샤시</h2>
          <div class="table-grid"></div>
        </div> -->

        <!-- <div class="inner-left">
          <h2><i class="dx-icon-event"></i>성서</h2>
          <div class="table-grid">
            <mon3_1SSTable></mon3_1SSTable>
          </div>
        </div>
        <div class="inner-right">
          <h2><i class="dx-icon-event"></i>현풍</h2>
          <div class="table-grid">
            <mon3_1HPTable></mon3_1HPTable>
          </div>
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
import mon3_1SSTable from "@/components/MON/mon3_1SS-table.vue";
import mon3_1HPTable from "@/components/MON/mon3_1HP-table.vue";
import monComm from "@/components/MON/mon-comm.vue";

export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const store = useStore();
    const router = useRouter();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getSSDataList: [],
      getHPDataList: [],
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
        api: "PKG_MANAGER_MONA.GET_MONA003#1_DATA",
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
      const ssGroup = result.resultSet[0].reduce((acc, current) => {
        acc[current.CONTROLGROUP] = acc[current.CONTROLGROUP] || [];
        acc[current.CONTROLGROUP].push(current);
        return acc;
      }, {});
      let ssList = [];
      ssList.push(ssGroup);
      data.getSSDataList = ssList;
      emitter.emit("sendScadaSS", data.getSSDataList);

      const hpGroup = result.resultSet[1].reduce((acc, current) => {
        acc[current.CONTROLGROUP] = acc[current.CONTROLGROUP] || [];
        acc[current.CONTROLGROUP].push(current);
        return acc;
      }, {});

      let hpList = [];
      hpList.push(hpGroup);
      data.getHPDataList = hpList;
      emitter.emit("sendScadaHP", data.getHPDataList);
    }

    function tabClick() {
      router.push("/MONA003");
    }

    return { data, tabClick };
  },
  components: {
    TitleName,
    mon3_1SSTable,
    mon3_1HPTable,
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

<template>
  <div style="height: 100%">
    <table class="table-wrap">
      <tr>
        <th></th>
        <th>호기</th>
        <th>표준전력</th>
        <th>표준유량</th>
        <th>전력순시</th>
        <th>유량순시</th>
        <th>최대원단위</th>
        <th>실시간원단위</th>
        <th>실시간부하율</th>
      </tr>
      <template v-for="(item, index) in accura.dataList" :key="index">
        <tr>
          <th :rowSpan="getRowSpan(item.accuraList)">
            <p v-html="groupName(item.CPGROUPNAME)"></p>
          </th>
        </tr>
        <template v-if="item.accuraList.length != 0">
          <tr v-for="(value, index) in item.accuraList" :key="index">
            <td :class="{ accuraErr: value.STATUSCHECK != '정상' }">
              {{ value.CPGROUPNAME }}
            </td>
            <td>{{ value.ELECTCAPACITY }}</td>
            <td>{{ value.RATEDCAPACITY }}</td>
            <td>{{ value.LASTDATA }}</td>
            <template v-if="index == 0">
              <td :rowSpan="getRowSpan(item.accuraList) - 1">
                {{ item.AIRFLOWINS }}
              </td>
              <!-- <ul>
                  <template v-for="(air, index) in item.airFlow" :key="index">
                    <li>{{ air.AIRFLOW }}</li>
                  </template>
                </ul> -->
              <td :rowSpan="getRowSpan(item.accuraList) - 1">
                {{ item.ALLWONUNIT }}
              </td>
              <td :rowSpan="getRowSpan(item.accuraList) - 1">
                {{ item.REALWONUNIT }}
              </td>
              <td :rowSpan="getRowSpan(item.accuraList) - 1">
                {{ item.REALLOADFACTOR }}%
              </td>
            </template>
          </tr>
        </template>
        <tr>
          <th colspan="2">합계</th>
          <td>{{ item.ALLELECTCAPACITY }}kw</td>
          <td>{{ item.ALLRATEDCAPACITY }}m3/min</td>
          <td>{{ item.ALLINSTANCEVALUE }}kw</td>
          <td>{{ item.AIRFLOWINS }}m3/min</td>
          <th colspan="3"></th>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import { reactive, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
export default {
  props: {
    type: String,
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const accura = reactive({
      dataList: [],
      type: props.type,
    });
    onMounted(() => {
      emitter.on("sendMon6", (item) => {
        if (props.type == "SS") {
          accura.dataList = item[0];
          const getSSData = item[2];
          const airFlowData = item[4];
          for (let idx = 0; idx < accura.dataList.length; idx++) {
            let getGroup = accura.dataList[idx];
            getGroup.accuraList = [];
            getGroup.AIRFLOWINS = null;
            getGroup.AIRFLOWSUM = null;
            getGroup.airFlow = [];
            getSSData.forEach((data) => {
              if (data.CPGROUPID1ST == getGroup.CPGROUPID) {
                getGroup.AIRFLOWINS = data.AIRFLOWINS; //유량순시합계
                getGroup.AIRFLOWSUM = data.AIRFLOWSUM; //유량적산합계
                getGroup.ALLINSTANCEVALUE = data.ALLINSTANCEVALUE; //전력순시합계
                getGroup.ALLELECTCAPACITY = data.ALLELECTCAPACITY; //표준전력합계
                getGroup.ALLRATEDCAPACITY = data.ALLRATEDCAPACITY; //표준유량합계
                getGroup.ALLWONUNIT = data.ALLWONUNIT; //최대원단위
                getGroup.REALWONUNIT = data.REALWONUNIT; //실시간원단위
                getGroup.REALLOADFACTOR = data.REALLOADFACTOR; //실시간부하율
                getGroup.accuraList.push(data);
              }
            });

            airFlowData.forEach((air) => {
              if (air.CPGROUPID == getGroup.CPGROUPID) {
                getGroup.airFlow.push(air);
              }
            });
          }
        } else if (props.type == "HP") {
          accura.dataList = item[1];
          const getHPData = item[3];
          const airFlowData = item[5];
          for (let idx = 0; idx < accura.dataList.length; idx++) {
            let getGroup = accura.dataList[idx];
            getGroup.accuraList = [];
            getGroup.AIRFLOWINS = null;
            getGroup.AIRFLOWSUM = null;
            getGroup.airFlow = [];
            getHPData.forEach((data) => {
              if (data.CPGROUPID1ST == getGroup.CPGROUPID) {
                getGroup.AIRFLOWINS = data.AIRFLOWINS; //유량순시합계
                getGroup.AIRFLOWSUM = data.AIRFLOWSUM; //유량적산합계
                getGroup.ALLINSTANCEVALUE = data.ALLINSTANCEVALUE; //전력순시합계
                getGroup.ALLELECTCAPACITY = data.ALLELECTCAPACITY; //표준전력합계
                getGroup.ALLRATEDCAPACITY = data.ALLRATEDCAPACITY; //표준유량합계
                getGroup.ALLWONUNIT = data.ALLWONUNIT; //최대원단위
                getGroup.REALWONUNIT = data.REALWONUNIT; //실시간원단위
                getGroup.REALLOADFACTOR = data.REALLOADFACTOR; //실시간부하율
                getGroup.accuraList.push(data);
              }
            });
            airFlowData.forEach((air) => {
              if (air.CPGROUPID == getGroup.CPGROUPID) {
                getGroup.airFlow.push(air);
              }
            });
          }
        }
      });
    });

    function getRowSpan(data) {
      let rowSpan = 1 + data.length;
      return rowSpan;
      // let rowSpan = 1;
      // data.forEach((item) => {
      //   if (item.CONTROLPOINTID.substr(3, 2) == "CT") rowSpan++;
      // });
      // return rowSpan;
    }

    function groupName(name) {
      let splitName = name.split(" ");
      let result = splitName[0] + "<br/ >" + splitName[1];
      return result;
    }

    function controlpointName(name) {
      let first = name.indexOf("_") + 1;
      let seconde = name.lastIndexOf("_");
      let result = name.substring(first, seconde);
      return result;
    }

    onBeforeUnmount(() => {
      emitter.off("sendMon6");
    });

    return { accura, getRowSpan, groupName, controlpointName };
  },
};
</script>
<style scoped>
.table-wrap {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  border-radius: 2px;
  color: #333;
  overflow: hidden;
  text-align: center;
}
table:first-child tr th {
  background: #dbe2e9;
  color: #080808;
  width: 120px;
  max-width: 120px;
}

table tr th {
  border-right: 1px solid #ebebeb;
}
table tr {
  border: 1px solid #ebebeb;
  /* background-color: #f9fafc; */
}
table tr td {
  border-right: 1px solid #ebebeb;
  font-size: 12px;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
ul li:first-child {
  border-top: 1px solid #ebebeb;
}
li {
  border-bottom: 1px solid #ebebeb;
}
</style>

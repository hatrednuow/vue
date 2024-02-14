<template>
  <table class="bottom-table">
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
    <template v-for="room in scadaData.roomData" :key="room">
      <tr>
        <th :rowSpan="getRowSpan(room.scadaList)">{{ room.CPGROUPNAME }}</th>
      </tr>
      <template v-if="room.scadaList.length != 0">
        <tr v-for="detail in room.scadaList" :key="detail">
          <td>{{ detail.CPGROUPNAME3RD }}</td>
          <td>{{ detail.ACTPOWER }}kw</td>
          <td>{{ detail.FACTORYPER }}%</td>
          <td>{{ detail.COMPPER }}%</td>
          <td>{{ detail.MAXPEAKVALUE }}</td>
          <td>{{ dateFormat(detail.PEAKDATE) }}</td>
          <td>{{ detail.RESERVERATE }}%</td>
        </tr>
      </template>
    </template>
    <tr>
      <th colspan="2">합계</th>
      <td v-if="scadaData.totalPower != null">
        {{ floorData(scadaData.totalPower) }}kw
      </td>
      <td v-if="scadaData.totalFactroy != null">
        {{ splitData(scadaData.totalFactroy) }}
      </td>
      <td v-if="scadaData.totalComp != null">
        {{ splitData(scadaData.totalComp) }}
      </td>
      <td v-if="scadaData.totalPeak != null">
        {{ splitData(scadaData.totalPeak) }}
      </td>

      <th colspan="2"></th>
    </tr>
  </table>
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

    const scadaData = reactive({
      roomData: [],
      totalPower: null,
      totalFactroy: null,
      totalComp: null,
      totalPeak: null,
    });

    onMounted(() => {
      emitter.on("sendScadaMon3#3", (item) => {
        scadaData.totalPower = null;
        scadaData.totalFactroy = null;
        scadaData.totalComp = null;
        scadaData.totalPeak = null;
        if (props.type == "SS") {
          scadaData.roomData = item[0];
          const roomDetail = item[2];
          for (let idx = 0; idx < scadaData.roomData.length; idx++) {
            const getRoom = scadaData.roomData[idx];
            getRoom.scadaList = [];
            roomDetail.forEach((data) => {
              if (data.CPGROUPID2ND == getRoom.CPGROUPID) {
                scadaData.totalPower += dataType(data.NUMBERACTPOWER); //순시
                scadaData.totalFactroy += dataType(data.FACTORYPER); //공장
                scadaData.totalComp += dataType(data.COMPPER); //콤프
                scadaData.totalPeak += dataType(data.NUMBERMAXVALUE); //피크
                getRoom.scadaList.push(data);
              }
            });
          }
        } else if (props.type == "HP") {
          scadaData.roomData = item[1];
          const roomDetail = item[3];
          for (let idx = 0; idx < scadaData.roomData.length; idx++) {
            const getRoom = scadaData.roomData[idx];
            getRoom.scadaList = [];
            roomDetail.forEach((data) => {
              if (data.CPGROUPID2ND == getRoom.CPGROUPID) {
                scadaData.totalPower += dataType(data.NUMBERACTPOWER);
                scadaData.totalFactroy += dataType(data.FACTORYPER);
                scadaData.totalComp += dataType(data.COMPPER);
                scadaData.totalPeak += dataType(data.NUMBERMAXVALUE);
                getRoom.scadaList.push(data);
              }
            });
          }
        }
      });
    });

    function getRowSpan(data) {
      let rowSpan = 1 + data.length;
      return rowSpan;
    }
    function dateFormat(date) {
      if (date == null) {
        return "";
      } else {
        const strDate = String(date);
        const year = strDate.substring(0, 4);
        const month = strDate.substring(4, 6);
        const day = strDate.substring(6, 8);
        const hour = strDate.substring(8, 10);
        const minute = strDate.substring(10, 12);
        const dateTime = `${year}-${month}-${day} ${hour}:${minute}`;
        return dateTime;
      }
    }

    function dataType(dataStr) {
      return Number(dataStr);
    }

    //소수 첫째자리
    function splitData(sumItme) {
      let numberData = sumItme.toFixed(1);
      numberData = numberData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return numberData;
    }

    //소수점버리기
    function floorData(power) {
      let numberData = power.toFixed(0);
      numberData = numberData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return numberData;
    }

    onBeforeUnmount(() => {
      emitter.off("sendScadaMon3#3");
    });

    return {
      scadaData,
      getRowSpan,
      dateFormat,
      dataType,
      splitData,
      floorData,
    };
  },
};
</script>
<style scoped>
.bottom-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  color: #333;
  border-radius: 0.4em;
  overflow: hidden;
}

.bottom-table tr > th {
  background: #dbe2e9;
  color: #080808;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}
.bottom-table tr th {
  border-right: 1px solid #ebebeb;
}
.bottom-table tr {
  border: 1px solid #ebebeb;
  /* background-color: #f9fafc; */
}
.bottom-table tr > td {
  padding: 0.2em;
  text-align: center;
}
</style>

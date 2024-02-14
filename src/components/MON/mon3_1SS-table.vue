<template>
  <table class="main-table">
    <!-- 냉동기상태 -->
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <template
            v-for="freezer in data.getSSDataList.STATEFREEZER"
            :key="freezer"
          >
            <ul class="freezer-ul">
              <li>{{ freezer.CONTROLPOINTNAME }}</li>
              <li v-if="freezer.LASTDATA == 1">ON</li>
              <li v-else>OFF</li>
            </ul>
          </template>
        </div>
      </td>
    </tr>
    <!-- 냉수,냉각수 -->
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <div class="th-name">냉수</div>
          <div style="width: 50%">
            <!-- 냉수공급 -->
            <div style="display: flex; height: calc(100% / 3)">
              <template
                v-for="tempWater in data.getSSDataList.TEMPWATEROUT"
                :key="tempWater"
              >
                <ul class="temp-ul">
                  <li>
                    <p v-html="splitName(tempWater.CONTROLPOINTNAME)"></p>
                  </li>
                  <li>{{ tempWater.LASTDATA }}℃</li>
                </ul>
              </template>
            </div>
            <!-- 냉수환수 -->
            <div style="display: flex; height: calc(100% / 3)">
              <template
                v-for="tempWaterIn in data.getSSDataList.TEMPWATERIN"
                :key="tempWaterIn"
              >
                <ul class="temp-ul">
                  <li>
                    <p v-html="splitName(tempWaterIn.CONTROLPOINTNAME)"></p>
                  </li>
                  <li>{{ tempWaterIn.LASTDATA }}℃</li>
                </ul>
              </template>
            </div>
            <!-- 냉수펌프상태 -->
            <div style="display: flex; height: calc(100% / 3)">
              <template
                v-for="stateChilling in data.getSSDataList.STATECHILLING"
                :key="stateChilling"
              >
                <ul class="temp-ul">
                  <li>
                    <p v-html="sliceName(stateChilling.CONTROLPOINTNAME)"></p>
                    <!-- {{ stateChilling.CONTROLPOINTNAME }} -->
                  </li>
                  <li v-if="stateChilling.LASTDATA == 1">ON</li>
                  <li v-else>OFF</li>
                </ul>
              </template>
            </div>
          </div>
          <div class="th-name">냉각수</div>
          <div style="width: 50%">
            <!-- 냉각수공급 -->
            <div style="display: flex; height: calc(100% / 3)">
              <template
                v-for="tempCoolant in data.getSSDataList.TEMPCOOLANTOUT"
                :key="tempCoolant"
              >
                <ul class="temp-ul">
                  <li>
                    <p v-html="splitName(tempCoolant.CONTROLPOINTNAME)"></p>
                  </li>
                  <li>{{ tempCoolant.LASTDATA }}℃</li>
                </ul>
              </template>
            </div>
            <!-- 냉각수환수 -->
            <div style="display: flex; height: calc(100% / 3)">
              <template
                v-for="tempCoolantIn in data.getSSDataList.TEMPCOOLANTIN"
                :key="tempCoolantIn"
              >
                <ul class="temp-ul">
                  <li>
                    <p v-html="splitName(tempCoolantIn.CONTROLPOINTNAME)"></p>
                  </li>
                  <li>{{ tempCoolantIn.LASTDATA }}℃</li>
                </ul>
              </template>
            </div>
            <!-- 냉각수펌프 -->
            <div style="display: flex; height: calc(100% / 3)">
              <template
                v-for="stateCooling in data.getSSDataList.STATECOOLINGWATER"
                :key="stateCooling"
              >
                <ul class="temp-ul">
                  <li>
                    <p v-html="sliceName(stateCooling.CONTROLPOINTNAME)"></p>
                    <!-- {{ stateCooling.CONTROLPOINTNAME }} -->
                  </li>
                  <li v-if="stateCooling.LASTDATA == 1">ON</li>
                  <li v-else>OFF</li>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </td>
    </tr>
    <!-- 냉각탑휀 -->
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <template
            v-for="coolingFen in data.getSSDataList.STATECOOLINGFEN"
            :key="coolingFen"
          >
            <ul class="freezer-ul">
              <li>{{ coolingFen.CONTROLPOINTNAME }}</li>
              <li v-if="coolingFen.LASTDATA == 1">ON</li>
              <li v-else>OFF</li>
            </ul>
          </template>
        </div>
      </td>
    </tr>
    <!-- 각동온도 -->
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <template
            v-for="roomTemp in data.getSSDataList.ROOMTEMP"
            :key="roomTemp"
          >
            <ul class="freezer-ul">
              <li>{{ roomTemp.CONTROLPOINTNAME }}</li>
              <li>{{ roomTemp.LASTDATA }}℃</li>
            </ul>
          </template>
        </div>
      </td>
    </tr>
    <!-- 보일러상태 -->
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <template
            v-for="boiler in data.getSSDataList.STATEBOILER"
            :key="boiler"
          >
            <ul class="boiler-ul">
              <li>{{ boiler.CONTROLPOINTNAME }}</li>
              <li v-if="boiler.LASTDATA == 1">ON</li>
              <li v-else>OFF</li>
            </ul>
          </template>
        </div>
      </td>
    </tr>
    <!-- 보일러온도 -->
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <template
            v-for="tempBoiler in data.getSSDataList.TEMPBOILER"
            :key="tempBoiler"
          >
            <ul class="boiler-ul">
              <li>{{ tempBoiler.CONTROLPOINTNAME }}</li>
              <li>{{ tempBoiler.LASTDATA }}℃</li>
            </ul>
          </template>
        </div>
      </td>
    </tr>
    <!-- 온수펌프 -->
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <template
            v-for="heatPump in data.getSSDataList.STATEHEATPUMP"
            :key="heatPump"
          >
            <ul class="freezer-ul">
              <li>{{ heatPump.CONTROLPOINTNAME }}</li>
              <li v-if="heatPump.LASTDATA == 1">ON</li>
              <li v-else>OFF</li>
            </ul>
          </template>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <div class="div-name">가스</div>
          <div class="elec-div">
            <template v-for="gas in data.getSSDataList.GAS" :key="gas">
              <ul class="elec-ul" v-if="gas.CONTROLPOINTID == 'SS_Gas_Point'">
                <li>일</li>
                <li>{{ gas.LASTDATA }}계산</li>
              </ul>
              <ul class="elec-ul" v-else>
                <li>월</li>
                <li>{{ gas.LASTDATA }}계산</li>
              </ul>
            </template>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="6" style="height: 0">
        <div class="td-div">
          <div class="div-name">전력</div>
          <div class="elec-div">
            <ul class="elec-ul">
              <li>일</li>
              <li>값</li>
            </ul>
            <ul class="elec-ul">
              <li>월</li>
              <li>값</li>
            </ul>
          </div>
        </div>
      </td>
    </tr>
    <!-- <tr>
      <th>기상청 기온</th>
      <td
        colspan="5"
        v-for="weather in data.getSSDataList.HP_WEATHER_TA"
        :key="weather"
      >
        {{ weather.LASTDATA }}
      </td>
    </tr> -->
  </table>
</template>

<script>
import { onMounted, reactive, getCurrentInstance, onBeforeUnmount } from "vue";
export default {
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const data = reactive({
      getSSDataList: [],
    });

    onMounted(() => {
      emitter.on("sendScadaSS", (item) => {
        data.getSSDataList = item[0];
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendScadaSS");
    });

    function splitName(name) {
      let splitName = name.split(" ");
      let result = splitName[0] + "&nbsp;" + splitName[1].slice(-2);
      return result;
    }

    function sliceName(name) {
      let result = name.slice(-3);
      return result;
    }

    return { data, splitName, sliceName };
  },
};
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 2px;
  color: #333;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 0 0 1px #e3e5e8, 0px 0px 0px rgba(0, 0, 0, 0.04);
}
table tr td {
  padding: 0px;
  font-size: 1rem;
}
.main-table > tr {
  border: 1px solid #ebebeb;
  /* background-color: #f9fafc; */
}
li {
  display: flex;
  align-items: center;
  justify-content: center;
}
li p {
  margin: 0px;
}
.th-name {
  background: #dbe2e9;
  color: #080808;
  font-size: 1rem;
  font-weight: bold;
  padding: 5px;
  border-right: 1px solid #ebebeb;
  writing-mode: vertical-lr;
}
.freezer-ul,
.boiler-ul {
  display: grid;
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
  /* background-color: #f9fafc; */
}
.freezer-ul:not(:last-child),
.boiler-ul:not(:last-child) {
  border-right: 1px solid #ebebeb;
}
.freezer-ul li:first-child,
.temp-ul li:first-child,
.elec-ul li:first-child {
  background: #dbe2e9;
  color: #080808;
  font-size: 0.9rem;
  font-weight: bold;
}
.boiler-ul li:first-child {
  background: #ff6c6c;
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
}
.temp-ul {
  display: grid;
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
  border-right: 1px solid #ebebeb;
  /* background-color: #f9fafc; */
}

.div-name {
  background: #dbe2e9;
  color: #080808;
  font-size: 1rem;
  font-weight: bold;
  border-right: 1px solid #ebebeb;
  flex-basis: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.elec-div {
  display: grid;
  flex-basis: 90%;
}
.elec-div .elec-ul:first-child {
  border-bottom: 1px solid #ebebeb;
}
.elec-ul {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  /* background-color: #f9fafc; */
}
.elec-ul li {
  float: left;
  height: 100%;
}
.elec-ul li:first-child {
  padding: 0px 30px;
  display: flex;
  align-items: center;
}

.td-div {
  display: flex;
  height: 100%;
}
</style>

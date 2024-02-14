<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <div class="inner">
        <div class="collector-name">
          <DxSelectBox
            :items="data.collectorNameList"
            :input-attr="{ 'aria-label': 'Product' }"
            v-model:value="data.selectCollectorName"
            @value-changed="onValueChanged"
            stylingMode="outlined"
            height="30"
            label="게이트웨이"
          />
        </div>
    
        <dx-data-grid
          id="Grid"
          key-expr="GATEWAYID"
          :data-source="data.gatewayList"
          :show-borders="true"
          :show-column-lines="true"
          :show-row-lines="false"
          :focused-row-enabled="true"
          :column-auto-width="true"
          :column-hiding-enabled="true"
          @init-new-row="initNewRow"
          @row-inserting="insertData"
          @editing-start="getUpdateInfo"
          @row-updating="updateSystemInfo"
        >
          <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
          <DxScrolling mode="virtual" />
          <dx-column
            data-field="GATEWAYID"
            caption="게이트웨이ID"
            :hiding-priority="11"
            :allow-editing="data.editingYN"
            sort-order="asc"
            >
            <DxRequiredRule message="필수 값입니다." />
          </dx-column>
          <dx-column
            data-field="GATEWAYNAME"
            caption="게이트웨이명"
            :allow-sorting="false"
            :hiding-priority="10"
            :allow-editing="data.editingYN"
          />
          <dx-column
            data-field="EVENTSERVERID"
            caption="이벤트서버ID"
            :allow-sorting="false"
            :hiding-priority="9"
            :allow-editing="data.editingYN"
          >
            <dx-lookup
              display-expr="EVENTSERVERID"
              value-expr="EVENTSERVERID"
              :data-source="data.eventServerList"
            />
          </dx-column>
          <dx-column
            data-field="COLLECTORID"
            caption="수집기ID"
            :allow-sorting="false"
            :hiding-priority="8"
            :allow-editing="data.editingYN"
            >
            <dx-lookup
              display-expr="CODE_"
              value-expr="CODE_"
              :data-source="data.collectorList"
            />
          </dx-column>
          <dx-column
            data-field="GATEWAYIP"
            caption="게이트웨이IP"
            :allow-sorting="false"
            :hiding-priority="7"
            :allow-editing="data.editingYN"
          />
          <dx-column
            data-field="READCYCLE"
            caption="검침주기"
            :allow-sorting="false"
            :hiding-priority="6"
          />
          <dx-column
            data-field="GATEWAYPORT"
            caption="게이트웨이PORT"
            :allow-sorting="false"
            :hiding-priority="5"
          />
          <dx-column
            data-field="WCFPORT"
            caption="WCF제어PORT"
            :allow-sorting="false"
            :hiding-priority="4"
          />
          <!-- <dx-column
            data-field="GATEWAYNAME_ENG"
            caption="게이트웨이명_영어"
            :allow-sorting="false"
            :hiding-priority="1"
          />
          <dx-column
            data-field="GATEWAYNAME_CHA"
            caption="게이트웨이명_중국어"
            :allow-sorting="false"
            :hiding-priority="0"
          /> -->
          <dx-column
            data-field="REMARKS"
            caption="비고"
            :allow-sorting="false"
            :hiding-priority="3"
          />
          <dx-column
            data-field="USEFLAG"
            caption="사용여부"
            :allow-sorting="false"
            :hiding-priority="2"
            :width="100"
          >
            <dx-lookup
              display-expr="value"
              value-expr="key"
              :data-source="data.useFlag"
            />
            <DxRequiredRule message="필수 값입니다." />
          </dx-column>
          <DxSummary>
            <DxTotalItem column="SERVICELOADID" summary-type="count" />
          </DxSummary>      
        </dx-data-grid>
      </div>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxLookup,
  DxEditing,
  DxSummary,
  DxTotalItem,
  DxRequiredRule,
  DxScrolling,
} from "devextreme-vue/data-grid";
import DxSelectBox from 'devextreme-vue/select-box';
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilArray } from "@/utils/utilArray";
import { utilNumber } from "@/utils/utilNumber";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const data = reactive({
      selectCollectorName: '',
      selectCollectorCode: '',
      collectorList: [],
      collectorNameList: [],
      eventServerList: [],
      gatewayList: [],
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      editingYN: true,
      gatewayIdList: [],
    });

    const gatewayData = reactive({
      GATEWAYID: "",
      GATEWAYNAME: "",
      EVENTSERVERID: "",
      COLLECTORID: "",
      GATEWAYIP: "",
      GATEWAYPORT: "",
      WCFPORT: "",
      DISTRIBUTETYPE: "",
      REMARKS: "",
      USEFLAG: "",
      GATEWAYNAME_ENG: "",
      GATEWAYNAME_CHA: "",
      READCYCLE: ""
    })

    onMounted(() => {
      getMainData();
    });
    async function getMainData() {
      const params = {
        api: "PKG_MANAGER_BASA.GET_BASA003_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };

      const result = await store.dispatch("api/kcfemsAPI", params);
      if (result.result == true) {
        data.collectorList = result.resultSet[0];
        data.collectorNameList = data.collectorList.map((row) => {
          return row.NAME_
        })
        data.eventServerList = result.resultSet[2];
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.GET_BASA003_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA003" }, //메뉴코드
          { dir: "in", val: data.selectCollectorCode }, 
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };

      const result1 = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result1.result != true) {
        errorAlert(result1.errmsg);
        return;
      }
      data.gatewayList = result1.resultSet[0];
      utilArray.ascSort(data.gatewayList, 'GATEWAYID')

      const idList = []
      data.gatewayList.forEach(gateway => {
        idList.push(gateway.GATEWAYID)
      })
      data.gatewayIdList = idList;
    }

    function onValueChanged(e) {
      const filteredData = data.collectorList.filter(item => item.NAME_ === e.value)[0];
      data.selectCollectorCode = filteredData.CODE_

      getMainData();
    }

    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateSystemInfo(e) {
      let param = {};
      let keys = Object.keys(data.getUpdateData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        if (e.newData[fieldName] != undefined) {
          param[fieldName] = e.newData[fieldName];
        } else {
          param[fieldName] = data.getUpdateData[fieldName];
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA003_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA003" }, //메뉴코드
          { dir: "in", val: param.GATEWAYID },
          { dir: "in", val: param.GATEWAYNAME },
          { dir: "in", val: param.EVENTSERVERID },
          { dir: "in", val: param.COLLECTORID },
          { dir: "in", val: param.GATEWAYIP },
          { dir: "in", val: param.GATEWAYPORT },
          { dir: "in", val: param.WCFPORT },
          { dir: "in", val: param.DISTRIBUTETYPE },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.GATEWAYNAME_ENG },
          { dir: "in", val: param.GATEWAYNAME_CHA },
          { dir: "in", val: param.READCYCLE },
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
    }

    //등록
    function initNewRow(e) {
      // TODO 성서인지 현풍인지 선택 후 처리 되도록 수정 필요
      if (data.gatewayIdList.length === 0) {
        e.data.GATEWAYID = 'HP_G00001';  
      }

      data.gatewayIdList.sort();
      const lastValue = data.gatewayIdList[data.gatewayIdList.length - 1];

      // 마지막 값을 분리하여 접두사와 숫자 부분을 구분
      const prefix = lastValue.substring(0, 4);
      const number = parseInt(lastValue.substring(4));

      e.data.GATEWAYID = prefix + utilNumber.pad(number + 1, 5);
      e.data.USEFLAG = 'Y'
      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(gatewayData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        gatewayData[fieldName] = e.data[fieldName];
        if (gatewayData[fieldName] == undefined) {
          gatewayData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA003_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA003" }, //메뉴코드
          { dir: "in", val: gatewayData.GATEWAYID },
          { dir: "in", val: gatewayData.GATEWAYNAME },
          { dir: "in", val: gatewayData.EVENTSERVERID },
          { dir: "in", val: gatewayData.COLLECTORID },
          { dir: "in", val: gatewayData.GATEWAYIP },
          { dir: "in", val: gatewayData.GATEWAYPORT },
          { dir: "in", val: gatewayData.WCFPORT },
          { dir: "in", val: gatewayData.DISTRIBUTETYPE },
          { dir: "in", val: gatewayData.REMARKS },
          { dir: "in", val: gatewayData.USEFLAG },
          { dir: "in", val: gatewayData.GATEWAYNAME_ENG },
          { dir: "in", val: gatewayData.GATEWAYNAME_CHA },
          { dir: "in", val: gatewayData.READCYCLE },
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
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('#Grid')
      if(n == false) {
        layout.style.height = '83vh'
      } else {
        layout.style.height = '77vh'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })
   
    return {
      data,
      getUpdateInfo,
      updateSystemInfo,
      onValueChanged,
      initNewRow,
      insertData
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxLookup,
    DxEditing,
    DxSummary,
    DxRequiredRule,
    DxTotalItem,
    DxScrolling,
    DxSelectBox,
    TitleName,
  },
};
</script>
<style scoped>
.collector-name{
  position: absolute;
  top: 65px;
  z-index: 10;
  width: 200px;
  padding: 10px 0;
  margin-left: 13px;
}
#Grid {
  height: calc(100vh - 220px);
}
#Grid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>

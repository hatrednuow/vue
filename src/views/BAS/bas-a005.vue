<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <dx-data-grid
        class="inner"
        id="Grid"
        key-expr="CONTROLPOINTID"
        :data-source="data.controlPointList"
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
        <DxFilterRow :visible="true" />
        <DxSearchPanel :visible="true" />
        <dx-column
          data-field="CONTROLPOINTID"
          caption="관제포인트ID"
          :hiding-priority="13"
          :allow-editing="data.editingYN"
          >
          <DxRequiredRule message="필수 값입니다." />
        </dx-column>
        <dx-column
          data-field="CONTROLPOINTNAME"
          caption="관제포인트명"
          :allow-sorting="false"
          :hiding-priority="12"
          :allow-editing="data.editingYN"
          />
        <dx-column
          data-field="POINTID"
          caption="포인트ID"
          :allow-sorting="false"
          :hiding-priority="11"
          :allow-editing="data.editingYN" 
          />
        <dx-column
          data-field="POINTIP"
          caption="포인트IP"
          :allow-sorting="false"
          :hiding-priority="10"
          :allow-editing="data.editingYN"
        />
        <dx-column
          data-field="POINTPORT"
          caption="포인트PORT"
          :allow-sorting="false"
          :hiding-priority="9"
          :allow-editing="data.editingYN"
        />
        <dx-column
          data-field="UNIT"
          caption="단위"
          :allow-sorting="false"
          :hiding-priority="8"
        >
          <dx-lookup
            display-expr="UNITDISP"
            value-expr="UNITCODE"
            :data-source="data.unitList"
          />
        </dx-column>
        <dx-column
          data-field="GATEWAYID"
          caption="게이트웨이ID"
          :allow-sorting="false"
          :hiding-priority="7"
          :allow-editing="data.editingYN"
          >
          <dx-lookup
            display-expr="GATEWAYID"
            value-expr="GATEWAYID"
            :data-source="data.gatewayList"
          />
        </dx-column>
        <dx-column
          data-field="GATEWAYNAME"
          caption="게이트웨이명"
          :allow-sorting="false"
          :hiding-priority="6"
          :allow-editing="data.editingYN"
        />
        <dx-column
          data-field="HIGHLIMIT"
          caption="관리상한"
          :allow-sorting="false"
          :hiding-priority="5"
        />
        <dx-column
          data-field="LOWLIMIT"
          caption="관리하한"
          :allow-sorting="false"
          :hiding-priority="4"
        />
        <dx-column
          data-field="COLLECTORATTRID"
          caption="콜렉터속성ID"
          :allow-sorting="false"
          :hiding-priority="4"
          :allow-editing="data.editingYN"
        />
        <dx-column
          data-field="INSTANCETYPE"
          caption="관제포인트타입"
          :allow-sorting="false"
          :hiding-priority="3"
          >
          <dx-lookup
            display-expr="CODEVALUE"
            value-expr="CODEDEF"
            :data-source="data.instanceTypeList"
          />
        </dx-column>
        <dx-column
          data-field="INTEGRATE_YN"
          caption="적산값여부"
          :allow-sorting="false"
          :hiding-priority="2"
          :width="100"
        >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.chkIntegate"
          />
        </dx-column>
        <dx-column
          data-field="CONTROLTYPE"
          caption="컨트롤TYPE"
          :allow-sorting="false"
          :hiding-priority="4"
        >
          <dx-lookup
              display-expr="CODEVALUE"
            value-expr="CODEDEF"
            :data-source="data.controlTypeList"
          />
        </dx-column>
        <dx-column
          data-field="REMARKS"
          caption="비고"
          :allow-sorting="false"
          :hiding-priority="1"
        />
        <dx-column
          data-field="USEFLAG"
          caption="사용여부"
          :allow-sorting="false"
          :hiding-priority="0"
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
          <DxTotalItem column="CONTROLPOINTNAME" summary-type="count" />
        </DxSummary>      
      </dx-data-grid>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxLookup,
  DxEditing,
  DxSummary,
  DxRequiredRule,
  DxTotalItem,
  DxScrolling,
  DxFilterRow,
  DxSearchPanel
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilArray } from '@/utils/utilArray';

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const data = reactive({
      instanceTypeList: [],
      controlTypeList: [],
      controlPointList: [],
      gatewayList: [],
      unitList: [],
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      chkIntegate: [
        { key: "Y", value: "Yes" },
        { key: "N", value: "No" },
      ],
      editingYN: true,
    });

    const controllpointData = reactive({
      CONTROLPOINTID: "",
      CONTROLPOINTNAME: "",
      UNIT: "",
      GATEWAYID: "",
      POINTID: "",
      POINTIP: "",
      POINTPORT: "",
      HIGHLIMIT: "",
      ROWLIMIT: "",
      USEFLAG: "",
      COLLECTORATTRID: "",
      INSTANCETYPE: "",
      INTEGRATE_YN: "",
      CONTROLTYPE: "",
      REMARKS: ""
    })

    onMounted(() => {
      getMainData();
    });
    async function getMainData() {
      const params = {
        api: "PKG_MANAGER_BASA.GET_BASA005_LOAD",
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
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };

      const result = await store.dispatch("api/kcfemsAPI", params);
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      console.log(result)
      data.unitList = result.resultSet[0]
      data.gatewayList = utilArray.ascSort(result.resultSet[1], 'GATEWAYID')
      data.instanceTypeList = result.resultSet[3]
      data.controlTypeList = result.resultSet[6]

      const apiParams = {
        api: "PKG_MANAGER_BASA.GET_BASA005_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA005" }, //메뉴코드
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
      data.controlPointList = utilArray.ascSort(result1.resultSet[0], "CONTROLPOINTID");
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
        api: "PKG_MANAGER_BASA.PUT_BASA005_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA005" }, //메뉴코드
          { dir: "in", val: param.CONTROLPOINTID },
          { dir: "in", val: param.CONTROLPOINTNAME },
          { dir: "in", val: param.UNIT },
          { dir: "in", val: param.GATEWAYID },
          { dir: "in", val: param.POINTID },
          { dir: "in", val: param.POINTIP },
          { dir: "in", val: param.POINTPORT },
          { dir: "in", val: param.HIGHLIMIT },
          { dir: "in", val: param.ROWLIMIT },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.COLLECTORATTRID },
          { dir: "in", val: param.INSTANCETYPE },
          { dir: "in", val: param.INTEGRATE_YN },
          { dir: "in", val: param.CONTROLTYPE },
          { dir: "in", val: param.REMARKS },
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
    function initNewRow() {
      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(controllpointData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        controllpointData[fieldName] = e.data[fieldName];
        if (controllpointData[fieldName] == undefined) {
          controllpointData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA005_DATA",
        params: [
        { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA005" }, //메뉴코드
          { dir: "in", val: controllpointData.CONTROLPOINTID },
          { dir: "in", val: controllpointData.CONTROLPOINTNAME },
          { dir: "in", val: controllpointData.UNIT },
          { dir: "in", val: controllpointData.GATEWAYID },
          { dir: "in", val: controllpointData.POINTID },
          { dir: "in", val: controllpointData.POINTIP },
          { dir: "in", val: controllpointData.POINTPORT },
          { dir: "in", val: controllpointData.HIGHLIMIT },
          { dir: "in", val: controllpointData.ROWLIMIT },
          { dir: "in", val: controllpointData.USEFLAG },
          { dir: "in", val: controllpointData.COLLECTORATTRID },
          { dir: "in", val: controllpointData.INSTANCETYPE },
          { dir: "in", val: controllpointData.INTEGRATE_YN },
          { dir: "in", val: controllpointData.CONTROLTYPE },
          { dir: "in", val: controllpointData.REMARKS },
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
        layout.style.height = '91vh'
      } else {
        layout.style.height = '85vh'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })

    return {
      data,
      getUpdateInfo,
      updateSystemInfo,
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
    DxTotalItem,
    DxRequiredRule,
    DxScrolling,
    TitleName,
    DxFilterRow,
    DxSearchPanel
  },
};
</script>
<style scoped>
#Grid {
  height: calc(100vh - 140px);
}
#Grid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>

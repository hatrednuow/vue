<template>
  <div>
    <title-name></title-name>
  </div>
  <div class="wrap">
    <div class="grid-box inner">
      <DxDataGrid
        id="unitTypeGrid"
        key-expr="UNITTYPE"
        :data-source="data.getUnitType"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :focused-row-enabled="true"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :rowAlternationEnabled="true"
        @selection-changed="onFocusedType"
      >
        <DxLoadPanel :enabled="true" />
        <DxScrolling mode="virtual" />
        <DxSelection mode="single" />
        <DxColumn data-field="UNITTYPENAME" caption="단위타입명" />
        <DxSummary>
          <DxTotalItem column="UNITTYPENAME" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
      <DxDataGrid
        id="unitCodeGrid"
        key-expr="UNITCODE"
        ref="unitCodeGridRef"
        :data-source="data.getUnitCode"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :rowAlternationEnabled="true"
        @editor-preparing="onEditorPreparing"
        @init-new-row="initNewRow"
        @row-inserting="insertData"
        @editing-start="getUpdateInfo"
        @row-updating="updateUnitCodeInfo"
      >
        <DxSelection mode="single" />
        <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
        <DxColumn
          data-field="UNITCODE"
          caption="단위코드"
          :width="180"
          :allow-editing="data.editingYN"
        >
          <DxRequiredRule message="단위코드를 입력 하세요." />
        </DxColumn>
        <DxColumn
          data-field="UNITDISP"
          caption="단위표현"
          :width="130"
          :hiding-priority="2"
        />
        <DxColumn
          data-field="UNITTYPENAME"
          caption="단위타입명"
          :allow-editing="false"
        />
        <DxColumn
          data-field="USEFLAG"
          caption="사용여부"
          :allow-sorting="false"
          :width="100"
          :hiding-priority="0"
        >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
        </DxColumn>
        <DxColumn
          data-field="REMARKS"
          caption="비고"
          :allow-sorting="false"
          :hiding-priority="1"
        />
        <DxToolbar>
          <DxItem name="addRowButton" :disabled="data.disableYN" />
        </DxToolbar>
        <DxSummary>
          <DxTotalItem column="UNITCODE" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
    </div>
  </div>
</template>
<script>
import DxDataGrid, {
  DxScrolling,
  DxSelection,
  DxColumn,
  DxLookup,
  DxEditing,
  DxSummary,
  DxTotalItem,
  DxToolbar,
  DxItem,
  DxRequiredRule,
  DxLoadPanel,
} from "devextreme-vue/data-grid";
import TitleName from "@/components/title-name";
import { useStore } from "vuex";
import { onMounted, reactive, ref, watch } from "vue";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const unitCodeGridRef = ref(null);

    const data = reactive({
      getUnitType: [],
      getUnitCode: [],
      getUpdateData: [],
      selectType: null,
      editingYN: true,
      disableYN: true,
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
    });

    const unitCodeData = reactive({
      UNITCODE: "",
      UNITDISP: "",
      UNITTYPE: "",
      USEFLAG: "",
      REMARKS: "",
      DESC_KOR: "",
      DESC_ENG: "",
      DESC_CHA: "",
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSA.GET_SYSA005_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //
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

      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      result.resultSet[0].pop();
      data.getUnitType = result.resultSet[0];
    }

    //그룹선택
    function onFocusedType(e) {
      if (e.selectedRowKeys.length == 0) {
        return;
      }
      data.disableYN = false; //단위타입선택안하면 등록row생성x
      data.selectType = e.selectedRowKeys[0];
      getUnitCode();
    }

    async function getUnitCode() {
      const apiParams = {
        api: "PKG_MANAGER_SYSA.GET_SYSA005_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: data.selectType }, //단위타입
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
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
      }
      data.getUnitCode = result.resultSet[0];
      unitCodeGridRef.value.instance.cancelEditData();
    }

    function onEditorPreparing(e) {
      if (e.dataField === "USEFLAG") {
        e.editorOptions.value = "Y";
        e.setValue("Y");
      }
    }

    //등록
    function initNewRow() {
      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(unitCodeData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        unitCodeData[fieldName] = e.data[fieldName];
        if (unitCodeData[fieldName] == undefined) {
          unitCodeData[fieldName] = null;
        }
      }
      const apiParams = {
        api: "PKG_MANAGER_SYSA.PUT_SYSA005_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: unitCodeData.UNITCODE },
          { dir: "in", val: unitCodeData.UNITDISP },
          { dir: "in", val: data.selectType }, //단위타입
          { dir: "in", val: unitCodeData.USEFLAG },
          { dir: "in", val: unitCodeData.REMARKS },
          { dir: "in", val: unitCodeData.DESC_KOR },
          { dir: "in", val: unitCodeData.DESC_ENG },
          { dir: "in", val: unitCodeData.DESC_CHA },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
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
      }
      getUnitCode();
    }

    //수정
    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateUnitCodeInfo(e) {
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
        api: "PKG_MANAGER_SYSA.PUT_SYSA005_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: param.UNITCODE },
          { dir: "in", val: param.UNITDISP },
          { dir: "in", val: data.selectType }, //단위타입
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.DESC_KOR },
          { dir: "in", val: param.DESC_ENG },
          { dir: "in", val: param.DESC_CHA },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
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
      }
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('#unitTypeGrid')
      const layout2 = document.querySelector('#unitCodeGrid')
      if(n == false) {
        layout.style.height = '91vh'
        layout2.style.height = '91vh'
      } else {
        layout.style.height = '85vh'
        layout2.style.height = '85vh'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })

    return {
      data,
      unitCodeData,
      unitCodeGridRef,
      onFocusedType,
      getUnitCode,
      onEditorPreparing,
      initNewRow,
      insertData,
      getUpdateInfo,
      updateUnitCodeInfo,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxScrolling,
    DxLookup,
    DxEditing,
    DxSummary,
    DxTotalItem,
    DxToolbar,
    DxItem,
    TitleName,
    DxRequiredRule,
    DxLoadPanel,
  },
};
</script>

<style scoped>
#unitTypeGrid {
  height: calc(100vh - 140px);
  padding: 57px 0px 0px 0px;
  flex-basis: 25%;
}
#unitCodeGrid {
  height: calc(100vh - 140px);
  padding: 0 0 0 15px;
  flex-basis: 75%;
}
#unitTypeGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td,
#unitCodeGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
.grid-box {
  display: flex;
}
</style>

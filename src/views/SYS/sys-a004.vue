<template>
  <div>
    <title-name></title-name>
  </div>
  <div class="wrap">
    <div class="grid-box inner">
      <DxDataGrid
        id="codeGroupGrid"
        key-expr="CODEGROUP"
        :data-source="data.getCodeGroup"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :focused-row-enabled="true"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :rowAlternationEnabled="true"
        @selection-changed="onFocusedGroup"
      >
        <DxLoadPanel :enabled="true" />
        <DxScrolling mode="virtual" />
        <DxSelection mode="single" />
        <DxColumn data-field="CODEGROUPNAME" caption="코드그룹" />
        <DxSummary>
          <DxTotalItem column="CODEGROUPNAME" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
      <DxDataGrid
        id="codeDefGrid"
        key-expr="CODEDEF"
        ref="codeDefGridRef"
        :data-source="data.getCodeDefList"
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
        @row-updating="updateCodeDefInfo"
      >
        <DxSelection mode="single" />
        <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
        <DxColumn
          data-field="CODEGROUP"
          caption="코드그룹"
          :width="190"
          :hiding-priority="1"
          :allow-editing="false"
          :allow-sorting="false"
        />
        <DxColumn
          data-field="CODEDEF"
          caption="코드정의"
          :allow-editing="data.editingYN"
        >
          <DxRequiredRule message="코드 정의를 입력해주세요" />
        </DxColumn>
        <DxColumn data-field="CODEVALUE" caption="코드정의값" />
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
        <DxToolbar>
          <DxItem name="addRowButton" :disabled="data.disableYN" />
        </DxToolbar>
        <DxSummary>
          <DxTotalItem column="CODEGROUP" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
    </div>
  </div>
</template>
<script>
import DxDataGrid, {
  DxColumn,
  DxSelection,
  DxScrolling,
  DxEditing,
  DxLookup,
  DxSummary,
  DxTotalItem,
  DxToolbar,
  DxItem,
  DxRequiredRule,
  DxLoadPanel,
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import { onMounted, reactive, ref, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const codeDefGridRef = ref(null);
    const data = reactive({
      getCodeGroup: [],
      getCodeDefList: [],
      getUpdateData: [],
      selectGroupCode: null,
      editingYN: true,
      disableYN: true,
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
    });

    const codeDefData = reactive({
      CODEGROUP: "",
      CODEDEF: "",
      CODEVALUE: "",
      ATTRIBUTE1: "",
      ATTRIBUTE2: "",
      ATTRIBUTE3: "",
      ATTRIBUTE4: "",
      ATTRIBUTE5: "",
      REMARKS: "",
      USEFLAG: "",
      DISPSEQ: "",
      CODEVALUE_ENG: "",
      CODEVALUE_CHA: "",
    });

    onMounted(() => {
      getMainData();
    });

    function onEditorPreparing(e) {
      if (e.dataField === "USEFLAG") {
        e.editorOptions.value = "Y";
        e.setValue("Y");
      }
    }

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSA.GET_SYSA004_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
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
      result.resultSet[0].splice(0, 1); //0번째 데이터 제거
      data.getCodeGroup = result.resultSet[0];
    }

    //그룹선택
    function onFocusedGroup(e) {
      if (e.selectedRowKeys.length == 0) {
        return;
      }
      data.disableYN = false;
      data.selectGroupCode = e.selectedRowKeys[0];
      getCodeDef();
    }

    async function getCodeDef() {
      const apiParams = {
        api: "PKG_MANAGER_SYSA.GET_SYSA004_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: data.selectGroupCode }, //코드그룹
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
      data.getCodeDefList = result.resultSet[0];
      codeDefGridRef.value.instance.cancelEditData();
    }

    //등록
    function initNewRow(e) {
      e.data.CODEGROUP = data.selectGroupCode;
      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(codeDefData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        codeDefData[fieldName] = e.data[fieldName];
        if (codeDefData[fieldName] == undefined) {
          codeDefData[fieldName] = null;
        }
      }
      const apiParams = {
        api: "PKG_MANAGER_SYSA.PUT_SYSA004_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: data.selectGroupCode },
          { dir: "in", val: codeDefData.CODEDEF },
          { dir: "in", val: codeDefData.CODEVALUE },
          { dir: "in", val: codeDefData.ATTRIBUTE1 },
          { dir: "in", val: codeDefData.ATTRIBUTE2 },
          { dir: "in", val: codeDefData.ATTRIBUTE3 },
          { dir: "in", val: codeDefData.ATTRIBUTE4 },
          { dir: "in", val: codeDefData.ATTRIBUTE5 },
          { dir: "in", val: codeDefData.REMARKS },
          { dir: "in", val: codeDefData.USEFLAG },
          { dir: "in", val: codeDefData.DISPSEQ },
          { dir: "in", val: codeDefData.CODEVALUE_ENG },
          { dir: "in", val: codeDefData.CODEVALUE_CHA },
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
      getCodeDef();
    }

    //그룹정의 수정
    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateCodeDefInfo(e) {
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
        api: "PKG_MANAGER_SYSA.PUT_SYSA004_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: param.CODEGROUP },
          { dir: "in", val: param.CODEDEF },
          { dir: "in", val: param.CODEVALUE },
          { dir: "in", val: param.ATTRIBUTE1 },
          { dir: "in", val: param.ATTRIBUTE2 },
          { dir: "in", val: param.ATTRIBUTE3 },
          { dir: "in", val: param.ATTRIBUTE4 },
          { dir: "in", val: param.ATTRIBUTE5 },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.DISPSEQ },
          { dir: "in", val: param.CODEVALUE_ENG },
          { dir: "in", val: param.CODEVALUE_CHA },
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
      const layout = document.querySelector('#codeGroupGrid')
      const layout2 = document.querySelector('#codeDefGrid')
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
      codeDefData,
      codeDefGridRef,
      onFocusedGroup,
      onEditorPreparing,
      initNewRow,
      getUpdateInfo,
      insertData,
      updateCodeDefInfo,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxScrolling,
    DxEditing,
    DxLookup,
    DxSummary,
    DxTotalItem,
    DxToolbar,
    DxItem,
    DxRequiredRule,
    DxLoadPanel,
    TitleName,
  },
};
</script>

<style scoped>
.grid-box {
  display: flex;
}
#codeGroupGrid {
  height: calc(100vh - 140px);
  padding: 57px 0px 0px 0;
  flex-basis: 25%;
}
#codeDefGrid {
  height: calc(100vh - 140px);
  padding: 0 0 0 15px;
  flex-basis: 75%;
}
#codeGroupGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td,
#codeDefGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>

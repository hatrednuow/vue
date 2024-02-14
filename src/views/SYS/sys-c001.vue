<template>
  <div>
    <title-name></title-name>
  </div>
  <div class="wrap">
    <div class="grid-box inner">
      <DxDataGrid
        id="rootGrid"
        key-expr="CODE_"
        ref="rootGridRef"
        :data-source="data.departmentList"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :rowAlternationEnabled="true"
        @selection-changed="onFocusedPart"
      >
        <DxSelection mode="single" />
        <dx-column
          data-field="DEPARTMENTNAME2"
          caption="부서명"
          :allow-sorting="false"
        />
        <DxSummary>
          <DxTotalItem column="DEPARTMENTNAME2" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
  
      <DxDataGrid
        id="departmentGrid"
        key-expr="DEPARTMENT"
        ref="departmentGridRef"
        :data-source="data.getOneDepartment"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :rowAlternationEnabled="true"
        :no-data-text="data.noDataText"
        @editor-preparing="onEditorPreparing"
        @init-new-row="initNewRow"
        @row-inserting="insertData"
        @editing-start="getUpdateInfo"
        @row-updating="updateDepInfo"
      >
        <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
        <DxSelection mode="single" />
        <dx-column
          data-field="UPDEPARTMENT"
          caption="상위부서"
          :allow-sorting="false"
          :allow-editing="false"
        />
        <dx-column
          data-field="DEPARTMENT"
          caption="부서코드"
          :allow-sorting="false"
          :allow-editing="data.editingYN"
        >
          <DxRequiredRule message="부서코드를 입력해주세요." />
        </dx-column>
        <dx-column
          data-field="DEPARTMENTNAME"
          caption="부서명"
          :allow-sorting="false"
        >
          <DxRequiredRule message="부서명을 입력해주세요." />
        </dx-column>
        <dx-column data-field="USEFLAG" caption="사용여부" :allow-sorting="false">
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
        </dx-column>
  
        <DxToolbar>
          <DxItem name="addRowButton" />
        </DxToolbar>
        <DxSummary>
          <DxTotalItem column="DEPARTMENT" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxSelection,
  DxSummary,
  DxTotalItem,
  DxToolbar,
  DxItem,
  DxLookup,
  DxRequiredRule,
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import { onMounted, reactive, ref, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const departmentGridRef = ref(null);
    const rootGridRef = ref(null);

    const data = reactive({
      departmentList: [],
      getOneDepartment: [],
      getUpdateData: [],
      // disableYN: true,
      selectPart: null,
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      noDataText: "선택된 부서가 없습니다.",
    });

    const departmentData = reactive({
      DEPARTMENT: "",
      DEPARTMENTNAME: "",
      UPDEPARTMENT: "",
      DISPSEQ: "",
      USEFLAG: "",
      REMARKS: "",
      DEPARTMENTNAME_ENG: "",
      DEPARTMENTNAME_CHA: "",
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSC.GET_SYSC001_LOAD",
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
      data.departmentList = result.resultSet[0].filter((item) => {
        return item.CODE_ != "ROOT";
      });

      if (data.selectPart != null) {
        rootGridRef.value.instance.deselectAll();
        getOnePart();
      }
    }

    function onFocusedPart(e) {
      if (e.selectedRowKeys.length == 0) {
        return;
      }
      // data.disableYN = false;
      data.selectPart = e.selectedRowKeys[0];
      getOnePart();
    }

    async function getOnePart() {
      const apiParams = {
        api: "PKG_MANAGER_SYSC.GET_SYSC001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: data.selectPart },
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
      data.getOneDepartment = result.resultSet[0];
      departmentGridRef.value.instance.cancelEditData();
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
      let keys = Object.keys(departmentData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        departmentData[fieldName] = e.data[fieldName];
        if (departmentData[fieldName] == undefined) {
          departmentData[fieldName] = null;
        }
      }
      if (data.selectPart != null) {
        departmentData.UPDEPARTMENT = data.selectPart;
      }
      const apiParams = {
        api: "PKG_MANAGER_SYSC.PUT_SYSC001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: departmentData.DEPARTMENT },
          { dir: "in", val: departmentData.DEPARTMENTNAME },
          { dir: "in", val: departmentData.UPDEPARTMENT }, //단위타입
          { dir: "in", val: departmentData.DISPSEQ },
          { dir: "in", val: departmentData.USEFLAG },
          { dir: "in", val: departmentData.REMARKS },
          { dir: "in", val: departmentData.DEPARTMENTNAME_ENG },
          { dir: "in", val: departmentData.DEPARTMENTNAME_CHA },
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
      data.selectPart = departmentData.DEPARTMENT;
      getMainData();
    }

    //수정
    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateDepInfo(e) {
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
        api: "PKG_MANAGER_SYSC.PUT_SYSC001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: param.DEPARTMENT },
          { dir: "in", val: param.DEPARTMENTNAME },
          { dir: "in", val: param.UPDEPARTMENT },
          { dir: "in", val: param.DISPSEQ },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.DEPARTMENTNAME_ENG },
          { dir: "in", val: param.DEPARTMENTNAME_CHA },
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
      const layout = document.querySelector('#rootGrid')
      const layout2 = document.querySelector('#departmentGrid')
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
      departmentData,
      rootGridRef,
      departmentGridRef,
      onFocusedPart,
      onEditorPreparing,
      initNewRow,
      insertData,
      getUpdateInfo,
      updateDepInfo,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxSummary,
    DxTotalItem,
    DxSelection,
    DxToolbar,
    DxItem,
    DxLookup,
    DxRequiredRule,
    TitleName,
  },
};
</script>
<style scoped>
#rootGrid {
  height: calc(100vh - 140px);
  padding: 57px 0px 0px 0px;
  flex-basis: 25%;
}
#departmentGrid {
  height: calc(100vh - 140px);
  padding: 0px 0 0 15px;
  flex-basis: 75%;
}
#rootGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td,
#departmentGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}

.grid-box {
  display: flex;
}
</style>

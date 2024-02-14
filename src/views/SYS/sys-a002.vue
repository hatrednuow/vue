<template>
  <div>
    <title-name></title-name>
  </div>
  <div class="wrap">
    <DxDataGrid
      class="inner"
      id="constantGrid"
      key-expr="CONSTANTCODE"
      :data-source="data.getConstantCode"
      :show-borders="true"
      :show-column-lines="true"
      :show-row-lines="false"
      :focused-row-enabled="true"
      :column-auto-width="true"
      :column-hiding-enabled="true"
      :rowAlternationEnabled="true"
      @init-new-row="initNewRow"
      @row-inserting="insertData"
      @editing-start="getUpdateInfo"
      @row-updating="updateConstantInfo"
    >
      <DxSelection mode="single" />
      <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
      <dx-column
        data-field="CONSTANTCODE"
        caption="고유상수코드"
        :allow-sorting="false"
        :allow-editing="data.editingYN"
      >
        <DxRequiredRule message="상수 코드를 입력 하세요." />
      </dx-column>
      <dx-column data-field="CONSTANTVALUE" caption="고유상수값" :width="150">
        <DxRequiredRule message="상수 값을 입력해주세요." />
      </dx-column>
      <dx-column
        data-field="CONSTANTTYPE"
        caption="고유상수타입[S,N]"
        :width="150"
        :allow-sorting="false"
      >
        <dx-lookup
          display-expr="CODENAME"
          value-expr="CODE"
          :data-source="data.constantType"
        />
      </dx-column>
      <dx-column
        data-field="CONSTANTDESC"
        caption="고유상수설명"
        :allow-sorting="false"
      />
      <DxSummary>
        <DxTotalItem column="CONSTANTCODE" summary-type="count" />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script>
import DxDataGrid, {
  DxColumn,
  DxLookup,
  DxEditing,
  DxRequiredRule,
  DxSummary,
  DxTotalItem,
  DxSelection,
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import TitleName from "@/components/title-name";
import { onMounted, reactive, watch } from "vue";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getConstantCode: [],
      constantType: [],
      getUpdateData: [],
      editingYN: true,
    });

    const constantData = reactive({
      CONSTANTCODE: "",
      CONSTANTVALUE: "",
      CONSTANTTYPE: "",
      CONSTANTDESC: "",
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSA.GET_SYSA002_LOAD",
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
        ],
        needUser: false,
      };

      const result = await store.dispatch("api/kcfemsAPI", apiParams);

      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      data.constantType = result.resultSet[0];
      data.getConstantCode = result.resultSet[1];
    }
    //등록
    function initNewRow() {
      data.editingYN = true;
    }
    async function insertData(e) {
      let keys = Object.keys(constantData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        constantData[fieldName] = e.data[fieldName];
        if (constantData[fieldName] == undefined) {
          constantData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_SYSA.PUT_SYSA002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: constantData.CONSTANTCODE },
          { dir: "in", val: constantData.CONSTANTVALUE },
          { dir: "in", val: constantData.CONSTANTTYPE },
          { dir: "in", val: constantData.CONSTANTDESC },
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

    //수정
    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateConstantInfo(e) {
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
        api: "PKG_MANAGER_SYSA.PUT_SYSA002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: param.CONSTANTCODE },
          { dir: "in", val: param.CONSTANTVALUE },
          { dir: "in", val: param.CONSTANTTYPE },
          { dir: "in", val: param.CONSTANTDESC },
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
      const layout = document.querySelector('#constantGrid')
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
      constantData,
      initNewRow,
      insertData,
      getUpdateInfo,
      updateConstantInfo,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxLookup,
    DxEditing,
    DxRequiredRule,
    DxSummary,
    DxTotalItem,
    DxSelection,
    TitleName,
  },
};
</script>
<style scoped>
#constantGrid {
  height: calc(100vh - 140px);
}
#constantGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>

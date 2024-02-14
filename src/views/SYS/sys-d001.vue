<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <DxDataGrid
        class="inner"
        id="userGroupGrid"
        key-expr="USERGROUPCODE"
        :data-source="data.getUserGroupList"
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
        @row-updating="updateUserGroupInfo"
      >
        <DxSelection mode="single" />
        <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
        <DxColumn
          data-field="USERGROUPCODE"
          caption="권한그룹코드"
          :allow-editing="data.editingYN"
        >
          <DxRequiredRule message="권한그룹코드를 입력해주세요." />
        </DxColumn>
        <DxColumn data-field="USERGROUPNAME" caption="권한그룹명">
          <DxRequiredRule message="권한그룹명을 입력해주세요." />
        </DxColumn>
        <DxColumn data-field="USEFLAG" caption="사용여부" :allow-sorting="false">
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
        </DxColumn>
        <DxColumn data-field="REMARKS" caption="비고" :allow-sorting="false" />
        <DxSummary>
          <DxTotalItem column="USERGROUPCODE" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxSummary,
  DxTotalItem,
  DxSelection,
  // DxToolbar,
  // DxItem,
  DxLookup,
  DxRequiredRule,
} from "devextreme-vue/data-grid";

import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getUserGroupList: [],
      getUpdateData: [],
      editingYN: true,
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
    });

    const userGroupData = reactive({
      USERGROUPCODE: "",
      USERGROUPNAME: "",
      USEFLAG: "",
      REMARKS: "",
      USERGROUPNAME_ENG: "",
      USERGROUPNAME_CHA: "",
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSD.GET_SYSD001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
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
      data.getUserGroupList = result.resultSet[0];
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
      let keys = Object.keys(userGroupData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        userGroupData[fieldName] = e.data[fieldName];
        if (userGroupData[fieldName] == undefined) {
          userGroupData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_SYSD.PUT_SYSD001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: userGroupData.USERGROUPCODE },
          { dir: "in", val: userGroupData.USERGROUPNAME },
          { dir: "in", val: userGroupData.USEFLAG },
          { dir: "in", val: userGroupData.REMARKS },
          { dir: "in", val: userGroupData.USERGROUPNAME_ENG },
          { dir: "in", val: userGroupData.USERGROUPNAME_CHA },
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

    async function updateUserGroupInfo(e) {
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
        api: "PKG_MANAGER_SYSD.PUT_SYSD001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: param.USERGROUPCODE },
          { dir: "in", val: param.USERGROUPNAME },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.USERGROUPNAME_ENG },
          { dir: "in", val: param.USERGROUPNAME_CHA },
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
      const layout = document.querySelector('#userGroupGrid')
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
      userGroupData,
      onEditorPreparing,
      initNewRow,
      insertData,
      getUpdateInfo,
      updateUserGroupInfo,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxSummary,
    DxTotalItem,
    DxSelection,
    DxLookup,
    DxRequiredRule,
    TitleName,
  },
};
</script>

<style scoped>
#userGroupGrid {
  height: calc(100vh - 140px);
}
#userGroupGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>

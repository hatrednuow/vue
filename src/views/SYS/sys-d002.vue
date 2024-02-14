<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <div class="grid-box inner">
        <DxDataGrid
          id="userGroupGrid"
          key-expr="USERGROUPCODE"
          :data-source="data.getUserGroupList"
          :show-borders="true"
          :show-column-lines="true"
          :show-row-lines="false"
          :column-auto-width="true"
          :column-hiding-enabled="true"
          :rowAlternationEnabled="true"
          @selection-changed="onFocusedGroup"
        >
          <DxSelection mode="single" />
          <DxColumn data-field="USERGROUPCODE" caption="권한그룹코드" />
          <DxColumn data-field="USERGROUPNAME" caption="권한그룹명" />
          <DxSummary>
            <DxTotalItem column="USERGROUPCODE" summary-type="count" />
          </DxSummary>
        </DxDataGrid>

        <DxTreeList
          id="menuListGrid"
          key-expr="MENUCODE"
          parent-id-expr="UPMENUCODE"
          root-value="-"
          v-model:data-source="data.getMenuList"
          :show-borders="true"
          :show-row-lines="true"
          :column-auto-width="true"
          :expanded-row-keys="data.expandedRowKeys"
          @editing-start="getUpdateInfo"
          @row-updating="updateMenuInfo"
        >
          <DxEditing :allow-updating="true" mode="row" />
          <TxColumn data-field="MENUNAME" caption="" />
          <TxColumn
            data-field="ACCESSFLAG"
            caption=""
            edit-cell-template="accessFlagTemplate"
            :width="350"
          >
            <DxLookup
              display-expr="text"
              value-expr="id"
              :data-source="data.accessFlag"
            />
          </TxColumn>
          <TxColumn />
          <template #accessFlagTemplate="{ data: radioOption }">
            <div>
              <DxRadioGroup
                :data-source="data.accessFlag"
                display-expr="text"
                value-expr="id"
                :value="radioOption.value"
                layout="horizontal"
                :on-value-changed="(e) => radioOption.setValue(e.value)"
              />
            </div>
          </template>
        </DxTreeList>
      </div>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxSummary,
  DxTotalItem,
  DxSelection,
} from "devextreme-vue/data-grid";
import {
  DxTreeList,
  DxColumn as TxColumn,
  DxEditing,
  DxLookup,
} from "devextreme-vue/tree-list";
import DxRadioGroup from "devextreme-vue/radio-group";
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
      getMenuList: [],
      selectGroupCode: null,
      expandedRowKeys: [],
      getUpdateData: [],
      accessFlag: [
        { id: "N", text: "None" },
        { id: "R", text: "Read Only" },
        { id: "W", text: "Read / Write" },
      ],
    });

    const radioOption = reactive({
      value: null,
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSD.GET_SYSD002_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
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

    function onFocusedGroup(e) {
      if (e.selectedRowKeys.length == 0) {
        return;
      }
      data.selectGroupCode = e.selectedRowKeys[0];
      getMenuList();
    }

    async function getMenuList() {
      data.expandedRowKeys = [];
      const apiParams = {
        api: "PKG_MANAGER_SYSD.GET_SYSD002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: data.selectGroupCode },
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
      data.getMenuList = result.resultSet[0];
      //autoExpandAll안될때
      data.getMenuList.filter((item) => {
        if (item.MENUCODE.length <= 4) {
          data.expandedRowKeys.push(item.MENUCODE);
          return data.expandedRowKeys;
        }
      });
      // data.getMenuList.filter((item) => {
      //   if (item.UPMENUCODE == "-" || item.UPMENUCODE == "IEMS") {
      //     data.expandedRowKeys.push(item.MENUCODE);
      //     return data.expandedRowKeys;
      //   }
      // });
    }

    //수정
    function getUpdateInfo(e) {
      data.getUpdateData = e.data;
    }

    async function updateMenuInfo(e) {
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
        api: "PKG_MANAGER_SYSD.PUT_SYSD002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: data.selectGroupCode },
          { dir: "in", val: param.MENUCODE },
          { dir: "in", val: param.ACCESSFLAG },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      console.log(result);
    }

    function updateHeight(n, o) {
      console.log(n, o);
      const layout = document.querySelector("#userGroupGrid");
      const layout2 = document.querySelector("#menuListGrid");
      if (n == false) {
        layout.style.height = "91vh";
        layout2.style.height = "91vh";
      } else {
        layout.style.height = "85vh";
        layout2.style.height = "85vh";
      }
    }

    watch(
      () => store.state.menu.headerOpen,
      (newValue, oldValue) => {
        updateHeight(newValue, oldValue);
      }
    );

    return {
      data,
      radioOption,
      onFocusedGroup,
      getUpdateInfo,
      updateMenuInfo,
    };
  },

  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxTotalItem,
    DxSelection,
    DxTreeList,
    TxColumn,
    DxRadioGroup,
    DxEditing,
    DxLookup,
    TitleName,
  },
};
</script>
<style scoped>
#userGroupGrid {
  height: calc(100vh - 140px);
  flex-basis: 25%;
}
#menuListGrid {
  height: calc(100vh - 140px);
  padding: 0px 0 0 15px;
  flex-basis: 75%;
}
#menuListGrid::v-deep .dx-treelist-headers .dx-treelist-table .dx-row > td,
#userGroupGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
.grid-box {
  display: flex;
}
</style>

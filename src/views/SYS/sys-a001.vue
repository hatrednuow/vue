<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <dx-data-grid
        class="inner headerHide systemGrid"
        id="systemGrid"
        key-expr="SYSTEMCODE"
        :data-source="data.getSystemCode"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :focused-row-enabled="true"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        @editing-start="getUpdateInfo"
        @row-updating="updateSystemInfo"
      >
        <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
        <dx-column
          data-field="SYSTEMCODE"
          caption="시스템코드"
          :allow-sorting="false"
          :width="120"
          :hiding-priority="6"
          :allow-editing="false"
        />

        <dx-column
          data-field="SYSTEMCODENAME"
          caption="시스템명"
          :hiding-priority="5"
        />
        <dx-column
          data-field="SYSTEMADMGROUP"
          caption="시스템관리자코드"
          :width="150"
          :hiding-priority="4"
        >
          <dx-lookup
            display-expr="USERGROUPNAME"
            value-expr="USERGROUPCODE"
            :data-source="data.systemAdmGroup"
          />
        </dx-column>
        <dx-column
          data-field="SYSTEMCODENAME_CHA"
          caption="시스템영문명"
          :allow-sorting="false"
          :hiding-priority="1"
        />
        <dx-column
          data-field="SYSTEMCODENAME_ENG"
          caption="시스템중문명"
          :allow-sorting="false"
          :hiding-priority="0"
        />
        <dx-column
          data-field="REMARKS"
          caption="비고"
          :allow-sorting="false"
          :hiding-priority="2"
        />
        <dx-column
          data-field="USEFLAG"
          caption="사용여부"
          :allow-sorting="false"
          :width="100"
          :hiding-priority="3"
        >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
        </dx-column>
        <DxToolbar>
          <DxItem name="addRowButton" :disabled="true" />
        </DxToolbar>
        <DxSummary>
          <DxTotalItem column="SYSTEMCODE" summary-type="count" />
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
  DxTotalItem,
  DxToolbar,
  DxItem,
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
      getSystemCode: [],
      systemAdmGroup: [],
      getUpdateData: [],
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
    });
    onMounted(() => {
      getMainData();
    });
    async function getMainData() {
      //시스템관리자코드
      const params = {
        api: "PKG_MANAGER_SYSA.GET_SYSA001_LOAD",
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
        ],
        needUser: false,
      };

      const result = await store.dispatch("api/kcfemsAPI", params);
      data.systemAdmGroup = result.resultSet[0];

      const apiParams = {
        api: "PKG_MANAGER_SYSA.GET_SYSA001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "SYSA001" }, //메뉴코드
          { dir: "in", val: "1" }, //폼로드시 1
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };

      const result1 = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result1.result == true) {
        data.getSystemCode = result1.resultSet[0];
      }
    }

    function getUpdateInfo(e) {
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
        api: "PKG_MANAGER_SYSA.PUT_SYSA001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "SYSA001" }, //메뉴코드
          { dir: "in", val: param.SYSTEMCODE },
          { dir: "in", val: param.SYSTEMCODENAME },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.SYSTEMADMGROUP },
          { dir: "in", val: param.SYSTEMCODENAME_ENG },
          { dir: "in", val: param.SYSTEMCODENAME_CHA },
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
      }
    }

    function updateHeight(n, o) {
      console.log(n, o);
      const layout = document.querySelector("#systemGrid");
      if (n == false) {
        layout.style.height = "91vh";
      } else {
        layout.style.height = "85vh";
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
      getUpdateInfo,
      updateSystemInfo,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxLookup,
    DxEditing,
    DxSummary,
    DxTotalItem,
    DxToolbar,
    DxItem,
    TitleName,
  },
};
</script>
<style scoped>
#systemGrid {
  height: calc(80vh);
}
#systemGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
